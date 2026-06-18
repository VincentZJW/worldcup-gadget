#!/bin/sh
set -eu
if (set -o pipefail) 2>/dev/null; then
  set -o pipefail
fi

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
PROJECT_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"
GADGET_DIR="$PROJECT_DIR/floating-gadget"
PID_FILE="/tmp/worldcup-floating-gadget.pid"

if [ ! -f "$PID_FILE" ]; then
  echo "WorldCup Floating Gadget is not running: PID file not found."
  exit 0
fi

pid="$(tr -d '[:space:]' < "$PID_FILE" || true)"
case "$pid" in
  ''|*[!0-9]*)
    echo "WorldCup Floating Gadget PID file is invalid: $PID_FILE"
    rm -f "$PID_FILE"
    exit 0
    ;;
esac

if ! kill -0 "$pid" 2>/dev/null; then
  echo "WorldCup Floating Gadget is not running. Removing stale PID file."
  rm -f "$PID_FILE"
  exit 0
fi

process_cwd=""
if command -v lsof >/dev/null 2>&1; then
  process_cwd="$(lsof -a -p "$pid" -d cwd -Fn 2>/dev/null | sed -n 's/^n//p' | head -n 1 || true)"
fi

if [ "$process_cwd" != "$GADGET_DIR" ]; then
  echo "Refusing to stop PID $pid because it does not appear to belong to this gadget."
  echo "Expected cwd: $GADGET_DIR"
  if [ -n "$process_cwd" ]; then
    echo "Actual cwd:   $process_cwd"
  else
    echo "Actual cwd:   unknown"
  fi
  exit 1
fi

kill "$pid"

count=0
while kill -0 "$pid" 2>/dev/null; do
  count=$((count + 1))
  if [ "$count" -ge 20 ]; then
    echo "Stop signal sent to PID $pid, but it is still shutting down."
    exit 0
  fi
  sleep 0.2
done

rm -f "$PID_FILE"
echo "WorldCup Floating Gadget stopped."
