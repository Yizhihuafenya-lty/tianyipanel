#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""生成天依面板自解压安装脚本 install.sh（支持 wget 一键安装）。
用法: python3 build_install_sh.py
输出: install.sh（含内嵌 base64 代码包）
"""
import base64
import io
import os
import sys
import tarfile
from pathlib import Path

ROOT = Path(__file__).resolve().parent

# 需要打包进安装包的文件
FILES = [
    "server.py",
    "apps.json",
    "models.json",
    "start.sh",
    "stop.sh",
    "README.md",
]
DIRS = ["static"]


def build_tar_bytes():
    """把面板代码打包成 tar.gz 的 base64 字符串。"""
    buf = io.BytesIO()
    with tarfile.open(fileobj=buf, mode="w:gz") as tar:
        for name in FILES:
            path = ROOT / name
            if path.exists():
                tar.add(str(path), arcname=name)
        for dirname in DIRS:
            path = ROOT / dirname
            if path.is_dir():
                tar.add(str(path), arcname=dirname, recursive=True)
    return base64.b64encode(buf.getvalue()).decode("ascii")


TEMPLATE = r"""#!/usr/bin/env bash
set -euo pipefail

# ============================================================
#  天依 Linux 面板 一键安装脚本（自解压安装包）
#  用法:  wget -O install.sh <下载地址> && bash install.sh
# ============================================================

PREFIX="${PANEL_PREFIX:-$HOME/panel}"
INSTALL_DIR="$PREFIX"
TAR_DATA="@@TAR_DATA@@"

info()  { echo -e "\033[1;32m[信息]\033[0m $*"; }
warn()  { echo -e "\033[1;33m[注意]\033[0m $*"; }
err()   { echo -e "\033[1;31m[错误]\033[0m $*" >&2; }

# 检查系统
if [ "$(uname -s)" != "Linux" ]; then
    err "本面板仅支持 Linux 系统"
    exit 1
fi

# 检查/安装 python3
if ! command -v python3 >/dev/null 2>&1; then
    warn "未检测到 python3，尝试安装..."
    if command -v apt-get >/dev/null 2>&1; then
        sudo apt-get update -qq && sudo apt-get install -y -qq python3
    elif command -v yum >/dev/null 2>&1; then
        sudo yum install -y python3
    elif command -v dnf >/dev/null 2>&1; then
        sudo dnf install -y python3
    else
        err "无法自动安装 python3，请手动安装后重试"
        exit 1
    fi
fi

# 解压代码
info "安装目录: $INSTALL_DIR"
mkdir -p "$INSTALL_DIR"
if command -v base64 >/dev/null 2>&1; then
    echo "$TAR_DATA" | base64 -d | tar -xzf - -C "$INSTALL_DIR"
else
    python3 -c "import base64,sys; sys.stdout.write(base64.b64decode(sys.argv[1]))" "$TAR_DATA" | tar -xzf - -C "$INSTALL_DIR"
fi
chmod +x "$INSTALL_DIR"/*.sh 2>/dev/null || true
chmod +x "$INSTALL_DIR"/server.py 2>/dev/null || true

# 启动面板
cd "$INSTALL_DIR"
# 设置默认 host/port（可被环境变量覆盖）
HOST_ARG="${PANEL_HOST:-0.0.0.0}"
PORT_ARG="${PANEL_PORT:-8000}"

if [ "${PANEL_ALLOW_COMMAND:-1}" = "1" ]; then
    CMD_FLAG="--allow-command"
else
    CMD_FLAG=""
fi

info "正在启动面板..."
nohup bash start.sh --host "$HOST_ARG" --port "$PORT_ARG" $CMD_FLAG > panel.log 2>&1 &
sleep 2

TOKEN=""
if [ -f "$INSTALL_DIR/panel.token" ]; then
    TOKEN="$(cat "$INSTALL_DIR/panel.token")"
fi
CODE=""
if [ -f "$INSTALL_DIR/panel.verify" ]; then
    CODE="$(cat "$INSTALL_DIR/panel.verify")"
fi

echo
echo "=============================================="
echo "  天依 Linux 面板安装完成！"
echo "----------------------------------------------"
echo "  访问地址: http://$HOST_ARG:$PORT_ARG"
[ -n "$CODE" ] && echo "  登录地址: http://$HOST_ARG:$PORT_ARG/$CODE"
[ -n "$TOKEN" ] && echo "  访问令牌: $TOKEN"
[ -n "$CODE" ] && echo "  验证码  : $CODE"
echo "  安装目录: $INSTALL_DIR"
echo "  日志文件: $INSTALL_DIR/panel.log"
echo "=============================================="
"""


def main():
    data = build_tar_bytes()
    script = TEMPLATE.replace("@@TAR_DATA@@", data)
    out = ROOT / "install.sh"
    out.write_text(script, encoding="utf-8")
    os.chmod(out, 0o755)
    size_mb = out.stat().st_size / 1024 / 1024
    print(f"已生成 {out}（{size_mb:.2f} MB）")


if __name__ == "__main__":
    main()
