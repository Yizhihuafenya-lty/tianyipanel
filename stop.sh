#!/usr/bin/env bash
set -euo pipefail

pkill -f "server.py --host 0.0.0.0" || true
echo "面板已停止（如无匹配进程则忽略）"
