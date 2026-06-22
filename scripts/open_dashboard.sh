#!/bin/zsh
set -euo pipefail

SCRIPT_DIR="${0:A:h}"
PROJECT_DIR="${SCRIPT_DIR:h}"
DASHBOARD_FILE="${PROJECT_DIR}/index.html"
DASHBOARD_URL="file://${DASHBOARD_FILE}"

"${SCRIPT_DIR}/update_data.sh"

echo "正在打开本地 Dashboard：${DASHBOARD_FILE}"

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
  /usr/bin/open -a "Safari" "${DASHBOARD_FILE}"
  resize_safari
fi
