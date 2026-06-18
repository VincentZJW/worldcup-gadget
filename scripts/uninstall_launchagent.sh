#!/bin/zsh
set -euo pipefail

LABEL="com.vincent.worldcupdashboard"
DOMAIN="gui/$(id -u)"
TARGET="${HOME}/Library/LaunchAgents/${LABEL}.plist"

if [[ -f "${TARGET}" ]]; then
  if /bin/launchctl bootout "${DOMAIN}" "${TARGET}" >/dev/null 2>&1; then
    echo "已卸载 ${LABEL}。"
  else
    echo "${LABEL} 未加载或已经卸载，继续清理配置文件。"
  fi

  rm -f "${TARGET}"
  echo "已删除：${TARGET}"
else
  echo "未找到 ${TARGET}；无需卸载。"
fi

echo "卸载完成。"
