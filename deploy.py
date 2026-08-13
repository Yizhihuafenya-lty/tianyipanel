#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""把天依面板部署到远程 Linux 服务器并启动。"""

import argparse
import os
import re
import stat
import time
from pathlib import Path

import paramiko


ROOT = Path(__file__).resolve().parent
FILES = [
    "server.py",
    "apps.json",
    "models.json",
    "start.sh",
    "stop.sh",
    "README.md",
]
DIRS = ["static"]


def parse_args():
    parser = argparse.ArgumentParser(description="部署天依 Linux 面板")
    parser.add_argument("--host", default="192.168.3.251")
    parser.add_argument("--user", default="lty")
    parser.add_argument("--remote-dir", default="~/panel")
    parser.add_argument("--port", type=int, default=22)
    parser.add_argument("--panel-port", type=int, default=8000)
    parser.add_argument("--allow-command", action="store_true")
    parser.add_argument("--skip-start", action="store_true")
    return parser.parse_args()


def upload(sftp, local_path, remote_path):
    sftp.put(str(local_path), remote_path)
    if local_path.suffix in {".sh"}:
        sftp.chmod(remote_path, 0o755)


def sh_single_quote(value):
    return "'" + str(value).replace("'", "'\\''") + "'"


def main():
    args = parse_args()
    password = os.environ.get("PANEL_SSH_PASS")
    if not password:
        raise SystemExit("请先设置环境变量 PANEL_SSH_PASS")
    sudo_password = os.environ.get("PANEL_SUDO_PASSWORD", "")

    client = paramiko.SSHClient()
    client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    client.connect(
        args.host,
        port=args.port,
        username=args.user,
        password=password,
        timeout=15,
        look_for_keys=False,
        allow_agent=False,
    )
    def run(command):
        stdin, stdout, stderr = client.exec_command(command, timeout=30)
        out = stdout.read().decode(errors="replace")
        err = stderr.read().decode(errors="replace")
        code = stdout.channel.recv_exit_status()
        return code, out, err

    code, out, err = run(f"echo {args.remote_dir}")
    remote_root = out.strip()
    if not remote_root:
        raise SystemExit(f"无法解析远程目录：{err}")

    code, _, err = run(f"mkdir -p {remote_root}/static")
    if code != 0:
        raise SystemExit(f"远程目录创建失败：{err}")

    sftp = client.open_sftp()
    try:
        for name in FILES:
            upload(sftp, ROOT / name, f"{remote_root}/{name}")
        def upload_dir(local_dir, remote_dir):
            for local in local_dir.iterdir():
                if local.is_dir():
                    child_remote = f"{remote_dir}/{local.name}"
                    try:
                        sftp.mkdir(child_remote)
                    except OSError:
                        pass
                    upload_dir(local, child_remote)
                elif local.is_file():
                    upload(sftp, local, f"{remote_dir}/{local.name}")

        for name in DIRS:
            upload_dir(ROOT / name, f"{remote_root}/{name}")
    finally:
        sftp.close()

    print("文件上传完成")
    if args.skip_start:
        client.close()
        return

    flag = " --allow-command" if args.allow_command else ""
    panel_port = args.panel_port
    sudo_prefix = (
        f"export PANEL_SUDO_PASSWORD={sh_single_quote(sudo_password)}; "
        if sudo_password
        else ""
    )
    cmd = (
        f"cd {remote_root} && "
        "pkill -f '[s]erver.py --host 0.0.0.0' 2>/dev/null || true; "
        "sleep 1; "
        f"{sudo_prefix}nohup bash start.sh --port {panel_port}{flag} > panel.log 2>&1 & "
        "sleep 1; "
        "echo '---TOKEN---'; cat panel.token; echo '---VERIFY---'; cat panel.verify"
    )
    code, out, err = run(cmd)
    if code != 0:
        print("启动命令返回异常")
        print(err)
    token_match = re.search(r"---TOKEN---\s*(\S+)", out)
    verify_match = re.search(r"---VERIFY---\s*(\S+)", out)
    token = token_match.group(1) if token_match else ""
    verify = verify_match.group(1) if verify_match else ""
    print("面板已启动")
    print(f"地址: http://{args.host}:8000/")
    if token:
        print(f"令牌: {token}")
    if verify:
        print(f"登录地址: http://{args.host}:8000/{verify}")
        print(f"访问验证码: {verify}")
    client.close()


if __name__ == "__main__":
    main()
