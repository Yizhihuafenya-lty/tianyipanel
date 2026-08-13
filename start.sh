#!/usr/bin/env bash
set -euo pipefail

cd "$(dirname "$0")"
TOKEN_FILE="panel.token"

if [ ! -f "$TOKEN_FILE" ]; then
  TOKEN="$(python3 -c 'import secrets; print(secrets.token_urlsafe(18))')"
  printf '%s\n' "$TOKEN" > "$TOKEN_FILE"
  chmod 600 "$TOKEN_FILE"
fi

TOKEN="$(cat "$TOKEN_FILE")"
exec python3 server.py --host 0.0.0.0 --port 8000 --token "$TOKEN" "$@"
