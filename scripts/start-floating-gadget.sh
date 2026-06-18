#!/bin/sh
set -eu
if (set -o pipefail) 2>/dev/null; then
  set -o pipefail
fi

export PATH="/Users/vincentz/.hermes/node/bin:/opt/homebrew/bin:/usr/local/bin:/usr/bin:/bin:/usr/sbin:/sbin:$PATH"

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
PROJECT_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"
GADGET_DIR="$PROJECT_DIR/floating-gadget"
ELECTRON_BIN="$GADGET_DIR/node_modules/.bin/electron"
LOG_FILE="/tmp/worldcup-floating-gadget.log"
PID_FILE="/tmp/worldcup-floating-gadget.pid"
NODE_BIN="$(command -v node || true)"
NODE_VERSION="$(node -v 2>/dev/null || true)"
WHICH_NODE="$(which node 2>/dev/null || true)"
WHICH_ELECTRON="$(which electron 2>/dev/null || true)"

log() {
  printf '%s\n' "$*" >> "$LOG_FILE"
}

if [ -z "$NODE_BIN" ]; then
  message="Node.js not found. Please install Node or update PATH in start-floating-gadget.sh."
  echo "$message"
  log "$message"
  log "PATH=$PATH"
  exit 1
fi

log "----- $(date '+%Y-%m-%d %H:%M:%S') start-floating-gadget -----"
log "PATH=$PATH"
log "which node=$WHICH_NODE"
log "NODE_BIN=$NODE_BIN"
log "node -v=$NODE_VERSION"
log "which electron=$WHICH_ELECTRON"
log "ELECTRON_BIN=$ELECTRON_BIN"
log "GADGET_DIR=$GADGET_DIR"

if [ ! -x "$ELECTRON_BIN" ]; then
  message="Electron is not installed for floating-gadget."
  echo "$message"
  echo "Please run:"
  echo "  cd \"$GADGET_DIR\" && npm install"
  log "$message"
  log "Please run: cd \"$GADGET_DIR\" && npm install"
  exit 1
fi

is_running=false
if [ -f "$PID_FILE" ]; then
  existing_pid="$(tr -d '[:space:]' < "$PID_FILE" || true)"
  case "$existing_pid" in
    ''|*[!0-9]*)
      ;;
    *)
      if kill -0 "$existing_pid" 2>/dev/null; then
        is_running=true
      fi
      ;;
  esac
fi

cd "$GADGET_DIR"
nohup "$ELECTRON_BIN" "$GADGET_DIR" --show-ball >> "$LOG_FILE" 2>&1 &
started_pid="$!"

if [ "$is_running" = "false" ]; then
  echo "$started_pid" > "$PID_FILE"
  echo "WorldCup Floating Gadget started. PID: $started_pid"
else
  echo "WorldCup Floating Gadget is already running. Sent wake request via Electron single-instance lock."
fi

echo "Log: $LOG_FILE"
