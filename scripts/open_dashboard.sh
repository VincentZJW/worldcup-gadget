#!/bin/zsh
set -euo pipefail

SCRIPT_DIR="${0:A:h}"
PROJECT_DIR="${SCRIPT_DIR:h}"
DASHBOARD_URL="http://127.0.0.1:8787/"
SERVER_LOG="/tmp/worldcupdashboard-http.log"

"${SCRIPT_DIR}/update_data.sh"

if ! /usr/bin/nc -z 127.0.0.1 8787 >/dev/null 2>&1; then
  PYTHON_BIN="$(command -v python3 || true)"
  if [[ -z "${PYTHON_BIN}" ]]; then
    echo "未找到 python3，无法启动本地 Dashboard 服务。" >&2
    exit 1
  fi

  echo "正在启动本地服务：${DASHBOARD_URL}"
  /usr/bin/nohup "${PYTHON_BIN}" -m http.server 8787 \
    --bind 127.0.0.1 \
    --directory "${PROJECT_DIR}" \
    > "${SERVER_LOG}" 2>&1 &

  sleep 1
  if ! /usr/bin/nc -z 127.0.0.1 8787 >/dev/null 2>&1; then
    echo "本地服务启动失败，请检查日志：${SERVER_LOG}" >&2
    exit 1
  fi
else
  echo "检测到 8787 端口已有本地服务，直接复用。"
fi

resize_chrome() {
  /usr/bin/osascript <<'APPLESCRIPT' || true
delay 1
tell application "Finder" to set desktopBounds to bounds of window of desktop
set screenRight to item 3 of desktopBounds
set screenTop to item 2 of desktopBounds
set gadgetWidth to 620
set gadgetHeight to 720
set edgeMargin to 24
set targetBounds to {screenRight - gadgetWidth - edgeMargin, screenTop + edgeMargin, screenRight - edgeMargin, screenTop + gadgetHeight + edgeMargin}

tell application "Google Chrome"
  activate
  repeat 20 times
    if (count of windows) > 0 then
      set bounds of window 1 to targetBounds
      exit repeat
    end if
    delay 0.25
  end repeat
end tell
APPLESCRIPT
}

resize_safari() {
  /usr/bin/osascript <<'APPLESCRIPT' || true
delay 1
tell application "Finder" to set desktopBounds to bounds of window of desktop
set screenRight to item 3 of desktopBounds
set screenTop to item 2 of desktopBounds
set gadgetWidth to 620
set gadgetHeight to 720
set edgeMargin to 24
set targetBounds to {screenRight - gadgetWidth - edgeMargin, screenTop + edgeMargin, screenRight - edgeMargin, screenTop + gadgetHeight + edgeMargin}

tell application "Safari"
  activate
  repeat 20 times
    if (count of windows) > 0 then
      set bounds of window 1 to targetBounds
      exit repeat
    end if
    delay 0.25
  end repeat
end tell
APPLESCRIPT
}

if /usr/bin/open -Ra "Google Chrome" >/dev/null 2>&1; then
  /usr/bin/open -na "Google Chrome" --args --app="${DASHBOARD_URL}"
  resize_chrome
else
  /usr/bin/open -a "Safari" "${DASHBOARD_URL}"
  resize_safari
fi
