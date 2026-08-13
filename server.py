#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""天依 Linux 面板 - 简易 Linux 服务器管理面板（Python 标准库实现）。"""

import argparse
import codecs
import datetime
import gc
import email
import errno
import glob
import hashlib
import ipaddress
import json
import os
import platform
import re
import secrets
import shlex
import shutil
import signal
import socket
import stat as stat_mod
import subprocess
import sys
import tarfile
import threading
import time
import struct
import uuid
import zipfile
from email import message_from_bytes, policy as email_policy
from collections import deque
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from urllib.parse import parse_qs, quote, unquote, urlparse
import urllib.error
import urllib.request

try:
    import grp
    import pwd
except ImportError:  # Windows 预览时不提供 uid/gid 名称
    grp = None
    pwd = None

try:
    import fcntl
    import termios
    import pty
except ImportError:  # Windows 预览不提供 PTY
    fcntl = None
    termios = None
    pty = None


APP_NAME = "天依 Linux 面板"
VERSION = "0.1.0"
ROOT = Path(__file__).resolve().parent
STATIC_DIR = ROOT / "static"
TRASH_DIR = Path.home() / ".panel-trash"
GUARD_RULES_PATH = Path.home() / ".panel-guard.json"
GUARD_LOG_PATH = Path.home() / ".panel-guard.log"
GUARD_INTERVAL = 5
GUARD_RESTART_COOLDOWN = 30
MAX_COMMAND_LENGTH = 4096
MAX_READ_BYTES = 512 * 1024
LOCAL_HOSTS = {"127.0.0.1", "localhost", "::1"}
DB_CONFIG_PATH = Path.home() / ".panel-db.json"
DB_BACKUP_DIR = Path.home() / ".panel-db-backups"
PANEL_BACKUP_DIR = Path.home() / ".panel-backups"
WEBDAV_CONFIG_PATH = Path.home() / ".panel-webdav.json"
METRICS_PATH = Path.home() / ".panel-metrics.jsonl"
TERMINAL_SESSIONS = {}
_TERMINAL_LOCK = threading.Lock()
MAX_UPLOAD_BYTES = 256 * 1024 * 1024
AUDIT_DIR = Path.home() / ".panel-audit"
AUDIT_FILE = AUDIT_DIR / "operations.log"
AUDIT_MAX_LINES = 2000
AUDIT_SKIP_ROUTES = {
    "/api/terminal/input",
    "/api/terminal/resize",
    "/api/terminal/close",
}
_AUDIT_LOCK = threading.Lock()

SIGNAL_MAP = {
    "HUP": getattr(signal, "SIGHUP", 1),
    "INT": getattr(signal, "SIGINT", 2),
    "TERM": getattr(signal, "SIGTERM", 15),
    "KILL": getattr(signal, "SIGKILL", 9),
}
SERVICE_NAME_RE = re.compile(r"^[A-Za-z0-9_.:@-]+\.service$")
_GUARD_LOCK = threading.Lock()
_CRON_LOCK = threading.Lock()
_APP_UPDATE_CACHE = {"time": 0, "packages": {}, "apps": {}}
_APP_UPDATE_LOCK = threading.Lock()
_LOGIN_ATTEMPTS = {}
_LOGIN_LOCK = threading.Lock()
APP_PACKAGE_ALIASES = {
    "php-fpm": [
        "php-fpm",
        "php8.1-fpm",
        "php8.2-fpm",
        "php8.3-fpm",
        "php8.4-fpm",
    ],
    "php-cli": [
        "php-cli",
        "php8.1-cli",
        "php8.2-cli",
        "php8.3-cli",
        "php8.4-cli",
    ],
    "php-mysql": [
        "php-mysql",
        "php8.1-mysql",
        "php8.2-mysql",
        "php8.3-mysql",
        "php8.4-mysql",
    ],
    "php-redis": [
        "php-redis",
        "php8.1-redis",
        "php8.2-redis",
        "php8.3-redis",
        "php8.4-redis",
    ],
    "mysql-server": ["mysql-server", "mysql-server-8.0", "mysql-server-8.4"],
    "postgresql": [
        "postgresql",
        "postgresql-12",
        "postgresql-13",
        "postgresql-14",
        "postgresql-15",
        "postgresql-16",
        "postgresql-17",
    ],
}
SSH_PATTERNS = (
    (
        re.compile(
            r"Accepted (\S+) for (\S+) from (\S+) port (\d+)"
        ),
        "success",
    ),
    (
        re.compile(
            r"Failed password for (?:invalid user )?(\S+) from (\S+) port (\d+)"
        ),
        "failed",
    ),
    (re.compile(r"Invalid user (\S+) from (\S+)"), "failed"),
    (re.compile(r"session opened for user (\S+)"), "session"),
    (re.compile(r"session closed for user (\S+)"), "session"),
)
COMMON_APPS = [
    {
        "id": "nginx",
        "name": "Nginx",
        "desc": "Web 服务器 / 反向代理",
        "command": "sudo apt-get install -y nginx",
    },
    {
        "id": "docker",
        "name": "Docker",
        "desc": "容器运行时",
        "command": "curl -fsSL https://get.docker.com | sh",
    },
    {
        "id": "nodejs",
        "name": "Node.js + npm",
        "desc": "JavaScript 运行时",
        "command": "sudo apt-get install -y nodejs npm",
    },
    {
        "id": "redis",
        "name": "Redis",
        "doc": "https://redis.io/",
        "desc": "内存数据库 / 缓存",
        "command": "sudo apt-get install -y redis-server",
    },
    {
        "id": "mysql",
        "name": "MySQL",
        "doc": "https://www.mysql.com/",
        "desc": "关系型数据库",
        "command": "sudo apt-get install -y mysql-server",
    },
    {
        "id": "postgresql",
        "name": "PostgreSQL",
        "desc": "关系型数据库",
        "command": "sudo apt-get install -y postgresql",
    },
    {
        "id": "git",
        "name": "Git",
        "desc": "版本控制工具",
        "command": "sudo apt-get install -y git",
    },
    {
        "id": "fail2ban",
        "name": "Fail2ban",
        "desc": "SSH 暴力破解防护",
        "command": "sudo apt-get install -y fail2ban",
    },
    {
        "id": "ufw",
        "name": "UFW",
        "desc": "防火墙管理",
        "command": "sudo apt-get install -y ufw",
    },
    {
        "id": "htop",
        "name": "htop",
        "desc": "交互式系统监控",
        "command": "sudo apt-get install -y htop",
    },
    {
        "id": "net-tools",
        "name": "net-tools",
        "desc": "ifconfig / netstat 等网络工具",
        "command": "sudo apt-get install -y net-tools",
    },
    {
        "id": "certbot",
        "name": "Certbot",
        "desc": "免费 SSL 证书",
        "command": "sudo apt-get install -y certbot python3-certbot-nginx",
    },
]
ANALYTICS_CONFIG_PATH = Path.home() / ".panel-analytics.json"
ANALYTICS_DEFAULT_PATHS = [
    "/var/log/nginx/access.log",
    "/var/log/nginx/access.log.1",
    "/var/log/apache2/access.log",
    "/var/log/apache2/access.log.1",
    "/var/log/caddy/access.log",
]
ACCESS_LOG_RE = re.compile(
    r'^(\S+) \S+ \S+ \[([^\]]+)\] "([^"]*)" (\d{3}) (\S+) "([^"]*)" "([^"]*)"'
)
TAMPER_CONFIG_PATH = Path.home() / ".panel-tamper.json"
TAMPER_EVENTS_PATH = Path.home() / ".panel-tamper-events.jsonl"
TAMPER_INTERVAL = 60
COMPOSE_DIR = Path.home() / ".panel-compose"
COMPOSE_TRASH_DIR = Path.home() / ".panel-compose-trash"
DOCKER_NAME_RE = re.compile(r"^[A-Za-z0-9][A-Za-z0-9_.-]{0,127}$")
DOCKER_REF_RE = re.compile(r"^[A-Za-z0-9][A-Za-z0-9_.:/@-]{0,511}$")
DOCKER_DRIVERS = {"bridge", "host", "none", "overlay", "macvlan", "ipvlan"}
FIREWALL_PORT_RE = re.compile(r"^\d{1,5}(:\d{1,5})?$")
_TAMPER_LOCK = threading.RLock()
NETWORK_HISTORY = deque(maxlen=300)
GPU_HISTORY = deque(maxlen=300)
MODEL_JOBS = {}
_MODEL_JOB_LOCK = threading.Lock()
PORT_MONITOR_HISTORY = {}
PORT_MONITOR_PREV = {}
PORT_MONITOR_EVENTS = deque(maxlen=300)
SYSTEM_USERS = {
    "root", "daemon", "bin", "sys", "adm", "systemd+",
    "systemd-resolve", "systemd-timesync", "systemd-network",
    "systemd-journal", "systemd-oom", "systemd-coredump",
    "messagebus", "message+", "syslog", "_apt", "avahi", "cups", "colord",
    "geoclue", "gdm", "nobody", "lp", "uucp", "games", "man",
    "news", "proxy", "sshd", "www-data", "uuidd", "tss",
    "landscape", "pollinate", "snapd", "fwupd", "rtkit", "usbmux",
}
APP_UNIT_HINTS = (
    "1panel", "docker", "containerd", "nginx", "caddy", "node",
    "python", "php", "mysql", "mariadb", "postgres", "redis",
    "gunicorn", "uvicorn", "java", "tomcat", "nextcloud",
    "cloudflared", "frps", "frpc", "panel",
)
APP_CMD_HINTS = (
    "1panel", "docker", "containerd", "nginx", "caddy", "node ",
    "python3 ", "python ", "php", "mysql", "mariadb", "postgres",
    "redis-server", "gunicorn", "uvicorn", "java ", "tomcat",
    "nextcloud", "cloudflared", "frps", "frpc",
)


class Config:
    host = "127.0.0.1"
    port = 8000
    token = None
    access_code = ""
    allow_command = False
    sudo_password = ""


CONFIG = Config()


def is_linux():
    return sys.platform.startswith("linux")


def now_str():
    return datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")


def human_size(num):
    try:
        num = float(num)
    except (TypeError, ValueError):
        return "0 B"
    for unit in ("B", "KB", "MB", "GB", "TB", "PB"):
        if abs(num) < 1024 or unit == "PB":
            return f"{num:.1f} {unit}" if unit != "B" else f"{int(num)} B"
        num /= 1024
    return f"{num:.1f} PB"


def run_cmd(cmd, timeout=15, privileged=False, env=None):
    """运行命令列表，可选通过 sudo 提权。"""
    try:
        if privileged and CONFIG.sudo_password:
            full_cmd = ["sudo", "-S", "--"] + list(cmd)
            proc = subprocess.run(
                full_cmd,
                input=CONFIG.sudo_password + "\n",
                capture_output=True,
                text=True,
                timeout=timeout,
                env=env,
            )
        else:
            proc = subprocess.run(
                cmd, capture_output=True, text=True, timeout=timeout, env=env
            )
        return proc.returncode, proc.stdout, proc.stderr
    except subprocess.TimeoutExpired:
        return 124, "", f"命令超时（{timeout}s）"
    except FileNotFoundError:
        return 127, "", f"找不到命令：{cmd[0] if cmd else '?'}"
    except Exception as exc:
        return 1, "", str(exc)


def run_shell(command, timeout=30):
    """执行任意 shell 命令（命令页使用），超时后杀死整个进程组。"""
    try:
        proc = subprocess.Popen(
            command,
            shell=True,
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            text=True,
            start_new_session=is_linux(),
        )
    except Exception as exc:
        return 1, "", str(exc)
    try:
        out, err = proc.communicate(timeout=timeout)
        return proc.returncode, out, err
    except subprocess.TimeoutExpired:
        try:
            if is_linux():
                os.killpg(proc.pid, getattr(signal, "SIGKILL", signal.SIGTERM))
            else:
                proc.kill()
        except Exception:
            pass
        try:
            out, err = proc.communicate()
        except Exception:
            out, err = "", ""
        return 124, out, err + "\n命令超时，已终止。"


def read_proc_stat():
    if not is_linux():
        return None
    try:
        with open("/proc/stat", encoding="utf-8", errors="replace") as fh:
            for line in fh:
                parts = line.split()
                if parts and parts[0] == "cpu":
                    return [int(x) for x in parts[1:]]
    except Exception:
        return None
    return None


def cpu_usage(duration=0.3):
    first = read_proc_stat()
    time.sleep(duration)
    second = read_proc_stat()
    if not first or not second or len(first) < 5 or len(second) < 5:
        return None
    idle_first = first[3] + first[4]
    idle_second = second[3] + second[4]
    total_first = sum(first[:8])
    total_second = sum(second[:8])
    diff_total = total_second - total_first
    diff_idle = idle_second - idle_first
    if diff_total <= 0:
        return 0.0
    return round(max(0.0, min(100.0, 100.0 * (1.0 - diff_idle / diff_total))), 1)


def read_loadavg():
    if not is_linux():
        return [0.0, 0.0, 0.0]
    try:
        with open("/proc/loadavg", encoding="utf-8") as fh:
            return [float(x) for x in fh.read().split()[:3]]
    except Exception:
        return [0.0, 0.0, 0.0]


def read_uptime():
    if not is_linux():
        return 0
    try:
        with open("/proc/uptime", encoding="utf-8") as fh:
            return int(float(fh.read().split()[0]))
    except Exception:
        return 0


def get_memory():
    if is_linux():
        mem = {}
        try:
            with open("/proc/meminfo", encoding="utf-8", errors="replace") as fh:
                for line in fh:
                    key, rest = line.split(":", 1)
                    value = rest.strip().split()
                    if value:
                        mem[key] = int(value[0]) * 1024
            total = mem.get("MemTotal", 0)
            available = mem.get("MemAvailable", 0)
            used = max(0, total - available)
            percent = round(used / total * 100, 1) if total else 0
            return {
                "total": total,
                "used": used,
                "available": available,
                "percent": percent,
                "swap_total": mem.get("SwapTotal", 0),
                "swap_used": max(0, mem.get("SwapTotal", 0) - mem.get("SwapFree", 0)),
            }
        except Exception:
            pass
    return {
        "total": 0,
        "used": 0,
        "available": 0,
        "percent": 0,
        "swap_total": 0,
        "swap_used": 0,
    }


def get_disks():
    if is_linux():
        rc, out, err = run_cmd(["df", "-B1", "-P"])
        if rc == 0:
            disks = []
            pattern = re.compile(
                r"^(\S+)\s+(\d+)\s+(\d+)\s+(\d+)\s+(\d+)%\s+(.*)$"
            )
            for line in out.splitlines()[1:]:
                match = pattern.match(line.strip())
                if not match:
                    continue
                fs, size, used, avail, pct, mount = match.groups()
                disks.append(
                    {
                        "filesystem": fs,
                        "mount": mount,
                        "size": int(size),
                        "used": int(used),
                        "avail": int(avail),
                        "percent": int(pct),
                    }
                )
            return disks
    try:
        usage = shutil.disk_usage("/")
        return [
            {
                "filesystem": "local",
                "mount": "/",
                "size": usage.total,
                "used": usage.used,
                "avail": usage.free,
                "percent": round(usage.used / usage.total * 100, 1),
            }
        ]
    except Exception:
        return []


def get_network():
    if not is_linux():
        return []
    result = []
    try:
        with open("/proc/net/dev", encoding="utf-8", errors="replace") as fh:
            for line in fh.readlines()[2:]:
                if ":" not in line:
                    continue
                iface, rest = line.split(":", 1)
                iface = iface.strip()
                values = rest.split()
                if len(values) < 16:
                    continue
                result.append(
                    {
                        "interface": iface,
                        "rx_bytes": int(values[0]),
                        "tx_bytes": int(values[8]),
                    }
                )
    except Exception:
        pass
    return result


# ---------------------------------------------------------------------------
# 指标历史采样（CPU / 内存 / 网络，每 30 秒一次，落盘 JSONL，保留 7 天）
# ---------------------------------------------------------------------------

METRICS_INTERVAL = 30
METRICS_MAX_AGE = 7 * 24 * 3600
_METRICS_LOCK = threading.Lock()
_last_net_sample = {"time": 0, "rx": 0, "tx": 0}


def _collect_net_totals():
    total_rx = 0
    total_tx = 0
    for item in get_network():
        if item["interface"] == "lo":
            continue
        total_rx += item["rx_bytes"]
        total_tx += item["tx_bytes"]
    return total_rx, total_tx


def sample_metrics():
    global _last_net_sample
    cpu = cpu_usage(0.5)
    if cpu is None:
        cpu = 0.0
    memory = get_memory()
    now = time.time()
    rx, tx = _collect_net_totals()
    net_in = 0.0
    net_out = 0.0
    last = _last_net_sample
    if last["time"] and rx >= last["rx"] and tx >= last["tx"]:
        elapsed = max(1.0, now - last["time"])
        net_in = round((rx - last["rx"]) / elapsed, 1)
        net_out = round((tx - last["tx"]) / elapsed, 1)
    _last_net_sample = {"time": now, "rx": rx, "tx": tx}
    return {
        "t": int(now),
        "cpu": float(cpu),
        "mem": float(memory.get("percent", 0)),
        "net_in": net_in,
        "net_out": net_out,
    }


def _metrics_compact():
    """只保留最近 7 天的记录，防止文件无限增长。"""
    try:
        if not METRICS_PATH.exists():
            return
        cutoff = time.time() - METRICS_MAX_AGE
        lines = METRICS_PATH.read_text(encoding="utf-8").splitlines()
        kept = []
        for line in lines:
            try:
                obj = json.loads(line)
                if obj.get("t", 0) >= cutoff:
                    kept.append(line)
            except Exception:
                continue
        with _METRICS_LOCK:
            METRICS_PATH.write_text("\n".join(kept) + ("\n" if kept else ""), encoding="utf-8")
    except Exception:
        pass


# ---------------------------------------------------------------------------
# 指标告警（阈值 + Webhook 推送）
# ---------------------------------------------------------------------------

ALERT_CONFIG_PATH = Path.home() / ".panel-alerts.json"
_ALERT_COOLDOWN = {}  # key -> 上次告警时间戳
_ALERT_LOCK = threading.Lock()


def load_alert_config():
    try:
        data = json.loads(ALERT_CONFIG_PATH.read_text(encoding="utf-8"))
        if isinstance(data, dict):
            return {
                "enabled": bool(data.get("enabled")),
                "webhook": str(data.get("webhook", "")),
                "cpu_threshold": int(data.get("cpu_threshold", 90)),
                "mem_threshold": int(data.get("mem_threshold", 90)),
                "disk_threshold": int(data.get("disk_threshold", 90)),
                "cooldown_minutes": int(data.get("cooldown_minutes", 30)),
            }
    except Exception:
        pass
    return {
        "enabled": False,
        "webhook": "",
        "cpu_threshold": 90,
        "mem_threshold": 90,
        "disk_threshold": 90,
        "cooldown_minutes": 30,
    }


def save_alert_config(config):
    ALERT_CONFIG_PATH.write_text(
        json.dumps(config, ensure_ascii=False, indent=2), encoding="utf-8"
    )


def _send_webhook(webhook_url, title, message):
    """发送 Webhook 告警（兼容钉钉/飞书/企业微信/Discord）。"""
    import urllib.request
    import urllib.parse

    # 钉钉机器人需要 @ 手机号，这里简化为纯文本
    payload = {
        "msgtype": "text",
        "text": {"content": f"{title}\n{message}"},
    }
    # 飞书也支持 msgtype=text 格式
    # 企业微信使用 markdown 格式
    if "qyapi.weixin.qq.com" in webhook_url:
        payload = {
            "msgtype": "markdown",
            "markdown": {"content": f"**{title}**\n{message}"},
        }

    data = json.dumps(payload, ensure_ascii=False).encode("utf-8")
    req = urllib.request.Request(
        webhook_url,
        data=data,
        headers={"Content-Type": "application/json"},
        method="POST",
    )
    try:
        with urllib.request.urlopen(req, timeout=10) as resp:
            return resp.status == 200
    except Exception:
        return False


def check_and_alert(metrics):
    """检查指标是否超阈值，超则发送告警（带冷却）。"""
    config = load_alert_config()
    if not config["enabled"] or not config["webhook"]:
        return

    now = time.time()
    cooldown = config["cooldown_minutes"] * 60
    alerts = []

    # CPU 告警
    cpu = metrics.get("cpu", 0)
    if cpu >= config["cpu_threshold"]:
        key = "cpu"
        with _ALERT_LOCK:
            last = _ALERT_COOLDOWN.get(key, 0)
            if now - last >= cooldown:
                _ALERT_COOLDOWN[key] = now
                alerts.append((key, f"CPU 使用率 {cpu:.1f}%（阈值 {config['cpu_threshold']}%）"))

    # 内存告警
    mem = metrics.get("mem", 0)
    if mem >= config["mem_threshold"]:
        key = "mem"
        with _ALERT_LOCK:
            last = _ALERT_COOLDOWN.get(key, 0)
            if now - last >= cooldown:
                _ALERT_COOLDOWN[key] = now
                alerts.append((key, f"内存使用率 {mem:.1f}%（阈值 {config['mem_threshold']}%）"))

    # 磁盘告警（检查根分区）
    try:
        disks = get_disks()
        root_disk = next((d for d in disks if d.get("mount") == "/"), None)
        if root_disk and root_disk.get("percent", 0) >= config["disk_threshold"]:
            key = "disk"
            with _ALERT_LOCK:
                last = _ALERT_COOLDOWN.get(key, 0)
                if now - last >= cooldown:
                    _ALERT_COOLDOWN[key] = now
                    alerts.append((key, f"根分区使用率 {root_disk['percent']}%（阈值 {config['disk_threshold']}%）"))
    except Exception:
        pass

    # 发送告警
    for key, message in alerts:
        hostname = socket.gethostname()
        _send_webhook(config["webhook"], f"⚠️ 服务器告警 [{hostname}]", message)


def metrics_loop():
    _metrics_compact()
    compact_counter = 0
    while True:
        try:
            row = sample_metrics()
            with _METRICS_LOCK:
                with METRICS_PATH.open("a", encoding="utf-8") as fh:
                    fh.write(json.dumps(row, ensure_ascii=False) + "\n")
            compact_counter += 1
            if compact_counter >= 240:  # 约 2 小时整理一次
                compact_counter = 0
                _metrics_compact()
            # 检查告警（每次采样后）
            try:
                check_and_alert(row)
            except Exception:
                pass
        except Exception:
            pass
        time.sleep(METRICS_INTERVAL)


def read_metrics_history(hours=24):
    if not METRICS_PATH.exists():
        return {"points": []}
    hours = max(1, min(int(hours or 24), 24 * 7))
    cutoff = time.time() - hours * 3600
    points = []
    try:
        with METRICS_PATH.open(encoding="utf-8") as fh:
            for line in fh:
                line = line.strip()
                if not line:
                    continue
                try:
                    obj = json.loads(line)
                except Exception:
                    continue
                if obj.get("t", 0) >= cutoff:
                    points.append(obj)
    except Exception:
        pass
    # 超过 600 个点时抽样，控制前端渲染压力
    if len(points) > 600:
        step = len(points) / 600.0
        picked = []
        index = 0.0
        while int(index) < len(points):
            picked.append(points[int(index)])
            index += step
        points = picked
    return {"points": points, "interval": METRICS_INTERVAL}


def process_count():
    if not is_linux():
        return 0
    try:
        return sum(1 for item in Path("/proc").iterdir() if item.name.isdigit())
    except Exception:
        return 0


def classify_process(user, comm, args, cgroup):
    if comm.startswith("[") or (args or "").startswith("["):
        return "system"
    cgroup_path = cgroup.split(":", 2)[-1] if cgroup and ":" in cgroup else (cgroup or "")
    if "/user.slice/" in cgroup_path:
        return "app"
    if "/init.scope" in cgroup_path:
        return "system"
    unit_name = cgroup_path.rstrip("/").rsplit("/", 1)[-1].lower()
    if any(hint in unit_name for hint in APP_UNIT_HINTS):
        return "app"
    if user in SYSTEM_USERS:
        lower = (args or "").lower()
        if any(hint in lower for hint in APP_CMD_HINTS):
            return "app"
        return "system"
    return "app"


def power_level(cpu, rss):
    if cpu >= 50:
        return "high"
    if cpu >= 10:
        return "medium"
    return "low"


def load_guard_rules():
    with _GUARD_LOCK:
        if not GUARD_RULES_PATH.exists():
            return []
        try:
            data = json.loads(GUARD_RULES_PATH.read_text(encoding="utf-8"))
        except (OSError, json.JSONDecodeError):
            return []
        return data if isinstance(data, list) else []


def save_guard_rules(rules):
    with _GUARD_LOCK:
        GUARD_RULES_PATH.parent.mkdir(parents=True, exist_ok=True)
        tmp = GUARD_RULES_PATH.with_suffix(".tmp")
        tmp.write_text(
            json.dumps(rules, ensure_ascii=False, indent=2), encoding="utf-8"
        )
        tmp.replace(GUARD_RULES_PATH)
        try:
            os.chmod(GUARD_RULES_PATH, 0o600)
        except OSError:
            pass


def find_process(pattern):
    if not pattern or not is_linux():
        return None
    rc, out, err = run_cmd(
        ["ps", "-eo", "pid=,comm=,args=", "--no-headers", "-ww"], timeout=10
    )
    if rc != 0:
        return None
    needle = pattern.lower()
    for line in out.splitlines():
        parts = line.split(None, 2)
        if len(parts) < 2:
            continue
        blob = " ".join(parts[1:]).lower()
        if needle in blob:
            try:
                return int(parts[0])
            except ValueError:
                continue
    return None


def guard_start_command(rule):
    command = (rule.get("command") or "").strip()
    if not command:
        return False
    try:
        with open(GUARD_LOG_PATH, "a", encoding="utf-8") as log:
            subprocess.Popen(
                command,
                shell=True,
                stdout=log,
                stderr=log,
                stdin=subprocess.DEVNULL,
                start_new_session=True,
            )
    except Exception:
        return False
    rule["restarts"] = int(rule.get("restarts", 0)) + 1
    rule["last_restart"] = now_str()
    return True


def get_guard_status():
    rules = load_guard_rules()
    if not rules:
        return []
    rc, out, err = run_cmd(
        ["ps", "-eo", "pid=,comm=,args=", "--no-headers", "-ww"], timeout=10
    )
    lines = out.splitlines() if rc == 0 else []
    result = []
    for rule in rules:
        needle = (rule.get("pattern") or "").lower()
        pid = None
        if needle:
            for line in lines:
                parts = line.split(None, 2)
                if len(parts) < 2:
                    continue
                blob = " ".join(parts[1:]).lower()
                if needle in blob:
                    try:
                        pid = int(parts[0])
                        break
                    except ValueError:
                        continue
        item = dict(rule)
        item["pid"] = pid
        item["running"] = pid is not None
        result.append(item)
    return result


def add_guard_rule(name, pattern, command, auto):
    name = str(name or "").strip()
    pattern = str(pattern or "").strip()
    command = str(command or "").strip()
    if not name:
        raise ValueError("名称不能为空")
    if len(name) > 50:
        raise ValueError("名称过长")
    if not pattern:
        raise ValueError("匹配规则不能为空")
    if len(pattern) > 200:
        raise ValueError("匹配规则过长")
    if not command:
        raise ValueError("拉起命令不能为空")
    if len(command) > MAX_COMMAND_LENGTH:
        raise ValueError("命令过长")
    rule = {
        "id": uuid.uuid4().hex[:8],
        "name": name,
        "pattern": pattern,
        "command": command,
        "auto": bool(auto),
        "restarts": 0,
        "last_restart": None,
        "created": now_str(),
    }
    rules = load_guard_rules()
    rules.append(rule)
    save_guard_rules(rules)
    return rule


def update_guard_rule(rule_id, **updates):
    rules = load_guard_rules()
    for rule in rules:
        if rule.get("id") == rule_id:
            for key in ("name", "pattern", "command", "auto"):
                if key in updates:
                    rule[key] = updates[key]
            save_guard_rules(rules)
            return rule
    raise ValueError("守护规则不存在")


def remove_guard_rule(rule_id):
    rules = load_guard_rules()
    remaining = [rule for rule in rules if rule.get("id") != rule_id]
    if len(remaining) == len(rules):
        raise ValueError("守护规则不存在")
    save_guard_rules(remaining)
    return {"ok": True}


def start_guard_rule(rule_id):
    rules = load_guard_rules()
    rule = next((item for item in rules if item.get("id") == rule_id), None)
    if not rule:
        raise ValueError("守护规则不存在")
    pid = find_process(rule.get("pattern", ""))
    if pid is not None:
        return {"ok": True, "already_running": True, "pid": pid}
    if not guard_start_command(rule):
        raise ValueError("拉起命令执行失败")
    save_guard_rules(rules)
    return {"ok": True, "already_running": False}


def guard_loop():
    while True:
        time.sleep(GUARD_INTERVAL)
        try:
            rules = load_guard_rules()
            changed = False
            for rule in rules:
                if not rule.get("auto"):
                    continue
                if find_process(rule.get("pattern", "")):
                    continue
                last_restart = rule.get("last_restart")
                if last_restart:
                    try:
                        last_time = datetime.datetime.strptime(
                            last_restart, "%Y-%m-%d %H:%M:%S"
                        )
                        if (
                            datetime.datetime.now() - last_time
                        ).total_seconds() < GUARD_RESTART_COOLDOWN:
                            continue
                    except ValueError:
                        pass
                if guard_start_command(rule):
                    changed = True
            if changed:
                save_guard_rules(rules)
        except Exception:
            pass


def read_power_info():
    """读取电源信息：笔记本显示电池容量/状态，非笔记本显示市电。"""
    info = {"is_battery": False, "online": None, "capacity": None,
            "status": "", "power_w": None}
    try:
        base = Path("/sys/class/power_supply")
        if not base.is_dir():
            return info
        battery = None
        ac = None
        for item in sorted(base.iterdir()):
            name = item.name
            if name.startswith("BAT"):
                battery = item
            elif name.startswith("AC") or name.startswith("ADP"):
                ac = item
        if battery is None:
            # 无电池 = 台式机/服务器，显示市电状态
            if ac is not None:
                try:
                    online = (ac / "online").read_text().strip()
                    info["online"] = online == "1"
                except Exception:
                    pass
            return info
        info["is_battery"] = True
        try:
            info["capacity"] = int((battery / "capacity").read_text().strip())
        except Exception:
            pass
        try:
            info["status"] = (battery / "status").read_text().strip()
        except Exception:
            pass
        if ac is not None:
            try:
                online = (ac / "online").read_text().strip()
                info["online"] = online == "1"
            except Exception:
                pass
        # 功率（微瓦 → 瓦），部分机型只有 current_now + voltage_now
        try:
            power_now = int((battery / "power_now").read_text().strip())
            info["power_w"] = round(power_now / 1_000_000, 1)
        except Exception:
            try:
                current = int((battery / "current_now").read_text().strip())
                voltage = int((battery / "voltage_now").read_text().strip())
                info["power_w"] = round(current * voltage / 1e12, 1)
            except Exception:
                pass
    except Exception:
        pass
    return info


def read_temperature():
    """读取传感器温度（thermal_zone），返回摄氏度列表。"""
    temps = []
    try:
        base = Path("/sys/class/thermal")
        if not base.is_dir():
            return temps
        for zone in sorted(base.glob("thermal_zone*")):
            try:
                raw = int((zone / "temp").read_text().strip())
                # 单位通常是毫摄氏度
                celsius = round(raw / 1000, 1)
                if 0 < celsius < 120:
                    name = ""
                    try:
                        name = (zone / "type").read_text().strip()
                    except Exception:
                        pass
                    temps.append({"name": name or zone.name, "temp": celsius})
            except Exception:
                pass
    except Exception:
        pass
    return temps


def get_system_info():
    distro = platform.platform()
    if hasattr(platform, "freedesktop_os_release"):
        try:
            distro = platform.freedesktop_os_release().get(
                "PRETTY_NAME", distro
            )
        except Exception:
            pass
    network = get_network()
    total_rx = sum(item["rx_bytes"] for item in network)
    total_tx = sum(item["tx_bytes"] for item in network)
    NETWORK_HISTORY.append(
        {
            "time": datetime.datetime.now().strftime("%H:%M:%S"),
            "rx": total_rx,
            "tx": total_tx,
            "total": total_rx + total_tx,
        }
    )
    return {
        "hostname": socket.gethostname(),
        "distro": distro,
        "kernel": platform.release(),
        "arch": platform.machine(),
        "python": platform.python_version(),
        "time": now_str(),
        "uptime": read_uptime(),
        "loadavg": read_loadavg(),
        "cpu_percent": cpu_usage(),
        "cpu_cores": os.cpu_count() or 0,
        "power": read_power_info(),
        "temperature": read_temperature(),
        "memory": get_memory(),
        "disks": get_disks(),
        "network": network,
        "network_history": list(NETWORK_HISTORY),
        "process_count": process_count(),
    }


def list_processes():
    if not is_linux():
        return []
    rc, out, err = run_cmd(
        [
            "ps",
            "-eo",
            "pid=,ppid=,user=,%cpu=,%mem=,stat=,etime=,rss=,vsz=,time=,cgroup=,comm=,args=",
            "--no-headers",
            "-ww",
        ],
        timeout=12,
    )
    if rc != 0:
        return []
    processes = []
    pattern = re.compile(
        r"^\s*(\d+)\s+(\d+)\s+(\S+)\s+([0-9.]+)\s+([0-9.]+)\s+(\S+)\s+(\S+)\s+(\d+)\s+(\d+)\s+(\S+)\s+(\S+)\s+(\S+)\s*(.*)$"
    )
    for line in out.splitlines():
        match = pattern.match(line)
        if not match:
            continue
        (
            pid,
            ppid,
            user,
            cpu,
            mem,
            state,
            elapsed,
            rss,
            vsz,
            cpu_time,
            cgroup,
            comm,
            args,
        ) = match.groups()
        kind = classify_process(user, comm, args, cgroup)
        processes.append(
            {
                "pid": int(pid),
                "ppid": int(ppid),
                "user": user,
                "cpu": float(cpu),
                "mem": float(mem),
                "rss": int(rss),
                "vsz": int(vsz),
                "cpu_time": cpu_time,
                "cgroup": cgroup,
                "kind": kind,
                "power": power_level(float(cpu), int(rss)),
                "state": state,
                "elapsed": elapsed,
                "comm": comm,
                "args": args,
            }
        )
    processes.sort(key=lambda item: item["cpu"], reverse=True)
    return processes


def kill_process(pid, sig_name="TERM"):
    if not isinstance(pid, int) or pid <= 1:
        raise ValueError("PID 无效或受保护")
    sig = SIGNAL_MAP.get(str(sig_name).upper(), SIGNAL_MAP["TERM"])
    sig_num = str(int(sig))
    rc, out, err = run_cmd(["kill", "-" + sig_num, str(pid)])
    if rc != 0 and ("不允许" in err or "Operation not permitted" in err):
        rc, out, err = run_cmd(
            ["kill", "-" + sig_num, str(pid)], privileged=True
        )
    if rc != 0:
        raise PermissionError((err or out).strip() or f"无法操作进程 {pid}")
    return {"ok": True, "pid": pid, "signal": str(sig_name).upper()}


def list_services():
    if not is_linux():
        return []
    units = []
    rc, out, err = run_cmd(
        [
            "systemctl",
            "list-units",
            "--type=service",
            "--all",
            "--no-pager",
            "--no-legend",
            "--plain",
            "--full",
        ],
        timeout=15,
    )
    pattern = re.compile(r"^(\S+)\s+(\S+)\s+(\S+)\s+(\S+)\s*(.*)$")
    if rc == 0:
        for line in out.splitlines():
            match = pattern.match(line)
            if not match:
                continue
            unit, load, active, sub, description = match.groups()
            units.append(
                {
                    "unit": unit,
                    "load": load,
                    "active": active,
                    "sub": sub,
                    "description": description.strip(),
                }
            )
    enabled = {}
    rc2, out2, err2 = run_cmd(
        [
            "systemctl",
            "list-unit-files",
            "--type=service",
            "--no-pager",
            "--no-legend",
        ],
        timeout=15,
    )
    if rc2 == 0:
        for line in out2.splitlines():
            parts = line.split(None, 1)
            if len(parts) == 2:
                enabled[parts[0]] = parts[1].strip()
    for unit in units:
        unit["enabled"] = enabled.get(unit["unit"], "")
    return units


def service_action(unit, action):
    if not SERVICE_NAME_RE.match(unit or ""):
        raise ValueError("服务名称无效")
    if action not in ("start", "stop", "restart", "reload"):
        raise ValueError("不支持的操作")
    rc, out, err = run_cmd(["systemctl", action, unit], timeout=40)
    if rc != 0 and (
        CONFIG.sudo_password or "Permission denied" in err or "Access denied" in err
    ):
        rc, out, err = run_cmd(
            ["systemctl", action, unit], privileged=True, timeout=40
        )
    if rc != 0:
        return {
            "ok": False,
            "action": action,
            "unit": unit,
            "stdout": out.strip(),
            "stderr": (err or out).strip(),
        }
    return {"ok": True, "action": action, "unit": unit}


def _owner_name(uid):
    if pwd is None:
        return str(uid)
    try:
        return pwd.getpwuid(uid).pw_name
    except Exception:
        return str(uid)


def _group_name(gid):
    if grp is None:
        return str(gid)
    try:
        return grp.getgrgid(gid).gr_name
    except Exception:
        return str(gid)


def list_files(path):
    path = os.path.abspath(os.path.expanduser(unquote(path or "")))
    if not os.path.exists(path):
        raise FileNotFoundError(f"路径不存在：{path}")
    if not os.path.isdir(path):
        raise NotADirectoryError(f"不是目录：{path}")
    entries = []
    try:
        names = os.listdir(path)
    except PermissionError:
        raise PermissionError(f"没有权限读取目录：{path}")
    for name in names:
        full = os.path.join(path, name)
        try:
            st = os.lstat(full)
        except OSError:
            continue
        if stat_mod.S_ISLNK(st.st_mode):
            kind = "link"
            try:
                target = os.readlink(full)
            except OSError:
                target = ""
        elif stat_mod.S_ISDIR(st.st_mode):
            kind = "dir"
            target = ""
        elif stat_mod.S_ISREG(st.st_mode):
            kind = "file"
            target = ""
        else:
            kind = "special"
            target = ""
        entries.append(
            {
                "name": name,
                "path": full,
                "kind": kind,
                "size": st.st_size,
                "mode": stat_mod.filemode(st.st_mode),
                "owner": _owner_name(st.st_uid),
                "group": _group_name(st.st_gid),
                "mtime": datetime.datetime.fromtimestamp(st.st_mtime).strftime(
                    "%Y-%m-%d %H:%M:%S"
                ),
                "target": target,
            }
        )
    entries.sort(
        key=lambda item: (
            item["kind"] != "dir",
            item["name"].lower(),
        )
    )
    real = os.path.realpath(path)
    parent = os.path.dirname(real) if real != os.sep else real
    return {
        "path": real,
        "parent": parent,
        "entries": entries,
    }


def read_text_file(path, max_bytes=MAX_READ_BYTES):
    path = os.path.abspath(os.path.expanduser(unquote(path or "")))
    if not os.path.isfile(path):
        raise FileNotFoundError(f"不是文件：{path}")
    if os.path.getsize(path) > max_bytes:
        raise ValueError(f"文件超过读取上限（{human_size(max_bytes)}）")
    with open(path, "r", encoding="utf-8", errors="replace") as fh:
        content = fh.read()
    return {"path": path, "content": content}


def delete_path(path):
    path = os.path.abspath(os.path.expanduser(unquote(path or "")))
    home = os.path.abspath(os.path.expanduser("~"))
    if path == os.sep or path == home:
        raise ValueError("出于安全考虑，不允许删除根目录或家目录")
    if not os.path.exists(path):
        raise FileNotFoundError(f"路径不存在：{path}")
    trash = Path(TRASH_DIR)
    trash.mkdir(parents=True, exist_ok=True)
    stamp = datetime.datetime.now().strftime("%Y%m%d-%H%M%S")
    target = trash / f"{stamp}-{os.path.basename(path)}"
    counter = 1
    while target.exists():
        target = trash / f"{stamp}-{counter}-{os.path.basename(path)}"
        counter += 1
    shutil.move(path, str(target))
    return {"trash": str(target)}



def _fs_path(value):
    return os.path.abspath(os.path.expanduser(unquote(str(value or ""))))


def upload_file(target_dir, filename, data):
    target_dir = _fs_path(target_dir)
    if not os.path.isdir(target_dir):
        raise NotADirectoryError(f"上传目录不存在：{target_dir}")
    filename = os.path.basename(unquote(str(filename or "")))
    if not filename or filename in (".", ".."):
        raise ValueError("文件名无效")
    target = os.path.join(target_dir, filename)
    with open(target, "wb") as fh:
        fh.write(data)
    return {"ok": True, "path": target, "name": filename, "size": len(data)}


def download_url_to_file(url, target_dir):
    target_dir = _fs_path(target_dir)
    if not os.path.isdir(target_dir):
        raise NotADirectoryError(f"目标目录不存在：{target_dir}")
    url = str(url or "").strip()
    if not url.lower().startswith(("http://", "https://")):
        raise ValueError("只支持 http/https 下载地址")
    parsed = urlparse(url)
    filename = os.path.basename(parsed.path) or "download.bin"
    target = os.path.join(target_dir, filename)
    try:
        req = urllib.request.Request(
            url, headers={"User-Agent": "TianyiPanel/0.1"}
        )
        with urllib.request.urlopen(req, timeout=30) as resp:
            with open(target, "wb") as fh:
                while True:
                    chunk = resp.read(65536)
                    if not chunk:
                        break
                    fh.write(chunk)
    except urllib.error.HTTPError as exc:
        raise RuntimeError(f"下载失败：HTTP {exc.code} {exc.reason}")
    except (urllib.error.URLError, TimeoutError, OSError) as exc:
        raise RuntimeError(f"下载失败：{exc}")
    return {
        "ok": True,
        "path": target,
        "name": os.path.basename(target),
        "size": os.path.getsize(target),
    }


def make_dir(path):
    path = _fs_path(path)
    try:
        os.makedirs(path, exist_ok=True)
    except PermissionError:
        raise PermissionError(f"没有权限创建目录：{path}")
    return {"ok": True, "path": path}


def rename_path(path, new_name):
    path = _fs_path(path)
    new_name = str(new_name or "").strip()
    if (
        not new_name
        or "/" in new_name
        or "\\" in new_name
        or new_name in (".", "..")
    ):
        raise ValueError("新名称无效")
    if not os.path.exists(path):
        raise FileNotFoundError(f"路径不存在：{path}")
    new_path = os.path.join(os.path.dirname(path), new_name)
    os.rename(path, new_path)
    return {"ok": True, "path": new_path}


def archive_paths(paths, target, fmt="tar.gz"):
    target = _fs_path(target)
    fmt = (fmt or "tar.gz").strip()
    if fmt not in ("tar.gz", "zip"):
        raise ValueError("不支持的压缩格式")
    cleaned = []
    for item in paths or []:
        item_path = _fs_path(item)
        if not os.path.exists(item_path):
            raise FileNotFoundError(f"路径不存在：{item_path}")
        cleaned.append(item_path)
    if not cleaned:
        raise ValueError("请至少选择一个路径")
    parent = os.path.dirname(target)
    if parent and not os.path.isdir(parent):
        raise NotADirectoryError(f"目标目录不存在：{parent}")
    if fmt == "zip":
        with zipfile.ZipFile(target, "w", zipfile.ZIP_DEFLATED) as zf:
            for item_path in cleaned:
                zf.write(item_path, arcname=os.path.basename(item_path))
    else:
        with tarfile.open(target, "w:gz") as tf:
            for item_path in cleaned:
                tf.add(item_path, arcname=os.path.basename(item_path))
    return {"ok": True, "path": target, "size": os.path.getsize(target)}


def extract_archive(archive, target_dir):
    archive = _fs_path(archive)
    target_dir = _fs_path(target_dir)
    if not os.path.isfile(archive):
        raise FileNotFoundError(f"压缩包不存在：{archive}")
    os.makedirs(target_dir, exist_ok=True)
    if zipfile.is_zipfile(archive):
        with zipfile.ZipFile(archive) as zf:
            for name in zf.namelist():
                clean = os.path.normpath(name)
                if clean.startswith("..") or os.path.isabs(clean):
                    raise ValueError(f"压缩包包含不安全路径：{name}")
            zf.extractall(target_dir)
        return {"ok": True, "path": target_dir, "message": "解压完成（zip）"}
    if tarfile.is_tarfile(archive):
        with tarfile.open(archive, "r:*") as tf:
            for member in tf.getmembers():
                clean = os.path.normpath(member.name)
                if clean.startswith("..") or os.path.isabs(clean):
                    raise ValueError(f"压缩包包含不安全路径：{member.name}")
            tf.extractall(target_dir)
        return {"ok": True, "path": target_dir, "message": "解压完成（tar）"}
    raise ValueError("不支持的压缩包格式")


def change_mode(path, mode):
    path = _fs_path(path)
    if not os.path.exists(path):
        raise FileNotFoundError(f"路径不存在：{path}")
    mode = str(mode or "").strip()
    if not re.fullmatch(r"[0-7]{3,4}", mode):
        raise ValueError("权限格式应为 3-4 位八进制，例如 755")
    try:
        os.chmod(path, int(mode, 8))
    except PermissionError:
        rc, out, err = run_cmd(["chmod", mode, path], timeout=15, privileged=True)
        if rc != 0:
            raise PermissionError((err or "chmod 失败").strip())
    except OSError as exc:
        raise RuntimeError(f"chmod 失败：{exc}")
    return {"ok": True, "path": path, "mode": mode}


def change_owner(path, owner, group=""):
    path = _fs_path(path)
    if not os.path.exists(path):
        raise FileNotFoundError(f"路径不存在：{path}")
    owner = str(owner or "").strip()
    group = str(group or "").strip()
    if not re.fullmatch(r"[A-Za-z0-9_.-]+", owner):
        raise ValueError("属主格式无效")
    spec = owner + (":" + group if group else "")
    rc, out, err = run_cmd(["chown", spec, path], timeout=15, privileged=True)
    if rc != 0:
        raise PermissionError((err or "chown 失败").strip())
    return {"ok": True, "path": path, "owner": spec}


def _backup_name_ok(name):
    value = str(name or "")
    if not re.fullmatch(r"[A-Za-z0-9._-]{1,128}", value):
        return False
    return ".." not in value


def list_backups():
    if not PANEL_BACKUP_DIR.exists():
        return []
    rows = []
    for item in sorted(
        PANEL_BACKUP_DIR.iterdir(),
        key=lambda item: item.stat().st_mtime,
        reverse=True,
    ):
        if item.is_file():
            st = item.stat()
            rows.append(
                {
                    "name": item.name,
                    "size": st.st_size,
                    "time": datetime.datetime.fromtimestamp(st.st_mtime).strftime(
                        "%Y-%m-%d %H:%M:%S"
                    ),
                }
            )
    return rows


def create_backup(name, paths, fmt="tar.gz"):
    if not _backup_name_ok(name):
        raise ValueError("备份名称只能包含字母、数字、下划线和连字符")
    fmt = (fmt or "tar.gz").strip()
    if fmt not in ("tar.gz", "zip"):
        raise ValueError("不支持的备份格式")
    PANEL_BACKUP_DIR.mkdir(parents=True, exist_ok=True)
    stamp = datetime.datetime.now().strftime("%Y%m%d-%H%M%S")
    ext = "zip" if fmt == "zip" else "tar.gz"
    target = PANEL_BACKUP_DIR / f"{name}-{stamp}.{ext}"
    result = archive_paths(paths, str(target), fmt)
    return {
        "ok": True,
        "name": os.path.basename(str(target)),
        "path": str(target),
        "size": result["size"],
        "message": "备份完成：" + os.path.basename(str(target)),
    }


def restore_backup(name, target_dir):
    if not _backup_name_ok(name):
        raise ValueError("备份文件名无效")
    archive = PANEL_BACKUP_DIR / name
    if not archive.is_file():
        raise FileNotFoundError(f"备份文件不存在：{name}")
    result = extract_archive(str(archive), target_dir)
    result["message"] = "已恢复到 " + result["path"]
    return result


def delete_backup(name):
    if not _backup_name_ok(name):
        raise ValueError("备份文件名无效")
    target = PANEL_BACKUP_DIR / name
    if not target.is_file():
        raise FileNotFoundError(f"备份文件不存在：{name}")
    target.unlink()
    return {"ok": True, "message": "备份已删除"}


# ---------------------------------------------------------------------------
# WebDAV 云存储（纯标准库实现）
# ---------------------------------------------------------------------------

_WEBDAV_LOCK = threading.Lock()


def load_webdav_config():
    try:
        data = json.loads(WEBDAV_CONFIG_PATH.read_text(encoding="utf-8"))
        if isinstance(data, dict):
            return {
                "enabled": bool(data.get("enabled")),
                "url": str(data.get("url", "")),
                "remote_dir": str(data.get("remote_dir", "") or "panel-backups"),
                "username": str(data.get("username", "")),
                "password": str(data.get("password", "")),
            }
    except Exception:
        pass
    return {"enabled": False, "url": "", "remote_dir": "panel-backups",
            "username": "", "password": ""}


def save_webdav_config(config):
    json_text = json.dumps(config, ensure_ascii=False, indent=2)
    with _WEBDAV_LOCK:
        WEBDAV_CONFIG_PATH.write_text(json_text, encoding="utf-8")
    try:
        os.chmod(WEBDAV_CONFIG_PATH, 0o600)
    except Exception:
        pass


def _webdav_require_config():
    config = load_webdav_config()
    if not config.get("url") or not config.get("username"):
        raise ValueError("请先配置 WebDAV 服务器地址和账号")
    return config


def _webdav_url(config, relpath):
    base = config["url"].rstrip("/")
    remote_dir = str(config.get("remote_dir") or "panel-backups").strip("/")
    parts = [base]
    if remote_dir:
        parts.append("/".join(quote(seg, safe="") for seg in remote_dir.split("/")))
    if relpath:
        parts.append(quote(relpath, safe="/"))
    return "/".join(parts)


def webdav_request(config, method, relpath, data=None, timeout=60, depth=None):
    import base64
    url = _webdav_url(config, relpath)
    headers = {
        "Authorization": "Basic "
        + base64.b64encode(
            (config["username"] + ":" + config["password"]).encode("utf-8")
        ).decode("ascii"),
        "User-Agent": APP_NAME + "/" + VERSION,
    }
    if depth is not None:
        headers["Depth"] = str(depth)
    request = urllib.request.Request(url, data=data, headers=headers, method=method)
    try:
        with urllib.request.urlopen(request, timeout=timeout) as response:
            return response.status, response.read()
    except urllib.error.HTTPError as exc:
        return exc.code, exc.read()
    except urllib.error.URLError as exc:
        raise ValueError(f"无法连接 WebDAV 服务器：{exc.reason}")


def webdav_ensure_dir(config):
    """逐级 MKCOL 确保远端目录存在（405 表示已存在）。"""
    import base64
    remote_dir = str(config.get("remote_dir") or "panel-backups").strip("/")
    if not remote_dir:
        return
    base = config["url"].rstrip("/")
    segments = remote_dir.split("/")
    auth = "Basic " + base64.b64encode(
        (config["username"] + ":" + config["password"]).encode("utf-8")
    ).decode("ascii")
    for index in range(1, len(segments) + 1):
        rel = "/".join(segments[:index])
        url = base + "/" + "/".join(
            quote(seg, safe="") for seg in segments[:index]
        )
        request = urllib.request.Request(
            url,
            headers={"Authorization": auth},
            method="MKCOL",
        )
        try:
            with urllib.request.urlopen(request, timeout=30):
                continue
        except urllib.error.HTTPError as exc:
            if exc.code in (201, 405, 301):
                continue
            raise ValueError(f"创建远端目录失败 /{rel}：HTTP {exc.code}")
        except urllib.error.URLError as exc:
            raise ValueError(f"无法连接 WebDAV 服务器：{exc.reason}")


def webdav_test(config=None):
    config = config or _webdav_require_config()
    remote_dir = str(config.get("remote_dir") or "").strip("/")
    status, _ = webdav_request(config, "PROPFIND", "", depth=0, timeout=20)
    if status in (207, 200):
        if remote_dir:
            webdav_ensure_dir(config)
        return {"ok": True, "message": "连接成功：WebDAV 服务器可用"}
    if status in (401, 403):
        raise ValueError(f"认证失败：HTTP {status}，请检查账号密码")
    raise ValueError(f"连接失败：HTTP {status}")


def webdav_list():
    config = _webdav_require_config()
    status, body = webdav_request(config, "PROPFIND", "", depth=1, timeout=30)
    if status not in (207, 200):
        raise ValueError(f"列目录失败：HTTP {status}")
    import xml.etree.ElementTree as ET
    rows = []
    try:
        root = ET.fromstring(body)
    except ET.ParseError:
        return {"files": []}
    base = config["url"].rstrip("/")
    remote_dir = str(config.get("remote_dir") or "panel-backups").strip("/")
    dir_prefix = "/" + remote_dir + "/" if remote_dir else "/"
    for resp in root.iter():
        if not resp.tag.endswith("}response") and resp.tag != "response":
            continue
        href = ""
        size = 0
        mtime = ""
        is_dir = False
        for child in resp.iter():
            tag = child.tag.split("}")[-1]
            if tag == "href":
                href = unquote(child.text or "")
            elif tag == "getcontentlength" and child.text:
                try:
                    size = int(child.text)
                except ValueError:
                    size = 0
            elif tag == "getlastmodified" and child.text:
                try:
                    mtime = datetime.datetime.strptime(
                        child.text.strip(), "%a, %d %b %Y %H:%M:%S %Z"
                    ).strftime("%Y-%m-%d %H:%M:%S")
                except ValueError:
                    mtime = child.text
            elif tag == "collection":
                is_dir = True
        if is_dir or not href:
            continue
        name = href[len(dir_prefix):] if href.startswith(dir_prefix) else href.lstrip("/")
        if not name or "/" in name:
            continue
        rows.append({"name": name, "size": size, "time": mtime})
    rows.sort(key=lambda item: item["time"], reverse=True)
    return {"files": rows}


def webdav_upload(name):
    config = _webdav_require_config()
    local = PANEL_BACKUP_DIR / name
    if not _backup_name_ok(name) or not local.is_file():
        raise FileNotFoundError(f"本地备份不存在：{name}")
    webdav_ensure_dir(config)
    data = local.read_bytes()
    status, body = webdav_request(config, "PUT", name, data=data, timeout=600)
    if status not in (200, 201, 204):
        raise ValueError(f"上传失败：HTTP {status}")
    return {"ok": True, "message": f"已上传到云存储：{name}"}


def webdav_download(name):
    """从云端下载到本地备份目录（随后可用现有恢复功能）。"""
    config = _webdav_require_config()
    if not _backup_name_ok(name):
        raise ValueError("备份文件名无效")
    status, body = webdav_request(config, "GET", name, timeout=600)
    if status != 200:
        raise FileNotFoundError(f"云端文件不存在或下载失败：HTTP {status}")
    PANEL_BACKUP_DIR.mkdir(parents=True, exist_ok=True)
    target = PANEL_BACKUP_DIR / name
    target.write_bytes(body)
    return {"ok": True, "message": f"已取回到本地备份目录：{name}"}


def webdav_delete(name):
    config = _webdav_require_config()
    if not _backup_name_ok(name):
        raise ValueError("备份文件名无效")
    status, _ = webdav_request(config, "DELETE", name, timeout=30)
    if status not in (200, 202, 204, 404):
        raise ValueError(f"删除失败：HTTP {status}")
    return {"ok": True, "message": f"云端备份已删除：{name}"}


# ---------------------------------------------------------------------------
# 面板设置（访问验证码自定义）
# ---------------------------------------------------------------------------

def get_panel_settings():
    return {
        "access_code": CONFIG.access_code,
        "port": CONFIG.port,
        "allow_command": CONFIG.allow_command,
        "has_sudo": bool(CONFIG.sudo_password),
    }


def set_access_code(code):
    code = str(code or "").strip()
    if not re.fullmatch(r"\d{6}", code):
        raise ValueError("访问验证码必须是 6 位数字")
    verify_file = ROOT / "panel.verify"
    try:
        verify_file.write_text(code + "\n", encoding="utf-8")
        os.chmod(verify_file, 0o600)
    except OSError as exc:
        raise ValueError("写入验证码失败：" + str(exc))
    CONFIG.access_code = code
    return {
        "ok": True,
        "message": f"访问验证码已更新为 {code}",
    }


# ---------------------------------------------------------------------------
# 网站管理（Nginx 站点）
# ---------------------------------------------------------------------------

SITES_CONFIG_PATH = Path.home() / ".panel-sites.json"
NGINX_CONF_DIR = "/etc/nginx/conf.d"
SITE_CONF_PREFIX = "panel-site-"


def _site_name_ok(name):
    return bool(re.fullmatch(r"[a-z0-9][a-z0-9-]{0,62}", str(name or "")))


def _site_domains_ok(domains):
    if not domains:
        return False
    for item in domains:
        value = str(item or "").strip()
        if not value:
            return False
        # 域名、通配符域名或 IP
        if not re.fullmatch(r"(\*\.)?[A-Za-z0-9.-]{1,253}", value):
            return False
    return True


def load_sites_meta():
    try:
        data = json.loads(SITES_CONFIG_PATH.read_text(encoding="utf-8"))
        if isinstance(data, dict) and isinstance(data.get("sites"), dict):
            return data["sites"]
    except Exception:
        pass
    return {}


def save_sites_meta(sites):
    payload = json.dumps({"sites": sites}, ensure_ascii=False, indent=2)
    SITES_CONFIG_PATH.write_text(payload, encoding="utf-8")


def _site_conf_path(name, disabled=False):
    suffix = ".conf.disabled" if disabled else ".conf"
    return f"{NGINX_CONF_DIR}/{SITE_CONF_PREFIX}{name}{suffix}"


def get_nginx_status():
    installed = False
    version = ""
    running = False
    rc, out, err = run_cmd(["nginx", "-v"], timeout=10)
    if rc in (0, 1) or "nginx" in (out + err).lower():
        text = out or err
        match = re.search(r"nginx/([\d.]+)", text)
        if match or rc == 0:
            installed = True
            version = match.group(1) if match else ""
    if not installed:
        rc2, out2, _ = run_cmd(["which", "nginx"], timeout=10)
        if rc2 == 0 and out2.strip():
            installed = True
    if installed:
        rc3, out3, _ = run_cmd(["systemctl", "is-active", "nginx"], timeout=10)
        running = rc3 == 0 and out3.strip() == "active"
    return {
        "installed": installed,
        "version": version,
        "running": running,
        "has_sudo": bool(CONFIG.sudo_password),
    }


def nginx_check_config():
    rc, out, err = run_cmd(["nginx", "-t"], timeout=20, privileged=True)
    return {"ok": rc == 0, "message": (err or out).strip()[-2000:]}


def nginx_reload():
    check = nginx_check_config()
    if not check["ok"]:
        raise ValueError("Nginx 配置校验失败：" + check["message"])
    rc, out, err = run_cmd(["systemctl", "reload", "nginx"], timeout=30, privileged=True)
    if rc != 0:
        # reload 失败时尝试启动（首次创建站点时 nginx 可能没在跑）
        rc2, _, err2 = run_cmd(
            ["systemctl", "enable", "--now", "nginx"], timeout=60, privileged=True
        )
        if rc2 != 0:
            raise ValueError("重载 Nginx 失败：" + (err or err2).strip()[-500:])
    return {"ok": True, "message": "Nginx 已重载配置"}


def install_nginx():
    status = get_nginx_status()
    if status["installed"]:
        return {"ok": True, "message": "Nginx 已安装"}
    manager = None
    for candidate in (["apt-get"], ["dnf"], ["yum"]):
        rc, _, _ = run_cmd(["which", candidate[0]], timeout=10)
        if rc == 0:
            manager = candidate
            break
    if not manager:
        raise ValueError("未找到 apt/dnf/yum 包管理器，请手动安装 Nginx")
    if manager[0] == "apt-get":
        run_cmd(["apt-get", "update", "-qq"], timeout=180, privileged=True)
        rc, out, err = run_cmd(
            ["apt-get", "install", "-y", "-qq", "nginx"],
            timeout=600,
            privileged=True,
        )
    else:
        rc, out, err = run_cmd(
            manager + ["install", "-y", "nginx"], timeout=600, privileged=True
        )
    if rc != 0:
        raise ValueError("安装 Nginx 失败：" + (err or out).strip()[-500:])
    run_cmd(["systemctl", "enable", "--now", "nginx"], timeout=60, privileged=True)
    return {"ok": True, "message": "Nginx 安装完成并已启动"}


def _site_body_lines(site):
    """生成 server 块内部的配置行（供 80 与 443 块复用）。"""
    lines = []
    site_type = site.get("type", "static")
    if site_type == "proxy":
        target = site.get("proxy_target", "http://127.0.0.1:8080")
        lines += [
            "    location / {",
            f"        proxy_pass {target};",
            "        proxy_set_header Host $host;",
            "        proxy_set_header X-Real-IP $remote_addr;",
            "        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;",
            "        proxy_set_header X-Forwarded-Proto $scheme;",
            "        proxy_http_version 1.1;",
            "        proxy_set_header Upgrade $http_upgrade;",
            "        proxy_set_header Connection \"upgrade\";",
            "    }",
        ]
    else:
        root = site.get("root", f"/var/www/{site.get('name', 'site')}")
        lines += [f"    root {root};", "    index index.html index.htm;"]
        if site_type == "php":
            socket_path = site.get("php_socket", "")
            index = site.get("index", "index.php index.html")
            lines[-1] = f"    index {index};"
            lines += [
                "    location ~ \\.php$ {",
                "        include fastcgi_params;",
                f"        fastcgi_pass unix:{socket_path};",
                "    }",
            ]
        lines += [
            "    location / {",
            "        try_files $uri $uri/ =404;",
            "    }",
        ]
    return lines


def build_site_conf(site):
    name = site["name"]
    domains = site.get("domains", [])
    listen = int(site.get("port", 80) or 80)
    server_name = " ".join(domains) if domains else "_"
    lines = [
        "# 由" + APP_NAME + "生成，请勿手动修改站点块",
        f"# site: {name}",
        "server {",
        f"    listen {listen};",
        f"    server_name {server_name};",
        "    # Let's Encrypt HTTP-01 验证通道",
        "    location /.well-known/acme-challenge/ {",
        "        root /var/www/acme;",
        "    }",
    ]
    lines += _site_body_lines(site)
    lines += [
        "    access_log /var/log/nginx/" + name + ".access.log;",
        "    error_log /var/log/nginx/" + name + ".error.log;",
        "}",
        "",
    ]
    # SSL 443 块
    ssl = site.get("ssl") or {}
    if ssl.get("enabled") and ssl.get("cert_path") and ssl.get("key_path"):
        lines += [
            "server {",
            "    listen 443 ssl;",
            "    http2 on;",
            f"    server_name {server_name};",
            f"    ssl_certificate {ssl['cert_path']};",
            f"    ssl_certificate_key {ssl['key_path']};",
            "    ssl_protocols TLSv1.2 TLSv1.3;",
        ]
        lines += _site_body_lines(site)
        lines += [
            "    access_log /var/log/nginx/" + name + ".access.log;",
            "    error_log /var/log/nginx/" + name + ".error.log;",
            "}",
            "",
        ]
    return "\n".join(lines)


def _nginx_conf_exists():
    rc, _, _ = run_cmd(["test", "-d", NGINX_CONF_DIR], timeout=10)
    return rc == 0


def write_site_conf_file(path, content):
    """写入需要 root 权限的 nginx 配置文件。
    
    使用临时文件 + sudo mv 的方式，避免 sudo -S 缓存状态下
    密码被误当作 stdin 数据写入文件。
    """
    if not CONFIG.sudo_password:
        raise ValueError("需要 PANEL_SUDO_PASSWORD 才能写入 /etc/nginx，请重启面板并设置该环境变量")
    import tempfile
    tmp_fd, tmp_path = tempfile.mkstemp(prefix="panel-site-", suffix=".conf")
    try:
        with os.fdopen(tmp_fd, "w", encoding="utf-8") as f:
            f.write(content)
        os.chmod(tmp_path, 0o644)
        rc, out, err = run_cmd(
            ["mv", tmp_path, path], timeout=15, privileged=True
        )
        if rc != 0:
            raise ValueError("写入站点配置失败：" + (err or out).strip()[-500:])
    except subprocess.TimeoutExpired:
        raise ValueError("写入站点配置超时")
    finally:
        try:
            os.unlink(tmp_path)
        except Exception:
            pass


def delete_site_conf_file(name):
    for path in (_site_conf_path(name), _site_conf_path(name, disabled=True)):
        rc, _, err = run_cmd(["rm", "-f", path], timeout=15, privileged=True)
        if rc != 0:
            raise ValueError("删除站点配置失败：" + err.strip()[-300:])


def list_sites():
    nginx = get_nginx_status()
    sites = load_sites_meta()
    rows = []
    for name, meta in sites.items():
        enabled = run_cmd(["test", "-f", _site_conf_path(name)], timeout=10)[0] == 0
        disabled = run_cmd(["test", "-f", _site_conf_path(name, True)], timeout=10)[0] == 0
        rows.append({
            "name": name,
            "type": meta.get("type", "static"),
            "domains": meta.get("domains", []),
            "port": meta.get("port", 80),
            "root": meta.get("root", ""),
            "proxy_target": meta.get("proxy_target", ""),
            "enabled": enabled and not disabled,
            "created": meta.get("created", ""),
            "ssl": bool((meta.get("ssl") or {}).get("enabled")),
        })
    rows.sort(key=lambda item: item["created"], reverse=True)
    return {"nginx": nginx, "sites": rows}


def create_site(payload):
    name = str(payload.get("name", "")).strip().lower()
    if not _site_name_ok(name):
        raise ValueError("站点名只能是小写字母、数字和连字符（开头为字母/数字）")
    sites = load_sites_meta()
    if name in sites:
        raise ValueError(f"站点已存在：{name}")
    domains = [d.strip() for d in (payload.get("domains") or []) if str(d).strip()]
    if not _site_domains_ok(domains):
        raise ValueError("请填写至少一个合法域名（支持 *.example.com）")
    site_type = str(payload.get("type", "static")).strip()
    if site_type not in ("static", "proxy", "php"):
        raise ValueError("不支持的站点类型")
    if not _nginx_conf_exists():
        raise ValueError("服务器未安装 Nginx 或 conf.d 目录不存在，请先安装 Nginx")

    site = {
        "name": name,
        "type": site_type,
        "domains": domains,
        "port": int(payload.get("port", 80) or 80),
        "created": now_str(),
    }
    if site_type == "proxy":
        target = str(payload.get("proxy_target", "")).strip()
        if not re.fullmatch(r"https?://[A-Za-z0-9.:/_-]+", target):
            raise ValueError("代理目标格式应为 http(s)://主机:端口")
        site["proxy_target"] = target
    else:
        root = str(payload.get("root", "")).strip() or f"/var/www/{name}"
        if not root.startswith("/"):
            raise ValueError("网站目录必须是绝对路径")
        site["root"] = root
    if site_type == "php":
        socket_path = str(payload.get("php_socket", "")).strip()
        if not socket_path.startswith("/"):
            raise ValueError("PHP-FPM socket 必须是绝对路径，例如 /run/php/php8.2-fpm.sock")
        site["php_socket"] = socket_path

    content = build_site_conf(site)
    write_site_conf_file(_site_conf_path(name), content)
    check = nginx_check_config()
    if not check["ok"]:
        delete_site_conf_file(name)
        raise ValueError("配置校验失败，已回滚：" + check["message"])

    # 静态/PHP 站点自动创建目录
    if site_type != "proxy":
        run_cmd(["mkdir", "-p", site["root"]], timeout=15, privileged=True)

    sites[name] = site
    save_sites_meta(sites)
    nginx_reload()
    return {"ok": True, "message": f"站点 {name} 创建成功并已生效"}


def get_site_config(name):
    if not _site_name_ok(name):
        raise ValueError("站点名无效")
    for path in (_site_conf_path(name), _site_conf_path(name, disabled=True)):
        rc, out, _ = run_cmd(["cat", path], timeout=10, privileged=True)
        if rc == 0:
            return {"name": name, "path": path, "content": out}
    raise FileNotFoundError(f"站点配置不存在：{name}")


def get_site_logs(name, kind="access", lines=100):
    if not _site_name_ok(name):
        raise ValueError("站点名无效")
    kind = kind if kind in ("access", "error") else "access"
    try:
        lines = max(10, min(int(lines), 500))
    except (TypeError, ValueError):
        lines = 100
    log_path = f"/var/log/nginx/{name}.{kind}.log"
    rc, out, err = run_cmd(
        ["tail", "-n", str(lines), log_path], timeout=15, privileged=True
    )
    if rc != 0:
        return {"name": name, "kind": kind, "lines": [],
                "message": f"日志文件不存在或为空：{log_path}"}
    return {"name": name, "kind": kind, "lines": out.rstrip("\n").splitlines()}


def save_site_config(name, content):
    if not _site_name_ok(name):
        raise ValueError("站点名无效")
    if "server" not in str(content):
        raise ValueError("配置内容必须包含 server 块")
    path = _site_conf_path(name)
    rc, _, _ = run_cmd(["test", "-f", path], timeout=10, privileged=True)
    if rc != 0:
        path = _site_conf_path(name, disabled=True)
        rc2, _, _ = run_cmd(["test", "-f", path], timeout=10, privileged=True)
        if rc2 != 0:
            raise FileNotFoundError(f"站点配置不存在：{name}")
    write_site_conf_file(path, str(content))
    check = nginx_check_config()
    if not check["ok"]:
        raise ValueError("配置已保存，但 nginx -t 校验失败：" + check["message"])
    nginx_reload()
    return {"ok": True, "message": "配置已保存并重载 Nginx"}


def toggle_site(name, enable):
    if not _site_name_ok(name):
        raise ValueError("站点名无效")
    if enable:
        src, dst = _site_conf_path(name, True), _site_conf_path(name)
    else:
        src, dst = _site_conf_path(name), _site_conf_path(name, True)
    rc, _, err = run_cmd(["mv", src, dst], timeout=15, privileged=True)
    if rc != 0:
        state_text = "启用" if enable else "停用"
        raise ValueError(f"{state_text}失败（配置文件不存在？）：{err.strip()[-300:]}")
    nginx_reload()
    return {"ok": True, "message": f"站点 {name} 已" + ("启用" if enable else "停用")}


def delete_site(name):
    if not _site_name_ok(name):
        raise ValueError("站点名无效")
    sites = load_sites_meta()
    delete_site_conf_file(name)
    sites.pop(name, None)
    save_sites_meta(sites)
    nginx_reload()
    return {"ok": True, "message": f"站点 {name} 已删除"}


# ---------------------------------------------------------------------------
# SSL 证书（基于 acme.sh，Let's Encrypt 免费证书 + 自动续签）
# ---------------------------------------------------------------------------

ACME_HOME = Path.home() / ".acme.sh"
ACME_BIN = ACME_HOME / "acme.sh"


def _run_acme(args, timeout=180):
    if not ACME_BIN.exists():
        raise ValueError("acme.sh 未安装，请先点击安装")
    # 以面板用户身份运行（acme.sh 及证书目录均在用户家目录，无需 root）
    rc, out, err = run_cmd(
        ["bash", str(ACME_BIN)] + args,
        timeout=timeout,
        env=dict(os.environ, HOME=str(Path.home())),
    )
    return rc, (out or "") + (err or "")


def acme_install():
    if ACME_BIN.exists():
        return {"ok": True, "message": "acme.sh 已安装"}
    # 下载官方安装脚本并静默安装
    # 注意：不带 --nocron，因为 acme.sh 靠 cron 实现自动续签
    install_sh = Path.home() / ".panel-acme-install.sh"
    rc, out, err = run_cmd(
        ["bash", "-c",
         "curl -fsSL https://get.acme.sh -o " + shlex.quote(str(install_sh))],
        timeout=120,
    )
    if rc != 0:
        raise ValueError("下载 acme.sh 失败：" + (err or out).strip()[-300:])
    rc2, out2, err2 = run_cmd(
        ["bash", str(install_sh)],
        timeout=300,
    )
    try:
        install_sh.unlink()
    except Exception:
        pass
    if rc2 != 0:
        raise ValueError("安装 acme.sh 失败：" + ((err2 or "") + (out2 or "")).strip()[-500:])
    return {"ok": True, "message": "acme.sh 安装完成（自动续签已注册）"}


def list_certificates():
    certs = []
    sites = load_sites_meta()
    for name, meta in sites.items():
        ssl = meta.get("ssl") or {}
        certs.append({
            "site": name,
            "domains": meta.get("domains", []),
            "enabled": bool(ssl.get("enabled")),
            "issuer": ssl.get("issuer", ""),
            "issued_at": ssl.get("issued_at", ""),
        })
    acme_ok = ACME_BIN.exists()
    return {"certs": certs, "acme_installed": acme_ok}


def issue_certificate(site_name):
    if not _site_name_ok(site_name):
        raise ValueError("站点名无效")
    sites = load_sites_meta()
    site = sites.get(site_name)
    if not site:
        raise ValueError(f"站点不存在：{site_name}")
    domains = [d for d in site.get("domains", []) if d and not d.startswith("*")]
    if not domains:
        raise ValueError("该站点没有可用于 HTTP 验证的域名（泛域名需要 DNS 验证）")

    acme_install()
    # 确保 ACME webroot 存在
    run_cmd(["mkdir", "-p", "/var/www/acme/.well-known/acme-challenge"],
            timeout=15, privileged=True)

    args = ["--issue"]
    for domain in domains:
        args += ["-d", domain]
    args += ["-w", "/var/www/acme", "--keylength", "ec-256", "--force"]
    rc, output = _run_acme(args, timeout=300)
    if rc != 0:
        raise ValueError("证书签发失败：" + output.strip()[-800:])

    main_domain = domains[0]
    cert_dir = ACME_HOME / (main_domain + "_ecc")
    cert_src = cert_dir / "fullchain.cer"
    key_src = cert_dir / (main_domain + ".key")

    # 部署证书到站点目录
    deploy_dir = Path.home() / ".panel-certs" / site_name
    deploy_dir.mkdir(parents=True, exist_ok=True)
    cert_dst = deploy_dir / "fullchain.pem"
    key_dst = deploy_dir / "privkey.pem"
    rc2, out2 = _run_acme(
        ["--install-cert", "-d", main_domain, "--ecc",
         "--fullchain-file", str(cert_dst), "--key-file", str(key_dst),
         "--reloadcmd", "systemctl reload nginx"],
        timeout=60,
    )
    if rc2 != 0:
        raise ValueError("证书部署失败：" + out2.strip()[-500:])

    # 更新站点配置，启用 SSL
    site["ssl"] = {
        "enabled": True,
        "cert_path": str(cert_dst),
        "key_path": str(key_dst),
        "issuer": "Let's Encrypt (acme.sh)",
        "issued_at": now_str(),
        "domains": domains,
    }
    sites[site_name] = site
    save_sites_meta(sites)
    content = build_site_conf(site)
    write_site_conf_file(_site_conf_path(site_name), content)
    check = nginx_check_config()
    if not check["ok"]:
        site.pop("ssl", None)
        save_sites_meta(sites)
        write_site_conf_file(_site_conf_path(site_name), build_site_conf(site))
        raise ValueError("证书已签发，但 Nginx 配置校验失败已回滚：" + check["message"])
    nginx_reload()
    return {"ok": True, "message": f"证书已签发并部署到站点 {site_name}（443 已启用，自动续签已开启）"}


def disable_certificate(site_name):
    if not _site_name_ok(site_name):
        raise ValueError("站点名无效")
    sites = load_sites_meta()
    site = sites.get(site_name)
    if not site:
        raise ValueError(f"站点不存在：{site_name}")
    site.pop("ssl", None)
    sites[site_name] = site
    save_sites_meta(sites)
    write_site_conf_file(_site_conf_path(site_name), build_site_conf(site))
    nginx_reload()
    return {"ok": True, "message": "SSL 已停用（证书文件保留，续签仍生效）"}


def audit_log(route, ok=True, detail="", ip="", duration_ms=0):
    try:
        row = {
            "time": now_str(),
            "ip": ip or "",
            "route": str(route or ""),
            "ok": bool(ok),
            "detail": str(detail or "")[:300],
            "duration_ms": int(duration_ms or 0),
        }
        with _AUDIT_LOCK:
            AUDIT_DIR.mkdir(parents=True, exist_ok=True)
            lines = []
            if AUDIT_FILE.is_file():
                try:
                    raw = AUDIT_FILE.read_text(
                        encoding="utf-8", errors="replace"
                    )
                    lines = [line for line in raw.splitlines() if line.strip()]
                except OSError:
                    lines = []
            lines.append(json.dumps(row, ensure_ascii=False))
            lines = lines[-AUDIT_MAX_LINES:]
            try:
                AUDIT_FILE.write_text(
                    "\n".join(lines) + "\n", encoding="utf-8"
                )
                os.chmod(AUDIT_FILE, 0o600)
            except OSError:
                pass
    except Exception:
        pass


def list_audit_logs(lines=200):
    try:
        lines = max(1, min(int(lines), 1000))
    except (TypeError, ValueError):
        lines = 200
    rows = []
    if not AUDIT_FILE.is_file():
        return rows
    try:
        raw = AUDIT_FILE.read_text(
            encoding="utf-8", errors="replace"
        )
    except OSError:
        return rows
    for line in raw.splitlines():
        line = line.strip()
        if not line:
            continue
        try:
            obj = json.loads(line)
        except ValueError:
            continue
        if isinstance(obj, dict):
            rows.append(obj)
    rows.reverse()
    return rows[:lines]


def clear_audit_logs():
    with _AUDIT_LOCK:
        if AUDIT_FILE.is_file():
            AUDIT_FILE.unlink()
    return {"ok": True, "message": "审计日志已清空"}


def _audit_detail_for(route, body):
    if not isinstance(body, dict):
        return ""
    mapping = {
        "/api/command": ["command"],
        "/api/apps/install": ["id"],
        "/api/container/action": ["id", "action"],
        "/api/container/create": ["name"],
        "/api/container/images/pull": ["image"],
        "/api/container/images/remove": ["id"],
        "/api/container/networks/create": ["name"],
        "/api/container/networks/remove": ["name"],
        "/api/container/volumes/create": ["name"],
        "/api/container/volumes/remove": ["name"],
        "/api/container/compose/save": ["name"],
        "/api/container/compose/up": ["name"],
        "/api/container/compose/down": ["name"],
        "/api/container/compose/stop": ["name"],
        "/api/container/compose/delete": ["name"],
        "/api/container/console/open": ["id"],
        "/api/firewall/toggle": ["enabled"],
        "/api/firewall/rule": ["action", "port", "protocol", "source"],
        "/api/firewall/rule/delete": ["number"],
        "/api/fail2ban/action": ["action"],
        "/api/fail2ban/unban": ["ip", "jail"],
        "/api/processes/kill": ["pid", "signal"],
        "/api/services/action": ["name", "action"],
        "/api/guard/add": ["name"],
        "/api/guard/remove": ["name"],
        "/api/files/download-url": ["url", "target"],
        "/api/files/archive": ["paths", "target", "format"],
        "/api/files/extract": ["archive", "target"],
        "/api/files/mkdir": ["path"],
        "/api/files/rename": ["path", "new_name"],
        "/api/files/chmod": ["path", "mode"],
        "/api/files/chown": ["path", "owner", "group"],
        "/api/files/delete": ["path"],
        "/api/backups/create": ["name", "format"],
        "/api/backups/restore": ["name", "target"],
        "/api/backups/delete": ["name"],
        "/api/db/create": ["engine", "name"],
        "/api/db/delete": ["engine", "name"],
        "/api/db/backup": ["engine", "name"],
        "/api/db/restore": ["engine", "name"],
        "/api/db/backups/delete": ["engine", "name"],
        "/api/models/pull": ["model"],
        "/api/models/remove": ["model"],
        "/api/models/generate": ["model"],
        "/api/tamper/set": ["paths"],
        "/api/terminal/open": [],
        "/api/audit/clear": [],
    }
    keys = mapping.get(route)
    if not keys:
        return ""
    parts = []
    for key in keys:
        value = body.get(key)
        if value is None or value == "":
            continue
        if isinstance(value, (list, tuple)):
            value = ", ".join(str(item) for item in value[:5])
        parts.append(f"{key}={value}")
    return " ".join(parts)


def get_dns_servers():
    servers = []
    try:
        with open("/etc/resolv.conf", encoding="utf-8", errors="replace") as fh:
            for line in fh:
                parts = line.split()
                if len(parts) >= 2 and parts[0] == "nameserver":
                    servers.append(parts[1])
    except OSError:
        pass
    return servers


def read_hosts():
    try:
        with open("/etc/hosts", encoding="utf-8", errors="replace") as fh:
            return fh.read()
    except OSError:
        return ""


def get_swap_info():
    memory = get_memory()
    total = memory.get("swap_total", 0)
    used = memory.get("swap_used", 0)
    percent = round(used / total * 100, 1) if total else 0
    return {
        "total": total,
        "used": used,
        "free": max(0, total - used),
        "percent": percent,
    }


def get_timezone():
    try:
        with open("/etc/timezone", encoding="utf-8", errors="replace") as fh:
            value = fh.read().strip()
            if value:
                return value
    except OSError:
        pass
    rc, out, err = run_cmd(
        ["timedatectl", "show", "-p", "Timezone", "--value"], timeout=10
    )
    return out.strip() if rc == 0 and out.strip() else "UTC"


def get_ntp_servers():
    servers = []
    try:
        with open("/etc/systemd/timesyncd.conf", encoding="utf-8", errors="replace") as fh:
            for line in fh:
                line = line.strip()
                if not line or line.startswith("#"):
                    continue
                key, sep, value = line.partition("=")
                if sep and key.strip() in ("NTP", "FallbackNTP"):
                    servers.extend(
                        item.strip() for item in value.split() if item.strip()
                    )
    except OSError:
        pass
    return servers or ["pool.ntp.org"]


def get_local_ips():
    rc, out, err = run_cmd(["hostname", "-I"], timeout=10)
    if rc == 0 and out.strip():
        return out.split()
    return []


def resolve_domain(domain):
    domain = str(domain or "").strip()
    if not domain:
        raise ValueError("域名不能为空")
    if len(domain) > 255:
        raise ValueError("域名过长")
    try:
        infos = socket.getaddrinfo(domain, None)
        ips = sorted({info[4][0] for info in infos})
        return {"domain": domain, "ips": ips, "error": None}
    except socket.gaierror as exc:
        return {"domain": domain, "ips": [], "error": str(exc)}


def get_toolbox_info():
    return {
        "dns": get_dns_servers(),
        "local_ips": get_local_ips(),
        "hosts": read_hosts(),
        "swap": get_swap_info(),
        "hostname": socket.gethostname(),
        "password_set": True,
        "ntp": get_ntp_servers(),
        "timezone": get_timezone(),
        "server_time": now_str(),
    }


def read_crontab():
    with _CRON_LOCK:
        rc, out, err = run_cmd(["crontab", "-l"], timeout=10)
        if rc == 0:
            return out.splitlines()
        return []


def write_crontab(lines):
    with _CRON_LOCK:
        text = "\n".join(lines)
        if text:
            text += "\n"
        try:
            proc = subprocess.run(
                ["crontab", "-"],
                input=text,
                capture_output=True,
                text=True,
                timeout=10,
            )
        except Exception as exc:
            raise ValueError(str(exc))
        if proc.returncode != 0:
            raise ValueError((proc.stderr or "").strip() or "crontab 写入失败")


def get_cron_list():
    lines = read_crontab()
    return {
        "lines": [
            {
                "index": index,
                "raw": line,
                "enabled": not line.startswith("#"),
            }
            for index, line in enumerate(lines)
        ],
        "total": len(lines),
    }


def add_cron(schedule, command):
    schedule = str(schedule or "").strip()
    command = str(command or "").strip()
    if len(schedule.split()) != 5:
        raise ValueError("计划格式应为 5 段，例如 */5 * * * *")
    if not command:
        raise ValueError("命令不能为空")
    if len(command) > 1000:
        raise ValueError("命令过长")
    lines = read_crontab()
    lines.append(f"{schedule} {command}")
    write_crontab(lines)
    return {"ok": True}


def remove_cron(index):
    try:
        index = int(index)
    except (TypeError, ValueError):
        raise ValueError("任务编号无效")
    lines = read_crontab()
    if index < 0 or index >= len(lines):
        raise ValueError("任务不存在")
    del lines[index]
    write_crontab(lines)
    return {"ok": True}


def toggle_cron(index):
    try:
        index = int(index)
    except (TypeError, ValueError):
        raise ValueError("任务编号无效")
    lines = read_crontab()
    if index < 0 or index >= len(lines):
        raise ValueError("任务不存在")
    line = lines[index]
    if line.startswith("# "):
        line = line[2:]
    elif line.startswith("#"):
        line = line[1:].lstrip()
    else:
        line = "# " + line
    lines[index] = line
    write_crontab(lines)
    return {"ok": True}


# ---------------------------------------------------------------------------
# 增强版计划任务（注册表 + wrapper 脚本 + 执行日志）
# ---------------------------------------------------------------------------

CRON_JOBS_PATH = Path.home() / ".panel-cron-jobs.json"
CRON_SCRIPT_DIR = Path.home() / ".panel-cron"
CRON_LOG_DIR = CRON_SCRIPT_DIR / "logs"


def _load_cron_jobs():
    try:
        data = json.loads(CRON_JOBS_PATH.read_text(encoding="utf-8"))
        if isinstance(data, list):
            return data
    except Exception:
        pass
    return []


def _save_cron_jobs(jobs):
    CRON_JOBS_PATH.write_text(
        json.dumps(jobs, ensure_ascii=False, indent=2), encoding="utf-8"
    )


def _cron_job_ok_name(name):
    return bool(re.fullmatch(r"[A-Za-z0-9_-]{1,64}", str(name or "")))


def _build_cron_wrapper(job):
    """生成任务包装脚本：执行任务并把输出追加到日志。"""
    job_id = job["id"]
    job_type = job.get("type", "shell")
    log_path = str(CRON_LOG_DIR / f"{job_id}.log")
    header = [
        "#!/usr/bin/env bash",
        "# 由" + APP_NAME + "生成，请勿手动修改",
        f"# job: {job.get('name', job_id)}",
        "set -o pipefail",
        f'LOG="{log_path}"',
        'echo "===== $(date "+%Y-%m-%d %H:%M:%S") 开始执行 =====" >> "$LOG"',
    ]
    if job_type == "shell":
        body = ["bash -c " + shlex.quote(job.get("script", "")) + ' >> "$LOG" 2>&1']
    elif job_type == "backup":
        stamp = "$(date +%Y%m%d-%H%M%S)"
        target_dir = str(Path.home() / ".panel-backups")
        paths = " ".join(shlex.quote(p) for p in job.get("paths", []) if p)
        name = job.get("name", "cronjob")
        archive_var = '"${ARCHIVE}"'
        body = [
            f"mkdir -p {shlex.quote(target_dir)}",
            f'ARCHIVE="{target_dir}/{name}-{stamp}.tar.gz"',
            "tar -czf " + archive_var + " " + paths + ' >> "$LOG" 2>&1',
        ]
        if job.get("cloud_upload"):
            # 备份成功后上传到 WebDAV 云存储
            upload_py = (
                "import json,sys,base64,urllib.request,pathlib;"
                "cfg=json.loads(pathlib.Path.home().joinpath('.panel-webdav.json').read_text());"
                "p=sys.argv[1];"
                "u=cfg['url'].rstrip('/')+'/'+cfg.get('remote_dir','panel-backups').strip('/')+'/'+p.split('/')[-1];"
                "r=urllib.request.Request(u,data=pathlib.Path(p).read_bytes(),"
                "headers={'Authorization':'Basic '+base64.b64encode("
                "(cfg['username']+':'+cfg['password']).encode()).decode()},method='PUT');"
                "urllib.request.urlopen(r,timeout=600);"
                "print('云存储上传成功')"
            )
            body += [
                "TAR_CODE=$?",
                "if [ $TAR_CODE -eq 0 ]; then",
                f'  python3 -c {shlex.quote(upload_py)} {archive_var} >> "$LOG" 2>&1 || echo "云存储上传失败" >> "$LOG"',
                "fi",
                "[ $TAR_CODE -eq 0 ]",  # 把 tar 的退出码传回脚本末尾，供统一日志记录
            ]
    elif job_type == "url":
        url = job.get("url", "")
        body = [
            "curl -fsS -m 60 " + shlex.quote(url)
            + ' -o /dev/null -w "HTTP %{http_code} (%{time_total}s)" >> "$LOG" 2>&1'
        ]
    else:
        body = ['echo "未知任务类型" >> "$LOG"', "exit 1"]
    footer = [
        'CODE=$?',
        'if [ $CODE -eq 0 ]; then',
        '  echo "执行成功" >> "$LOG"',
        "else",
        '  echo "执行失败（退出码 $CODE）" >> "$LOG"',
        "fi",
        "# 只保留最近 500 行日志",
        'tail -n 500 "$LOG" > "$LOG.tmp" 2>/dev/null && mv "$LOG.tmp" "$LOG"',
    ]
    return "\n".join(header + body + footer) + "\n"


def _sync_cron_crond():
    """把注册表同步到 crontab（带 PANEL-CRON 标记，不影响用户自己的行）。"""
    jobs = _load_cron_jobs()
    lines = read_crontab()
    kept = [l for l in lines if "PANEL-CRON" not in l]
    for job in jobs:
        if not job.get("enabled", True):
            continue
        script = str(CRON_SCRIPT_DIR / f"{job['id']}.sh")
        kept.append(f"{job['schedule']} bash {script} # PANEL-CRON {job['id']}")
    write_crontab(kept)


def _write_cron_wrapper(job):
    CRON_SCRIPT_DIR.mkdir(parents=True, exist_ok=True)
    CRON_LOG_DIR.mkdir(parents=True, exist_ok=True)
    path = CRON_SCRIPT_DIR / f"{job['id']}.sh"
    path.write_text(_build_cron_wrapper(job), encoding="utf-8")
    os.chmod(path, 0o700)


def list_cron_jobs():
    jobs = _load_cron_jobs()
    for job in jobs:
        log_file = CRON_LOG_DIR / f"{job['id']}.log"
        job["has_log"] = log_file.exists()
        job["last_run"] = ""
        if log_file.exists():
            try:
                text = log_file.read_text(encoding="utf-8", errors="replace")
                for line in reversed(text.splitlines()):
                    if "开始执行" in line:
                        job["last_run"] = line.split("开始执行")[0].replace("=", "").strip()
                        break
            except Exception:
                pass
    return {"jobs": jobs}


def create_cron_job(payload):
    name = str(payload.get("name", "")).strip()
    if not _cron_job_ok_name(name):
        raise ValueError("任务名只能包含字母、数字、下划线和连字符")
    schedule = str(payload.get("schedule", "")).strip()
    if len(schedule.split()) != 5:
        raise ValueError("计划格式应为 5 段，例如 */5 * * * *")
    job_type = str(payload.get("type", "shell")).strip()
    if job_type not in ("shell", "backup", "url"):
        raise ValueError("不支持的任务类型")
    jobs = _load_cron_jobs()
    if any(j["name"] == name for j in jobs):
        raise ValueError(f"任务名已存在：{name}")
    job = {
        "id": uuid.uuid4().hex[:12],
        "name": name,
        "type": job_type,
        "schedule": schedule,
        "enabled": bool(payload.get("enabled", True)),
        "created": now_str(),
    }
    if job_type == "shell":
        script = str(payload.get("script", "")).strip()
        if not script:
            raise ValueError("脚本内容不能为空")
        job["script"] = script
    elif job_type == "backup":
        paths = [str(p).strip() for p in (payload.get("paths") or []) if str(p).strip()]
        if not paths:
            raise ValueError("请填写要备份的路径")
        job["paths"] = paths
        job["cloud_upload"] = bool(payload.get("cloud_upload"))
    else:
        url = str(payload.get("url", "")).strip()
        if not url.startswith(("http://", "https://")):
            raise ValueError("URL 必须以 http(s):// 开头")
        job["url"] = url
    _write_cron_wrapper(job)
    jobs.append(job)
    _save_cron_jobs(jobs)
    _sync_cron_crond()
    return {"ok": True, "message": f"任务 {name} 创建成功"}


def update_cron_job(payload):
    job_id = str(payload.get("id", ""))
    jobs = _load_cron_jobs()
    job = next((j for j in jobs if j["id"] == job_id), None)
    if not job:
        raise ValueError("任务不存在")
    schedule = str(payload.get("schedule", job["schedule"])).strip()
    if len(schedule.split()) != 5:
        raise ValueError("计划格式应为 5 段")
    job["schedule"] = schedule
    if job["type"] == "shell" and payload.get("script") is not None:
        job["script"] = str(payload["script"])
    if job["type"] == "backup" and payload.get("paths") is not None:
        job["paths"] = [str(p).strip() for p in payload["paths"] if str(p).strip()]
    if job["type"] == "url" and payload.get("url") is not None:
        job["url"] = str(payload["url"]).strip()
    job["enabled"] = bool(payload.get("enabled", job.get("enabled", True)))
    _write_cron_wrapper(job)
    _save_cron_jobs(jobs)
    _sync_cron_crond()
    return {"ok": True, "message": "任务已更新"}


def delete_cron_job(job_id):
    jobs = _load_cron_jobs()
    before = len(jobs)
    jobs = [j for j in jobs if j["id"] != job_id]
    if len(jobs) == before:
        raise ValueError("任务不存在")
    _save_cron_jobs(jobs)
    _sync_cron_crond()
    for path in (CRON_SCRIPT_DIR / f"{job_id}.sh", CRON_LOG_DIR / f"{job_id}.log"):
        try:
            path.unlink()
        except Exception:
            pass
    return {"ok": True, "message": "任务已删除"}


def toggle_cron_job(job_id, enable):
    jobs = _load_cron_jobs()
    job = next((j for j in jobs if j["id"] == job_id), None)
    if not job:
        raise ValueError("任务不存在")
    job["enabled"] = bool(enable)
    _save_cron_jobs(jobs)
    _sync_cron_crond()
    return {"ok": True, "message": "任务已" + ("启用" if enable else "停用")}


def run_cron_job_now(job_id):
    jobs = _load_cron_jobs()
    job = next((j for j in jobs if j["id"] == job_id), None)
    if not job:
        raise ValueError("任务不存在")
    script = CRON_SCRIPT_DIR / f"{job_id}.sh"
    if not script.exists():
        _write_cron_wrapper(job)
    rc, out, err = run_cmd(["bash", str(script)], timeout=600)
    if rc != 0:
        raise ValueError("任务执行失败：" + (err or out).strip()[-500:])
    return {"ok": True, "message": "任务已执行，日志已记录"}


def read_cron_job_log(job_id, lines=200):
    if not re.fullmatch(r"[a-f0-9]{12}", str(job_id)):
        raise ValueError("任务编号无效")
    log_file = CRON_LOG_DIR / f"{job_id}.log"
    if not log_file.exists():
        return {"lines": [], "message": "暂无执行日志"}
    text = log_file.read_text(encoding="utf-8", errors="replace")
    return {"lines": text.splitlines()[-int(lines or 200):]}


def parse_ssh_logs(text, limit):
    events = []
    for line in text.splitlines():
        parts = line.split(None, 1)
        event = {
            "time": parts[0] if parts else "",
            "event": "other",
            "user": "",
            "ip": "",
            "detail": line,
        }
        for pattern, kind in SSH_PATTERNS:
            match = pattern.search(line)
            if not match:
                continue
            event["event"] = kind
            if kind == "success":
                method, user, ip, port = match.groups()
                event["user"] = user
                event["ip"] = ip
                event["detail"] = f"{method} · 端口 {port}"
            elif kind == "failed":
                groups = match.groups()
                if len(groups) == 3:
                    user, ip, port = groups
                    event["user"] = user
                    event["ip"] = ip
                    note = " · 无效用户" if "invalid user" in line.lower() else ""
                    event["detail"] = f"端口 {port}{note}"
                else:
                    user, ip = groups
                    event["user"] = user
                    event["ip"] = ip
                    event["detail"] = "无效用户"
            elif kind == "session":
                event["user"] = match.group(1)
            break
        events.append(event)
        if len(events) >= limit:
            break
    return events


def get_ssh_logs(lines=200):
    limit = max(1, min(int(lines), 1000))
    candidates = [
        [
            "journalctl",
            "-u",
            "ssh",
            "-n",
            str(limit * 3),
            "--no-pager",
            "-o",
            "short-iso",
        ],
        [
            "journalctl",
            "-u",
            "sshd",
            "-n",
            str(limit * 3),
            "--no-pager",
            "-o",
            "short-iso",
        ],
    ]
    for command in candidates:
        rc, out, err = run_cmd(command, timeout=20)
        if rc == 0 and out.strip():
            return {
                "source": "journalctl",
                "events": parse_ssh_logs(out, limit),
            }
    rc, out, err = run_cmd(
        ["tail", "-n", str(limit * 3), "/var/log/auth.log"], timeout=15
    )
    if rc == 0 and out.strip():
        return {"source": "auth.log", "events": parse_ssh_logs(out, limit)}
    return {"source": "none", "events": []}


# ---------------------------------------------------------------------------
# SSH 管理（sshd_config 读写、端口/登录方式控制）
# ---------------------------------------------------------------------------

SSHD_CONFIG_PATH = "/etc/ssh/sshd_config"


def _require_sudo():
    if not CONFIG.sudo_password:
        raise PermissionError("需要 PANEL_SUDO_PASSWORD 才能修改系统配置")


def _read_sshd_config():
    rc, out, err = run_cmd(["cat", SSHD_CONFIG_PATH], timeout=10, privileged=True)
    if rc != 0:
        raise ValueError("读取 sshd_config 失败：" + (err or "").strip()[:300])
    return out


def get_ssh_config():
    rc, out, err = run_cmd(["cat", SSHD_CONFIG_PATH], timeout=10, privileged=True)
    if rc != 0:
        return {"ok": False, "error": (err or "读取 sshd_config 失败").strip()[:300]}
    text = out

    def get_value(key, default=""):
        for line in text.splitlines():
            stripped = line.strip()
            if stripped.startswith("#"):
                continue
            if stripped.lower().startswith(key.lower() + " "):
                return stripped.split(None, 1)[1].strip()
        return default

    port = get_value("Port", "22")
    permit_root = get_value("PermitRootLogin", "prohibit-password")
    password_auth = get_value("PasswordAuthentication", "yes")
    pubkey = get_value("PubkeyAuthentication", "yes")
    return {
        "ok": True,
        "port": port,
        "permit_root": permit_root,
        "password_auth": password_auth,
        "pubkey": pubkey,
    }


def _set_sshd_option(key, value):
    _require_sudo()
    text = _read_sshd_config()
    lines = text.splitlines()
    new_lines = []
    matched = False
    for line in lines:
        stripped = line.strip()
        lower_key = key.lower()
        if stripped.lower().startswith(lower_key + " ") or stripped.lower() == lower_key:
            new_lines.append(f"{key} {value}")
            matched = True
        elif stripped.startswith("#") and stripped[1:].strip().lower().startswith(lower_key + " "):
            # 注释掉的配置行，替换为生效行
            new_lines.append(f"{key} {value}")
            matched = True
        else:
            new_lines.append(line)
    if not matched:
        new_lines.append(f"{key} {value}")
    content = "\n".join(new_lines) + "\n"
    write_site_conf_file(SSHD_CONFIG_PATH, content)


def _restart_sshd():
    for unit in ("sshd", "ssh"):
        rc, _, err = run_cmd(
            ["systemctl", "restart", unit], timeout=30, privileged=True
        )
        if rc == 0:
            return True
    return False


def set_ssh_config(payload):
    _require_sudo()
    changed = []
    port = payload.get("port")
    if port is not None:
        try:
            port = int(port)
        except (TypeError, ValueError):
            raise ValueError("端口必须为数字")
        if not (1 <= port <= 65535):
            raise ValueError("端口超出范围（1-65535）")
        _set_sshd_option("Port", str(port))
        changed.append(f"端口 → {port}")
    if payload.get("permit_root") is not None:
        value = str(payload["permit_root"])
        if value not in ("yes", "no", "prohibit-password"):
            raise ValueError("root 登录选项无效")
        _set_sshd_option("PermitRootLogin", value)
        changed.append("root 登录 → " + value)
    if payload.get("password_auth") is not None:
        value = "yes" if str(payload["password_auth"]).lower() in ("yes", "true", "1") else "no"
        _set_sshd_option("PasswordAuthentication", value)
        changed.append("密码登录 → " + value)
    if not changed:
        raise ValueError("没有需要修改的配置项")
    # 校验 sshd 配置语法
    rc, out, err = run_cmd(["sshd", "-t"], timeout=15, privileged=True)
    if rc != 0:
        raise ValueError("sshd 配置校验失败：" + (err or out).strip()[-400:])
    _restart_sshd()
    return {"ok": True, "message": "SSH 配置已更新并重启服务：" + "，".join(changed)}


# ---------------------------------------------------------------------------
# 缓存清理（apt / journal / 临时文件）
# ---------------------------------------------------------------------------

def _size_of(paths):
    total = 0
    for p in paths:
        rc, out, _ = run_cmd(["du", "-sb", p], timeout=15)
        if rc == 0 and out.strip():
            try:
                total += int(out.split()[0])
            except (ValueError, IndexError):
                pass
    return total


def get_clean_status():
    items = []
    # apt 缓存
    apt_cache = "/var/cache/apt/archives"
    items.append({
        "key": "apt",
        "name": "APT 包缓存",
        "size": _size_of([apt_cache]),
        "desc": "/var/cache/apt/archives 下载的 .deb 包",
    })
    # journal 日志
    rc, out, _ = run_cmd(["journalctl", "--disk-usage"], timeout=15)
    journal_size = 0
    match = re.search(r"([\d.]+[KMG]?)i?B", out or "")
    if match:
        num = float(re.sub(r"[^0-9.]", "", match.group(1)) or 0)
        unit = match.group(1)[-1].upper()
        journal_size = int(num * {"K": 1024, "M": 1024**2, "G": 1024**3}.get(unit, 1))
    items.append({
        "key": "journal",
        "name": "系统日志（journal）",
        "size": journal_size,
        "desc": "journalctl 持久化日志",
    })
    # 临时文件
    items.append({
        "key": "tmp",
        "name": "临时文件",
        "size": _size_of(["/tmp", "/var/tmp"]),
        "desc": "/tmp 与 /var/tmp",
    })
    total = sum(item["size"] for item in items)
    return {"items": items, "total": total}


def run_clean(keys):
    _require_sudo()
    keys = keys if isinstance(keys, list) else [keys]
    done = []
    freed = 0
    for key in keys:
        if key == "apt":
            before = _size_of(["/var/cache/apt/archives"])
            rc, out, err = run_cmd(
                ["apt-get", "clean"], timeout=120, privileged=True
            )
            if rc != 0:
                raise ValueError("清理 APT 缓存失败：" + (err or "").strip()[-300])
            after = _size_of(["/var/cache/apt/archives"])
            freed += max(0, before - after)
            done.append("APT 缓存")
        elif key == "journal":
            rc, out, err = run_cmd(
                ["journalctl", "--vacuum-time=7d"], timeout=120, privileged=True
            )
            if rc != 0:
                raise ValueError("清理日志失败：" + (err or "").strip()[-300])
            done.append("系统日志（保留 7 天）")
        elif key == "tmp":
            rc, out, err = run_cmd(
                ["bash", "-c", "find /tmp /var/tmp -mindepth 1 -maxdepth 1 ! -name '.*' -exec rm -rf {} + 2>/dev/null || true"],
                timeout=120,
                privileged=True,
            )
            done.append("临时文件")
    return {
        "ok": True,
        "message": "清理完成：" + "、".join(done),
        "freed": freed,
    }


# ---------------------------------------------------------------------------
# 病毒扫描（ClamAV）
# ---------------------------------------------------------------------------

CLAMAV_SCAN_LOG = Path.home() / ".panel-clam-scan.log"


def clamav_status():
    rc, out, _ = run_cmd(["clamscan", "--version"], timeout=10)
    installed = rc == 0 and out.strip() != ""
    return {
        "installed": installed,
        "version": out.strip().split()[0] if out.strip() else "",
        "scanning": _CLAM_SCANNING["running"],
        "last_result": _CLAM_LAST["result"],
    }


def install_clamav():
    if not CONFIG.sudo_password:
        raise PermissionError("需要 PANEL_SUDO_PASSWORD 才能安装 ClamAV")
    rc, _, _ = run_cmd(["which", "clamscan"], timeout=10)
    if rc == 0:
        return {"ok": True, "message": "ClamAV 已安装"}
    rc, out, err = run_cmd(
        ["apt-get", "install", "-y", "-qq", "clamav", "clamav-daemon"],
        timeout=600,
        privileged=True,
    )
    if rc != 0:
        raise ValueError("安装 ClamAV 失败：" + (err or out).strip()[-500:])
    return {"ok": True, "message": "ClamAV 安装完成，首次扫描前会自动更新病毒库"}


_CLAM_SCANNING = {"running": False, "thread": None}
_CLAM_LAST = {"result": ""}


def _clam_scan_worker(path):
    try:
        _CLAM_LAST["result"] = "扫描中…"
        # 先更新病毒库
        run_cmd(["freshclam"], timeout=300, privileged=True)
        rc, out, err = run_cmd(
            [
                "clamscan",
                "-r",
                "--infected",
                "--exclude-dir=^/sys",
                "--exclude-dir=^/proc",
                "--exclude-dir=^/dev",
                path,
            ],
            timeout=3600,
            privileged=True,
        )
        with CLAMAV_SCAN_LOG.open("a", encoding="utf-8") as fh:
            fh.write(f"===== {now_str()} 扫描 {path} =====\n")
            fh.write(out or "")
            fh.write(err or "")
            fh.write("\n")
        # 提取摘要
        summary_lines = [
            line for line in (out or "").splitlines()
            if ":" in line and any(k in line for k in ("Files", "Infected", "Scanned"))
        ]
        infected = [line for line in (out or "").splitlines() if "FOUND" in line]
        result = {
            "ok": True,
            "path": path,
            "infected_count": len(infected),
            "infected": infected[:50],
            "summary": summary_lines[-10:],
        }
        _CLAM_LAST["result"] = result
    except Exception as exc:
        _CLAM_LAST["result"] = {"ok": False, "error": str(exc)}
    finally:
        _CLAM_SCANNING["running"] = False


def start_clam_scan(path):
    if _CLAM_SCANNING["running"]:
        raise ValueError("扫描正在进行中，请稍候")
    path = str(path or "").strip()
    if not path.startswith("/"):
        raise ValueError("扫描路径必须是绝对路径")
    rc, _, _ = run_cmd(["which", "clamscan"], timeout=10)
    if rc != 0:
        raise ValueError("ClamAV 未安装，请先安装")
    _CLAM_SCANNING["running"] = True
    thread = threading.Thread(target=_clam_scan_worker, args=(path,), daemon=True)
    _CLAM_SCANNING["thread"] = thread
    thread.start()
    return {"ok": True, "message": f"后台扫描已启动：{path}"}


# ---------------------------------------------------------------------------
# 磁盘管理（分区、挂载、文件系统）
# ---------------------------------------------------------------------------

def get_disk_info():
    # 块设备树
    rc, out, err = run_cmd(
        ["lsblk", "-J", "-o", "NAME,SIZE,TYPE,FSTYPE,MOUNTPOINT,MODEL"],
        timeout=15,
    )
    blockdevices = []
    if rc == 0:
        try:
            data = json.loads(out)
            blockdevices = data.get("blockdevices", [])
        except (json.JSONDecodeError, ValueError):
            pass
    # 磁盘使用情况（复用 get_disks）
    usage = get_disks()
    return {"blockdevices": blockdevices, "usage": usage}


def run_install_command(command, timeout=300):
    if not CONFIG.sudo_password:
        raise PermissionError("未配置 sudo 密码，无法自动安装")
    cmd = str(command or "").strip()
    if cmd.startswith("sudo "):
        cmd = cmd[5:].lstrip()
    try:
        proc = subprocess.Popen(
            ["sudo", "-S", "bash", "-c", cmd],
            stdin=subprocess.PIPE,
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            text=True,
            start_new_session=is_linux(),
        )
    except Exception as exc:
        raise ValueError(str(exc))
    try:
        out, err = proc.communicate(
            input=CONFIG.sudo_password + "\n", timeout=timeout
        )
    except subprocess.TimeoutExpired:
        if is_linux():
            try:
                os.killpg(proc.pid, signal.SIGKILL)
            except Exception:
                pass
        out, err = proc.communicate()
        return {
            "ok": False,
            "returncode": 124,
            "stdout": out,
            "stderr": err + "\n安装超时，已终止",
        }
    return {
        "ok": proc.returncode == 0,
        "returncode": proc.returncode,
        "stdout": out,
        "stderr": err,
    }


def load_common_apps():
    path = ROOT / "apps.json"
    if path.exists():
        try:
            data = json.loads(path.read_text(encoding="utf-8"))
            if isinstance(data, list) and data:
                return sorted(
                    data,
                    key=lambda app: (
                        app.get("priority", 99),
                        app.get("category", ""),
                        app.get("name", ""),
                    ),
                )
        except (OSError, json.JSONDecodeError):
            pass
    return sorted(
        COMMON_APPS,
        key=lambda app: (
            app.get("priority", 99),
            app.get("category", ""),
            app.get("name", ""),
        ),
    )


def _apt_installed_packages():
    rc, out, err = run_cmd(
        ["dpkg-query", "-W", "-f=${Package}\t${Status}\t${Version}\n"],
        timeout=30,
    )
    result = {}
    if rc != 0:
        return result
    for line in out.splitlines():
        parts = line.split("\t")
        if len(parts) >= 3 and "install ok installed" in parts[1]:
            result[parts[0]] = parts[2]
    return result


def _apt_upgradable_packages():
    rc, out, err = run_cmd(
        ["apt", "list", "--upgradable"],
        timeout=30,
        privileged=True,
    )
    result = {}
    if rc != 0:
        return result
    for line in out.splitlines():
        line = line.strip()
        if not line or line.startswith("Listing"):
            continue
        name_part = line.split("/", 1)[0]
        fields = line.split()
        if len(fields) >= 2:
            result[name_part] = fields[1]
    return result


def _enrich_common_apps(apps, status_map):
    result = []
    for app in apps:
        status = status_map.get(app.get("id"), {})
        result.append(
            {
                **app,
                "installed": bool(status.get("installed")),
                "update_available": bool(status.get("update_available")),
                "current_version": status.get("current_version", ""),
                "available_version": status.get("available_version", ""),
            }
        )
    return result


def check_common_app_updates(force=False):
    now = time.time()
    with _APP_UPDATE_LOCK:
        cached = dict(_APP_UPDATE_CACHE)
    if not force and now - cached.get("time", 0) < 60:
        apps = _enrich_common_apps(
            load_common_apps(), cached.get("apps", {})
        )
        return {
            "ok": True,
            "apps": apps,
            "update_count": sum(
                1 for app in apps if app["update_available"]
            ),
            "checked_at": cached.get("time", 0),
            "error": cached.get("error", ""),
        }
    if force:
        run_cmd(["apt-get", "update", "-qq"], timeout=180, privileged=True)
    installed = _apt_installed_packages()
    upgradable = _apt_upgradable_packages()
    apps = load_common_apps()
    status_map = {}
    for app in apps:
        app_id = str(app.get("id", ""))
        names = [app_id] + APP_PACKAGE_ALIASES.get(app_id, [])
        current_pkg = next(
            (name for name in names if installed.get(name)), ""
        )
        available_pkg = next(
            (name for name in names if upgradable.get(name)), ""
        )
        current = installed.get(current_pkg, "") if current_pkg else ""
        available = (
            upgradable.get(available_pkg, "") if available_pkg else ""
        )
        installed_flag = bool(current)
        if (
            not installed_flag
            and app_id not in {"default-jdk", "default-jre"}
        ):
            installed_flag = bool(shutil.which(app_id))
        status_map[app_id] = {
            "installed": installed_flag,
            "update_available": bool(available),
            "current_version": current,
            "available_version": available,
            "update_package": available_pkg or current_pkg or app_id,
        }
    with _APP_UPDATE_LOCK:
        _APP_UPDATE_CACHE.update(
            {
                "time": now,
                "apps": status_map,
                "error": "",
            }
        )
    enriched = _enrich_common_apps(apps, status_map)
    return {
        "ok": True,
        "apps": enriched,
        "update_count": sum(
            1 for app in enriched if app["update_available"]
        ),
        "checked_at": now,
        "error": "",
    }


def get_common_apps():
    with _APP_UPDATE_LOCK:
        status_map = _APP_UPDATE_CACHE.get("apps", {})
    return _enrich_common_apps(load_common_apps(), status_map)


def install_common_app(app_id, update=False):
    app = next(
        (item for item in load_common_apps() if item.get("id") == app_id),
        None,
    )
    if not app:
        raise ValueError("应用不存在")
    if update:
        update_command = app.get("update", "").strip()
        if update_command:
            return run_install_command(update_command)
        if app.get("command", "").strip().startswith("sudo apt-get"):
            with _APP_UPDATE_LOCK:
                status_map = _APP_UPDATE_CACHE.get("apps", {})
            update_package = (
                status_map.get(app_id, {}).get("update_package") or app_id
            )
            return run_install_command(
                f"apt-get install --only-upgrade -y "
                f"{shlex.quote(update_package)}"
            )
        raise ValueError("该应用没有可用的更新命令")
    return run_install_command(app["command"])


def uninstall_common_app(app_id):
    """卸载 apt 安装的应用（remove --purge + autoremove）。"""
    app = next(
        (item for item in load_common_apps() if item.get("id") == app_id),
        None,
    )
    if not app:
        raise ValueError("应用不存在")
    if app.get("docker"):
        raise ValueError("Docker 应用请使用对应的卸载入口")
    command = str(app.get("command", "")).strip()
    match = re.search(r"apt(?:-get)?\s+install\s+(?:-\S+\s+)*([\w.+-]+)", command)
    if not match:
        raise ValueError("该应用不是 apt 安装，无法自动卸载")
    package = match.group(1)
    if not re.fullmatch(r"[A-Za-z0-9.+-]+", package):
        raise ValueError("包名无效")
    return run_install_command(
        f"apt-get remove --purge -y {shlex.quote(package)} && apt-get autoremove -y",
        timeout=300,
    )


# ---------------------------------------------------------------------------
# Docker 应用商店（Compose 模板安装，支持参数表单、启停、日志、卸载）
# ---------------------------------------------------------------------------

DOCKER_APPS = [
    {
        "id": "mysql",
        "name": "MySQL",
        "doc": "https://www.mysql.com/",
        "category": "数据库",
        "desc": "关系型数据库（容器化）",
        "image": "mysql:8.0",
        "port": 3306,
        "params": [
            {"key": "MYSQL_ROOT_PASSWORD", "label": "root 密码", "type": "password", "default": ""},
        ],
        "compose": (
            "services:\n"
            "  mysql:\n"
            "    image: mysql:8.0\n"
            "    container_name: panel-app-mysql\n"
            "    restart: unless-stopped\n"
            "    environment:\n"
            "      MYSQL_ROOT_PASSWORD: ${MYSQL_ROOT_PASSWORD}\n"
            "      TZ: Asia/Shanghai\n"
            "    ports:\n"
            "      - \"${PORT}:3306\"\n"
            "    volumes:\n"
            "      - mysql-data:/var/lib/mysql\n"
            "volumes:\n"
            "  mysql-data:\n"
        ),
    },
    {
        "id": "redis",
        "name": "Redis",
        "doc": "https://redis.io/",
        "category": "数据库",
        "desc": "高性能键值数据库（容器化）",
        "image": "redis:7-alpine",
        "port": 6379,
        "params": [
            {"key": "REDIS_PASSWORD", "label": "访问密码（留空则无密码）", "type": "password", "default": ""},
        ],
        "compose": (
            "services:\n"
            "  redis:\n"
            "    image: redis:7-alpine\n"
            "    container_name: panel-app-redis\n"
            "    restart: unless-stopped\n"
            "    command: [\"sh\", \"-c\", \"if [ -n \\\"$$REDIS_PASSWORD\\\" ]; then exec redis-server --requirepass \\\"$$REDIS_PASSWORD\\\"; else exec redis-server; fi\"]\n"
            "    environment:\n"
            "      REDIS_PASSWORD: ${REDIS_PASSWORD}\n"
            "    ports:\n"
            "      - \"${PORT}:6379\"\n"
            "    volumes:\n"
            "      - redis-data:/data\n"
            "volumes:\n"
            "  redis-data:\n"
        ),
    },
    {
        "id": "mariadb",
        "name": "MariaDB",
        "doc": "https://mariadb.org/",
        "category": "数据库",
        "desc": "MySQL 开源分支（容器化）",
        "image": "mariadb:11",
        "port": 3306,
        "params": [
            {"key": "MARIADB_ROOT_PASSWORD", "label": "root 密码", "type": "password", "default": ""},
        ],
        "compose": (
            "services:\n"
            "  mariadb:\n"
            "    image: mariadb:11\n"
            "    container_name: panel-app-mariadb\n"
            "    restart: unless-stopped\n"
            "    environment:\n"
            "      MARIADB_ROOT_PASSWORD: ${MARIADB_ROOT_PASSWORD}\n"
            "      TZ: Asia/Shanghai\n"
            "    ports:\n"
            "      - \"${PORT}:3306\"\n"
            "    volumes:\n"
            "      - mariadb-data:/var/lib/mysql\n"
            "volumes:\n"
            "  mariadb-data:\n"
        ),
    },
    {
        "id": "postgres",
        "name": "PostgreSQL",
        "doc": "https://www.postgresql.org/",
        "category": "数据库",
        "desc": "开源关系型数据库（容器化）",
        "image": "postgres:16-alpine",
        "port": 5432,
        "params": [
            {"key": "POSTGRES_PASSWORD", "label": "postgres 密码", "type": "password", "default": ""},
        ],
        "compose": (
            "services:\n"
            "  postgres:\n"
            "    image: postgres:16-alpine\n"
            "    container_name: panel-app-postgres\n"
            "    restart: unless-stopped\n"
            "    environment:\n"
            "      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD}\n"
            "      TZ: Asia/Shanghai\n"
            "    ports:\n"
            "      - \"${PORT}:5432\"\n"
            "    volumes:\n"
            "      - pg-data:/var/lib/postgresql/data\n"
            "volumes:\n"
            "  pg-data:\n"
        ),
    },
    {
        "id": "nextcloud",
        "name": "Nextcloud",
        "doc": "https://nextcloud.com/",
        "category": "云存储",
        "desc": "自建私有云盘（容器化）",
        "image": "nextcloud:stable-apache",
        "port": 8080,
        "params": [],
        "compose": (
            "services:\n"
            "  nextcloud:\n"
            "    image: nextcloud:stable-apache\n"
            "    container_name: panel-app-nextcloud\n"
            "    restart: unless-stopped\n"
            "    environment:\n"
            "      TZ: Asia/Shanghai\n"
            "    ports:\n"
            "      - \"${PORT}:80\"\n"
            "    volumes:\n"
            "      - nextcloud-data:/var/www/html\n"
            "volumes:\n"
            "  nextcloud-data:\n"
        ),
    },
    {
        "id": "uptime-kuma",
        "name": "Uptime Kuma",
        "doc": "https://github.com/louislam/uptime-kuma",
        "category": "监控",
        "desc": "自托管服务监控面板（容器化）",
        "image": "louislam/uptime-kuma:1",
        "port": 3001,
        "params": [],
        "compose": (
            "services:\n"
            "  uptime-kuma:\n"
            "    image: louislam/uptime-kuma:1\n"
            "    container_name: panel-app-uptime-kuma\n"
            "    restart: unless-stopped\n"
            "    ports:\n"
            "      - \"${PORT}:3001\"\n"
            "    volumes:\n"
            "      - kuma-data:/app/data\n"
            "volumes:\n"
            "  kuma-data:\n"
        ),
    },
    {
        "id": "portainer",
        "name": "Portainer",
        "doc": "https://www.portainer.io/",
        "category": "容器",
        "desc": "图形化容器管理工具（容器化）",
        "image": "portainer/portainer-ce:latest",
        "port": 9000,
        "params": [],
        "compose": (
            "services:\n"
            "  portainer:\n"
            "    image: portainer/portainer-ce:latest\n"
            "    container_name: panel-app-portainer\n"
            "    restart: unless-stopped\n"
            "    ports:\n"
            "      - \"${PORT}:9000\"\n"
            "    volumes:\n"
            "      - /var/run/docker.sock:/var/run/docker.sock\n"
            "      - portainer-data:/data\n"
            "volumes:\n"
            "  portainer-data:\n"
        ),
    },
    {
        "id": "wordpress",
        "name": "WordPress",
        "doc": "https://wordpress.org/",
        "category": "建站",
        "desc": "博客/CMS + MariaDB 组合（容器化）",
        "image": "wordpress:latest",
        "port": 8081,
        "params": [
            {"key": "DB_PASSWORD", "label": "数据库密码", "type": "password", "default": ""},
        ],
        "compose": (
            "services:\n"
            "  db:\n"
            "    image: mariadb:11\n"
            "    container_name: panel-app-wordpress-db\n"
            "    restart: unless-stopped\n"
            "    environment:\n"
            "      MYSQL_ROOT_PASSWORD: ${DB_PASSWORD}\n"
            "      MYSQL_DATABASE: wordpress\n"
            "      MYSQL_USER: wordpress\n"
            "      MYSQL_PASSWORD: ${DB_PASSWORD}\n"
            "    volumes:\n"
            "      - wp-db-data:/var/lib/mysql\n"
            "  wordpress:\n"
            "    image: wordpress:latest\n"
            "    container_name: panel-app-wordpress\n"
            "    restart: unless-stopped\n"
            "    depends_on:\n"
            "      - db\n"
            "    environment:\n"
            "      WORDPRESS_DB_HOST: db:3306\n"
            "      WORDPRESS_DB_NAME: wordpress\n"
            "      WORDPRESS_DB_USER: wordpress\n"
            "      WORDPRESS_DB_PASSWORD: ${DB_PASSWORD}\n"
            "    ports:\n"
            "      - \"${PORT}:80\"\n"
            "    volumes:\n"
            "      - wp-data:/var/www/html\n"
            "volumes:\n"
            "  wp-db-data:\n"
            "  wp-data:\n"
        ),
    },
    {
        "id": "grafana",
        "name": "Grafana",
        "doc": "https://grafana.com/docs/",
        "category": "监控",
        "desc": "开源可视化监控大屏（容器化）",
        "image": "grafana/grafana:latest",
        "port": 3000,
        "params": [],
        "compose": (
            "services:\n"
            "  grafana:\n"
            "    image: grafana/grafana:latest\n"
            "    container_name: panel-app-grafana\n"
            "    restart: unless-stopped\n"
            "    ports:\n"
            "      - \"${PORT}:3000\"\n"
            "    volumes:\n"
            "      - grafana-data:/var/lib/grafana\n"
            "volumes:\n"
            "  grafana-data:\n"
        ),
    },
    {
        "id": "minio",
        "name": "MinIO",
        "doc": "https://min.io/docs/",
        "category": "云存储",
        "desc": "S3 兼容对象存储（容器化）",
        "image": "minio/minio:latest",
        "port": 9000,
        "params": [
            {"key": "MINIO_ROOT_USER", "label": "管理账号", "type": "text", "default": "minioadmin"},
            {"key": "MINIO_ROOT_PASSWORD", "label": "管理密码（至少8位）", "type": "password", "default": ""},
        ],
        "compose": (
            "services:\n"
            "  minio:\n"
            "    image: minio/minio:latest\n"
            "    container_name: panel-app-minio\n"
            "    restart: unless-stopped\n"
            "    command: server /data --console-address \":9001\"\n"
            "    environment:\n"
            "      MINIO_ROOT_USER: ${MINIO_ROOT_USER}\n"
            "      MINIO_ROOT_PASSWORD: ${MINIO_ROOT_PASSWORD}\n"
            "    ports:\n"
            "      - \"${PORT}:9000\"\n"
            "      - \"${PORT_CONSOLE}:9001\"\n"
            "    volumes:\n"
            "      - minio-data:/data\n"
            "volumes:\n"
            "  minio-data:\n"
        ),
    },
    {
        "id": "gitea",
        "name": "Gitea",
        "doc": "https://docs.gitea.com/",
        "category": "DevOps",
        "desc": "轻量代码托管平台（容器化）",
        "image": "gitea/gitea:latest",
        "port": 3000,
        "params": [],
        "compose": (
            "services:\n"
            "  gitea:\n"
            "    image: gitea/gitea:latest\n"
            "    container_name: panel-app-gitea\n"
            "    restart: unless-stopped\n"
            "    ports:\n"
            "      - \"${PORT}:3000\"\n"
            "      - \"2222:22\"\n"
            "    volumes:\n"
            "      - gitea-data:/data\n"
            "volumes:\n"
            "  gitea-data:\n"
        ),
    },
    {
        "id": "alist",
        "name": "Alist",
        "doc": "https://alist.nn.ci/zh/",
        "category": "云存储",
        "desc": "多存储网盘列表程序（容器化）",
        "image": "xhofe/alist:latest",
        "port": 5244,
        "params": [],
        "compose": (
            "services:\n"
            "  alist:\n"
            "    image: xhofe/alist:latest\n"
            "    container_name: panel-app-alist\n"
            "    restart: unless-stopped\n"
            "    ports:\n"
            "      - \"${PORT}:5244\"\n"
            "    volumes:\n"
            "      - alist-data:/opt/alist/data\n"
            "volumes:\n"
            "  alist-data:\n"
        ),
    },
    {
        "id": "halo",
        "name": "Halo",
        "doc": "https://docs.halo.run/",
        "category": "建站",
        "desc": "强大易用的开源建站工具（容器化）",
        "image": "halohub/halo:2",
        "port": 8090,
        "params": [],
        "compose": (
            "services:\n"
            "  halo:\n"
            "    image: halohub/halo:2\n"
            "    container_name: panel-app-halo\n"
            "    restart: unless-stopped\n"
            "    ports:\n"
            "      - \"${PORT}:8090\"\n"
            "    volumes:\n"
            "      - halo-data:/root/.halo2\n"
            "volumes:\n"
            "  halo-data:\n"
        ),
    },
    {
        "id": "memos",
        "name": "Memos",
        "doc": "https://www.usememos.com/docs",
        "category": "办公",
        "desc": "轻量自托管备忘录（容器化）",
        "image": "ghcr.io/usememos/memos:latest",
        "port": 5230,
        "params": [],
        "compose": (
            "services:\n"
            "  memos:\n"
            "    image: ghcr.io/usememos/memos:latest\n"
            "    container_name: panel-app-memos\n"
            "    restart: unless-stopped\n"
            "    ports:\n"
            "      - \"${PORT}:5230\"\n"
            "    volumes:\n"
            "      - memos-data:/var/opt/memos\n"
            "volumes:\n"
            "  memos-data:\n"
        ),
    },
    {
        "id": "jellyfin",
        "name": "Jellyfin",
        "doc": "https://jellyfin.org/docs/",
        "category": "多媒体",
        "desc": "开源媒体中心（容器化）",
        "image": "lscr.io/linuxserver/jellyfin:latest",
        "port": 8096,
        "params": [],
        "compose": (
            "services:\n"
            "  jellyfin:\n"
            "    image: lscr.io/linuxserver/jellyfin:latest\n"
            "    container_name: panel-app-jellyfin\n"
            "    restart: unless-stopped\n"
            "    environment:\n"
            "      TZ: Asia/Shanghai\n"
            "      PUID: 1000\n"
            "      PGID: 1000\n"
            "    ports:\n"
            "      - \"${PORT}:8096\"\n"
            "    volumes:\n"
            "      - jellyfin-config:/config\n"
            "      - jellyfin-cache:/cache\n"
            "volumes:\n"
            "  jellyfin-config:\n"
            "  jellyfin-cache:\n"
        ),
    },
    {
        "id": "nginx-proxy-manager",
        "name": "Nginx Proxy Manager",
        "doc": "https://nginxproxymanager.com/guide/",
        "category": "Web 服务器",
        "desc": "图形化反向代理/证书管理（容器化）",
        "image": "jc21/nginx-proxy-manager:latest",
        "port": 8181,
        "params": [],
        "compose": (
            "services:\n"
            "  npm:\n"
            "    image: jc21/nginx-proxy-manager:latest\n"
            "    container_name: panel-app-npm\n"
            "    restart: unless-stopped\n"
            "    ports:\n"
            "      - \"${PORT}:81\"\n"
            "      - \"8080:80\"\n"
            "      - \"8443:443\"\n"
            "    volumes:\n"
            "      - npm-data:/data\n"
            "      - npm-ssl:/etc/letsencrypt\n"
            "volumes:\n"
            "  npm-data:\n"
            "  npm-ssl:\n"
        ),
    },
    {
        "id": "openclaw",
        "name": "OpenClaw",
        "doc": "https://openclaw.cn/",
        "category": "AI",
        "desc": "开源自托管个人 AI 助理（容器化）",
        "image": "openclaw/openclaw:latest",
        "port": 18789,
        "params": [
            {"key": "PORT_BRIDGE", "label": "Bridge 端口", "type": "text", "default": "18790"},
            {"key": "OPENAI_API_KEY", "label": "API Key", "type": "password", "default": ""},
            {"key": "OPENAI_BASE_URL", "label": "API 地址", "type": "text", "default": "https://opencode.ai/zen/go/v1"},
        ],
        "compose": (
            "services:\n"
            "  openclaw:\n"
            "    image: openclaw/openclaw:latest\n"
            "    container_name: panel-app-openclaw\n"
            "    restart: unless-stopped\n"
            "    user: \"0:0\"\n"
            "    command: [\"node\", \"openclaw.mjs\", \"gateway\", \"--allow-unconfigured\", \"--bind\", \"lan\", \"--auth\", \"token\"]\n"
            "    environment:\n"
            "      HOME: /home/lty\n"
            "      OPENCLAW_GATEWAY_TOKEN: ${OPENCLAW_TOKEN}\n"
            "      OPENAI_API_KEY: ${OPENAI_API_KEY}\n"
            "      OPENAI_BASE_URL: ${OPENAI_BASE_URL}\n"
            "    ports:\n"
            "      - \"${PORT}:18789\"\n"
            "      - \"${PORT_BRIDGE}:18790\"\n"
            "    volumes:\n"
            "      - openclaw-data:/home/lty/.openclaw\n"
            "volumes:\n"
            "  openclaw-data:\n"
        ),
    },
]


def _docker_app_project_name(app_id):
    return "app-" + app_id


def _docker_app_status(app_id):
    """返回 Docker 应用的安装/运行状态（读取 compose 项目）。"""
    project = _docker_app_project_name(app_id)
    folder, file_path = _compose_file(project)
    if not file_path.is_file():
        return {"installed": False, "running": False}
    rc, out, err = _compose_cmd(["-f", str(file_path), "ps", "--format", "{{.State}}"], timeout=30)
    running = rc == 0 and any(
        line.strip().lower() == "running" for line in out.splitlines()
    )
    return {"installed": True, "running": running}


def list_docker_apps():
    apps = []
    for app in DOCKER_APPS:
        status = _docker_app_status(app["id"])
        apps.append({
            "id": app["id"],
            "name": app["name"],
            "category": app["category"],
            "desc": app["desc"],
            "doc": app.get("doc", ""),
            "image": app["image"],
            "port": app["port"],
            "params": [
                {"key": p["key"], "label": p["label"], "type": p["type"]}
                for p in app.get("params", [])
            ],
            "installed": status["installed"],
            "running": status["running"],
        })
    return {"apps": apps}


def docker_app_backup(app_id):
    """将应用的命名卷打包成 tar.gz 存入备份目录。"""
    import tempfile
    app = next((a for a in DOCKER_APPS if a["id"] == app_id), None)
    if not app:
        raise ValueError("应用不存在")
    if not _docker_app_status(app_id)["installed"]:
        raise ValueError("该应用未安装")
    # 直接查询真实存在的卷（compose 卷名规则：<项目名>_<卷名>）
    prefix = _docker_app_project_name(app_id) + "_"
    rc, out, err = _run_with_sudo_fallback(
        "docker", ["volume", "ls", "--format", "{{.Name}}"], timeout=30
    )
    if rc != 0:
        raise ValueError("查询数据卷失败：" + (err or out)[-300:])
    volume_names = [
        name.strip() for name in out.splitlines()
        if name.strip().startswith(prefix)
    ]
    if not volume_names:
        raise ValueError("该应用没有命名数据卷，无需备份")
    stamp = time.strftime("%Y%m%d-%H%M%S")
    backup_name = f"docker-{app_id}-{stamp}.tar.gz"
    PANEL_BACKUP_DIR.mkdir(parents=True, exist_ok=True)
    target = PANEL_BACKUP_DIR / backup_name
    # 先停止容器，保证数据一致性，备份完成后再启动
    compose_action(_docker_app_project_name(app_id), "down")
    try:
        with tarfile.open(str(target), "w:gz") as tar:
            for volume_name in volume_names:
                # 二进制流式导出：docker run 挂载卷并把 tar 写入临时文件
                tmp_fd, tmp_tar = tempfile.mkstemp(prefix="panel-vol-", suffix=".tar")
                os.close(tmp_fd)
                rc, err = _docker_output_binary(
                    ["run", "--rm", "-v", f"{volume_name}:/data:ro",
                     "alpine", "tar", "-cf", "-", "-C", "/data", "."],
                    tmp_tar,
                    timeout=600,
                )
                if rc != 0 or os.path.getsize(tmp_tar) == 0:
                    os.unlink(tmp_tar)
                    raise ValueError(f"备份卷 {volume_name} 失败：" + (err or "")[-300:])
                tar.add(tmp_tar, arcname=volume_name.split("_", 1)[-1] + ".tar")
                os.unlink(tmp_tar)
    except Exception:
        compose_action(_docker_app_project_name(app_id), "up")
        raise
    compose_action(_docker_app_project_name(app_id), "up")
    st = target.stat()
    return {
        "ok": True,
        "message": f"数据卷已备份：{backup_name}（{human_size(st.st_size)}）",
        "name": backup_name,
    }


def _render_app_compose(app, port, params):
    content = app["compose"]
    if not re.fullmatch(r"\d{2,5}", str(port)):
        raise ValueError("端口格式无效")
    port = int(port)
    if not (1 <= port <= 65535):
        raise ValueError("端口超出范围（1-65535）")
    content = content.replace("${PORT}", str(port))
    content = content.replace("${PORT_CONSOLE}", str(port + 1))
    # OpenClaw 等需要自动生成 token 的应用
    if "${OPENCLAW_TOKEN}" in content:
        content = content.replace(
            "${OPENCLAW_TOKEN}", secrets.token_urlsafe(16)
        )
    for p in app.get("params", []):
        value = str(params.get(p["key"], "") or "")
        if p.get("type") == "password" and not value:
            raise ValueError(f"请填写 {p['label']}")
        if "$" in value or "\\" in value or value.startswith("-"):
            raise ValueError(f"{p['label']}包含非法字符")
        content = content.replace("${" + p["key"] + "}", value)
    return content


def install_docker_app(app_id, port, params):
    app = next((a for a in DOCKER_APPS if a["id"] == app_id), None)
    if not app:
        raise ValueError("应用不存在")
    if shutil.which("docker") is None:
        raise ValueError("未安装 Docker，请先安装 Docker")
    project = _docker_app_project_name(app_id)
    content = _render_app_compose(app, port or app["port"], params or {})
    save_result = save_compose_project(project, content)
    if not save_result.get("ok"):
        raise ValueError("生成 Compose 失败：" + str(save_result.get("error", "")))
    up_result = compose_action(project, "up")
    if not up_result.get("ok"):
        raise ValueError("启动失败：" + str(up_result.get("error", ""))[-500:])
    return {"ok": True, "message": f"{app['name']} 已安装并启动（端口 {port or app['port']}）"}


def uninstall_docker_app(app_id, purge=False):
    app = next((a for a in DOCKER_APPS if a["id"] == app_id), None)
    if not app:
        raise ValueError("应用不存在")
    project = _docker_app_project_name(app_id)
    folder, file_path = _compose_file(project)
    if not file_path.is_file():
        raise ValueError("该应用未安装")
    down_result = compose_action(project, "down")
    if not down_result.get("ok"):
        raise ValueError("停止失败：" + str(down_result.get("error", ""))[-500:])
    delete_result = delete_compose_project(project)
    if not delete_result.get("ok"):
        raise ValueError("删除失败：" + str(delete_result.get("error", ""))[-300:])
    message = f"{app['name']} 已卸载（compose 移入回收站）"
    if purge:
        # 删除命名卷（数据不保留）
        for volume in re.findall(r"^  ([\w-]+):\s*$", app["compose"], flags=re.M):
            run_cmd(["docker", "volume", "rm", "panel-app_" + volume], timeout=30)
        message = f"{app['name']} 已卸载并清除数据卷"
    return {"ok": True, "message": message}


def docker_app_action(app_id, action):
    app = next((a for a in DOCKER_APPS if a["id"] == app_id), None)
    if not app:
        raise ValueError("应用不存在")
    if action not in ("up", "stop", "down"):
        raise ValueError("不支持的操作")
    project = _docker_app_project_name(app_id)
    result = compose_action(project, action)
    if not result.get("ok"):
        raise ValueError(str(result.get("error", "操作失败"))[-500:])
    text = {"up": "已启动", "stop": "已停止", "down": "已移除容器（配置保留）"}[action]
    return {"ok": True, "message": f"{app['name']} {text}"}


def docker_app_logs(app_id, tail=200):
    app = next((a for a in DOCKER_APPS if a["id"] == app_id), None)
    if not app:
        raise ValueError("应用不存在")
    project = _docker_app_project_name(app_id)
    _, file_path = _compose_file(project)
    if not file_path.is_file():
        raise ValueError("该应用未安装")
    try:
        tail = max(10, min(int(tail or 200), 1000))
    except (TypeError, ValueError):
        tail = 200
    rc, out, err = _compose_cmd(
        ["-f", str(file_path), "logs", "--tail", str(tail), "--no-log-prefix"],
        timeout=30,
    )
    if rc != 0:
        raise ValueError((err or out).strip()[-500:] or "读取日志失败")
    return {"ok": True, "logs": (out or "").rstrip("\n").splitlines()}


def load_analytics_config():
    try:
        data = json.loads(
            ANALYTICS_CONFIG_PATH.read_text(encoding="utf-8")
        )
        paths = data.get("paths", []) if isinstance(data, dict) else []
        if isinstance(paths, list) and paths:
            return [str(item) for item in paths]
    except (OSError, json.JSONDecodeError):
        pass
    return list(ANALYTICS_DEFAULT_PATHS)


def save_analytics_config(paths, ports=None):
    ANALYTICS_CONFIG_PATH.parent.mkdir(parents=True, exist_ok=True)
    existing = {}
    try:
        existing = json.loads(
            ANALYTICS_CONFIG_PATH.read_text(encoding="utf-8")
        )
    except (OSError, json.JSONDecodeError):
        existing = {}
    if not isinstance(existing, dict):
        existing = {}
    existing["paths"] = paths
    if ports is not None:
        existing["ports"] = ports
    tmp = ANALYTICS_CONFIG_PATH.with_suffix(".tmp")
    tmp.write_text(
        json.dumps(existing, ensure_ascii=False, indent=2),
        encoding="utf-8",
    )
    tmp.replace(ANALYTICS_CONFIG_PATH)
    try:
        os.chmod(ANALYTICS_CONFIG_PATH, 0o600)
    except OSError:
        pass


def load_analytics_ports():
    try:
        data = json.loads(
            ANALYTICS_CONFIG_PATH.read_text(encoding="utf-8")
        )
        ports = data.get("ports", []) if isinstance(data, dict) else []
        return [
            int(item)
            for item in ports
            if str(item).strip().isdigit() and 1 <= int(item) <= 65535
        ]
    except (OSError, json.JSONDecodeError, ValueError):
        return []


def get_analytics_files():
    paths = load_analytics_config()
    files = []
    for pattern in paths:
        if any(char in pattern for char in "*?["):
            files.extend(glob.glob(pattern))
        elif os.path.exists(pattern):
            files.append(pattern)
    return sorted(set(files))


def get_analytics_status():
    files = get_analytics_files()
    return {
        "paths": load_analytics_config(),
        "ports": load_analytics_ports(),
        "files": [
            {
                "path": path,
                "size": os.path.getsize(path),
                "mtime": datetime.datetime.fromtimestamp(
                    os.path.getmtime(path)
                ).strftime("%Y-%m-%d %H:%M:%S"),
            }
            for path in files
        ],
    }


def set_analytics_paths(paths):
    clean = [str(item).strip() for item in (paths or []) if str(item).strip()]
    if not clean:
        raise ValueError("至少需要一个访问日志路径")
    save_analytics_config(clean)
    return get_analytics_status()


def set_analytics_ports(ports):
    clean = []
    for item in (ports or []):
        try:
            port = int(item)
        except (TypeError, ValueError):
            continue
        if 1 <= port <= 65535:
            clean.append(port)
    clean = sorted(set(clean))
    if not clean:
        raise ValueError("至少需要一个有效端口")
    save_analytics_config(load_analytics_config(), clean)
    PORT_MONITOR_PREV.clear()
    return get_analytics_status()


def parse_analytics_logs(max_lines=50000):
    records = []
    files = get_analytics_files()
    for path in files:
        rc, out, err = run_cmd(
            ["tail", "-n", str(max_lines), path], timeout=30
        )
        if rc != 0:
            continue
        for line in out.splitlines():
            match = ACCESS_LOG_RE.match(line)
            if not match:
                continue
            ip, timestamp, request, status, bytes_text, referer, ua = (
                match.groups()
            )
            method = ""
            path_request = ""
            parts = request.split(" ", 2)
            if len(parts) >= 2:
                method = parts[0]
                path_request = parts[1]
            dt = None
            try:
                parsed = datetime.datetime.strptime(
                    timestamp, "%d/%b/%Y:%H:%M:%S %z"
                )
                dt = parsed.replace(tzinfo=None)
            except ValueError:
                pass
            try:
                size = int(bytes_text) if bytes_text != "-" else 0
            except ValueError:
                size = 0
            records.append(
                {
                    "ip": ip,
                    "dt": dt,
                    "time": timestamp,
                    "method": method,
                    "path": path_request,
                    "status": int(status),
                    "bytes": size,
                    "referer": referer,
                    "ua": ua,
                }
            )
        if len(records) >= max_lines:
            break
    return records


def analytics_device(ua):
    value = (ua or "").lower()
    if any(
        key in value
        for key in (
            "bot",
            "spider",
            "crawler",
            "slurp",
            "googlebot",
            "bingbot",
            "baiduspider",
            "petalbot",
        )
    ):
        return "蜘蛛"
    if any(
        key in value
        for key in ("mobile", "android", "iphone", "ipad")
    ):
        return "移动端"
    if any(key in value for key in ("curl", "wget", "python-requests", "httpie")):
        return "命令行"
    return "桌面"


def analytics_referer_domain(referer):
    try:
        netloc = urlparse(referer or "").netloc
    except ValueError:
        netloc = ""
    if not netloc:
        return "直接访问"
    if netloc.startswith("www."):
        netloc = netloc[4:]
    return netloc


def analytics_ip_network(ip):
    if ":" in ip:
        parts = ip.split(":")
        return ":".join(parts[:3]) + "::/48" if len(parts) > 3 else ip
    parts = ip.split(".")
    if len(parts) == 4:
        return ".".join(parts[:2]) + ".0.0/16"
    return ip


def _top_items(counter, limit=10):
    return [
        {"name": name, "count": count}
        for name, count in counter.most_common(limit)
    ]


def collect_port_samples():
    ports = load_analytics_ports()
    if not ports:
        return []
    rc, out, err = run_cmd(["ss", "-tn"], timeout=10)
    if rc != 0:
        return []
    current = {port: set() for port in ports}
    for line in out.splitlines():
        parts = line.split()
        if len(parts) < 5:
            continue
        local = parts[3]
        remote = parts[4]
        if ":" not in local:
            continue
        try:
            local_port = int(local.rsplit(":", 1)[1])
        except ValueError:
            continue
        if local_port in current:
            current[local_port].add(remote)
    now = datetime.datetime.now().strftime("%H:%M:%S")
    samples = []
    for port in ports:
        current_set = current[port]
        previous = PORT_MONITOR_PREV.get(port, set())
        new_items = current_set - previous
        unique_ips = len({item.rsplit(":", 1)[0] for item in current_set})
        for item in new_items:
            PORT_MONITOR_EVENTS.append(
                {
                    "time": now,
                    "port": port,
                    "remote": item,
                    "action": "新连接",
                }
            )
        PORT_MONITOR_PREV[port] = current_set
        history = PORT_MONITOR_HISTORY.setdefault(
            port, deque(maxlen=300)
        )
        history.append(
            {
                "time": now,
                "active": len(current_set),
                "new": len(new_items),
                "ips": unique_ips,
            }
        )
        samples.append(
            {
                "port": port,
                "active": len(current_set),
                "new": len(new_items),
                "ips": unique_ips,
                "history": list(history),
            }
        )
    return samples


def analytics_summary():
    records = parse_analytics_logs()
    now = datetime.datetime.now()
    files = get_analytics_files()
    port_samples = collect_port_samples()
    port_events = list(PORT_MONITOR_EVENTS)[-50:]
    if not records:
        return {
            "configured": bool(load_analytics_config()),
            "files": files,
            "ports": port_samples,
            "port_events": port_events,
            "requests": 0,
            "unique_ips": 0,
            "traffic": 0,
            "errors": 0,
            "trend": [],
            "sources": {"referrers": [], "networks": []},
            "stats": {"status": [], "devices": [], "spiders": [], "pages": []},
            "realtime": {
                "last_60s": {"requests": 0, "traffic": 0},
                "last_5m": {"requests": 0, "traffic": 0},
            },
            "recent": [],
        }

    from collections import Counter

    status_counter = Counter()
    device_counter = Counter()
    spider_counter = Counter()
    page_counter = Counter()
    referer_counter = Counter()
    network_counter = Counter()
    ips = set()
    traffic = 0
    errors = 0
    trend = {}

    for record in records:
        status_counter[str(record["status"])] += 1
        device = analytics_device(record["ua"])
        device_counter[device] += 1
        page_counter[record["path"] or "/"] += 1
        referer_counter[
            analytics_referer_domain(record["referer"])
        ] += 1
        network_counter[analytics_ip_network(record["ip"])] += 1
        ips.add(record["ip"])
        traffic += record["bytes"]
        if record["status"] >= 400:
            errors += 1
        if record["ua"] and analytics_device(record["ua"]) == "蜘蛛":
            spider_counter[(record["ua"] or "unknown")[:80]] += 1
        if record["dt"] and record["dt"] >= now - datetime.timedelta(hours=24):
            key = record["dt"].strftime("%Y-%m-%d %H:00")
            if key not in trend:
                trend[key] = {
                    "label": record["dt"].strftime("%m-%d %H:00"),
                    "requests": 0,
                    "visitors": set(),
                }
            trend[key]["requests"] += 1
            trend[key]["visitors"].add(record["ip"])

    trend_list = [
        {
            "label": item["label"],
            "requests": item["requests"],
            "visitors": len(item["visitors"]),
        }
        for item in trend.values()
    ]
    recent = [
        {
            "time": record["time"],
            "ip": record["ip"],
            "method": record["method"],
            "path": record["path"],
            "status": record["status"],
            "bytes": record["bytes"],
            "ua": record["ua"],
        }
        for record in reversed(records[-50:])
    ]
    last_60s = [
        record
        for record in records
        if record["dt"]
        and (now - record["dt"]).total_seconds() <= 60
    ]
    last_5m = [
        record
        for record in records
        if record["dt"]
        and (now - record["dt"]).total_seconds() <= 300
    ]
    return {
        "configured": bool(load_analytics_config()),
        "files": files,
        "ports": port_samples,
        "port_events": port_events,
        "requests": len(records),
        "unique_ips": len(ips),
        "traffic": traffic,
        "errors": errors,
        "trend": trend_list,
        "sources": {
            "referrers": _top_items(referer_counter),
            "networks": _top_items(network_counter),
        },
        "stats": {
            "status": _top_items(status_counter, 12),
            "devices": _top_items(device_counter),
            "spiders": _top_items(spider_counter),
            "pages": _top_items(page_counter),
        },
        "realtime": {
            "last_60s": {
                "requests": len(last_60s),
                "traffic": sum(item["bytes"] for item in last_60s),
            },
            "last_5m": {
                "requests": len(last_5m),
                "traffic": sum(item["bytes"] for item in last_5m),
            },
        },
        "recent": recent,
    }


def load_tamper_config():
    try:
        data = json.loads(TAMPER_CONFIG_PATH.read_text(encoding="utf-8"))
        if isinstance(data, dict):
            return data
    except (OSError, json.JSONDecodeError):
        pass
    return {"paths": [], "baseline": {}, "last_scan": None, "last_anomalies": []}


def save_tamper_config(config):
    with _TAMPER_LOCK:
        TAMPER_CONFIG_PATH.parent.mkdir(parents=True, exist_ok=True)
        tmp = TAMPER_CONFIG_PATH.with_suffix(".tmp")
        tmp.write_text(
            json.dumps(config, ensure_ascii=False, indent=2), encoding="utf-8"
        )
        tmp.replace(TAMPER_CONFIG_PATH)
        try:
            os.chmod(TAMPER_CONFIG_PATH, 0o600)
        except OSError:
            pass


def tamper_hash_file(path):
    digest = hashlib.sha256()
    with open(path, "rb") as fh:
        while True:
            chunk = fh.read(1024 * 1024)
            if not chunk:
                break
            digest.update(chunk)
    return digest.hexdigest()


def tamper_collect_files(paths, hash_all=False):
    result = {}
    skip_dirs = {".git", "node_modules", ".cache", "__pycache__"}
    for base in paths:
        base = os.path.abspath(os.path.expanduser(base or ""))
        candidates = []
        if os.path.isfile(base):
            candidates = [base]
        elif os.path.isdir(base):
            for root, dirs, files in os.walk(base):
                dirs[:] = [d for d in dirs if d not in skip_dirs]
                for name in files:
                    candidates.append(os.path.join(root, name))
        else:
            continue
        for path in candidates:
            try:
                st = os.lstat(path)
            except OSError:
                continue
            if stat_mod.S_ISLNK(st.st_mode):
                continue
            info = {
                "size": st.st_size,
                "mtime_ns": st.st_mtime_ns,
                "hash": "",
            }
            if hash_all:
                try:
                    info["hash"] = tamper_hash_file(path)
                except OSError:
                    info["hash"] = ""
            result[path] = info
            if len(result) >= 20000:
                break
        if len(result) >= 20000:
            break
    return result


def append_tamper_event(event_type, path, detail):
    line = json.dumps(
        {
            "time": now_str(),
            "type": event_type,
            "path": path,
            "detail": detail,
        },
        ensure_ascii=False,
    )
    with _TAMPER_LOCK:
        TAMPER_EVENTS_PATH.parent.mkdir(parents=True, exist_ok=True)
        with open(TAMPER_EVENTS_PATH, "a", encoding="utf-8") as fh:
            fh.write(line + "\n")


def get_tamper_events(limit=200):
    limit = max(1, min(int(limit), 5000))
    if not TAMPER_EVENTS_PATH.exists():
        return []
    with _TAMPER_LOCK:
        lines = TAMPER_EVENTS_PATH.read_text(
            encoding="utf-8", errors="replace"
        ).splitlines()
    events = []
    for line in lines[-limit:]:
        try:
            events.append(json.loads(line))
        except json.JSONDecodeError:
            continue
    return events


def set_tamper_paths(paths):
    clean = [str(item).strip() for item in (paths or []) if str(item).strip()]
    if not clean:
        raise ValueError("至少需要一个监控路径")
    config = load_tamper_config()
    config["paths"] = clean
    config["baseline"] = {}
    config["last_scan"] = None
    config["last_anomalies"] = []
    save_tamper_config(config)
    return get_tamper_status()


def init_tamper_baseline():
    with _TAMPER_LOCK:
        config = load_tamper_config()
        if not config.get("paths"):
            raise ValueError("请先配置监控路径")
        baseline = tamper_collect_files(config["paths"], hash_all=True)
        config["baseline"] = baseline
        config["last_scan"] = now_str()
        config["last_anomalies"] = []
        save_tamper_config(config)
        append_tamper_event(
            "基线", "", f"初始化基线，共 {len(baseline)} 个文件"
        )
        return {"ok": True, "count": len(baseline)}


def run_tamper_scan():
    with _TAMPER_LOCK:
        config = load_tamper_config()
        if not config.get("paths"):
            raise ValueError("请先配置监控路径")
        baseline = config.get("baseline", {})
        if not baseline:
            raise ValueError("请先初始化基线")
        current = tamper_collect_files(config["paths"], hash_all=False)
        anomalies = []
        for path, info in current.items():
            base = baseline.get(path)
            if base is None:
                anomalies.append(
                    {
                        "path": path,
                        "type": "新增",
                        "detail": "文件不在基线中",
                    }
                )
            elif (
                base.get("size") != info["size"]
                or base.get("mtime_ns") != info["mtime_ns"]
            ):
                try:
                    actual_hash = tamper_hash_file(path)
                except OSError:
                    actual_hash = ""
                if actual_hash != base.get("hash"):
                    anomalies.append(
                        {
                            "path": path,
                            "type": "篡改",
                            "detail": f"哈希不一致，大小 {info['size']}",
                        }
                    )
        for path in baseline:
            if path not in current:
                anomalies.append(
                    {"path": path, "type": "删除", "detail": "基线文件不存在"}
                )
        config["last_scan"] = now_str()
        config["last_anomalies"] = anomalies
        save_tamper_config(config)
        for anomaly in anomalies:
            append_tamper_event(
                anomaly["type"], anomaly["path"], anomaly["detail"]
            )
        return {"ok": True, "count": len(current), "anomalies": anomalies}


def get_tamper_status():
    config = load_tamper_config()
    return {
        "paths": config.get("paths", []),
        "baseline_count": len(config.get("baseline", {})),
        "last_scan": config.get("last_scan"),
        "last_anomalies": config.get("last_anomalies", []),
        "events_count": len(get_tamper_events(10000)),
    }


def get_tamper_permissions(limit=100):
    config = load_tamper_config()
    if not config.get("paths"):
        return []
    current = tamper_collect_files(config["paths"], hash_all=False)
    risky = []
    for path in current:
        try:
            st = os.lstat(path)
        except OSError:
            continue
        if stat_mod.S_ISLNK(st.st_mode):
            continue
        if st.st_mode & 0o002:
            risky.append(
                {
                    "path": path,
                    "mode": stat_mod.filemode(st.st_mode),
                    "owner": _owner_name(st.st_uid),
                    "group": _group_name(st.st_gid),
                    "risk": "其他用户可写",
                }
            )
            if len(risky) >= limit:
                break
    return risky


def tamper_loop():
    while True:
        time.sleep(TAMPER_INTERVAL)
        try:
            config = load_tamper_config()
            if config.get("paths") and config.get("baseline"):
                run_tamper_scan()
        except Exception:
            pass


def _run_with_sudo_fallback(cmd, args, timeout):
    rc, out, err = run_cmd([cmd] + args, timeout=timeout)
    if rc == 0:
        return rc, out, err
    low = ((out or "") + (err or "")).lower()
    if CONFIG.sudo_password and any(
        key in low
        for key in (
            "permission denied",
            "cannot connect",
            "connection refused",
            "dial unix",
            "docker daemon socket",
        )
    ):
        return run_cmd([cmd] + args, timeout=timeout, privileged=True)
    return rc, out, err


def _docker_output_binary(args, output_path, timeout=600):
    """以二进制模式运行 docker 命令，stdout 写入文件（用于备份 tar 流）。"""
    # 清理同名残留（docker 挂载可能留下目录）
    if os.path.isdir(output_path):
        shutil.rmtree(output_path, ignore_errors=True)
    elif os.path.exists(output_path):
        os.unlink(output_path)
    cmd = ["docker"] + list(args)
    if not CONFIG.sudo_password:
        proc = subprocess.run(
            cmd, stdout=open(output_path, "wb"), stderr=subprocess.PIPE, timeout=timeout
        )
        return proc.returncode, proc.stderr.decode("utf-8", "replace")
    # 先试不带 sudo，权限不足再带 sudo
    proc = subprocess.run(
        cmd, stdout=open(output_path, "wb"), stderr=subprocess.PIPE, timeout=timeout
    )
    if proc.returncode == 0:
        return 0, proc.stderr.decode("utf-8", "replace")
    proc2 = subprocess.run(
        ["sudo", "-S", "--"] + cmd,
        input=(CONFIG.sudo_password + "\n").encode(),
        stdout=open(output_path, "wb"),
        stderr=subprocess.PIPE,
        timeout=timeout,
    )
    return proc2.returncode, proc2.stderr.decode("utf-8", "replace")


def docker_cmd(args, timeout=30):
    """执行 docker 命令，权限不足时自动通过 sudo 重试。"""
    return _run_with_sudo_fallback("docker", list(args), timeout)


def _compose_cmd(args, timeout=30):
    rc, out, err = _run_with_sudo_fallback(
        "docker", ["compose"] + list(args), timeout
    )
    if rc == 0 or not shutil.which("docker-compose"):
        return rc, out, err
    rc2, out2, err2 = _run_with_sudo_fallback(
        "docker-compose", list(args), timeout
    )
    if rc2 == 0:
        return rc2, out2, err2
    return rc, out, err


def _docker_json_lines(text):
    rows = []
    for line in (text or "").splitlines():
        line = line.strip()
        if not line:
            continue
        try:
            obj = json.loads(line)
        except ValueError:
            continue
        if isinstance(obj, dict):
            rows.append(obj)
    return rows


def _docker_lines(value):
    if isinstance(value, str):
        lines = value.splitlines()
    else:
        lines = [str(item) for item in (value or [])]
    return [line.strip() for line in lines if line.strip()]


def _require_docker_name(value, label):
    value = str(value or "").strip()
    if not value or not DOCKER_NAME_RE.match(value):
        raise ValueError(f"{label}格式无效")
    return value


def _docker_safe_value(value, label):
    value = str(value or "").strip()
    if (
        not value
        or value.startswith("-")
        or any(ord(ch) < 32 for ch in value)
        or any(ch.isspace() for ch in value)
    ):
        raise ValueError(f"{label}格式无效")
    return value


def _docker_error(rc, err):
    message = (err or "").strip() or f"docker 命令失败（返回码 {rc}）"
    return {"ok": False, "error": message}


def list_containers():
    rc, out, err = docker_cmd(
        ["ps", "-a", "--no-trunc", "--format", "{{json .}}"], timeout=30
    )
    if rc != 0:
        return [], err
    rows = _docker_json_lines(out)
    stats = {}
    rc2, out2, err2 = docker_cmd(
        ["stats", "--no-stream", "--format", "{{json .}}"], timeout=40
    )
    if rc2 == 0:
        for row in _docker_json_lines(out2):
            cid = row.get("ID") or row.get("Container") or ""
            stats[cid] = row
    result = []
    for row in rows:
        cid = row.get("ID", "")
        st = stats.get(cid) or {}
        result.append(
            {
                "id": cid,
                "name": row.get("Names", ""),
                "image": row.get("Image", ""),
                "command": row.get("Command", ""),
                "state": row.get("State", ""),
                "status": row.get("Status", ""),
                "created": row.get("CreatedAt", ""),
                "ports": row.get("Ports", "") or "",
                "networks": row.get("Networks", "") or "",
                "labels": row.get("Labels", "") or "",
                "mounts": row.get("Mounts", "") or "",
                "cpu_percent": st.get("CPUPerc", "") or "",
                "mem_percent": st.get("MemPerc", "") or "",
                "mem_usage": st.get("MemUsage", "") or "",
                "pids": st.get("PIDs", "") or "",
                "net_io": st.get("NetIO", "") or "",
                "block_io": st.get("BlockIO", "") or "",
            }
        )
    return result, "" if rc2 == 0 else err2


def list_images():
    rc, out, err = docker_cmd(
        ["images", "--no-trunc", "--format", "{{json .}}"], timeout=30
    )
    if rc != 0:
        return [], err
    result = []
    for row in _docker_json_lines(out):
        result.append(
            {
                "id": row.get("ID", ""),
                "repository": row.get("Repository", ""),
                "tag": row.get("Tag", ""),
                "size": row.get("Size", ""),
                "created": row.get("CreatedSince", ""),
                "containers": row.get("Containers", ""),
            }
        )
    return result, ""


def list_networks():
    rc, out, err = docker_cmd(
        ["network", "ls", "--format", "{{json .}}"], timeout=30
    )
    if rc != 0:
        return [], err
    result = []
    for row in _docker_json_lines(out):
        result.append(
            {
                "id": row.get("ID", ""),
                "name": row.get("Name", ""),
                "driver": row.get("Driver", ""),
                "scope": row.get("Scope", ""),
                "internal": row.get("Internal", ""),
                "ipv6": row.get("IPv6", ""),
                "created": row.get("CreatedAt", ""),
            }
        )
    return result, ""


def list_volumes():
    rc, out, err = docker_cmd(
        ["volume", "ls", "--format", "{{json .}}"], timeout=30
    )
    if rc != 0:
        return [], err
    result = []
    for row in _docker_json_lines(out):
        result.append(
            {
                "name": row.get("Name", ""),
                "driver": row.get("Driver", ""),
                "scope": row.get("Scope", ""),
                "mountpoint": row.get("Mountpoint", ""),
                "labels": row.get("Labels", "") or "",
            }
        )
    return result, ""


def container_action(cid, action):
    cid = _require_docker_name(cid, "容器")
    valid = {"start", "stop", "restart", "pause", "unpause", "kill", "remove"}
    if action not in valid:
        raise ValueError("不支持的操作")
    if action == "remove":
        args = ["rm", "-f", cid]
    else:
        args = [action, cid]
    rc, out, err = docker_cmd(args, timeout=60)
    if rc != 0:
        return _docker_error(rc, err)
    return {"ok": True, "message": (out or err or "操作成功").strip()}


def get_container_logs(cid, tail=200):
    cid = _require_docker_name(cid, "容器")
    try:
        tail = max(1, min(int(tail), 2000))
    except (TypeError, ValueError):
        tail = 200
    rc, out, err = docker_cmd(
        ["logs", "--tail", str(tail), "--timestamps", cid], timeout=30
    )
    if rc != 0:
        return _docker_error(rc, err)
    return {
        "ok": True,
        "container": cid,
        "logs": out.rstrip("\n").splitlines(),
    }


def open_container_console(cid, cols=120, rows=32):
    cid = _require_docker_name(cid, "容器")
    rc, out, err = docker_cmd(
        ["inspect", "--format", "{{.State.Running}}", cid], timeout=15
    )
    if rc != 0 or out.strip().lower() != "true":
        raise ValueError("容器未运行，无法打开控制台")
    try:
        cols = max(20, min(300, int(cols)))
        rows = max(5, min(100, int(rows)))
    except (TypeError, ValueError):
        cols, rows = 120, 32
    if CONFIG.sudo_password:
        cmd = ["sudo", "-n", "docker", "exec", "-it", cid, "/bin/sh"]
    else:
        cmd = ["docker", "exec", "-it", cid, "/bin/sh"]
    _prune_terminal_sessions()
    sid = uuid.uuid4().hex
    sess = TerminalSession(sid, cols, rows, cmd)
    with _TERMINAL_LOCK:
        TERMINAL_SESSIONS[sid] = sess
    return {"session": sid, "alive": True, "container": cid, "shell": "/bin/sh"}


def create_container(data):
    name = _require_docker_name(data.get("name"), "容器名称")
    image = str(data.get("image", "")).strip()
    if not image or not DOCKER_REF_RE.match(image):
        raise ValueError("镜像格式无效")
    args = ["run", "-d", "--name", name]

    restart = str(data.get("restart", "") or "").strip()
    if restart and restart not in {
        "no",
        "always",
        "on-failure",
        "unless-stopped",
    }:
        raise ValueError("重启策略无效")
    if restart:
        args += ["--restart", restart]

    network = str(data.get("network", "") or "").strip()
    if network:
        _require_docker_name(network, "网络")
        args += ["--network", network]

    cpus = str(data.get("cpus", "") or "").strip()
    if cpus:
        try:
            if float(cpus) <= 0:
                raise ValueError
        except ValueError:
            raise ValueError("CPU 限制格式无效")
        args += ["--cpus", cpus]

    memory = str(data.get("memory", "") or "").strip().lower()
    if memory:
        if not re.match(r"^\d+(\.\d+)?[bkmgt]?$", memory):
            raise ValueError("内存限制格式无效（例如 512m、2g）")
        args += ["--memory", memory]

    for port in _docker_lines(data.get("ports")):
        args += ["-p", _docker_safe_value(port, "端口映射")]
    for volume in _docker_lines(data.get("volumes")):
        args += ["-v", _docker_safe_value(volume, "存储卷")]
    for env in _docker_lines(data.get("env")):
        args += ["-e", _docker_safe_value(env, "环境变量")]

    args.append(image)
    command = str(data.get("command", "") or "").strip()
    if command:
        try:
            args += shlex.split(command)
        except ValueError:
            raise ValueError("启动命令格式错误")

    rc, out, err = docker_cmd(args, timeout=300)
    if rc != 0:
        return _docker_error(rc, err)
    return {"ok": True, "message": (out or err or "容器已创建").strip()}


def pull_docker_image(image):
    image = str(image or "").strip()
    if not image or not DOCKER_REF_RE.match(image):
        raise ValueError("镜像格式无效")
    rc, out, err = docker_cmd(["pull", image], timeout=600)
    if rc != 0:
        return _docker_error(rc, err)
    return {"ok": True, "message": (out or err or "镜像已拉取").strip()}


def remove_docker_image(image_id):
    image_id = _docker_safe_value(image_id, "镜像")
    rc, out, err = docker_cmd(["rmi", "-f", image_id], timeout=60)
    if rc != 0:
        return _docker_error(rc, err)
    return {"ok": True, "message": (out or err or "镜像已删除").strip()}


def create_docker_network(name, driver=""):
    name = _require_docker_name(name, "网络名称")
    driver = str(driver or "").strip()
    if driver and driver not in DOCKER_DRIVERS:
        raise ValueError("不支持的网络驱动")
    args = ["network", "create"]
    if driver:
        args += ["--driver", driver]
    args.append(name)
    rc, out, err = docker_cmd(args, timeout=30)
    if rc != 0:
        return _docker_error(rc, err)
    return {"ok": True, "message": (out or err or "网络已创建").strip()}


def remove_docker_network(name):
    name = _require_docker_name(name, "网络")
    rc, out, err = docker_cmd(["network", "rm", name], timeout=30)
    if rc != 0:
        return _docker_error(rc, err)
    return {"ok": True, "message": (out or err or "网络已删除").strip()}


def create_docker_volume(name, driver=""):
    name = _require_docker_name(name, "卷名称")
    driver = str(driver or "").strip()
    if driver and not re.match(r"^[A-Za-z0-9][A-Za-z0-9_.-]{0,63}$", driver):
        raise ValueError("卷驱动格式无效")
    args = ["volume", "create"]
    if driver:
        args += ["--driver", driver]
    args.append(name)
    rc, out, err = docker_cmd(args, timeout=30)
    if rc != 0:
        return _docker_error(rc, err)
    return {"ok": True, "message": (out or err or "卷已创建").strip()}


def remove_docker_volume(name):
    name = _require_docker_name(name, "卷")
    rc, out, err = docker_cmd(["volume", "rm", name], timeout=30)
    if rc != 0:
        return _docker_error(rc, err)
    return {"ok": True, "message": (out or err or "卷已删除").strip()}


def _compose_file(project):
    project = _require_docker_name(project, "Compose 项目")
    folder = COMPOSE_DIR / project
    for name in (
        "compose.yml",
        "compose.yaml",
        "docker-compose.yml",
        "docker-compose.yaml",
    ):
        if (folder / name).is_file():
            return folder, folder / name
    return folder, folder / "compose.yml"


def list_compose_projects():
    if not COMPOSE_DIR.is_dir():
        return [], ""
    projects = []
    first_error = ""
    for folder in sorted(COMPOSE_DIR.iterdir()):
        if not folder.is_dir():
            continue
        _, file_path = _compose_file(folder.name)
        if not file_path.is_file():
            continue
        content = ""
        try:
            content = file_path.read_text(encoding="utf-8", errors="replace")
        except OSError:
            pass
        rc, out, err = _compose_cmd(
            ["-f", str(file_path), "ps", "--format", "json"], timeout=30
        )
        containers = []
        project_error = ""
        if rc == 0:
            for row in _docker_json_lines(out):
                containers.append(
                    {
                        "name": row.get("Name", ""),
                        "state": row.get("State", ""),
                        "status": row.get("Status", ""),
                    }
                )
        else:
            project_error = (err or "Compose 状态查询失败").strip()
            if not first_error:
                first_error = project_error
        projects.append(
            {
                "name": folder.name,
                "file": file_path.name,
                "path": str(file_path),
                "content": content,
                "containers": containers,
                "error": project_error,
            }
        )
    return projects, first_error


def get_compose_project(name):
    folder, file_path = _compose_file(name)
    if not file_path.is_file():
        return {"ok": False, "error": "Compose 文件不存在"}
    try:
        content = file_path.read_text(encoding="utf-8", errors="replace")
    except OSError as exc:
        return {"ok": False, "error": str(exc)}
    return {
        "ok": True,
        "name": folder.name,
        "path": str(file_path),
        "content": content,
    }


def save_compose_project(name, content):
    name = _require_docker_name(name, "Compose 项目")
    content = str(content or "")
    if not content.strip():
        raise ValueError("Compose 内容不能为空")
    if len(content) > 1024 * 1024:
        raise ValueError("Compose 内容过大")
    folder, file_path = _compose_file(name)
    folder.mkdir(parents=True, exist_ok=True)
    tmp_path = folder / ".compose.tmp"
    tmp_path.write_text(content, encoding="utf-8")
    rc, out, err = _compose_cmd(
        ["-f", str(tmp_path), "config", "--quiet"], timeout=30
    )
    if rc != 0:
        try:
            tmp_path.unlink(missing_ok=True)
        except OSError:
            pass
        return _docker_error(rc, err or "Compose 配置无效")
    os.replace(tmp_path, file_path)
    return {"ok": True, "message": "Compose 已保存", "path": str(file_path)}


def compose_action(name, action):
    name = _require_docker_name(name, "Compose 项目")
    _, file_path = _compose_file(name)
    if not file_path.is_file():
        return {"ok": False, "error": "Compose 文件不存在"}
    if action == "up":
        args = ["-f", str(file_path), "up", "-d", "--remove-orphans"]
    elif action == "down":
        args = ["-f", str(file_path), "down"]
    elif action == "stop":
        args = ["-f", str(file_path), "stop"]
    else:
        raise ValueError("不支持的操作")
    rc, out, err = _compose_cmd(args, timeout=120)
    if rc != 0:
        return _docker_error(rc, err)
    return {"ok": True, "message": (out or err or "操作成功").strip()}


def delete_compose_project(name):
    name = _require_docker_name(name, "Compose 项目")
    folder, _ = _compose_file(name)
    if not folder.is_dir():
        return {"ok": False, "error": "Compose 项目不存在"}
    COMPOSE_TRASH_DIR.mkdir(parents=True, exist_ok=True)
    stamp = time.strftime("%Y%m%d-%H%M%S")
    dest = COMPOSE_TRASH_DIR / f"{name}-{stamp}"
    try:
        shutil.move(str(folder), str(dest))
    except OSError as exc:
        return {"ok": False, "error": str(exc)}
    return {"ok": True, "message": f"已移入回收站：{dest}"}


def get_container_summary():
    containers, c_err = list_containers()
    images, i_err = list_images()
    networks, n_err = list_networks()
    volumes, v_err = list_volumes()
    compose, p_err = list_compose_projects()
    errors = []
    for section, error in (
        ("容器", c_err),
        ("镜像", i_err),
        ("网络", n_err),
        ("卷", v_err),
        ("Compose", p_err),
    ):
        if error:
            errors.append({"section": section, "message": error.strip()})
    return {
        "ok": not errors,
        "containers": containers,
        "images": images,
        "networks": networks,
        "volumes": volumes,
        "compose": compose,
        "errors": errors,
    }


def firewall_cmd(args, timeout=60):
    """执行 ufw 命令（需要 sudo 提权）。"""
    return run_cmd(["ufw"] + list(args), timeout=timeout, privileged=True)


def _firewall_defaults(text):
    result = {"incoming": "", "outgoing": "", "routed": ""}
    match = re.search(r"Default:\s*(.+)", text)
    if not match:
        return result
    for part in match.group(1).split(","):
        part = part.strip()
        low = part.lower()
        for key in ("incoming", "outgoing", "routed"):
            if key in low:
                result[key] = part.split("(")[0].strip()
    return result


def _firewall_defaults_from_config():
    result = {"incoming": "", "outgoing": "", "routed": ""}
    path = Path("/etc/default/ufw")
    if not path.is_file():
        return result
    mapping = {
        "DEFAULT_INPUT_POLICY": "incoming",
        "DEFAULT_OUTPUT_POLICY": "outgoing",
        "DEFAULT_FORWARD_POLICY": "routed",
    }
    try:
        for line in path.read_text(encoding="utf-8", errors="replace").splitlines():
            line = line.strip()
            if not line or line.startswith("#") or "=" not in line:
                continue
            key, value = line.split("=", 1)
            key = key.strip()
            if key in mapping:
                result[mapping[key]] = value.strip().strip('"').strip().lower()
    except OSError:
        pass
    return result


def _firewall_rules(text):
    rules = []
    pattern = re.compile(
        r"^\[\s*(\d+)\]\s+(.+?)\s+(ALLOW|DENY|LIMIT|REJECT)\s+"
        r"(IN|OUT|FWD)\s+(.+)$"
    )
    for line in text.splitlines():
        match = pattern.match(line.strip())
        if not match:
            continue
        rules.append(
            {
                "number": int(match.group(1)),
                "rule": match.group(2).strip(),
                "action": match.group(3),
                "direction": match.group(4),
                "from": match.group(5).strip(),
            }
        )
    return rules


def _parse_added_spec(spec):
    try:
        parts = shlex.split(spec)
    except ValueError:
        return None
    if not parts:
        return None
    action = parts[0].upper()
    if "from" in parts:
        from_index = parts.index("from")
        source = (
            parts[from_index + 1]
            if from_index + 1 < len(parts)
            else "Anywhere"
        )
        rule = " ".join(parts[1:])
    else:
        rule = parts[1] if len(parts) > 1 else "all"
        source = "Anywhere"
    return {
        "action": action,
        "rule": rule,
        "direction": "IN",
        "from": source,
        "spec": spec,
    }


def _firewall_added_rules(text):
    rules = []
    for line in text.splitlines():
        line = line.strip()
        if not line.lower().startswith("ufw "):
            continue
        parsed = _parse_added_spec(line[4:].strip())
        if not parsed:
            continue
        parsed["number"] = len(rules) + 1
        rules.append(parsed)
    return rules


def _firewall_apps(text):
    apps = []
    started = False
    for line in text.splitlines():
        if "Available applications:" in line:
            started = True
            continue
        if started and line.strip() and not line.strip().startswith("-"):
            apps.append(line.strip())
    return apps


def get_firewall_status():
    rc, out, err = firewall_cmd(["status", "verbose"])
    if rc != 0:
        message = (err or out or "防火墙状态查询失败").strip()
        return {"ok": False, "available": False, "error": message}
    active = bool(re.search(r"Status:\s*active", out, re.IGNORECASE))
    defaults = _firewall_defaults(out)
    if not active:
        config_defaults = _firewall_defaults_from_config()
        for key in ("incoming", "outgoing", "routed"):
            if not defaults[key]:
                defaults[key] = config_defaults.get(key, "")
    logging_match = re.search(r"Logging:\s*(.+)", out)
    logging = logging_match.group(1).strip() if logging_match else ""
    if active:
        rc2, out2, err2 = firewall_cmd(["status", "numbered"])
        rules = _firewall_rules(out2) if rc2 == 0 else []
    else:
        rc2, out2, err2 = firewall_cmd(["show", "added"])
        rules = _firewall_added_rules(out2) if rc2 == 0 else []
    rc3, out3, err3 = firewall_cmd(["app", "list"])
    apps = _firewall_apps(out3) if rc3 == 0 else []
    return {
        "ok": True,
        "available": True,
        "active": active,
        "logging": logging,
        "default_in": defaults["incoming"],
        "default_out": defaults["outgoing"],
        "default_routed": defaults["routed"],
        "rules": rules,
        "apps": apps,
        "errors": [
            message
            for message in (err2, err3)
            if message and message.strip()
        ],
    }


def firewall_set_enabled(enabled):
    args = ["--force", "enable"] if enabled else ["disable"]
    rc, out, err = firewall_cmd(args, timeout=90)
    if rc != 0:
        return {"ok": False, "error": (err or "防火墙操作失败").strip()}
    return {
        "ok": True,
        "active": enabled,
        "message": (out or "防火墙已" + ("启用" if enabled else "停用")).strip(),
    }


def firewall_add_rule(action, port, protocol="tcp", source=""):
    action = str(action or "").strip().lower()
    if action not in {"allow", "deny", "limit"}:
        raise ValueError("动作只能是 allow/deny/limit")
    port = str(port or "").strip()
    if not port or not FIREWALL_PORT_RE.match(port):
        raise ValueError("端口格式无效")
    for part in port.split(":"):
        if not 1 <= int(part) <= 65535:
            raise ValueError("端口范围超出 1-65535")
    protocol = str(protocol or "").strip().lower()
    if protocol not in {"tcp", "udp", "any"}:
        raise ValueError("协议只能是 tcp/udp/any")
    source = str(source or "").strip()
    if source and source.lower() != "any":
        try:
            ipaddress.ip_network(source, strict=False)
        except ValueError:
            raise ValueError("来源 IP/CIDR 格式无效")
        args = [action, "from", source, "to", "any"]
        args += ["port", port]
        if protocol != "any":
            args += ["proto", protocol]
    else:
        rule = port
        if protocol != "any":
            rule += "/" + protocol
        args = [action, rule]
    rc, out, err = firewall_cmd(args, timeout=60)
    if rc != 0:
        return {"ok": False, "error": (err or "添加规则失败").strip()}
    return {"ok": True, "message": (out or "规则已添加").strip()}


def firewall_delete_rule(number):
    try:
        number = int(number)
    except (TypeError, ValueError):
        raise ValueError("规则编号无效")
    if not 1 <= number <= 9999:
        raise ValueError("规则编号无效")
    status = get_firewall_status()
    if status.get("active"):
        args = ["--force", "delete", str(number)]
    else:
        rule = next(
            (
                item
                for item in status.get("rules", [])
                if item.get("number") == number and item.get("spec")
            ),
            None,
        )
        if not rule:
            raise ValueError("规则不存在")
        try:
            args = ["--force", "delete"] + shlex.split(rule["spec"])
        except ValueError:
            raise ValueError("规则格式无效")
    rc, out, err = firewall_cmd(args, timeout=60)
    if rc != 0:
        return {"ok": False, "error": (err or "删除规则失败").strip()}
    return {"ok": True, "message": (out or "规则已删除").strip()}


def _f2b_int(value):
    try:
        return int(str(value or "").strip())
    except (TypeError, ValueError):
        return 0


def fail2ban_bin():
    return shutil.which("fail2ban-client")


def fail2ban_run(args, timeout=30):
    return run_cmd(
        ["fail2ban-client"] + list(args), timeout=timeout, privileged=True
    )


def get_fail2ban_status():
    if not fail2ban_bin():
        return {
            "installed": False,
            "ok": True,
            "service": "未安装",
            "jails": [],
        }
    rc, out, err = fail2ban_run(["status"], timeout=20)
    if rc != 0:
        return {
            "installed": True,
            "ok": False,
            "service": "inactive",
            "jails": [],
            "error": (err or out or "Fail2ban 服务未运行").strip(),
        }
    jails = []
    for line in (out or "").splitlines():
        if "jail list:" in line.strip().lower():
            names = line.split(":", 1)[1].strip()
            jails = [name.strip() for name in names.split(",") if name.strip()]
    jail_rows = []
    for name in jails:
        rc2, out2, err2 = fail2ban_run(["status", name], timeout=20)
        jail = {
            "name": name,
            "currently_failed": 0,
            "total_failed": 0,
            "currently_banned": 0,
            "total_banned": 0,
            "banned": [],
            "file": "",
            "error": (err2 or "").strip(),
        }
        if rc2 == 0:
            for line in (out2 or "").splitlines():
                if "Currently failed:" in line:
                    jail["currently_failed"] = _f2b_int(
                        line.split(":", 1)[1]
                    )
                elif "Total failed:" in line:
                    jail["total_failed"] = _f2b_int(
                        line.split(":", 1)[1]
                    )
                elif "Currently banned:" in line:
                    jail["currently_banned"] = _f2b_int(
                        line.split(":", 1)[1]
                    )
                elif "Total banned:" in line:
                    jail["total_banned"] = _f2b_int(
                        line.split(":", 1)[1]
                    )
                elif "Banned IP list:" in line:
                    raw = line.split(":", 1)[1].strip()
                    jail["banned"] = [
                        item.strip()
                        for item in raw.split()
                        if item.strip()
                    ]
                elif "File list:" in line:
                    jail["file"] = line.split(":", 1)[1].strip()
        jail_rows.append(jail)
    return {
        "installed": True,
        "ok": True,
        "service": "active",
        "jails": jail_rows,
    }


def fail2ban_action(action):
    action = str(action or "").strip()
    if action not in {"start", "stop", "restart", "reload"}:
        raise ValueError("不支持的操作")
    if action == "reload":
        rc, out, err = fail2ban_run(["reload"], timeout=30)
    else:
        rc, out, err = run_cmd(
            ["systemctl", action, "fail2ban"], timeout=60, privileged=True
        )
        if rc != 0:
            rc, out, err = fail2ban_run([action], timeout=30)
    if rc != 0:
        return {"ok": False, "error": (err or "Fail2ban 操作失败").strip()}
    labels = {"start": "启动", "stop": "停止", "restart": "重启", "reload": "重载规则"}
    return {"ok": True, "message": f"Fail2ban 已{labels.get(action, action)}"}


def fail2ban_unban(ip, jail=""):
    ip = str(ip or "").strip()
    try:
        ipaddress.ip_address(ip)
    except ValueError:
        raise ValueError("IP 地址格式无效")
    jail = str(jail or "").strip()
    if jail:
        if not re.fullmatch(r"[A-Za-z0-9_.-]{1,64}", jail):
            raise ValueError("规则名格式无效")
        rc, out, err = fail2ban_run(
            ["set", jail, "unbanip", ip], timeout=30
        )
        if rc != 0:
            return {"ok": False, "error": (err or "解封失败").strip()}
        return {"ok": True, "message": f"已从 {jail} 解封 {ip}"}
    status = get_fail2ban_status()
    messages = []
    for item in status.get("jails", []):
        if ip in item.get("banned", []):
            rc, out, err = fail2ban_run(
                ["set", item["name"], "unbanip", ip], timeout=30
            )
            if rc == 0:
                messages.append(item["name"])
    if messages:
        return {
            "ok": True,
            "message": f"已解封 {ip}（{', '.join(messages)}）",
        }
    return {"ok": False, "error": f"{ip} 不在任何规则封禁列表中"}


def _current_user_name():
    if pwd:
        try:
            return pwd.getpwuid(os.getuid()).pw_name
        except (KeyError, OSError):
            pass
    return os.environ.get("USER") or "root"


def verify_local_password(password):
    """校验本机密码；sudo 免密时改用 su 校验当前用户密码。"""
    if not password or not str(password).strip():
        return False
    if not is_linux():
        return False
    try:
        no_password_sudo = subprocess.run(
            ["sudo", "-n", "true"],
            capture_output=True,
            text=True,
            timeout=10,
        )
        if no_password_sudo.returncode == 0 and shutil.which("su"):
            user = _current_user_name()
            proc = subprocess.run(
                ["su", "-s", "/bin/sh", "-", user, "-c", "true"],
                input=str(password) + "\n",
                capture_output=True,
                text=True,
                timeout=10,
            )
            return proc.returncode == 0
        proc = subprocess.run(
            ["sudo", "-S", "-k", "-p", "", "true"],
            input=str(password) + "\n",
            capture_output=True,
            text=True,
            timeout=10,
        )
        return proc.returncode == 0
    except (OSError, subprocess.SubprocessError):
        return False


def login_user(body):
    code = str(body.get("code", "") or "").strip()
    password = str(body.get("password", "") or "")
    if not CONFIG.access_code or not secrets.compare_digest(
        code, CONFIG.access_code
    ):
        raise PermissionError("访问验证码错误")
    if not verify_local_password(password):
        raise PermissionError("本机密码验证失败，请重新输入")
    return {
        "ok": True,
        "app": APP_NAME,
        "version": VERSION,
        "hostname": socket.gethostname(),
        "token": CONFIG.token or "",
    }


def _ollama_endpoint():
    return os.environ.get(
        "PANEL_OLLAMA_ENDPOINT", "http://127.0.0.1:11434"
    ).rstrip("/")


def _ollama_models_dir():
    return os.environ.get("OLLAMA_MODELS") or str(
        Path.home() / ".ollama" / "models"
    )


def _ollama_api(path, payload=None, timeout=60):
    url = _ollama_endpoint() + path
    data = json.dumps(payload).encode("utf-8") if payload is not None else None
    request = urllib.request.Request(
        url,
        data=data,
        headers={"Content-Type": "application/json"},
        method="POST" if payload is not None else "GET",
    )
    try:
        with urllib.request.urlopen(request, timeout=timeout) as response:
            return json.loads(response.read().decode("utf-8"))
    except Exception as exc:
        return {"error": str(exc)}


def _ollama_cli(args, timeout=120):
    env = os.environ.copy()
    env["OLLAMA_MODELS"] = _ollama_models_dir()
    return run_cmd(["ollama"] + list(args), timeout=timeout, env=env)


def _parse_ollama_list(text):
    models = []
    for line in (text or "").splitlines():
        if not line.strip() or line.lstrip().startswith("NAME"):
            continue
        parts = line.split()
        if len(parts) >= 4:
            models.append(
                {
                    "name": parts[0],
                    "id": parts[1],
                    "size": parts[2],
                    "modified": " ".join(parts[3:]),
                }
            )
    return models


def _parse_ollama_ps(text):
    running = []
    for line in (text or "").splitlines():
        if not line.strip() or line.lstrip().startswith("NAME"):
            continue
        parts = line.split()
        if len(parts) >= 5:
            running.append(
                {
                    "name": parts[0],
                    "id": parts[1],
                    "size": parts[2],
                    "processor": parts[3],
                    "until": " ".join(parts[4:]),
                }
            )
    return running


def get_gpu_snapshot():
    if not is_linux() or not shutil.which("nvidia-smi"):
        return None
    rc, out, err = run_cmd(
        [
            "nvidia-smi",
            "--query-gpu=index,name,utilization.gpu,memory.used,memory.total,"
            "temperature.gpu,power.draw",
            "--format=csv,noheader,nounits",
        ],
        timeout=10,
    )
    if rc != 0 or not out.strip():
        return None
    fields = [part.strip() for part in out.splitlines()[0].split(",")]
    if len(fields) < 7:
        return None
    try:
        return {
            "index": fields[0],
            "name": fields[1],
            "utilization": float(fields[2]),
            "memory_used": float(fields[3]),
            "memory_total": float(fields[4]),
            "temperature": float(fields[5]),
            "power": float(fields[6]),
        }
    except (TypeError, ValueError):
        return None


def load_models_catalog():
    path = ROOT / "models.json"
    try:
        data = json.loads(path.read_text(encoding="utf-8"))
    except (OSError, ValueError):
        return []
    return data if isinstance(data, list) else []


def get_ollama_info():
    if not shutil.which("ollama"):
        return {
            "installed": False,
            "running": False,
            "version": "",
            "models": [],
            "running_models": [],
            "error": "Ollama 未安装",
        }
    rc, out, err = _ollama_cli(["--version"], timeout=20)
    version = out.strip().splitlines()[0] if rc == 0 else ""
    rc2, out2, err2 = _ollama_cli(["list"], timeout=30)
    models = _parse_ollama_list(out2) if rc2 == 0 else []
    rc3, out3, err3 = _ollama_cli(["ps"], timeout=30)
    running = _parse_ollama_ps(out3) if rc3 == 0 else []
    api = _ollama_api("/api/tags", timeout=5)
    service_ok = "error" not in api
    error = ""
    if not service_ok:
        error = "Ollama 服务未启动"
    elif rc2 != 0:
        error = (err2 or "模型列表读取失败").strip()
    return {
        "installed": True,
        "running": service_ok,
        "version": version,
        "models": models,
        "running_models": running,
        "error": error,
    }


def get_models_status():
    info = get_ollama_info()
    gpu = get_gpu_snapshot()
    _prune_model_jobs()
    with _MODEL_JOB_LOCK:
        jobs = [dict(job) for job in MODEL_JOBS.values()]
    return {
        "ok": info["installed"] and info["running"],
        "ollama_installed": info["installed"],
        "ollama_running": info["running"],
        "version": info["version"],
        "models_dir": _ollama_models_dir(),
        "models": info["models"],
        "running": info["running_models"],
        "gpu": gpu,
        "gpu_history": list(GPU_HISTORY),
        "catalog": load_models_catalog(),
        "jobs": jobs,
        "error": info["error"],
    }


def _update_model_job(job_id, **updates):
    with _MODEL_JOB_LOCK:
        if job_id in MODEL_JOBS:
            MODEL_JOBS[job_id].update(updates)


_ANSI_ESCAPE_RE = re.compile(
    r"\x1b\[[0-9;?]*[A-Za-z]|\x1b\][^\x07]*(\x07|\x1b\\)|\x1b[()][0-9A-Z]"
)


def _clean_progress_text(text):
    text = _ANSI_ESCAPE_RE.sub("", text or "")
    text = re.sub(r"[\x07]+", "", text)
    return text


def _collect_model_job_output(job_id, proc, done_message, fail_message):
    output = ""
    try:
        for line in iter(proc.stdout.readline, ""):
            line = _clean_progress_text(line)
            output = _clean_progress_text((output + line)[-4000:])
            _update_model_job(
                job_id,
                output=output,
                message=_clean_progress_text(line.strip())[-160:] or "运行中",
            )
        rc = proc.wait()
    except Exception as exc:
        rc = 1
        output = (output + str(exc))[-4000:]
    if rc == 0:
        _update_model_job(
            job_id, status="done", message=done_message, finished=now_str()
        )
    else:
        tail = output.strip().splitlines()[-1] if output.strip() else ""
        _update_model_job(
            job_id,
            status="error",
            message=(fail_message + (": " + tail if tail else "")),
            finished=now_str(),
        )


def _new_model_job(kind, label, target, *args):
    job_id = uuid.uuid4().hex[:12]
    job = {
        "id": job_id,
        "kind": kind,
        "model": label,
        "status": "running",
        "message": "任务已启动",
        "started": now_str(),
        "started_ts": time.time(),
        "finished": "",
        "output": "",
    }
    _prune_model_jobs()
    with _MODEL_JOB_LOCK:
        MODEL_JOBS[job_id] = job
    threading.Thread(
        target=target, args=(job_id,) + tuple(args), daemon=True
    ).start()
    return dict(job)


def _prune_model_jobs():
    with _MODEL_JOB_LOCK:
        finished = [
            job
            for job in MODEL_JOBS.values()
            if job.get("status") in {"done", "error"}
        ]
        finished.sort(key=lambda job: job.get("started_ts", 0), reverse=True)
        keep_ids = {job["id"] for job in finished[:50]}
        stale_ids = [
            job_id
            for job_id, job in MODEL_JOBS.items()
            if job.get("status") in {"done", "error"}
            and job_id not in keep_ids
        ]
        for job_id in stale_ids:
            MODEL_JOBS.pop(job_id, None)


def _ollama_install_job(job_id):
    env = os.environ.copy()
    models_dir = shlex.quote(_ollama_models_dir())
    script = "\n".join(
        [
            "set -e",
            'INSTALL_DIR="$(mktemp -d /tmp/ollama-install-XXXXXX)"',
            'cd "$INSTALL_DIR"',
            (
                "curl -fsSL --max-time 30 "
                '"https://modelscope.cn/models/Lixiang/ollama-release/'
                'resolve/master/linux-install.sh" -o linux-install.sh'
            ),
            (
                'ASSET_ID=$(curl -fsSL --max-time 30 '
                '"https://api.github.com/repos/ollama/ollama/releases/latest" '
                '| python3 -c "import sys,json; d=json.load(sys.stdin); '
                'print([a[\'id\'] for a in d[\'assets\'] '
                'if a[\'name\']==\'ollama-linux-amd64.tar.zst\'][0])")'
            ),
            (
                'DL_URL=$(curl -fsSI --max-time 30 '
                '-H "Accept: application/octet-stream" '
                '"https://api.github.com/repos/ollama/ollama/releases/assets/'
                '$ASSET_ID" | grep -i "^location:" '
                "| sed 's/^[Ll]ocation: //' | tr -d '\\r')"
            ),
            (
                'curl -fL --retry 5 --retry-delay 3 --max-time 1200 '
                '-o ollama-linux-amd64.tar.zst "$DL_URL"'
            ),
            (
                "command -v zstd >/dev/null 2>&1 || "
                "(apt-get update -qq && apt-get install -y -qq zstd)"
            ),
            "sh linux-install.sh",
            "mkdir -p " + models_dir,
            "chown -R ollama:ollama " + models_dir,
            "chmod 711 $(dirname $(dirname " + models_dir + "))",
            (
                "sed -i '/^Environment=OLLAMA_MODELS=/d' "
                "/etc/systemd/system/ollama.service; "
                "if ! grep -q 'Environment=OLLAMA_MODELS=' "
                "/etc/systemd/system/ollama.service; then "
                "sed -i '/^\\[Install\\]/i Environment=OLLAMA_MODELS="
                + models_dir
                + "' /etc/systemd/system/ollama.service; fi"
            ),
            "systemctl daemon-reload",
            "systemctl restart ollama",
            "sleep 2",
        ]
    )
    _update_model_job(job_id, message="正在安装 Ollama")
    try:
        if CONFIG.sudo_password:
            proc = subprocess.Popen(
                ["sudo", "-S", "-p", "", "bash", "-c", script],
                stdin=subprocess.PIPE,
                stdout=subprocess.PIPE,
                stderr=subprocess.STDOUT,
                text=True,
                env=env,
                start_new_session=is_linux(),
            )
            proc.stdin.write(CONFIG.sudo_password + "\n")
            proc.stdin.close()
        else:
            proc = subprocess.Popen(
                ["bash", "-c", script],
                stdout=subprocess.PIPE,
                stderr=subprocess.STDOUT,
                text=True,
                env=env,
                start_new_session=is_linux(),
            )
    except Exception as exc:
        _update_model_job(
            job_id, status="error", message="安装失败：" + str(exc)
        )
        return
    _collect_model_job_output(
        job_id, proc, "Ollama 安装完成", "Ollama 安装失败"
    )
    if not shutil.which("ollama"):
        _update_model_job(
            job_id,
            status="error",
            message="安装未生效：未找到 ollama 二进制",
        )


def _ollama_pull_job(job_id, model):
    env = os.environ.copy()
    env["OLLAMA_MODELS"] = _ollama_models_dir()
    _update_model_job(job_id, message="正在拉取 " + model)
    try:
        proc = subprocess.Popen(
            ["ollama", "pull", model],
            stdout=subprocess.PIPE,
            stderr=subprocess.STDOUT,
            text=True,
            env=env,
            start_new_session=is_linux(),
        )
    except Exception as exc:
        _update_model_job(
            job_id, status="error", message="拉取失败：" + str(exc)
        )
        return
    _collect_model_job_output(
        job_id, proc, "模型 " + model + " 已就绪", "模型拉取失败"
    )


def start_ollama_install():
    return {
        "ok": True,
        "job": _new_model_job("install", "Ollama", _ollama_install_job),
    }


def start_model_pull(model):
    model = str(model or "").strip()
    if not model or not DOCKER_REF_RE.match(model):
        raise ValueError("模型名称格式无效")
    if not shutil.which("ollama"):
        return {"ok": False, "error": "Ollama 未安装，请先一键安装"}
    return {
        "ok": True,
        "job": _new_model_job("pull", model, _ollama_pull_job, model),
    }


def remove_ollama_model(model):
    model = str(model or "").strip()
    if not model or not DOCKER_REF_RE.match(model):
        raise ValueError("模型名称格式无效")
    if not shutil.which("ollama"):
        return {"ok": False, "error": "Ollama 未安装"}
    rc, out, err = _ollama_cli(["rm", model], timeout=120)
    if rc != 0:
        return {"ok": False, "error": (err or "模型删除失败").strip()}
    return {"ok": True, "message": (out or "模型已删除").strip()}


def generate_ollama(payload):
    model = str(payload.get("model", "") or "").strip()
    prompt = str(payload.get("prompt", "") or "").strip()
    if not model or not DOCKER_REF_RE.match(model):
        raise ValueError("模型名称格式无效")
    if not prompt:
        raise ValueError("提示词不能为空")
    if len(prompt) > 20000:
        raise ValueError("提示词过长")
    data = _ollama_api(
        "/api/generate",
        {
            "model": model,
            "prompt": prompt,
            "stream": False,
            "options": {"temperature": 0.7},
        },
        timeout=300,
    )
    if not isinstance(data, dict) or "response" not in data:
        return {
            "ok": False,
            "error": str(data.get("error") or "Ollama 调用失败"),
        }
    return {
        "ok": True,
        "model": model,
        "response": data.get("response", ""),
        "eval_count": data.get("eval_count", 0),
        "total_duration_ms": int(
            (data.get("total_duration") or 0) / 1_000_000
        ),
    }


def gpu_loop():
    while True:
        time.sleep(2)
        try:
            gpu = get_gpu_snapshot()
            if gpu:
                GPU_HISTORY.append(
                    {
                        "time": now_str(),
                        "utilization": gpu["utilization"],
                        "memory_used": gpu["memory_used"],
                        "memory_total": gpu["memory_total"],
                        "temperature": gpu["temperature"],
                        "power": gpu["power"],
                    }
                )
        except Exception:
            pass


def get_logs(lines=200):
    lines = max(1, min(int(lines), 5000))
    if is_linux():
        rc, out, err = run_cmd(
            [
                "journalctl",
                "-n",
                str(lines),
                "--no-pager",
                "-o",
                "short-iso",
            ],
            timeout=15,
        )
        if rc == 0 and out.strip():
            return {"source": "journalctl", "lines": out.rstrip("\n").splitlines()}
        rc, out, err = run_cmd(
            ["tail", "-n", str(lines), "/var/log/syslog"], timeout=15
        )
        if rc == 0 and out.strip():
            return {"source": "syslog", "lines": out.rstrip("\n").splitlines()}
        return {"source": "none", "lines": [], "error": (err or "").strip()}
    return {"source": "none", "lines": []}


def execute_command(command, password=""):
    if not CONFIG.allow_command:
        raise PermissionError("命令执行功能未开启")
    if not command or not command.strip():
        raise ValueError("命令不能为空")
    if len(command) > MAX_COMMAND_LENGTH:
        raise ValueError(f"命令过长（上限 {MAX_COMMAND_LENGTH} 字符）")
    if not verify_local_password(password):
        raise PermissionError("本机密码验证失败，请重新输入")
    started = time.monotonic()
    rc, out, err = run_shell(command, timeout=30)
    return {
        "ok": rc == 0,
        "returncode": rc,
        "stdout": out,
        "stderr": err,
        "duration_ms": int((time.monotonic() - started) * 1000),
    }



def _db_config():
    try:
        if DB_CONFIG_PATH.exists():
            data = json.loads(DB_CONFIG_PATH.read_text(encoding="utf-8"))
            if isinstance(data, dict):
                return data
    except Exception:
        pass
    return {}


def _save_db_config(config):
    DB_CONFIG_PATH.parent.mkdir(parents=True, exist_ok=True)
    DB_CONFIG_PATH.write_text(
        json.dumps(config, ensure_ascii=False, indent=2), encoding="utf-8"
    )


def _db_client(engine):
    """返回数据库客户端命令与环境变量。"""
    cfg = _db_config().get(engine, {})
    env = dict(os.environ)
    args = []
    if engine in ("mysql", "mariadb"):
        bin_name = (
            "mariadb"
            if engine == "mariadb" and shutil.which("mariadb")
            else "mysql"
        )
        args = [bin_name]
        if cfg.get("user"):
            args += ["-u", str(cfg["user"])]
        if cfg.get("password"):
            env["MYSQL_PWD"] = str(cfg["password"])
        if cfg.get("host"):
            args += ["-h", str(cfg["host"])]
        if cfg.get("port"):
            args += ["-P", str(cfg["port"])]
    elif engine == "postgresql":
        args = ["psql"]
        if cfg.get("user"):
            args += ["-U", str(cfg["user"])]
        if cfg.get("password"):
            env["PGPASSWORD"] = str(cfg["password"])
        if cfg.get("host"):
            args += ["-h", str(cfg["host"])]
        if cfg.get("port"):
            args += ["-p", str(cfg["port"])]
    elif engine == "redis":
        args = ["redis-cli", "--no-auth-warning"]
        if cfg.get("password"):
            env["REDISCLI_AUTH"] = str(cfg["password"])
        if cfg.get("host"):
            args += ["-h", str(cfg["host"])]
        if cfg.get("port"):
            args += ["-p", str(cfg["port"])]
    return args, env


def _db_run(engine, extra, timeout=15):
    args, env = _db_client(engine)
    if engine == "postgresql" and not _db_config().get("postgresql", {}).get("user"):
        sudo_args = ["sudo", "-u", "postgres"] + args + list(extra)
        rc, out, err = run_cmd(sudo_args, timeout=timeout, env=env)
        if rc == 0:
            return rc, out, err
        rc2, out2, err2 = run_cmd(args + list(extra), timeout=timeout, env=env)
        if rc2 == 0:
            return rc2, out2, err2
        return rc, out, err
    return run_cmd(args + list(extra), timeout=timeout, env=env)


def _db_ping(engine):
    if engine in ("mysql", "mariadb"):
        return _db_run(engine, ["-N", "-B", "-e", "SELECT VERSION()"], timeout=8)
    if engine == "postgresql":
        return _db_run(engine, ["-Atc", "SELECT version()"], timeout=8)
    return _db_run(engine, ["PING"], timeout=6)


def _systemd_active(*unit_names):
    if not is_linux() or not shutil.which("systemctl"):
        return None
    for unit in unit_names:
        rc, out, err = run_cmd(["systemctl", "is-active", unit], timeout=5)
        if rc == 0:
            return True
    return False


def get_db_status():
    engines = []
    for key, name, bins, units in (
        ("mysql", "MySQL", ("mysql",), ("mysql", "mysqld")),
        ("mariadb", "MariaDB", ("mariadb", "mysql"), ("mariadb", "mysql")),
        ("postgresql", "PostgreSQL", ("psql",), ("postgresql",)),
        ("redis", "Redis", ("redis-cli",), ("redis-server", "redis")),
    ):
        installed = any(shutil.which(bin_name) for bin_name in bins)
        cfg = _db_config().get(key, {})
        entry = {
            "key": key,
            "name": name,
            "installed": installed,
            "running": False,
            "version": "",
            "detail": "",
            "error": "",
            "config": {
                "user": str(cfg.get("user", "")),
                "host": str(cfg.get("host", "")),
                "port": str(cfg.get("port", "")),
            },
        }
        if installed:
            bin_name = next(
                (item for item in bins if shutil.which(item)), bins[0]
            )
            rc, out, err = run_cmd([bin_name, "--version"], timeout=5)
            version = (out or err).strip()
            if version:
                entry["version"] = version.splitlines()[0][:200]
                entry["detail"] = entry["version"]
            active = _systemd_active(*units)
            if active:
                entry["running"] = True
                entry["detail"] = "服务运行中"
            try:
                rc, out, err = _db_ping(key)
                if rc == 0:
                    entry["running"] = True
                    entry["detail"] = "连接正常"
                else:
                    entry["error"] = (err or out or "连接失败").strip()[:200]
            except Exception as exc:
                entry["error"] = str(exc)[:200]
        engines.append(entry)
    return {"engines": engines}


def _validate_db_name(name):
    if not isinstance(name, str) or not re.fullmatch(r"[A-Za-z0-9_]+", name):
        raise ValueError("数据库名只能包含字母、数字和下划线")
    if len(name) > 64:
        raise ValueError("数据库名过长")


def _require_db_installed(engine):
    bins = {
        "mysql": ("mysql",),
        "mariadb": ("mariadb", "mysql"),
        "postgresql": ("psql",),
        "redis": ("redis-cli",),
    }.get(engine, ())
    if not any(shutil.which(bin_name) for bin_name in bins):
        raise ValueError("该数据库引擎未安装，请先在应用商店安装")


def list_databases(engine):
    if engine not in ("mysql", "mariadb", "postgresql", "redis"):
        raise ValueError("不支持的数据库类型")
    _require_db_installed(engine)
    if engine in ("mysql", "mariadb"):
        rc, out, err = _db_run(
            engine, ["-N", "-B", "-e", "SHOW DATABASES"], timeout=15
        )
        if rc != 0:
            raise RuntimeError((err or out or "连接数据库失败").strip()[:300])
        databases = [
            {"name": line.strip()}
            for line in out.splitlines()
            if line.strip()
        ]
        return {"engine": engine, "databases": databases}
    if engine == "postgresql":
        rc, out, err = _db_run(
            engine,
            [
                "-Atc",
                "SELECT datname FROM pg_database WHERE datistemplate = false ORDER BY datname",
            ],
            timeout=15,
        )
        if rc != 0:
            raise RuntimeError((err or out or "连接数据库失败").strip()[:300])
        databases = [
            {"name": line.strip()}
            for line in out.splitlines()
            if line.strip()
        ]
        return {"engine": engine, "databases": databases}
    rc, out, err = _db_run(engine, ["INFO", "keyspace"], timeout=10)
    if rc != 0:
        raise RuntimeError((err or out or "连接 Redis 失败").strip()[:300])
    databases = []
    for line in out.splitlines():
        match = re.match(r"^(db\d+):keys=(\d+),expires=(\d+)", line.strip())
        if match:
            databases.append(
                {
                    "name": match.group(1),
                    "keys": int(match.group(2)),
                    "expires": int(match.group(3)),
                }
            )
    if not databases:
        databases = [{"name": "db0", "keys": 0, "expires": 0}]
    return {"engine": engine, "databases": databases}


def create_database(engine, name, charset=""):
    _validate_db_name(name)
    _require_db_installed(engine)
    if engine in ("mysql", "mariadb"):
        charset = (charset or "utf8mb4").strip().lower()
        if charset not in (
            "utf8mb4",
            "utf8",
            "utf8mb3",
            "latin1",
            "ascii",
            "gbk",
            "gb2312",
        ):
            raise ValueError("不支持的字符集")
        rc, out, err = _db_run(
            engine,
            ["-e", "CREATE DATABASE `" + name + "` CHARACTER SET " + charset],
            timeout=30,
        )
    elif engine == "postgresql":
        rc, out, err = _db_run(
            engine,
            ["-Atc", 'CREATE DATABASE "' + name + '" ENCODING \'UTF8\''],
            timeout=30,
        )
    elif engine == "redis":
        raise ValueError("Redis 无需创建数据库")
    else:
        raise ValueError("不支持的数据库类型")
    if rc != 0:
        return {"ok": False, "error": (err or out or "创建失败").strip()[:300]}
    return {"ok": True, "message": "数据库 " + name + " 已创建"}


def drop_database(engine, name):
    _validate_db_name(name)
    _require_db_installed(engine)
    if engine in ("mysql", "mariadb"):
        rc, out, err = _db_run(
            engine, ["-e", "DROP DATABASE `" + name + "`"], timeout=30
        )
    elif engine == "postgresql":
        rc, out, err = _db_run(
            engine,
            ["-Atc", 'DROP DATABASE IF EXISTS "' + name + '"'],
            timeout=30,
        )
    elif engine == "redis":
        raise ValueError("Redis 请使用 FLUSHDB 清空数据")
    else:
        raise ValueError("不支持的数据库类型")
    if rc != 0:
        return {"ok": False, "error": (err or out or "删除失败").strip()[:300]}
    return {"ok": True, "message": "数据库 " + name + " 已删除"}


def _db_dump_cmd(engine, name):
    if engine in ("mysql", "mariadb"):
        args, env = _db_client(engine)
        dump_bin = (
            "mariadb-dump"
            if engine == "mariadb" and shutil.which("mariadb-dump")
            else "mysqldump"
        )
        dump = (
            [dump_bin]
            + args[1:]
            + ["--single-transaction", "--quick", "--routines", "--triggers", name]
        )
        return dump, env
    if engine == "postgresql":
        args, env = _db_client(engine)
        dump = ["pg_dump"] + args[1:] + [name]
        if not _db_config().get("postgresql", {}).get("user"):
            dump = ["sudo", "-u", "postgres"] + dump
        return dump, env
    return None, None


def _run_dump_stream(cmd, env, target, timeout=600):
    try:
        with target.open("wb") as fh:
            proc = subprocess.Popen(
                cmd, stdout=fh, stderr=subprocess.PIPE, env=env
            )
            _, err = proc.communicate(timeout=timeout)
        return proc.returncode, err.decode("utf-8", errors="replace")
    except subprocess.TimeoutExpired:
        try:
            proc.kill()
            proc.communicate()
        except Exception:
            pass
        return 124, "备份超时，已终止"


def backup_database(engine, name):
    _validate_db_name(name)
    _require_db_installed(engine)
    if engine not in ("mysql", "mariadb", "postgresql", "redis"):
        raise ValueError("不支持的数据库类型")
    DB_BACKUP_DIR.mkdir(parents=True, exist_ok=True)
    stamp = datetime.datetime.now().strftime("%Y%m%d_%H%M%S")
    base = DB_BACKUP_DIR / (engine + "_" + name + "_" + stamp)
    if engine == "redis":
        target = Path(str(base) + ".rdb")
        args, env = _db_client(engine)
        rc, out, err = run_cmd(args + ["--rdb", str(target)], timeout=300, env=env)
        if rc != 0:
            return {"ok": False, "error": (err or out or "备份失败").strip()[:300]}
    else:
        dump, env = _db_dump_cmd(engine, name)
        if dump is None:
            raise ValueError("不支持的数据库类型")
        target = Path(str(base) + ".sql")
        rc, err_text = _run_dump_stream(dump, env, target)
        if rc != 0:
            return {"ok": False, "error": (err_text or "备份失败").strip()[:300]}
        if target.exists() and target.stat().st_size == 0:
            target.unlink(missing_ok=True)
            return {"ok": False, "error": "备份结果为空"}
        if shutil.which("gzip"):
            rc2, out2, err2 = run_cmd(["gzip", "-f", str(target)], timeout=120)
            if rc2 == 0:
                target = Path(str(target) + ".gz")
    if not target.exists():
        return {"ok": False, "error": "备份文件未生成"}
    return {
        "ok": True,
        "path": str(target),
        "name": target.name,
        "size": target.stat().st_size,
        "message": "备份完成：" + target.name,
    }


def list_db_backups():
    if not DB_BACKUP_DIR.exists():
        return []
    rows = []
    for item in sorted(
        DB_BACKUP_DIR.iterdir(),
        key=lambda item: item.stat().st_mtime,
        reverse=True,
    ):
        if item.is_file():
            st = item.stat()
            rows.append(
                {
                    "name": item.name,
                    "size": st.st_size,
                    "time": datetime.datetime.fromtimestamp(st.st_mtime).strftime(
                        "%Y-%m-%d %H:%M:%S"
                    ),
                }
            )
    return rows


def delete_db_backup(name):
    if (
        not name
        or "/" in name
        or "\\" in name
        or ".." in name
    ):
        raise ValueError("备份文件名无效")
    target = DB_BACKUP_DIR / name
    if not target.is_file():
        raise FileNotFoundError("备份文件不存在")
    target.unlink()
    return {"ok": True, "message": "备份已删除"}


def save_db_connection(engine, data):
    if engine not in ("mysql", "mariadb", "postgresql", "redis"):
        raise ValueError("不支持的数据库类型")
    allowed = ("user", "password", "host", "port")
    clean = {}
    for key in allowed:
        if key not in data:
            continue
        value = str(data.get(key) or "").strip()
        if key == "port":
            if value and not value.isdigit():
                raise ValueError("端口必须是数字")
            clean[key] = int(value) if value else ""
        else:
            clean[key] = value
    config = _db_config()
    config[engine] = clean
    _save_db_config(config)
    return {"ok": True, "message": "连接配置已保存"}


def _prune_terminal_sessions():
    now = time.time()
    with _TERMINAL_LOCK:
        stale = [
            sid
            for sid, sess in list(TERMINAL_SESSIONS.items())
            if now - sess.last_active > 600
        ]
    for sid in stale:
        sess = TERMINAL_SESSIONS.get(sid)
        if sess:
            sess.close()


class TerminalSession:
    def __init__(self, sid, cols, rows, cmd=None):
        self.sid = sid
        self.created = time.time()
        self.last_active = time.time()
        self.closed = False
        self.queue = deque()
        self.lock = threading.Lock()
        self.decoder = codecs.getincrementaldecoder("utf-8")(errors="replace")
        self.proc = None
        self.master_fd = None
        self.reader = None
        self._spawn(cols, rows, cmd)

    def _spawn(self, cols, rows, cmd=None):
        if is_linux() and pty:
            master, slave = pty.openpty()
            self._apply_size(master, cols, rows)
            if cmd:
                self.proc = subprocess.Popen(
                    cmd,
                    stdin=slave,
                    stdout=slave,
                    stderr=slave,
                    close_fds=True,
                    start_new_session=True,
                )
            else:
                shell = os.environ.get("SHELL") or "/bin/bash"
                self.proc = subprocess.Popen(
                    [shell],
                    stdin=slave,
                    stdout=slave,
                    stderr=slave,
                    close_fds=True,
                    start_new_session=True,
                )
            os.close(slave)
            self.master_fd = master
            if cmd and cmd[0] == "sudo" and "-S" in cmd and CONFIG.sudo_password:
                try:
                    os.write(
                        master,
                        (CONFIG.sudo_password + "\n").encode("utf-8"),
                    )
                except OSError:
                    pass
            self.reader = threading.Thread(target=self._read_pty, daemon=True)
        else:
            if cmd:
                self.proc = subprocess.Popen(
                    cmd,
                    stdin=subprocess.PIPE,
                    stdout=subprocess.PIPE,
                    stderr=subprocess.STDOUT,
                    bufsize=0,
                )
            else:
                shell = (
                    os.environ.get("SHELL")
                    or os.environ.get("COMSPEC")
                    or "cmd.exe"
                )
                self.proc = subprocess.Popen(
                    [shell],
                    stdin=subprocess.PIPE,
                    stdout=subprocess.PIPE,
                    stderr=subprocess.STDOUT,
                    bufsize=0,
                )
            if cmd and cmd[0] == "sudo" and "-S" in cmd and CONFIG.sudo_password:
                try:
                    self.proc.stdin.write(
                        (CONFIG.sudo_password + "\n").encode("utf-8")
                    )
                    self.proc.stdin.flush()
                except Exception:
                    pass
            self.reader = threading.Thread(target=self._read_pipe, daemon=True)
        self.reader.start()

    def _read_pty(self):
        while not self.closed:
            try:
                data = os.read(self.master_fd, 65536)
            except OSError as exc:
                if exc.errno in (errno.EIO, errno.EBADF):
                    break
                time.sleep(0.02)
                continue
            if not data:
                break
            with self.lock:
                self.queue.append(data)
            self.last_active = time.time()
        self._finish()

    def _read_pipe(self):
        while not self.closed:
            try:
                data = self.proc.stdout.read(65536)
            except Exception:
                break
            if not data:
                break
            with self.lock:
                self.queue.append(data)
            self.last_active = time.time()
        self._finish()

    def _apply_size(self, fd, cols, rows):
        if not (is_linux() and pty and termios and fcntl):
            return
        try:
            fcntl.ioctl(
                fd,
                termios.TIOCSWINSZ,
                struct.pack("HHHH", max(int(rows), 2), max(int(cols), 2), 0, 0),
            )
        except Exception:
            pass

    def resize(self, cols, rows):
        if self.master_fd is not None:
            self._apply_size(self.master_fd, cols, rows)

    def write(self, data):
        if self.closed:
            return False
        try:
            if is_linux() and pty:
                os.write(self.master_fd, data)
            else:
                self.proc.stdin.write(data)
                self.proc.stdin.flush()
            self.last_active = time.time()
            return True
        except Exception:
            return False

    def drain_text(self):
        with self.lock:
            parts = []
            while self.queue:
                data = self.queue.popleft()
                parts.append(self.decoder.decode(data, final=False))
        return "".join(parts)

    def _finish(self):
        self.closed = True
        with _TERMINAL_LOCK:
            TERMINAL_SESSIONS.pop(self.sid, None)

    def close(self):
        if self.closed:
            self._finish()
            return
        self.closed = True
        if is_linux() and pty:
            try:
                if self.proc and self.proc.poll() is None:
                    os.killpg(self.proc.pid, signal.SIGHUP)
                    time.sleep(0.15)
                if self.proc and self.proc.poll() is None:
                    os.killpg(self.proc.pid, signal.SIGKILL)
            except Exception:
                pass
            try:
                if self.master_fd is not None:
                    os.close(self.master_fd)
            except Exception:
                pass
        else:
            try:
                if self.proc and self.proc.poll() is None:
                    self.proc.kill()
            except Exception:
                pass
        try:
            if self.proc:
                self.proc.wait(timeout=3)
        except Exception:
            pass
        self._finish()


def open_terminal(cols=120, rows=32):
    _prune_terminal_sessions()
    try:
        cols = max(20, min(300, int(cols)))
        rows = max(5, min(100, int(rows)))
    except (TypeError, ValueError):
        cols, rows = 120, 32
    sid = uuid.uuid4().hex
    sess = TerminalSession(sid, cols, rows)
    with _TERMINAL_LOCK:
        TERMINAL_SESSIONS[sid] = sess
    return {"session": sid, "alive": True}


def read_terminal(sid):
    _prune_terminal_sessions()
    sess = TERMINAL_SESSIONS.get(sid)
    if not sess:
        return {"alive": False, "data": "", "message": "会话不存在或已关闭"}
    sess.last_active = time.time()
    return {"alive": not sess.closed, "data": sess.drain_text()}


def write_terminal(sid, data):
    if not isinstance(data, str) or len(data) > 32768:
        raise ValueError("输入内容过长")
    sess = TERMINAL_SESSIONS.get(sid)
    if not sess:
        return {"ok": False, "alive": False, "message": "会话不存在"}
    ok = sess.write(data.encode("utf-8", errors="replace"))
    return {"ok": ok, "alive": not sess.closed}


def resize_terminal(sid, cols, rows):
    sess = TERMINAL_SESSIONS.get(sid)
    if not sess:
        return {"ok": False, "message": "会话不存在"}
    sess.resize(cols, rows)
    return {"ok": True}


def close_terminal(sid):
    sess = TERMINAL_SESSIONS.get(sid)
    if sess:
        sess.close()
    return {"ok": True}


class Handler(BaseHTTPRequestHandler):
    protocol_version = "HTTP/1.1"

    def handle(self):
        try:
            super().handle()
        except (ConnectionResetError, BrokenPipeError, TimeoutError):
            pass

    def log_message(self, fmt, *args):
        print(f"[panel] {self.address_string()} {fmt % args}")

    def _send_json(self, payload, status=200):
        self.audit_status = status
        if isinstance(payload, dict) and payload.get("ok") is False:
            self.audit_ok = False
        else:
            self.audit_ok = status < 400
        body = json.dumps(payload, ensure_ascii=False).encode("utf-8")
        self.send_response(status)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Content-Length", str(len(body)))
        self.send_header("Cache-Control", "no-store")
        self.end_headers()
        self.wfile.write(body)

    def _send_text(self, text, content_type, status=200):
        self.audit_status = status
        self.audit_ok = status < 400
        body = text.encode("utf-8")
        self.send_response(status)
        self.send_header("Content-Type", content_type)
        self.send_header("Content-Length", str(len(body)))
        self.send_header("Cache-Control", "no-cache")
        self.end_headers()
        self.wfile.write(body)

    def _send_download(self, target):
        if not target.is_file():
            self._send_json({"error": "not_found", "message": "文件不存在"}, 404)
            return
        size = target.stat().st_size
        self.audit_status = 200
        self.audit_ok = True
        self.send_response(200)
        self.send_header("Content-Type", "application/octet-stream")
        self.send_header("Content-Length", str(size))
        self.send_header(
            "Content-Disposition", 'attachment; filename="' + target.name + '"'
        )
        self.send_header("Cache-Control", "no-store")
        self.end_headers()
        try:
            with target.open("rb") as fh:
                while True:
                    chunk = fh.read(65536)
                    if not chunk:
                        break
                    self.wfile.write(chunk)
        except (ConnectionResetError, BrokenPipeError):
            pass

    def _read_json(self):
        length = int(self.headers.get("Content-Length", "0") or 0)
        if length <= 0:
            return {}
        if length > MAX_READ_BYTES:
            raise ValueError("请求体过大")
        raw = self.rfile.read(length)
        try:
            data = json.loads(raw.decode("utf-8"))
        except (UnicodeDecodeError, json.JSONDecodeError):
            return {}
        return data if isinstance(data, dict) else {}

    def _read_multipart(self):
        length = int(self.headers.get("Content-Length", "0") or 0)
        if length <= 0:
            raise ValueError("上传内容为空")
        if length > MAX_UPLOAD_BYTES:
            raise ValueError(
                f"上传文件过大（上限 {human_size(MAX_UPLOAD_BYTES)}）"
            )
        raw = self.rfile.read(length)
        content_type = self.headers.get("Content-Type", "")
        match = re.search(
            r'boundary=(?:"([^"]+)"|([^;]+))', content_type
        )
        if not match:
            raise ValueError("multipart 格式错误")
        mime_header = (
            "Content-Type: " + content_type + "\r\n"
            "MIME-Version: 1.0\r\n\r\n"
        ).encode("utf-8")
        msg = message_from_bytes(mime_header + raw, policy=email_policy.default)
        if not msg.is_multipart():
            raise ValueError("请求不是 multipart 表单")
        fields = {}
        files = []
        for part in msg.iter_parts():
            name = part.get_param("name", header="content-disposition")
            filename = part.get_filename()
            payload = part.get_payload(decode=True)
            if filename:
                files.append(
                    {"name": name, "filename": filename, "payload": payload}
                )
            else:
                fields[name] = (
                    payload.decode("utf-8", "replace") if payload else ""
                )
        return fields, files

    def _auth_ok(self):
        if not CONFIG.token:
            return True
        query = parse_qs(urlparse(self.path).query)
        provided = query.get("token", [None])[0]
        if not provided:
            provided = self.headers.get("X-Panel-Token")
        return bool(provided) and secrets.compare_digest(provided, CONFIG.token)

    def _deny(self):
        self._send_json(
            {"error": "unauthorized", "message": "缺少访问令牌或令牌错误"},
            status=401,
        )

    def _handle_api_error(self, exc):
        if isinstance(exc, ValueError):
            self._send_json({"error": "bad_request", "message": str(exc)}, status=400)
        elif isinstance(exc, (PermissionError, FileNotFoundError, NotADirectoryError)):
            self._send_json({"error": "denied", "message": str(exc)}, status=403)
        else:
            self._send_json(
                {"error": "server_error", "message": str(exc)}, status=500
            )

    def _api_get(self, route, parsed):
        try:
            if route == "/api/status":
                payload = {
                    "app": APP_NAME,
                    "version": VERSION,
                    "hostname": socket.gethostname(),
                    "os": platform.platform(),
                    "auth": bool(CONFIG.token),
                    "allow_command": CONFIG.allow_command,
                    "time": now_str(),
                }
            elif route == "/api/system":
                payload = get_system_info()
            elif route == "/api/processes":
                payload = {"processes": list_processes()}
            elif route == "/api/services":
                payload = {"services": list_services()}
            elif route == "/api/guard":
                payload = {
                    "rules": get_guard_status(),
                    "interval": GUARD_INTERVAL,
                }
            elif route == "/api/toolbox":
                payload = get_toolbox_info()
            elif route == "/api/toolbox/dns":
                query = parse_qs(parsed.query)
                payload = resolve_domain(query.get("domain", [""])[0])
            elif route == "/api/analytics":
                payload = analytics_summary()
            elif route == "/api/analytics/status":
                payload = get_analytics_status()
            elif route == "/api/tamper/status":
                payload = get_tamper_status()
            elif route == "/api/tamper/events":
                query = parse_qs(parsed.query)
                payload = {"events": get_tamper_events(query.get("lines", ["200"])[0])}
            elif route == "/api/tamper/permissions":
                payload = {"risky": get_tamper_permissions()}
            elif route == "/api/cron":
                payload = get_cron_list()
            elif route == "/api/ssh-logs":
                query = parse_qs(parsed.query)
                payload = get_ssh_logs(query.get("lines", ["200"])[0])
            elif route == "/api/apps":
                payload = {"apps": get_common_apps()}
            elif route == "/api/docker-apps":
                payload = list_docker_apps()
            elif route == "/api/docker-apps/logs":
                query = parse_qs(parsed.query)
                payload = docker_app_logs(
                    query.get("id", [""])[0],
                    query.get("tail", ["200"])[0],
                )
            elif route == "/api/container":
                payload = get_container_summary()
            elif route == "/api/container/logs":
                query = parse_qs(parsed.query)
                payload = get_container_logs(
                    query.get("id", [""])[0],
                    query.get("tail", ["200"])[0],
                )
            elif route == "/api/container/compose":
                query = parse_qs(parsed.query)
                payload = get_compose_project(query.get("name", [""])[0])
            elif route == "/api/fail2ban":
                payload = get_fail2ban_status()
            elif route == "/api/audit":
                query = parse_qs(parsed.query)
                payload = {
                    "logs": list_audit_logs(
                        query.get("lines", ["200"])[0]
                    )
                }
            elif route == "/api/firewall":
                payload = get_firewall_status()
            elif route == "/api/models":
                payload = get_models_status()
            elif route == "/api/models/jobs":
                _prune_model_jobs()
                with _MODEL_JOB_LOCK:
                    payload = {
                        "jobs": [dict(job) for job in MODEL_JOBS.values()]
                    }
            elif route == "/api/files":
                query = parse_qs(parsed.query)
                payload = list_files(query.get("path", ["/"])[0])
            elif route == "/api/files/read":
                query = parse_qs(parsed.query)
                payload = read_text_file(query.get("path", [""])[0])
            elif route == "/api/files/download":
                query = parse_qs(parsed.query)
                self._send_download(Path(_fs_path(query.get("path", [""])[0])))
                return
            elif route == "/api/backups":
                payload = {"backups": list_backups()}
            elif route == "/api/metrics/history":
                query = parse_qs(parsed.query)
                hours = query.get("hours", ["24"])[0]
                payload = read_metrics_history(hours)
            elif route == "/api/webdav":
                config = load_webdav_config()
                config["password"] = "*" * 6 if config.get("password") else ""
                payload = config
            elif route == "/api/webdav/files":
                payload = webdav_list()
            elif route == "/api/sites":
                payload = list_sites()
            elif route == "/api/sites/config":
                query = parse_qs(parsed.query)
                payload = get_site_config(query.get("name", [""])[0])
            elif route == "/api/sites/logs":
                query = parse_qs(parsed.query)
                payload = get_site_logs(
                    query.get("name", [""])[0],
                    query.get("kind", ["access"])[0],
                    query.get("lines", ["100"])[0],
                )
            elif route == "/api/cron-jobs":
                payload = list_cron_jobs()
            elif route == "/api/cron-jobs/log":
                query = parse_qs(parsed.query)
                payload = read_cron_job_log(
                    query.get("id", [""])[0],
                    query.get("lines", ["200"])[0],
                )
            elif route == "/api/certs":
                payload = list_certificates()
            elif route == "/api/ssh-config":
                payload = get_ssh_config()
            elif route == "/api/clean/status":
                payload = get_clean_status()
            elif route == "/api/settings":
                payload = get_panel_settings()
            elif route == "/api/clamav/status":
                payload = clamav_status()
            elif route == "/api/clamav/last":
                payload = _CLAM_LAST["result"] or {"ok": False, "message": "暂无扫描记录"}
            elif route == "/api/disk/info":
                payload = get_disk_info()
            elif route == "/api/alerts/config":
                payload = load_alert_config()
            elif route == "/api/backups/download":
                query = parse_qs(parsed.query)
                name = query.get("name", [""])[0]
                if not _backup_name_ok(name):
                    raise ValueError("备份文件名无效")
                self._send_download(PANEL_BACKUP_DIR / name)
                return
            elif route == "/api/logs":
                query = parse_qs(parsed.query)
                payload = get_logs(query.get("lines", ["200"])[0])
            elif route == "/api/db":
                payload = get_db_status()
            elif route == "/api/db/databases":
                query = parse_qs(parsed.query)
                payload = list_databases(query.get("engine", [""])[0])
            elif route == "/api/db/backups":
                payload = {"backups": list_db_backups()}
            elif route == "/api/db/backups/download":
                query = parse_qs(parsed.query)
                name = query.get("name", [""])[0]
                if (
                    not name
                    or "/" in name
                    or "\\" in name
                    or ".." in name
                ):
                    raise ValueError("备份文件名无效")
                self._send_download(DB_BACKUP_DIR / name)
                return
            elif route == "/api/terminal/output":
                query = parse_qs(parsed.query)
                payload = read_terminal(query.get("sid", [""])[0])
            else:
                self._send_json({"error": "not_found", "message": "接口不存在"}, 404)
                return
        except Exception as exc:
            self._handle_api_error(exc)
            return
        self._send_json(payload)

    def _api_post(self, route):
        try:
            body = self._read_json()
            self.audit_detail = _audit_detail_for(route, body)
            password = body.get("password", "")
            if route in (
                "/api/terminal/input",
                "/api/terminal/resize",
                "/api/terminal/close",
            ):
                pass
            elif not verify_local_password(password):
                if not password:
                    self._send_json(
                        {
                            "error": "password_required",
                            "message": "需要本机密码验证",
                        },
                        status=403,
                    )
                else:
                    self._send_json(
                        {
                            "error": "denied",
                            "message": "本机密码验证失败，请重新输入",
                        },
                        status=403,
                    )
                return
            if route == "/api/processes/kill":
                pid = body.get("pid")
                if isinstance(pid, str) and pid.isdigit():
                    pid = int(pid)
                if not isinstance(pid, int):
                    raise ValueError("PID 无效")
                payload = kill_process(pid, body.get("signal", "TERM"))
            elif route == "/api/services/action":
                payload = service_action(
                    body.get("unit", ""), body.get("action", "")
                )
            elif route == "/api/guard/add":
                payload = add_guard_rule(
                    body.get("name", ""),
                    body.get("pattern", ""),
                    body.get("command", ""),
                    body.get("auto", False),
                )
            elif route == "/api/guard/update":
                updates = {}
                for key in ("name", "pattern", "command", "auto"):
                    if key in body:
                        updates[key] = body[key]
                payload = update_guard_rule(body.get("id", ""), **updates)
            elif route == "/api/guard/remove":
                payload = remove_guard_rule(body.get("id", ""))
            elif route == "/api/guard/start":
                payload = start_guard_rule(body.get("id", ""))
            elif route == "/api/cron/add":
                payload = add_cron(
                    body.get("schedule", ""), body.get("command", "")
                )
            elif route == "/api/cron/remove":
                payload = remove_cron(body.get("index"))
            elif route == "/api/cron/toggle":
                payload = toggle_cron(body.get("index"))
            elif route == "/api/analytics/paths":
                payload = set_analytics_paths(body.get("paths", []))
            elif route == "/api/analytics/ports":
                payload = set_analytics_ports(body.get("ports", []))
            elif route == "/api/tamper/paths":
                payload = set_tamper_paths(body.get("paths", []))
            elif route == "/api/tamper/init":
                payload = init_tamper_baseline()
            elif route == "/api/tamper/scan":
                payload = run_tamper_scan()
            elif route == "/api/apps/install":
                payload = install_common_app(
                    body.get("id", ""), bool(body.get("update"))
                )
            elif route == "/api/apps/uninstall":
                payload = uninstall_common_app(body.get("id", ""))
            elif route == "/api/apps/check-updates":
                payload = check_common_app_updates(force=True)
            elif route == "/api/docker-apps/install":
                payload = install_docker_app(
                    body.get("id", ""),
                    body.get("port"),
                    body.get("params", {}) or {},
                )
            elif route == "/api/docker-apps/uninstall":
                payload = uninstall_docker_app(
                    body.get("id", ""), bool(body.get("purge"))
                )
            elif route == "/api/docker-apps/action":
                payload = docker_app_action(
                    body.get("id", ""), body.get("action", "")
                )
            elif route == "/api/docker-apps/backup":
                payload = docker_app_backup(body.get("id", ""))
            elif route == "/api/container/action":
                payload = container_action(
                    body.get("id", ""), body.get("action", "")
                )
            elif route == "/api/container/create":
                payload = create_container(body)
            elif route == "/api/container/images/pull":
                payload = pull_docker_image(body.get("image", ""))
            elif route == "/api/container/images/remove":
                payload = remove_docker_image(body.get("id", ""))
            elif route == "/api/container/networks/create":
                payload = create_docker_network(
                    body.get("name", ""), body.get("driver", "")
                )
            elif route == "/api/container/networks/remove":
                payload = remove_docker_network(body.get("name", ""))
            elif route == "/api/container/volumes/create":
                payload = create_docker_volume(
                    body.get("name", ""), body.get("driver", "")
                )
            elif route == "/api/container/volumes/remove":
                payload = remove_docker_volume(body.get("name", ""))
            elif route == "/api/container/compose/save":
                payload = save_compose_project(
                    body.get("name", ""), body.get("content", "")
                )
            elif route == "/api/container/compose/up":
                payload = compose_action(body.get("name", ""), "up")
            elif route == "/api/container/compose/down":
                payload = compose_action(body.get("name", ""), "down")
            elif route == "/api/container/compose/stop":
                payload = compose_action(body.get("name", ""), "stop")
            elif route == "/api/container/compose/delete":
                payload = delete_compose_project(body.get("name", ""))
            elif route == "/api/container/console/open":
                payload = open_container_console(
                    body.get("id", ""),
                    body.get("cols", 120),
                    body.get("rows", 32),
                )
            elif route == "/api/fail2ban/action":
                payload = fail2ban_action(body.get("action", ""))
            elif route == "/api/fail2ban/unban":
                payload = fail2ban_unban(
                    body.get("ip", ""), body.get("jail", "")
                )
            elif route == "/api/audit/clear":
                payload = clear_audit_logs()
            elif route == "/api/firewall/toggle":
                payload = firewall_set_enabled(bool(body.get("enabled")))
            elif route == "/api/firewall/rule":
                payload = firewall_add_rule(
                    body.get("action", ""),
                    body.get("port", ""),
                    body.get("protocol", "tcp"),
                    body.get("source", ""),
                )
            elif route == "/api/firewall/rule/delete":
                payload = firewall_delete_rule(body.get("number"))
            elif route == "/api/models/install":
                payload = start_ollama_install()
            elif route == "/api/models/pull":
                payload = start_model_pull(body.get("model", ""))
            elif route == "/api/models/remove":
                payload = remove_ollama_model(body.get("model", ""))
            elif route == "/api/models/generate":
                payload = generate_ollama(body)
            elif route == "/api/files/delete":
                payload = delete_path(body.get("path", ""))
            elif route == "/api/files/download-url":
                payload = download_url_to_file(
                    body.get("url", ""), body.get("target", "")
                )
            elif route == "/api/files/archive":
                payload = archive_paths(
                    body.get("paths", []),
                    body.get("target", ""),
                    body.get("format", "tar.gz"),
                )
            elif route == "/api/files/extract":
                payload = extract_archive(
                    body.get("archive", ""), body.get("target", "")
                )
            elif route == "/api/files/mkdir":
                payload = make_dir(body.get("path", ""))
            elif route == "/api/files/rename":
                payload = rename_path(
                    body.get("path", ""), body.get("new_name", "")
                )
            elif route == "/api/files/chmod":
                payload = change_mode(body.get("path", ""), body.get("mode", ""))
            elif route == "/api/files/chown":
                payload = change_owner(
                    body.get("path", ""),
                    body.get("owner", ""),
                    body.get("group", ""),
                )
            elif route == "/api/backups/create":
                payload = create_backup(
                    body.get("name", ""),
                    body.get("paths", []),
                    body.get("format", "tar.gz"),
                )
            elif route == "/api/backups/restore":
                payload = restore_backup(
                    body.get("name", ""), body.get("target", "")
                )
            elif route == "/api/backups/delete":
                payload = delete_backup(body.get("name", ""))
            elif route == "/api/webdav/save":
                config = load_webdav_config()
                if body.get("url") is not None:
                    config["url"] = str(body.get("url", "")).strip()
                if body.get("remote_dir") is not None:
                    config["remote_dir"] = str(body.get("remote_dir", "")).strip()
                if body.get("username") is not None:
                    config["username"] = str(body.get("username", "")).strip()
                dav_password = body.get("dav_password")
                if dav_password is not None:
                    config["password"] = str(dav_password)
                config["enabled"] = bool(body.get("enabled", config.get("enabled")))
                save_webdav_config(config)
                payload = {"ok": True, "message": "WebDAV 配置已保存"}
            elif route == "/api/webdav/test":
                payload = webdav_test()
            elif route == "/api/webdav/upload":
                payload = webdav_upload(body.get("name", ""))
            elif route == "/api/webdav/download":
                payload = webdav_download(body.get("name", ""))
            elif route == "/api/webdav/delete":
                payload = webdav_delete(body.get("name", ""))
            elif route == "/api/sites/create":
                payload = create_site(body)
            elif route == "/api/sites/save":
                payload = save_site_config(
                    body.get("name", ""), body.get("content", "")
                )
            elif route == "/api/sites/toggle":
                payload = toggle_site(
                    body.get("name", ""), bool(body.get("enable"))
                )
            elif route == "/api/sites/delete":
                payload = delete_site(body.get("name", ""))
            elif route == "/api/sites/install-nginx":
                payload = install_nginx()
            elif route == "/api/cron-jobs/create":
                payload = create_cron_job(body)
            elif route == "/api/cron-jobs/update":
                payload = update_cron_job(body)
            elif route == "/api/cron-jobs/delete":
                payload = delete_cron_job(body.get("id", ""))
            elif route == "/api/cron-jobs/toggle":
                payload = toggle_cron_job(
                    body.get("id", ""), bool(body.get("enable"))
                )
            elif route == "/api/cron-jobs/run":
                payload = run_cron_job_now(body.get("id", ""))
            elif route == "/api/certs/install-acme":
                payload = acme_install()
            elif route == "/api/certs/issue":
                payload = issue_certificate(body.get("site", ""))
            elif route == "/api/certs/disable":
                payload = disable_certificate(body.get("site", ""))
            elif route == "/api/ssh-config/save":
                payload = set_ssh_config(body)
            elif route == "/api/clean/run":
                payload = run_clean(body.get("keys", []))
            elif route == "/api/settings/access-code":
                payload = set_access_code(body.get("code", ""))
            elif route == "/api/clamav/install":
                payload = install_clamav()
            elif route == "/api/clamav/scan":
                payload = start_clam_scan(body.get("path", ""))
            elif route == "/api/alerts/save":
                config = load_alert_config()
                config.update({
                    "enabled": bool(body.get("enabled", config.get("enabled"))),
                    "webhook": str(body.get("webhook", config.get("webhook", ""))),
                    "cpu_threshold": int(body.get("cpu_threshold", config.get("cpu_threshold", 90))),
                    "mem_threshold": int(body.get("mem_threshold", config.get("mem_threshold", 90))),
                    "disk_threshold": int(body.get("disk_threshold", config.get("disk_threshold", 90))),
                    "cooldown_minutes": int(body.get("cooldown_minutes", config.get("cooldown_minutes", 30))),
                })
                save_alert_config(config)
                payload = {"ok": True, "message": "告警配置已保存"}
            elif route == "/api/alerts/test":
                webhook = str(body.get("webhook") or load_alert_config().get("webhook", ""))
                if not webhook:
                    raise ValueError("请先填写 Webhook 地址")
                ok = _send_webhook(webhook, "✅ 天依面板告警测试", f"这是一条测试消息，来自 {socket.gethostname()}")
                payload = {"ok": ok, "message": "测试消息发送成功" if ok else "发送失败，请检查 Webhook 地址"}
            elif route == "/api/command":
                payload = execute_command(
                    body.get("command", ""), body.get("password", "")
                )
            elif route == "/api/db/connect":
                payload = save_db_connection(
                    body.get("engine", ""), body.get("config", {}) or {}
                )
            elif route == "/api/db/create":
                payload = create_database(
                    body.get("engine", ""),
                    body.get("name", ""),
                    body.get("charset", ""),
                )
            elif route == "/api/db/drop":
                payload = drop_database(
                    body.get("engine", ""), body.get("name", "")
                )
            elif route == "/api/db/backup":
                payload = backup_database(
                    body.get("engine", ""), body.get("name", "")
                )
            elif route == "/api/db/backups/delete":
                payload = delete_db_backup(body.get("name", ""))
            elif route == "/api/terminal/open":
                payload = open_terminal(
                    body.get("cols", 120), body.get("rows", 32)
                )
            elif route == "/api/terminal/input":
                payload = write_terminal(
                    body.get("sid", ""), body.get("data", "")
                )
            elif route == "/api/terminal/resize":
                payload = resize_terminal(
                    body.get("sid", ""),
                    body.get("cols", 120),
                    body.get("rows", 32),
                )
            elif route == "/api/terminal/close":
                payload = close_terminal(body.get("sid", ""))
            else:
                self._send_json({"error": "not_found", "message": "接口不存在"}, 404)
                return
        except Exception as exc:
            self._handle_api_error(exc)
            return
        self._send_json(payload)

    def _api_upload(self, parsed):
        query = parse_qs(parsed.query)
        target_dir = query.get("path", ["/"])[0]
        fields, files = self._read_multipart()
        if not files:
            raise ValueError("没有收到文件")
        password = fields.get("password", "")
        if not verify_local_password(password):
            if not password:
                self._send_json(
                    {
                        "error": "password_required",
                        "message": "需要本机密码验证",
                    },
                    status=403,
                )
            else:
                self._send_json(
                    {
                        "error": "denied",
                        "message": "本机密码验证失败，请重新输入",
                    },
                    status=403,
                )
            return
        results = []
        for item in files:
            results.append(
                upload_file(target_dir, item["filename"], item["payload"])
            )
        self.audit_detail = "上传: " + ", ".join(
            os.path.basename(item.get("name", "") or "")
            for item in results
        )
        self._send_json({"ok": True, "files": results})

    def _serve_static(self, route):
        name = route
        if name == "/":
            name = "/index.html"
        path_code = name.lstrip("/")
        if re.fullmatch(r"\d{6}", path_code):
            if CONFIG.access_code and secrets.compare_digest(
                path_code, CONFIG.access_code
            ):
                name = "/index.html"
            else:
                self._send_text("Not Found", "text/plain; charset=utf-8", 404)
                return
        if ".." in name or "\x00" in name:
            self._send_text("Forbidden", "text/plain; charset=utf-8", 403)
            return
        candidate = STATIC_DIR / name.lstrip("/")
        try:
            resolved = candidate.resolve()
            root = STATIC_DIR.resolve()
            if not resolved.is_relative_to(root) or not resolved.is_file():
                self._send_text("Not Found", "text/plain; charset=utf-8", 404)
                return
        except (OSError, ValueError):
            self._send_text("Not Found", "text/plain; charset=utf-8", 404)
            return
        content_type = {
            ".html": "text/html; charset=utf-8",
            ".css": "text/css; charset=utf-8",
            ".js": "application/javascript; charset=utf-8",
            ".svg": "image/svg+xml",
            ".json": "application/json; charset=utf-8",
        }.get(resolved.suffix.lower(), "application/octet-stream")
        try:
            self._send_text(resolved.read_text(encoding="utf-8"), content_type)
        except Exception:
            self._send_text("Read Error", "text/plain; charset=utf-8", 500)

    def do_GET(self):
        parsed = urlparse(self.path)
        route = parsed.path
        if route.startswith("/api/"):
            if not self._auth_ok():
                self._deny()
                return
            self._api_get(route, parsed)
            return
        self._serve_static(route)

    def do_POST(self):
        route = urlparse(self.path).path
        started = time.time()
        self.audit_status = 200
        self.audit_ok = True
        self.audit_detail = ""
        try:
            if not route.startswith("/api/"):
                self._send_json(
                    {"error": "not_found", "message": "接口不存在"}, 404
                )
                return
            if route == "/api/login":
                self.audit_detail = "登录"
                try:
                    body = self._read_json()
                except Exception as exc:
                    self._handle_api_error(exc)
                    return
                client_ip = self.client_address[0]
                now = time.time()
                with _LOGIN_LOCK:
                    attempts = [
                        stamp
                        for stamp in _LOGIN_ATTEMPTS.get(client_ip, [])
                        if now - stamp < 300
                    ]
                    _LOGIN_ATTEMPTS[client_ip] = attempts
                    if len(attempts) >= 10:
                        self._send_json(
                            {
                                "error": "too_many",
                                "message": "登录尝试次数过多，请 5 分钟后再试",
                            },
                            status=429,
                        )
                        return
                try:
                    payload = login_user(body)
                except Exception as exc:
                    with _LOGIN_LOCK:
                        attempts = _LOGIN_ATTEMPTS.setdefault(client_ip, [])
                        attempts.append(now)
                        _LOGIN_ATTEMPTS[client_ip] = attempts[-20:]
                    self._handle_api_error(exc)
                    return
                with _LOGIN_LOCK:
                    _LOGIN_ATTEMPTS.pop(client_ip, None)
                self._send_json(payload)
                return
            if not self._auth_ok():
                self._deny()
                return
            if route == "/api/files/upload":
                try:
                    self._api_upload(urlparse(self.path))
                except Exception as exc:
                    self._handle_api_error(exc)
                return
            self._api_post(route)
        except Exception as exc:
            self.audit_status = 500
            self.audit_detail = self.audit_detail or str(exc)
            try:
                self._handle_api_error(exc)
            except Exception:
                pass
        finally:
            if route not in AUDIT_SKIP_ROUTES:
                audit_log(
                    route=route,
                    ok=self.audit_ok,
                    ip=self.client_address[0],
                    duration_ms=int((time.time() - started) * 1000),
                    detail=self.audit_detail,
                )


def main():
    parser = argparse.ArgumentParser(description=APP_NAME)
    parser.add_argument("--host", default="127.0.0.1", help="监听地址")
    parser.add_argument("--port", type=int, default=8000, help="监听端口")
    parser.add_argument(
        "--token",
        default=None,
        help="访问令牌；auto 表示自动生成并保存到 panel.token",
    )
    parser.add_argument(
        "--allow-command",
        action="store_true",
        help="开启命令执行页面（默认关闭）",
    )
    args = parser.parse_args()

    CONFIG.host = args.host
    CONFIG.port = args.port
    CONFIG.allow_command = args.allow_command
    CONFIG.sudo_password = os.environ.get("PANEL_SUDO_PASSWORD", "")

    access_code = os.environ.get("PANEL_ACCESS_CODE", "").strip()
    verify_file = ROOT / "panel.verify"
    if not access_code and verify_file.is_file():
        try:
            access_code = verify_file.read_text(encoding="utf-8").strip()
        except OSError:
            access_code = ""
    if not re.fullmatch(r"\d{6}", access_code):
        access_code = f"{secrets.randbelow(1000000):06d}"
        try:
            verify_file.write_text(access_code + "\n", encoding="utf-8")
            try:
                os.chmod(verify_file, 0o600)
            except OSError:
                pass
        except OSError:
            pass
    CONFIG.access_code = access_code

    token_file = ROOT / "panel.token"
    should_auto = args.token == "auto" or (
        args.token is None and args.host not in LOCAL_HOSTS
    )
    if should_auto:
        CONFIG.token = secrets.token_urlsafe(18)
        try:
            token_file.write_text(CONFIG.token + "\n", encoding="utf-8")
            try:
                os.chmod(token_file, 0o600)
            except OSError:
                pass
        except OSError:
            pass
    else:
        CONFIG.token = args.token

    print(f"{APP_NAME} v{VERSION}")
    print(f"监听: {CONFIG.host}:{CONFIG.port}")
    print(f"鉴权: {'启用' if CONFIG.token else '未启用（仅本机）'}")
    print(f"命令执行: {'启用' if CONFIG.allow_command else '关闭'}")
    if CONFIG.token:
        print(f"访问令牌: {CONFIG.token}")
    print(f"访问验证码: {CONFIG.access_code}")
    print(f"登录地址: http://{CONFIG.host}:{CONFIG.port}/{CONFIG.access_code}")
    if CONFIG.sudo_password:
        print("sudo 提权: 已通过 PANEL_SUDO_PASSWORD 配置")
    threading.Thread(target=guard_loop, daemon=True).start()
    threading.Thread(target=tamper_loop, daemon=True).start()
    threading.Thread(target=gpu_loop, daemon=True).start()
    threading.Thread(target=metrics_loop, daemon=True).start()

    try:
        server = ThreadingHTTPServer((CONFIG.host, CONFIG.port), Handler)
    except OSError as exc:
        print(f"启动失败：{exc}", file=sys.stderr)
        sys.exit(1)
    server.daemon_threads = True
    print(f"面板已启动: http://{CONFIG.host}:{CONFIG.port}/")
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print("\n已停止")


if __name__ == "__main__":
    # 冻结解释器启动阶段的对象，之后 GC 不再扫描它们，
    # 显著降低长期运行进程的 GC 开销（Python 3.7+ 官方推荐）
    try:
        gc.freeze()
    except Exception:
        pass
    main()
