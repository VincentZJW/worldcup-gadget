const translations = {
  zh: {
    documentTitle: "WorldCup Gadget - 世界杯桌面悬浮球",
    navDownload: "下载",
    heroTitle: "世界杯战况，在你的桌面优雅展开。",
    heroSubtitle: "实时比分、小组积分、赛程与进球榜，一屏掌握。",
    downloadLatest: "下载最新版",
    releaseNote: "免费 beta 通过 GitHub Pages + GitHub Releases 分发。",
    liveTitle: "实时比分与最近赛果",
    liveBody: "正在进行的比赛会显示 LIVE 标记，最近结束的比赛会保留比分和进球信息。",
    standingsTitle: "小组积分",
    standingsBody: "按小组切换查看排名、胜平负、净胜球和积分，晋级区高亮显示。",
    bracketTitle: "淘汰赛对阵",
    bracketBody: "如果淘汰赛尚未开始，会先显示 TBD 占位；数据更新后自动替换为真实对阵。",
    scheduleTitle: "赛程安排",
    scheduleBody: "按日期查看未来赛程和已结束比分，包含阶段、场馆和状态。",
    scorersTitle: "进球榜",
    scorersBody: "前三名以高亮卡片展示，后续球员以紧凑列表呈现。",
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
    penalties: "点球"
  },
  en: {
    documentTitle: "WorldCup Gadget - Desktop World Cup Floating Ball",
    navDownload: "Download",
    heroTitle: "World Cup action, elegantly unfolding on your desktop.",
    heroSubtitle: "Live scores, group tables, fixtures, and top scorers in one polished view.",
    downloadLatest: "Download Latest",
    releaseNote: "Free beta distribution through GitHub Pages + GitHub Releases.",
    liveTitle: "Live Scores and Recent Results",
    liveBody: "Live matches get a LIVE badge, while recent full-time results keep scores and goal events visible.",
    standingsTitle: "Group Standings",
    standingsBody: "Switch groups to inspect ranking, form, goal difference, and points with qualification spots highlighted.",
    bracketTitle: "Knockout Bracket",
    bracketBody: "If knockout fixtures have not started, TBD placeholders stay in place until real data arrives.",
    scheduleTitle: "Schedule",
    scheduleBody: "Browse fixtures by date with time, stage, venue, status, and finished scores.",
    scorersTitle: "Top Scorers",
    scorersBody: "The top three players get spotlight cards, followed by a compact scoring list.",
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
    penalties: "Penalties"
  }
};

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
  const groups = pageData.standings?.groups || [];
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
    tr.className = row.rank <= 2 ? "qualifies" : "";
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
}

function renderBracket() {
  const flow = document.getElementById("bracketFlow");
  flow.innerHTML = "";
  (pageData.bracket?.rounds || []).forEach((round, roundIndex) => {
    const column = document.createElement("div");
    column.className = "bracket-round";
    column.style.setProperty("--delay", `${roundIndex * 100}ms`);
    column.innerHTML = `<h3>${round.name}</h3>`;
    (round.matches || []).forEach((match) => {
      const item = document.createElement("article");
      item.className = "bracket-card";
      item.innerHTML = `
        <div><span>${match.home?.flag || "🏳️"} ${match.home?.name || "TBD"}</span><strong>${match.home?.score ?? ""}</strong></div>
        <div><span>${match.away?.flag || "🏳️"} ${match.away?.name || "TBD"}</span><strong>${match.away?.score ?? ""}</strong></div>
        <small>${statusLabel(match.status)}</small>
      `;
      column.append(item);
    });
    flow.append(column);
  });
}

function renderSchedule() {
  const list = document.getElementById("scheduleList");
  list.innerHTML = "";
  const grouped = new Map();
  (pageData.schedule?.matches || []).forEach((match) => {
    const key = match.date || "TBD";
    if (!grouped.has(key)) grouped.set(key, []);
    grouped.get(key).push(match);
  });

  [...grouped.entries()].slice(0, 6).forEach(([date, matches], dateIndex) => {
    const group = document.createElement("div");
    group.className = "schedule-day";
    group.style.setProperty("--delay", `${dateIndex * 70}ms`);
    group.innerHTML = `<h3>${date}</h3>`;
    matches.slice(0, 6).forEach((match) => {
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
  const players = pageData.scorers?.players || [];
  const podium = document.getElementById("podiumGrid");
  const list = document.getElementById("scorerList");
  podium.innerHTML = "";
  list.innerHTML = "";

  players.slice(0, 3).forEach((player, index) => {
    const card = document.createElement("article");
    card.className = "podium-card";
    card.style.setProperty("--delay", `${index * 80}ms`);
    card.innerHTML = `
      <div class="avatar">${initials(player.player)}</div>
      <span>#${player.rank} ${player.flag} ${player.team}</span>
      <h3>${player.player}</h3>
      <strong data-count="${player.goals}">0</strong>
      <p>${t("assists")}: ${player.assists ?? 0}${player.penalties !== null && player.penalties !== undefined ? ` · ${t("penalties")}: ${player.penalties}` : ""}</p>
    `;
    podium.append(card);
  });

  players.slice(3, 12).forEach((player) => {
    const row = document.createElement("article");
    row.className = "scorer-row";
    row.innerHTML = `
      <span>#${player.rank}</span>
      <strong>${player.player}</strong>
      <em>${player.flag} ${player.team}</em>
      <b>${player.goals}</b>
    `;
    list.append(row);
  });

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

document.querySelectorAll("[data-lang-toggle]").forEach((button) => {
  button.addEventListener("click", () => {
    applyLanguage(button.dataset.langToggle);
  });
});

applyLanguage(getInitialLanguage());
setupParallax();
loadData();
