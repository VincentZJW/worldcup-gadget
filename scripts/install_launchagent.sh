#!/bin/zsh
set -euo pipefail

SCRIPT_DIR="${0:A:h}"
PROJECT_DIR="${SCRIPT_DIR:h}"
TEMPLATE="${PROJECT_DIR}/launchd/com.vincent.worldcupdashboard.plist.template"
LABEL="com.vincent.worldcupdashboard"
DOMAIN="gui/$(id -u)"
LAUNCH_AGENTS_DIR="${HOME}/Library/LaunchAgents"
TARGET="${LAUNCH_AGENTS_DIR}/${LABEL}.plist"

if [[ ! -f "${TEMPLATE}" ]]; then
  echo "找不到 LaunchAgent 模板：${TEMPLATE}" >&2
  exit 1
fi

if [[ ! -x "${PROJECT_DIR}/scripts/open_dashboard.sh" ]]; then
  echo "open_dashboard.sh 不可执行。请先运行：chmod +x scripts/*.sh" >&2
  exit 1
fi

mkdir -p "${LAUNCH_AGENTS_DIR}"
/usr/bin/sed "s|__PROJECT_DIR__|${PROJECT_DIR}|g" "${TEMPLATE}" > "${TARGET}"
/usr/bin/plutil -lint "${TARGET}" >/dev/null

if /bin/launchctl print "${DOMAIN}/${LABEL}" >/dev/null 2>&1; then
  /bin/launchctl bootout "${DOMAIN}" "${TARGET}" || true
fi

/bin/launchctl bootstrap "${DOMAIN}" "${TARGET}"
/bin/launchctl enable "${DOMAIN}/${LABEL}"

echo "LaunchAgent 安装成功：每天系统本地时间 10:00 打开 Dashboard。"
echo "配置文件：${TARGET}"
echo "立即测试：launchctl kickstart -k ${DOMAIN}/${LABEL}"
