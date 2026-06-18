#!/bin/zsh
set -euo pipefail

SCRIPT_DIR="${0:A:h}"
PROJECT_DIR="${SCRIPT_DIR:h}"
DATA_DIR="${PROJECT_DIR}/data"
DATA_FILE="${DATA_DIR}/latest.json"
CACHE_FILE="${DATA_DIR}/latest.js"

mkdir -p "${DATA_DIR}"

if [[ ! -f "${DATA_FILE}" ]]; then
  cat > "${DATA_FILE}" <<'JSON'
{
  "updated_at": "北京时间 2026-06-18 09:55",
  "date_range": "2026-06-17",
  "summary": "昨日世界杯共有 4 场比赛结束，阿根廷取得关键胜利，葡萄牙今日即将出战。",
  "matches": [
    {
      "group": "Group J",
      "status": "FT",
      "venue": "Mexico City",
      "team_a": {
        "name": "Argentina",
        "flag": "🇦🇷",
        "score": 3,
        "scorers": [
          {"player": "Julián Álvarez", "minute": "18'", "type": "goal"},
          {"player": "Lionel Messi", "minute": "52'", "type": "penalty"},
          {"player": "Lautaro Martínez", "minute": "78'", "type": "goal"}
        ]
      },
      "team_b": {
        "name": "Algeria",
        "flag": "🇩🇿",
        "score": 0,
        "scorers": []
      },
      "highlights": [
        "阿根廷取得小组赛开门红",
        "梅西贡献关键进球",
        "阿尔及利亚防线压力较大"
      ]
    },
    {
      "group": "Group I",
      "status": "FT",
      "venue": "Toronto",
      "team_a": {
        "name": "France",
        "flag": "🇫🇷",
        "score": 3,
        "scorers": [
          {"player": "Kylian Mbappé", "minute": "24'", "type": "goal"},
          {"player": "Antoine Griezmann", "minute": "61'", "type": "goal"},
          {"player": "Olivier Giroud", "minute": "88'", "type": "goal"}
        ]
      },
      "team_b": {
        "name": "Senegal",
        "flag": "🇸🇳",
        "score": 1,
        "scorers": [
          {"player": "Ismaïla Sarr", "minute": "73'", "type": "goal"}
        ]
      },
      "highlights": ["法国队进攻效率较高", "塞内加尔下半场扳回一球"]
    }
  ],
  "standings_changes": [
    "阿根廷暂列 J 组第一",
    "法国队凭借净胜球优势领跑 I 组",
    "阿尔及利亚和塞内加尔出线压力增大"
  ],
  "today_fixtures": [
    {
      "time_bj": "北京时间 21:00",
      "team_a": {"name": "Portugal", "flag": "🇵🇹"},
      "team_b": {"name": "DR Congo", "flag": "🇨🇩"},
      "group": "Group K"
    },
    {
      "time_bj": "北京时间 23:30",
      "team_a": {"name": "England", "flag": "🏴"},
      "team_b": {"name": "Croatia", "flag": "🇭🇷"},
      "group": "Group L"
    }
  ],
  "news": [
    {"title": "葡萄牙即将迎来小组赛首战", "source": "Demo Source", "url": "https://example.com"},
    {"title": "英格兰与克罗地亚焦点战即将开打", "source": "Demo Source", "url": "https://example.com"}
  ]
}
JSON
  echo "已创建 demo 数据。"
else
  echo "检测到现有数据，不会覆盖。"
fi

# Chrome 会限制 file:// 页面直接 fetch JSON。此缓存只负责让本地页面可直接打开，
# latest.json 仍是 OpenClaw 唯一需要更新的数据源。
CACHE_TMP="$(mktemp "${DATA_DIR}/.latest.js.XXXXXX")"
trap 'rm -f "${CACHE_TMP}"' EXIT
{
  printf 'window.WORLDCUP_DATA = '
  cat "${DATA_FILE}"
  printf ';\n'
} > "${CACHE_TMP}"
mv "${CACHE_TMP}" "${CACHE_FILE}"
trap - EXIT

echo "当前使用的数据文件：${DATA_FILE}"
