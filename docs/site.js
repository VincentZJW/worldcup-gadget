const translations = {
  zh: {
    documentTitle: "WorldCup Gadget - 世界杯桌面悬浮球",
    navDownload: "下载",
    heroTitle: "世界杯战况，\n在你的桌面优雅展开。",
    heroSubtitle: "实时比分、小组积分、赛程与进球榜，一屏掌握。",
    downloadLatest: "下载最新版",
    releaseNote: "免费 beta 通过 GitHub Pages + GitHub Releases 分发。",
    liveTitle: "实时比分与最近赛果",
    liveBody: "正在进行的比赛会显示 LIVE 标记，最近结束的比赛会保留比分和进球信息。",
    standingsTitle: "小组总积分",
    standingsBody: "开赛以来累计排名、胜平负、净胜球和积分，晋级区高亮显示。",
    bracketTitle: "赛程预告与看点",
    bracketBody: "聚焦接下来值得看的比赛、出线形势和最近赛果；完整赛程仍在下方查看。",
    scheduleTitle: "完整赛程 / Tournament Map",
    scheduleBody: "查看小组赛和淘汰赛全部比赛，可按阶段与状态快速筛选。",
    scorersTitle: "进球榜",
    scorersBody: "统计开赛以来所有球员的总进球数，并尽量补齐球员头像。",
    productTitle: "Mac 桌面悬浮球",
    productBody: "每天 10 点自动弹出战报，平时安静悬浮在桌面边缘。点击小足球即可展开 dashboard。",
    productAutoTitle: "每日自动展示",
    productAutoBody: "早上自动提醒最新战况，错过比赛也能快速补课。",
    productQuietTitle: "轻量不打扰",
    productQuietBody: "收起后只保留桌面小足球，不占用工作流注意力。",
    productClickTitle: "一键展开",
    productClickBody: "点击悬浮球展开战报、比分、赛程和设置。",
    ctaTitle: "把世界杯放回桌面。",
    rankLabel: "排名",
    teamLabel: "球队",
    playedLabel: "场次",
    wonLabel: "胜",
    drawnLabel: "平",
    lostLabel: "负",
    goalsForLabel: "进球",
    goalsAgainstLabel: "失球",
    goalDifferenceLabel: "净胜球",
    pointsLabel: "积分",
    fallbackNotice: "数据暂未更新，当前显示示例数据",
    scheduled: "Scheduled",
    live: "LIVE",
    fullTime: "FT",
    noGoals: "暂无进球信息",
    venue: "场馆",
    assists: "助攻",
    penalties: "点球",
    allMatches: "全部",
    allGroups: "全部小组",
    groupStage: "小组赛",
    knockoutStage: "淘汰赛",
    today: "今日",
    finished: "已结束",
    upcoming: "未开始",
    previewNextTitle: "接下来比赛",
    previewFocusTitle: "焦点比赛",
    previewRecentTitle: "最近赛果",
    previewWatchTitle: "看点解析",
    previewEmptyNext: "暂无已确定的后续比赛",
    previewEmptyRecent: "暂无最近赛果",
    previewNoFocus: "暂无明确焦点比赛",
    previewGroupRank: "小组排名",
    sortGoals: "进球数",
    expandAll: "展开全部",
    collapse: "收起"
  },
  en: {
    documentTitle: "WorldCup Gadget - Desktop World Cup Floating Ball",
    navDownload: "Download",
    heroTitle: "World Cup action,\nelegantly unfolding on your desktop.",
    heroSubtitle: "Live scores, group tables, fixtures, and top scorers in one polished view.",
    downloadLatest: "Download Latest",
    releaseNote: "Free beta distribution through GitHub Pages + GitHub Releases.",
    liveTitle: "Live Scores and Recent Results",
    liveBody: "Live matches get a LIVE badge, while recent full-time results keep scores and goal events visible.",
    standingsTitle: "Group Tables",
    standingsBody: "Cumulative group ranking, form, goal difference, and points since the tournament opened.",
    bracketTitle: "Fixture Preview",
    bracketBody: "Upcoming matches, qualification stakes, and recent results stay focused here. The full schedule remains below.",
    scheduleTitle: "Full Schedule / Tournament Map",
    scheduleBody: "Browse every group and knockout fixture with stage and status filters.",
    scorersTitle: "Goal Leaders",
    scorersBody: "Cumulative tournament goals with player portraits where a public source is available.",
    productTitle: "Mac Desktop Floating Ball",
    productBody: "The report can appear automatically at 10 AM, then stay quiet as a floating ball on your desktop edge.",
    productAutoTitle: "Daily Auto Show",
    productAutoBody: "Catch up every morning even when you missed the match overnight.",
    productQuietTitle: "Lightweight and Quiet",
    productQuietBody: "Collapsed mode keeps only the desktop soccer ball and stays out of your workflow.",
    productClickTitle: "Click to Expand",
    productClickBody: "Open the dashboard, scores, schedule, and settings from the floating ball.",
    ctaTitle: "Bring the World Cup back to your desktop.",
    rankLabel: "Rank",
    teamLabel: "Team",
    playedLabel: "P",
    wonLabel: "W",
    drawnLabel: "D",
    lostLabel: "L",
    goalsForLabel: "GF",
    goalsAgainstLabel: "GA",
    goalDifferenceLabel: "GD",
    pointsLabel: "Pts",
    fallbackNotice: "Data has not updated yet. Showing sample data.",
    scheduled: "Scheduled",
    live: "LIVE",
    fullTime: "FT",
    noGoals: "No goal events yet",
    venue: "Venue",
    assists: "Assists",
    penalties: "Penalties",
    allMatches: "All",
    allGroups: "All Groups",
    groupStage: "Group Stage",
    knockoutStage: "Knockout",
    today: "Today",
    finished: "Finished",
    upcoming: "Upcoming",
    previewNextTitle: "Next Fixtures",
    previewFocusTitle: "Featured Match",
    previewRecentTitle: "Recent Results",
    previewWatchTitle: "What to Watch",
    previewEmptyNext: "No confirmed upcoming fixtures yet",
    previewEmptyRecent: "No recent results yet",
    previewNoFocus: "No clear featured match yet",
    previewGroupRank: "Group rank",
    sortGoals: "Goals",
    expandAll: "Expand All",
    collapse: "Collapse"
  }
};

const groupNames = Array.from({ length: 12 }, (_, index) => `Group ${String.fromCharCode(65 + index)}`);
const fallbackGroupTeams = {
  "Group A": ["Mexico", "Korea Republic", "South Africa", "Czechia"],
  "Group B": ["Switzerland", "Canada", "Bosnia and Herzegovina", "Qatar"],
  "Group C": ["Brazil", "Morocco", "Scotland", "Haiti"],
  "Group D": ["USA", "Türkiye", "Australia", "Paraguay"],
  "Group E": ["Germany", "Ecuador", "Côte d'Ivoire", "Curaçao"],
  "Group F": ["Netherlands", "Japan", "Sweden", "Tunisia"],
  "Group G": ["Spain", "Uruguay", "Cape Verde", "Saudi Arabia"],
  "Group H": ["England", "Belgium", "Ghana", "Panama"],
  "Group I": ["France", "Norway", "Senegal", "Iraq"],
  "Group J": ["Argentina", "Croatia", "Egypt", "New Zealand"],
  "Group K": ["Colombia", "Portugal", "DR Congo", "Saudi Arabia"],
  "Group L": ["Uruguay", "Denmark", "Serbia", "Chile"]
};
const bracketSpecs = [
  ["Round of 32", 16],
  ["Round of 16", 8],
  ["Quarter-finals", 4],
  ["Semi-finals", 2],
  ["Third-place match", 1],
  ["Final", 1]
];

const inlineFallbackData = {
  live: {
    isFallback: true,
    notice: "数据暂未更新，当前显示示例数据",
    matches: [
      {
        id: "inline-1",
        stage: "Group Stage",
        status: "LIVE",
        minute: "67",
        venue: "New York New Jersey Stadium",
        home: { name: "Argentina", code: "ARG", flag: "🇦🇷", score: 2 },
        away: { name: "France", code: "FRA", flag: "🇫🇷", score: 1 },
        goals: [
          { team: "ARG", player: "Messi", minute: "23'" },
          { team: "FRA", player: "Mbappé", minute: "51'" },
          { team: "ARG", player: "Alvarez", minute: "64'" }
        ]
      }
    ]
  },
  standings: {
    isFallback: true,
    groups: [
      {
        group: "Group A",
        rows: [
          { rank: 1, team: "Argentina", flag: "🇦🇷", played: 2, won: 2, drawn: 0, lost: 0, goalsFor: 5, goalsAgainst: 1, goalDifference: 4, points: 6 },
          { rank: 2, team: "France", flag: "🇫🇷", played: 2, won: 1, drawn: 0, lost: 1, goalsFor: 3, goalsAgainst: 3, goalDifference: 0, points: 3 }
        ]
      }
    ]
  },
  schedule: {
    isFallback: true,
    matches: [
      {
        id: "inline-schedule-1",
        date: "2026-06-26",
        time: "北京时间 2026-06-26 04:00",
        stage: "Group E",
        venue: "Philadelphia Stadium",
        status: "Scheduled",
        score: "",
        home: { name: "Ecuador", code: "ECU", flag: "🇪🇨", score: null },
        away: { name: "Germany", code: "GER", flag: "🇩🇪", score: null }
      }
    ]
  },
  bracket: {
    isFallback: true,
    rounds: [
      {
        name: "Round of 32",
        matches: [
          {
            id: "inline-bracket-1",
            status: "TBD",
            home: { name: "TBD", code: "TBD", flag: "🏳️", score: null },
            away: { name: "TBD", code: "TBD", flag: "🏳️", score: null }
          }
        ]
      }
    ]
  },
  scorers: {
    isFallback: true,
    players: [
      { rank: 1, player: "Messi", team: "Argentina", flag: "🇦🇷", goals: 2, assists: 1, penalties: null },
      { rank: 2, player: "Mbappé", team: "France", flag: "🇫🇷", goals: 1, assists: 0, penalties: null }
    ]
  }
};

let currentLanguage = "zh";
let pageData = inlineFallbackData;
let activeMatchIndex = 0;
let activeGroupIndex = 0;
let showAllScorers = false;
let countUpStarted = false;
let revealObserver = null;

function t(key) {
  return translations[currentLanguage][key] || translations.zh[key] || key;
}

function getInitialLanguage() {
  const storedLanguage = localStorage.getItem("worldcup-gadget-language");
  if (storedLanguage === "zh" || storedLanguage === "en") return storedLanguage;
  return navigator.language.toLowerCase().startsWith("zh") ? "zh" : "en";
}

function applyLanguage(language) {
  currentLanguage = language;
  const dictionary = translations[language] || translations.zh;

  document.documentElement.lang = language === "zh" ? "zh-CN" : "en";
  document.body.dataset.lang = language;
  document.title = dictionary.documentTitle;

  document.querySelectorAll("[data-i18n]").forEach((element) => {
    const key = element.dataset.i18n;
    if (dictionary[key]) element.textContent = dictionary[key];
  });

  document.querySelectorAll("[data-lang-toggle]").forEach((button) => {
    const isActive = button.dataset.langToggle === language;
    button.setAttribute("aria-selected", String(isActive));
  });

  localStorage.setItem("worldcup-gadget-language", language);
  renderAll();
}

function dataUrl(fileName) {
  return new URL(`data/${fileName}`, window.location.href).href;
}

function fallbackStandingRow(team, rank) {
  return {
    rank,
    team,
    flag: "🏳️",
    played: 0,
    won: 0,
    drawn: 0,
    lost: 0,
    goalsFor: 0,
    goalsAgainst: 0,
    goalDifference: 0,
    points: 0
  };
}

function normalizedGroups() {
  const groups = pageData.standings?.groups || [];
  const byGroup = new Map(groups.map((group) => [group.group, group]));
  return groupNames.map((groupName) => {
    const rows = byGroup.get(groupName)?.rows || [];
    const fallbackTeams = fallbackGroupTeams[groupName] || [];
    return {
      group: groupName,
      rows: Array.from({ length: 4 }, (_, index) => ({
        ...fallbackStandingRow(fallbackTeams[index] || "TBD", index + 1),
        ...(rows[index] || {}),
        rank: rows[index]?.rank || index + 1
      }))
    };
  });
}

function playerName(player) {
  return typeof player?.player === "object" ? player.player.name : player?.player || "Unknown";
}

function playerPhoto(player) {
  return typeof player?.player === "object" ? player.player.photo : "";
}

function playerTeam(player) {
  if (typeof player?.team === "object") return player.team;
  return { name: player?.team || "TBD", flag: player?.flag || "🏳️", code: "" };
}

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function teamFlagHtml(team = {}) {
  const flag = escapeHtml(team.flag || "🏳️");
  if (team.flagUrl) {
    return `<span class="flag-wrap"><img class="flag-icon" src="${escapeHtml(team.flagUrl)}" alt="" loading="lazy" onerror="this.hidden=true;this.nextElementSibling.hidden=false"><span class="flag-emoji" hidden>${flag}</span></span>`;
  }
  return `<span class="flag-emoji">${flag}</span>`;
}

function teamLabelHtml(team = {}, options = {}) {
  const label = escapeHtml(options.code ? team.code || team.name || team.team || "TBD" : team.name || team.team || "TBD");
  const flag = teamFlagHtml(team);
  const parts = options.reverse ? [`<span>${label}</span>`, flag] : [flag, `<span>${label}</span>`];
  return `<span class="team-label">${parts.join("")}</span>`;
}

function markDynamicVisible(root) {
  if (!root) return;
  root.querySelectorAll(":scope > *").forEach((item) => item.classList.add("is-visible"));
}

function isGroupStage(stage) {
  return /^Group\s+[A-L]$/i.test(stage || "");
}

function stageOrder(stage) {
  const groupIndex = groupNames.indexOf(stage);
  if (groupIndex >= 0) return groupIndex;
  const roundIndex = bracketSpecs.findIndex(([name]) => name === stage);
  if (roundIndex >= 0) return 100 + roundIndex;
  return 200;
}

function normalizeLookupName(value) {
  return String(value || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/gi, " ")
    .trim()
    .toLowerCase();
}

function standingsLookup() {
  const byName = new Map();
  (pageData.standings?.groups || []).forEach((group) => {
    (group.rows || []).forEach((row) => {
      byName.set(normalizeLookupName(row.team), { group: group.group, ...row });
    });
  });
  return byName;
}

function standingForTeam(team, lookup = standingsLookup()) {
  return lookup.get(normalizeLookupName(team?.name)) || null;
}

function namedTeamMatch(match) {
  return !/^TBD$/i.test(match?.home?.name || "") && !/^TBD$/i.test(match?.away?.name || "");
}

function matchTimeLabel(match) {
  return escapeHtml(match?.time || match?.date || "");
}

function matchImportance(match, lookup) {
  const home = standingForTeam(match.home, lookup);
  const away = standingForTeam(match.away, lookup);
  const knownTeams = new Set(["Argentina", "Brazil", "France", "Germany", "Spain", "England", "Portugal", "Netherlands", "Uruguay", "Mexico", "USA"]);
  let score = match.status === "LIVE" ? 100 : 0;
  if (isGroupStage(match.stage)) score += 20;
  if (knownTeams.has(match.home?.name)) score += 10;
  if (knownTeams.has(match.away?.name)) score += 10;
  if (home && away) {
    score += Math.max(0, 8 - Math.abs(home.points - away.points));
    if (home.rank <= 3) score += 8;
    if (away.rank <= 3) score += 8;
    if (home.group === away.group) score += 6;
  }
  return score;
}

function previewBullets(match, lookup) {
  if (!match) return [t("previewNoFocus")];
  const home = standingForTeam(match.home, lookup);
  const away = standingForTeam(match.away, lookup);
  const bullets = [];

  if (home && away) {
    bullets.push(currentLanguage === "zh"
      ? `${match.stage}：${match.home.name} 第 ${home.rank} 名/${home.points} 分，${match.away.name} 第 ${away.rank} 名/${away.points} 分。`
      : `${match.stage}: ${match.home.name} are ${home.rank} with ${home.points} pts; ${match.away.name} are ${away.rank} with ${away.points} pts.`);
    if (home.rank <= 3 || away.rank <= 3) {
      bullets.push(currentLanguage === "zh"
        ? "这场会直接影响小组前列排序，适合作为下一轮重点关注。"
        : "This directly affects the top of the group and is worth prioritizing.");
    }
    if (Math.abs(home.points - away.points) <= 2) {
      bullets.push(currentLanguage === "zh"
        ? "两队积分接近，净胜球和直接对话结果都可能改变排名。"
        : "The points gap is narrow, so goal difference and the head-to-head result can swing the table.");
    }
  } else {
    bullets.push(currentLanguage === "zh"
      ? `${match.stage || "World Cup"} 的后续赛程已确定，开球时间为 ${match.time || match.date || "TBD"}。`
      : `${match.stage || "World Cup"} is confirmed with kickoff at ${match.time || match.date || "TBD"}.`);
  }

  if (bullets.length < 3) {
    bullets.push(currentLanguage === "zh"
      ? `比赛地点：${match.venue || "TBD"}。`
      : `Venue: ${match.venue || "TBD"}.`);
  }
  return bullets.slice(0, 3);
}

async function fetchJson(fileName) {
  const response = await fetch(dataUrl(fileName), { cache: "no-store" });
  if (!response.ok) throw new Error(`${fileName} returned ${response.status}`);
  return response.json();
}

async function loadData() {
  try {
    const [live, standings, schedule, bracket, scorers] = await Promise.all([
      fetchJson("worldcup-live.json"),
      fetchJson("worldcup-standings.json"),
      fetchJson("worldcup-schedule.json"),
      fetchJson("worldcup-bracket.json"),
      fetchJson("worldcup-scorers.json")
    ]);
    pageData = { live, standings, schedule, bracket, scorers };
  } catch (error) {
    console.warn("[worldcup-site] Falling back to inline data:", error);
    pageData = inlineFallbackData;
  }

  renderAll();
}

function statusLabel(status) {
  if (status === "LIVE") return t("live");
  if (status === "FT") return t("fullTime");
  if (status === "Scheduled") return t("scheduled");
  return status || t("scheduled");
}

function scoreText(match) {
  const homeScore = match?.home?.score;
  const awayScore = match?.away?.score;
  if (homeScore === null || homeScore === undefined || awayScore === null || awayScore === undefined) {
    return "vs";
  }
  return `${homeScore} - ${awayScore}`;
}

function goalsText(match) {
  const goals = match?.goals || [];
  if (!goals.length) return t("noGoals");
  return goals.map((goal) => `${goal.minute} ${goal.player}`).join(" · ");
}

function matchMeta(match) {
  const pieces = [match?.stage || "World Cup"];
  if (match?.minute && match.status === "LIVE") pieces.push(`${match.minute}'`);
  pieces.push(statusLabel(match?.status));
  return pieces.join(" · ");
}

function activeMatch() {
  const matches = pageData.live?.matches || [];
  return matches[activeMatchIndex] || matches[0] || inlineFallbackData.live.matches[0];
}

function renderNotice() {
  const notice = document.getElementById("dataNotice");
  const isFallback = Object.values(pageData).some((value) => value?.isFallback);
  if (!notice) return;
  notice.hidden = !isFallback;
  notice.textContent = isFallback ? t("fallbackNotice") : "";
}

function renderPitch() {
  const match = activeMatch();
  document.getElementById("pitchHome").innerHTML = teamLabelHtml(match.home);
  document.getElementById("pitchAway").innerHTML = teamLabelHtml(match.away, { reverse: true });
  document.getElementById("pitchScore").textContent = scoreText(match);
  document.getElementById("pitchStage").textContent = matchMeta(match);
  document.getElementById("pitchGoals").textContent = goalsText(match);

  const ticker = document.getElementById("matchTicker");
  ticker.innerHTML = "";
  (pageData.live?.matches || []).slice(0, 6).forEach((item, index) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = `ticker-card${index === activeMatchIndex ? " is-active" : ""}`;
    button.innerHTML = `
      ${teamLabelHtml(item.home, { code: true })}
      <strong>${scoreText(item)}</strong>
      ${teamLabelHtml(item.away, { code: true, reverse: true })}
    `;
    button.addEventListener("click", () => {
      activeMatchIndex = index;
      renderPitch();
    });
    ticker.append(button);
  });
}

function renderLiveMatches() {
  const grid = document.getElementById("liveMatchGrid");
  grid.innerHTML = "";
  (pageData.live?.matches || []).forEach((match, index) => {
    const card = document.createElement("article");
    card.className = "match-card";
    card.style.setProperty("--delay", `${index * 60}ms`);
    card.innerHTML = `
      <div class="card-topline">
        <span>${match.stage || "World Cup"}</span>
        <span class="status-badge ${match.status === "LIVE" ? "live" : ""}">${statusLabel(match.status)}</span>
      </div>
      <div class="match-scoreline">
        ${teamLabelHtml(match.home)}
        <strong>${scoreText(match)}</strong>
        ${teamLabelHtml(match.away, { reverse: true })}
      </div>
      <p>${goalsText(match)}</p>
    `;
    grid.append(card);
  });
}

function renderStandings() {
  const groups = normalizedGroups();
  const tabs = document.getElementById("groupTabs");
  const body = document.getElementById("standingsBody");
  tabs.innerHTML = "";
  body.innerHTML = "";

  groups.forEach((group, index) => {
    const button = document.createElement("button");
    button.type = "button";
    button.role = "tab";
    button.textContent = group.group;
    button.setAttribute("aria-selected", String(index === activeGroupIndex));
    button.addEventListener("click", () => {
      activeGroupIndex = index;
      renderStandings();
    });
    tabs.append(button);
  });

  const activeGroup = groups[activeGroupIndex] || groups[0];
  (activeGroup?.rows || []).forEach((row, index) => {
    const tr = document.createElement("tr");
    tr.className = row.rank <= 2 ? "qualifies" : row.rank === 3 ? "third-place" : "";
    tr.style.setProperty("--delay", `${index * 45}ms`);
    tr.innerHTML = `
      <td>${row.rank}</td>
      <td class="team-cell">${teamLabelHtml(row)}</td>
      <td>${row.played}</td>
      <td>${row.won}</td>
      <td>${row.drawn}</td>
      <td>${row.lost}</td>
      <td>${row.goalsFor}</td>
      <td>${row.goalsAgainst}</td>
      <td>${row.goalDifference}</td>
      <td><strong>${row.points}</strong></td>
    `;
    body.append(tr);
  });
}

function renderPreview() {
  const flow = document.getElementById("previewFlow");
  if (!flow) return;
  flow.innerHTML = "";
  const matches = pageData.schedule?.matches || [];
  const byTimeAsc = (left, right) => String(left.time || left.date || "").localeCompare(String(right.time || right.date || ""));
  const byTimeDesc = (left, right) => String(right.time || right.date || "").localeCompare(String(left.time || left.date || ""));
  const lookup = standingsLookup();
  const finished = matches.filter((match) => match.status === "FT" && namedTeamMatch(match)).sort(byTimeDesc).slice(0, 4);
  const next = matches
    .filter((match) => match.status === "LIVE" || match.status === "Scheduled")
    .filter(namedTeamMatch)
    .sort(byTimeAsc)
    .slice(0, 5);
  const focus = [...next].sort((left, right) => matchImportance(right, lookup) - matchImportance(left, lookup))[0] || next[0] || null;

  const nextItems = next.length ? next.map((match) => `
    <article class="preview-match">
      <small>${escapeHtml(match.stage || "World Cup")} · ${matchTimeLabel(match)}</small>
      <strong>${teamLabelHtml(match.home)} <span class="versus">vs</span> ${teamLabelHtml(match.away, { reverse: true })}</strong>
      <em>${escapeHtml(match.venue || "TBD")}</em>
    </article>
  `).join("") : `<p class="preview-empty">${t("previewEmptyNext")}</p>`;

  const recentItems = finished.length ? finished.map((match) => `
    <article class="preview-result">
      <small>${escapeHtml(match.stage || "World Cup")} · ${escapeHtml(match.date || "")}</small>
      <strong>${teamLabelHtml(match.home)} <b>${match.score || scoreText(match)}</b> ${teamLabelHtml(match.away, { reverse: true })}</strong>
      <em>${escapeHtml(goalsText(match))}</em>
    </article>
  `).join("") : `<p class="preview-empty">${t("previewEmptyRecent")}</p>`;

  const focusMarkup = focus ? `
    <div class="focus-scoreline">
      ${teamLabelHtml(focus.home)}
      <strong>vs</strong>
      ${teamLabelHtml(focus.away, { reverse: true })}
    </div>
    <p>${escapeHtml(focus.stage || "World Cup")} · ${matchTimeLabel(focus)}</p>
    <ul>
      ${previewBullets(focus, lookup).map((point) => `<li>${escapeHtml(point)}</li>`).join("")}
    </ul>
  ` : `<p class="preview-empty">${t("previewNoFocus")}</p>`;

  flow.innerHTML = `
    <article class="preview-panel">
      <h3>${t("previewNextTitle")}</h3>
      <div class="preview-list">${nextItems}</div>
    </article>
    <article class="preview-panel preview-focus">
      <h3>${t("previewFocusTitle")}</h3>
      ${focusMarkup}
    </article>
    <article class="preview-panel">
      <h3>${t("previewRecentTitle")}</h3>
      <div class="preview-list">${recentItems}</div>
    </article>
  `;
  markDynamicVisible(flow);
}

function initials(name) {
  return String(name || "?")
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}

function renderScorers() {
  const players = [...(pageData.scorers?.players || [])].sort((a, b) => {
    return Number(b.goals || 0) - Number(a.goals || 0) || playerName(a).localeCompare(playerName(b));
  }).map((player, index) => ({ ...player, rank: index + 1 }));
  const podium = document.getElementById("podiumGrid");
  const list = document.getElementById("scorerList");
  const toggleButton = document.getElementById("toggleScorers");
  podium.innerHTML = "";
  list.innerHTML = "";
  toggleButton.textContent = showAllScorers ? t("collapse") : t("expandAll");
  toggleButton.onclick = () => {
    showAllScorers = !showAllScorers;
    renderScorers();
  };

  players.slice(0, 3).forEach((player, index) => {
    const name = playerName(player);
    const photo = playerPhoto(player);
    const team = playerTeam(player);
    const card = document.createElement("article");
    card.className = "podium-card";
    card.style.setProperty("--delay", `${index * 80}ms`);
    card.innerHTML = `
      <div class="avatar ${photo ? "has-photo" : ""}">${photo ? `<img src="${escapeHtml(photo)}" alt="" loading="lazy" onerror="this.parentElement.classList.remove('has-photo'); this.remove()">` : ""}<span>${initials(name)}</span></div>
      <span>#${player.rank} ${teamLabelHtml(team)}</span>
      <h3>${escapeHtml(name)}</h3>
      <strong data-count="${player.goals}">0</strong>
      <p>${t("sortGoals")}</p>
    `;
    podium.append(card);
  });

  const visibleRows = showAllScorers ? players : players.slice(0, 20);
  visibleRows.forEach((player) => {
    const name = playerName(player);
    const photo = playerPhoto(player);
    const team = playerTeam(player);
    const row = document.createElement("article");
    row.className = "scorer-row";
    row.innerHTML = `
      <span>#${player.rank}</span>
      <div class="avatar small ${photo ? "has-photo" : ""}">${photo ? `<img src="${escapeHtml(photo)}" alt="" loading="lazy" onerror="this.parentElement.classList.remove('has-photo'); this.remove()">` : ""}<span>${initials(name)}</span></div>
      <strong>${escapeHtml(name)}</strong>
      <em>${teamLabelHtml(team)}</em>
      <b>${player.goals}</b>
    `;
    list.append(row);
  });

  markDynamicVisible(podium);
  markDynamicVisible(list);
  countUpStarted = false;
  observeCountUp();
}

function renderAll() {
  renderNotice();
  renderPitch();
  renderLiveMatches();
  renderStandings();
  renderPreview();
  renderScorers();
  requestAnimationFrame(setupReveal);
}

function setupReveal() {
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const revealItems = document.querySelectorAll(".reveal, .stagger > *");
  if (reducedMotion) {
    revealItems.forEach((item) => item.classList.add("is-visible"));
    return;
  }

  if (revealObserver) revealObserver.disconnect();
  revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const delay = entry.target.dataset.revealDelay || entry.target.style.getPropertyValue("--delay") || "0ms";
          entry.target.style.transitionDelay = delay;
          entry.target.classList.add("is-visible");
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.16 }
  );

  revealItems.forEach((item) => revealObserver.observe(item));
}

function observeCountUp() {
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const counters = document.querySelectorAll("[data-count]");
  if (reducedMotion) {
    counters.forEach((counter) => {
      counter.textContent = counter.dataset.count;
    });
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    if (countUpStarted) return;
    if (!entries.some((entry) => entry.isIntersecting)) return;
    countUpStarted = true;
    counters.forEach((counter) => {
      const target = Number(counter.dataset.count || 0);
      let frame = 0;
      const totalFrames = 24;
      const tick = () => {
        frame += 1;
        counter.textContent = String(Math.round((target * frame) / totalFrames));
        if (frame < totalFrames) requestAnimationFrame(tick);
      };
      tick();
    });
  }, { threshold: 0.3 });

  counters.forEach((counter) => observer.observe(counter));
}

function setupParallax() {
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reducedMotion) return;

  const pitch = document.querySelector(".pitch-shell");
  window.addEventListener(
    "scroll",
    () => {
      const offset = Math.min(window.scrollY * 0.04, 28);
      if (pitch) pitch.style.transform = `translateY(${offset}px)`;
    },
    { passive: true }
  );
}

document.querySelectorAll("[data-lang-toggle]").forEach((button) => {
  button.addEventListener("click", () => {
    applyLanguage(button.dataset.langToggle);
  });
});

applyLanguage(getInitialLanguage());
setupParallax();
loadData();
