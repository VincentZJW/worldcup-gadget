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
    bracketTitle: "全部对阵图",
    bracketBody: "从小组赛到淘汰赛，展示世界杯开赛以来和后续赛程的全部对阵。",
    scheduleTitle: "完整赛程 / Tournament Map",
    scheduleBody: "查看小组赛和淘汰赛全部比赛，可按阶段与状态快速筛选。",
    scorersTitle: "球员数据榜",
    scorersBody: "统计开赛以来所有球员的总进球数；助攻、点球和出场时间在数据源提供时同步展示。",
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
    sortByLabel: "排序",
    sortGoals: "进球数",
    sortAssists: "助攻数",
    sortPenalties: "点球数",
    sortMinutes: "出场时间",
    sortTeam: "球队",
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
    bracketTitle: "Full Match Map",
    bracketBody: "Every matchup from group stage through the knockout rounds, including completed results and upcoming fixtures.",
    scheduleTitle: "Full Schedule / Tournament Map",
    scheduleBody: "Browse every group and knockout fixture with stage and status filters.",
    scorersTitle: "Stat Leaders",
    scorersBody: "Cumulative player goals since kickoff, with assists, penalties, and minutes shown when the data source provides them.",
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
    sortByLabel: "Sort",
    sortGoals: "Goals",
    sortAssists: "Assists",
    sortPenalties: "Penalties",
    sortMinutes: "Minutes",
    sortTeam: "Team",
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
let scheduleFilter = "all";
let scorerSort = "goals";
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

function blankBracketMatch(roundName, index) {
  return {
    id: `${roundName}-${index + 1}`,
    stage: roundName,
    date: "",
    time: "",
    status: "TBD",
    home: { name: "TBD", flag: "🏳️", code: "TBD", score: null },
    away: { name: "TBD", flag: "🏳️", code: "TBD", score: null },
    winner: null
  };
}

function normalizedBracketRounds() {
  const rounds = pageData.bracket?.rounds || [];
  const byRound = new Map(rounds.map((round) => [round.name, round]));
  return bracketSpecs.map(([name, count]) => ({
    name,
    matches: Array.from({ length: count }, (_, index) => ({
      ...blankBracketMatch(name, index),
      ...(byRound.get(name)?.matches?.[index] || {})
    }))
  }));
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

function markDynamicVisible(root) {
  if (!root) return;
  root.querySelectorAll(":scope > *").forEach((item) => item.classList.add("is-visible"));
}

function isGroupStage(stage) {
  return /^Group\s+[A-L]$/i.test(stage || "");
}

function currentBeijingDateKey() {
  const formatter = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Shanghai",
    year: "numeric",
    month: "2-digit",
    day: "2-digit"
  });
  return formatter.format(new Date());
}

function stageOrder(stage) {
  const groupIndex = groupNames.indexOf(stage);
  if (groupIndex >= 0) return groupIndex;
  const roundIndex = bracketSpecs.findIndex(([name]) => name === stage);
  if (roundIndex >= 0) return 100 + roundIndex;
  return 200;
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
  document.getElementById("pitchHome").textContent = `${match.home.flag} ${match.home.name}`;
  document.getElementById("pitchAway").textContent = `${match.away.name} ${match.away.flag}`;
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
      <span>${item.home.flag} ${item.home.code}</span>
      <strong>${scoreText(item)}</strong>
      <span>${item.away.code} ${item.away.flag}</span>
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
        <span>${match.home.flag} ${match.home.name}</span>
        <strong>${scoreText(match)}</strong>
        <span>${match.away.name} ${match.away.flag}</span>
      </div>
      <p>${goalsText(match)}</p>
    `;
    grid.append(card);
  });
}

function renderStandings() {
  const groups = normalizedGroups();
  const overview = document.getElementById("groupOverview");
  const tabs = document.getElementById("groupTabs");
  const body = document.getElementById("standingsBody");
  overview.innerHTML = "";
  tabs.innerHTML = "";
  body.innerHTML = "";

  groups.forEach((group, index) => {
    const card = document.createElement("button");
    card.type = "button";
    card.className = `group-card${index === activeGroupIndex ? " is-active" : ""}`;
    card.style.setProperty("--delay", `${index * 35}ms`);
    const leader = group.rows[0];
    card.innerHTML = `
      <strong>${group.group}</strong>
      <span>${leader?.flag || "🏳️"} ${leader?.team || "TBD"} · ${leader?.points ?? 0} pts</span>
      ${group.rows
        .slice(0, 4)
        .map((row) => `<em class="${row.rank <= 2 ? "qualifies" : row.rank === 3 ? "third-place" : ""}">${row.rank}. ${row.flag || "🏳️"} ${row.team} · ${row.played}P · ${row.points}</em>`)
        .join("")}
    `;
    card.addEventListener("click", () => {
      activeGroupIndex = index;
      renderStandings();
    });
    overview.append(card);
  });

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
      <td class="team-cell">${row.flag} ${row.team}</td>
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

  markDynamicVisible(overview);
}

function renderBracket() {
  const flow = document.getElementById("bracketFlow");
  flow.innerHTML = "";
  const matches = pageData.schedule?.matches || [];
  const grouped = new Map();
  matches.forEach((match) => {
    const stage = match.stage || "World Cup";
    if (!grouped.has(stage)) grouped.set(stage, []);
    grouped.get(stage).push(match);
  });

  const stages = [...grouped.keys()].sort((left, right) => stageOrder(left) - stageOrder(right) || left.localeCompare(right));
  stages.forEach((stage, roundIndex) => {
    const stageMatches = [...(grouped.get(stage) || [])].sort((left, right) =>
      String(left.time || left.date || "").localeCompare(String(right.time || right.date || ""))
    );
    const column = document.createElement("div");
    column.className = "bracket-round";
    column.style.setProperty("--delay", `${roundIndex * 100}ms`);
    column.innerHTML = `<h3>${stage}</h3>`;
    stageMatches.forEach((match) => {
      const item = document.createElement("article");
      item.className = "bracket-card";
      const homeWins = match.winner === match.home?.code || (match.status === "FT" && Number(match.home?.score) > Number(match.away?.score));
      const awayWins = match.winner === match.away?.code || (match.status === "FT" && Number(match.away?.score) > Number(match.home?.score));
      item.innerHTML = `
        <small>${match.time || match.date || stage} · ${statusLabel(match.status)}</small>
        <div class="${homeWins ? "winner" : ""}"><span>${match.home?.flag || "🏳️"} ${match.home?.name || "TBD"}</span><strong>${match.home?.score ?? ""}</strong></div>
        <b>${match.score || "vs"}</b>
        <div class="${awayWins ? "winner" : ""}"><span>${match.away?.flag || "🏳️"} ${match.away?.name || "TBD"}</span><strong>${match.away?.score ?? ""}</strong></div>
      `;
      column.append(item);
    });
    flow.append(column);
  });
  markDynamicVisible(flow);
}

function renderSchedule() {
  const list = document.getElementById("scheduleList");
  const filters = document.getElementById("scheduleFilters");
  list.innerHTML = "";
  filters.innerHTML = "";
  const filterOptions = [
    ["all", t("allMatches")],
    ["group", t("groupStage")],
    ["knockout", t("knockoutStage")],
    ["today", t("today")],
    ["finished", t("finished")],
    ["upcoming", t("upcoming")]
  ];
  filterOptions.forEach(([value, label]) => {
    const button = document.createElement("button");
    button.type = "button";
    button.textContent = label;
    button.setAttribute("aria-selected", String(scheduleFilter === value));
    button.addEventListener("click", () => {
      scheduleFilter = value;
      renderSchedule();
    });
    filters.append(button);
  });

  const todayKey = currentBeijingDateKey();
  const filteredMatches = (pageData.schedule?.matches || []).filter((match) => {
    const isGroup = isGroupStage(match.stage);
    const isFinished = match.status === "FT";
    const isUpcoming = match.status === "Scheduled" || match.status === "TBD";
    if (scheduleFilter === "group") return isGroup;
    if (scheduleFilter === "knockout") return !isGroup;
    if (scheduleFilter === "today") return match.date === todayKey;
    if (scheduleFilter === "finished") return isFinished;
    if (scheduleFilter === "upcoming") return isUpcoming;
    return true;
  });

  const grouped = new Map();
  filteredMatches.forEach((match) => {
    const key = match.date || match.stage || "TBD";
    if (!grouped.has(key)) grouped.set(key, []);
    grouped.get(key).push(match);
  });

  [...grouped.entries()].forEach(([date, matches], dateIndex) => {
    const group = document.createElement("div");
    group.className = "schedule-day";
    group.style.setProperty("--delay", `${dateIndex * 70}ms`);
    group.innerHTML = `<h3>${date}</h3>`;
    matches.forEach((match) => {
      const item = document.createElement("article");
      item.className = "schedule-item";
      item.innerHTML = `
        <div>
          <strong>${match.home.flag} ${match.home.name} ${match.score || "vs"} ${match.away.name} ${match.away.flag}</strong>
          <span>${match.stage || "World Cup"} · ${t("venue")}: ${match.venue || "TBD"}</span>
        </div>
        <div>
          <span>${match.time || ""}</span>
          <em>${statusLabel(match.status)}</em>
        </div>
      `;
      group.append(item);
    });
    list.append(group);
  });
  markDynamicVisible(list);
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
    if (scorerSort === "team") return playerTeam(a).name.localeCompare(playerTeam(b).name);
    return Number(b[scorerSort] || 0) - Number(a[scorerSort] || 0) || Number(b.goals || 0) - Number(a.goals || 0);
  }).map((player, index) => ({ ...player, rank: index + 1 }));
  const podium = document.getElementById("podiumGrid");
  const list = document.getElementById("scorerList");
  const sortSelect = document.getElementById("scorerSort");
  const toggleButton = document.getElementById("toggleScorers");
  podium.innerHTML = "";
  list.innerHTML = "";
  sortSelect.value = scorerSort;
  toggleButton.textContent = showAllScorers ? t("collapse") : t("expandAll");
  sortSelect.onchange = () => {
    scorerSort = sortSelect.value;
    renderScorers();
  };
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
      <div class="avatar ${photo ? "has-photo" : ""}">${photo ? `<img src="${photo}" alt="" loading="lazy" onerror="this.parentElement.classList.remove('has-photo'); this.remove()">` : ""}<span>${initials(name)}</span></div>
      <span>#${player.rank} ${team.flag} ${team.name}</span>
      <h3>${name}</h3>
      <strong data-count="${player.goals}">0</strong>
      <p>${t("assists")}: ${player.assists ?? "—"} · ${t("penalties")}: ${player.penalties ?? "—"}${player.minutes ? ` · ${player.minutes}′` : ""}</p>
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
      <div class="avatar small ${photo ? "has-photo" : ""}">${photo ? `<img src="${photo}" alt="" loading="lazy" onerror="this.parentElement.classList.remove('has-photo'); this.remove()">` : ""}<span>${initials(name)}</span></div>
      <strong>${name}</strong>
      <em>${team.flag} ${team.name}</em>
      <small>${t("assists")}: ${player.assists ?? "—"} · ${t("penalties")}: ${player.penalties ?? "—"}${player.minutes ? ` · ${player.minutes}′` : ""}</small>
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
  renderBracket();
  renderSchedule();
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

function setupMapControls() {
  const flow = document.getElementById("bracketFlow");
  const prev = document.getElementById("mapPrev");
  const next = document.getElementById("mapNext");
  if (!flow || !prev || !next) return;
  const scrollByColumn = (direction) => {
    const firstColumn = flow.querySelector(".bracket-round");
    const amount = firstColumn ? firstColumn.getBoundingClientRect().width + 18 : 360;
    flow.scrollBy({ left: direction * amount, behavior: "smooth" });
  };
  prev.addEventListener("click", () => scrollByColumn(-1));
  next.addEventListener("click", () => scrollByColumn(1));
}

document.querySelectorAll("[data-lang-toggle]").forEach((button) => {
  button.addEventListener("click", () => {
    applyLanguage(button.dataset.langToggle);
  });
});

applyLanguage(getInitialLanguage());
setupParallax();
setupMapControls();
loadData();
