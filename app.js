(function () {
  "use strict";

  const $ = (id) => document.getElementById(id);

  class DataReadError extends Error {}
  class DataFormatError extends Error {}

  function element(tag, className, text) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined) node.textContent = String(text);
    return node;
  }

  function array(value) {
    return Array.isArray(value) ? value : [];
  }

  function appendEmpty(container, message) {
    container.append(element("div", "empty-state", message));
  }

  function normalizeTeam(team) {
    if (team && typeof team === "object") {
      const hasScore = team.score !== null && team.score !== undefined && team.score !== "";
      return {
        name: team.name || "TBD",
        flag: team.flag || "🏳️",
        score: hasScore && Number.isFinite(Number(team.score)) ? Number(team.score) : null,
        scorers: array(team.scorers)
      };
    }

    return {
      name: typeof team === "string" && team ? team : "TBD",
      flag: "🏳️",
      score: null,
      scorers: []
    };
  }

  function scorerSuffix(type) {
    if (type === "penalty") return " (P)";
    if (type === "own_goal") return " (OG)";
    return "";
  }

  function createTeam(team, align) {
    const wrapper = element("div", `team-block team-block--${align}`);
    wrapper.append(
      element("span", "team__flag", team.flag),
      element("span", "team__name", team.name)
    );
    return wrapper;
  }

  function createScorers(team, align) {
    const list = element("div", `scorers scorers--${align}`);
    if (!team.scorers.length) {
      list.append(element("span", "scorer scorer--empty", "无进球"));
      return list;
    }

    team.scorers.forEach((scorer) => {
      const player = scorer && scorer.player ? scorer.player : "未知球员";
      const minute = scorer && scorer.minute ? ` ${scorer.minute}` : "";
      const suffix = scorerSuffix(scorer && scorer.type);
      list.append(element("span", "scorer", `${player}${minute}${suffix}`));
    });
    return list;
  }

  function renderMatches(matches) {
    const container = $("matches");
    container.replaceChildren();
    $("matches-count").textContent = `${matches.length} 场比赛`;

    if (!matches.length) {
      appendEmpty(container, "昨日暂无比赛数据");
      return;
    }

    matches.forEach((match) => {
      const teamA = normalizeTeam(match.team_a);
      const teamB = normalizeTeam(match.team_b);
      const status = match.status || "TBD";
      const statusKey = ["FT", "HT", "Live"].includes(status) ? status.toLowerCase() : "tbd";
      const card = element("article", "match-card");
      const meta = element("div", "match__meta");
      const statusBadge = element("span", `match__status match__status--${statusKey}`, status);
      meta.append(
        element("span", "match__group", match.group || "Group --"),
        element("span", "match__venue", match.venue || "场地待定"),
        statusBadge
      );

      const scoreboard = element("div", "scoreboard");
      const scoreA = teamA.score === null ? "–" : teamA.score;
      const scoreB = teamB.score === null ? "–" : teamB.score;
      scoreboard.append(
        createTeam(teamA, "left"),
        element("span", "score", `${scoreA} - ${scoreB}`),
        createTeam(teamB, "right")
      );

      const scorers = element("div", "scorers-grid");
      scorers.append(createScorers(teamA, "left"), createScorers(teamB, "right"));
      card.append(meta, scoreboard, scorers);

      const highlights = array(match.highlights);
      if (highlights.length) {
        const list = element("ul", "highlights");
        highlights.slice(0, 2).forEach((highlight) => list.append(element("li", "", highlight)));
        card.append(list);
      }
      container.append(card);
    });
  }

  function renderFixtures(fixtures) {
    const container = $("fixtures");
    container.replaceChildren();

    if (!fixtures.length) {
      appendEmpty(container, "今日暂无赛程数据");
      return;
    }

    fixtures.forEach((fixture) => {
      const teamA = normalizeTeam(fixture.team_a);
      const teamB = normalizeTeam(fixture.team_b);
      const card = element("article", "fixture");
      const body = element("div", "fixture__body");
      const teams = element("div", "fixture__teams");
      teams.append(
        element("span", "fixture__team", `${teamA.flag} ${teamA.name}`),
        element("span", "versus", "VS"),
        element("span", "fixture__team", `${teamB.flag} ${teamB.name}`)
      );
      body.append(teams, element("div", "fixture__group", fixture.group || "Group --"));
      card.append(
        element("time", "fixture__time", String(fixture.time_bj || "--:--").replace("北京时间 ", "")),
        body
      );
      container.append(card);
    });
  }

  function renderStandings(changes) {
    const container = $("standings");
    container.replaceChildren();
    if (!changes.length) {
      container.append(element("li", "", "暂无积分或出线形势变化"));
      return;
    }
    changes.forEach((change) => container.append(element("li", "", change)));
  }

  function safeUrl(value) {
    try {
      const url = new URL(value);
      return ["http:", "https:"].includes(url.protocol) ? url.href : "#";
    } catch (_error) {
      return "#";
    }
  }

  function renderNews(news) {
    const container = $("news");
    container.replaceChildren();
    if (!news.length) {
      appendEmpty(container, "暂无重点新闻");
      return;
    }

    news.forEach((item) => {
      const link = element("a", "news-item");
      link.href = safeUrl(item && item.url);
      link.target = "_blank";
      link.rel = "noopener noreferrer";
      link.append(
        element("span", "news__title", `${(item && item.title) || "未命名新闻"} ↗`),
        element("span", "news__source", (item && item.source) || "Local Source")
      );
      container.append(link);
    });
  }

  function render(data) {
    if (!data || typeof data !== "object" || Array.isArray(data)) throw new DataFormatError();

    $("updated-at").textContent = `更新时间：${data.updated_at || "北京时间未知"}`;
    $("date-range").textContent = data.date_range || "--";
    $("summary").textContent = data.summary || "暂无昨日概览。";
    renderMatches(array(data.matches));
    renderFixtures(array(data.today_fixtures));
    renderStandings(array(data.standings_changes));
    renderNews(array(data.news));
    $("data-source").textContent = "数据文件：data/latest.json";
  }

  function showError(message) {
    const toast = $("error-toast");
    toast.textContent = message;
    toast.hidden = false;
    $("updated-at").textContent = "本地数据读取失败";
  }

  async function loadData() {
    try {
      const response = await fetch("./data/latest.json", { cache: "no-store" });
      if (!response.ok) throw new DataReadError();
      try {
        return await response.json();
      } catch (_error) {
        throw new DataFormatError();
      }
    } catch (error) {
      if (error instanceof DataFormatError) throw error;
      // Chromium 对 file:// fetch 有额外限制；open_dashboard.sh 会生成这份本地缓存。
      if (window.WORLDCUP_DATA) return window.WORLDCUP_DATA;
      throw new DataReadError();
    }
  }

  loadData()
    .then(render)
    .catch((error) => {
      if (error instanceof DataFormatError) {
        showError("数据格式错误，请检查 latest.json。");
      } else {
        showError("无法读取 data/latest.json，请确认数据文件存在。");
      }
    });
})();
