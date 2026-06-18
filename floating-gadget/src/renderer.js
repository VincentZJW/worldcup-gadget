(function () {
  "use strict";

  const ballView = document.getElementById("ball-view");
  const panelView = document.getElementById("panel-view");
  const ballButton = document.getElementById("ball-button");
  const collapseButton = document.getElementById("collapse-button");
  const refreshButton = document.getElementById("refresh-button");
  const moreButton = document.getElementById("more-button");
  const latestContainer = document.getElementById("latest-match");
  const allMatchesContainer = document.getElementById("all-matches");
  const allMatchesSection = document.getElementById("all-matches-section");
  const statusMessage = document.getElementById("status-message");
  const updatedAt = document.getElementById("updated-at");
  const matchCount = document.getElementById("match-count");

  const LONG_PRESS_MS = 360;

  let showingAll = false;
  let statusTimer = null;
  let longPressTimer = null;
  let activePointerId = null;
  let pressStartPoint = null;
  let latestPointerPoint = null;
  let draggingBall = false;
  let suppressNextBallClick = false;

  function element(tag, className, text) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined) node.textContent = String(text);
    return node;
  }

  function asArray(value) {
    return Array.isArray(value) ? value : [];
  }

  function pointerPoint(event) {
    return {
      screenX: Math.round(event.screenX),
      screenY: Math.round(event.screenY)
    };
  }

  function clearLongPressTimer() {
    if (!longPressTimer) return;
    window.clearTimeout(longPressTimer);
    longPressTimer = null;
  }

  function setBallDraggingVisualState(isDragging) {
    ballView.classList.toggle("ball-view--pressing", Boolean(pressStartPoint && !isDragging));
    ballView.classList.toggle("ball-view--dragging", isDragging);
    ballButton.setAttribute(
      "aria-label",
      isDragging ? "正在拖动世界杯悬浮球" : "展开世界杯战报"
    );
  }

  function resetBallPointerState() {
    clearLongPressTimer();
    activePointerId = null;
    pressStartPoint = null;
    latestPointerPoint = null;
    draggingBall = false;
    setBallDraggingVisualState(false);
  }

  async function beginBallDrag() {
    if (!pressStartPoint || draggingBall) return;

    draggingBall = true;
    suppressNextBallClick = true;
    setBallDraggingVisualState(true);

    try {
      await window.gadgetAPI.startWindowDrag(latestPointerPoint || pressStartPoint);
    } catch (_error) {
      resetBallPointerState();
      suppressNextBallClick = false;
    }
  }

  function onBallPointerDown(event) {
    if (event.button !== 0 || document.body.dataset.mode !== "ball") return;

    activePointerId = event.pointerId;
    pressStartPoint = pointerPoint(event);
    latestPointerPoint = pressStartPoint;
    setBallDraggingVisualState(false);

    try {
      ballButton.setPointerCapture(event.pointerId);
    } catch (_error) {
      // Pointer capture is a convenience here; custom drag still works without it.
    }

    clearLongPressTimer();
    longPressTimer = window.setTimeout(() => {
      longPressTimer = null;
      beginBallDrag();
    }, LONG_PRESS_MS);
  }

  function onBallPointerMove(event) {
    if (activePointerId !== event.pointerId || !pressStartPoint) return;

    latestPointerPoint = pointerPoint(event);
    if (!draggingBall) return;

    event.preventDefault();
    window.gadgetAPI.moveWindowDrag(latestPointerPoint);
  }

  function onBallPointerEnd(event) {
    if (activePointerId !== event.pointerId) return;

    const wasDragging = draggingBall;
    clearLongPressTimer();

    if (wasDragging) {
      event.preventDefault();
      window.gadgetAPI.endWindowDrag().catch(() => {});
    }

    try {
      ballButton.releasePointerCapture(event.pointerId);
    } catch (_error) {
      // It is fine if capture was already released by the browser.
    }

    resetBallPointerState();

    if (wasDragging) {
      window.setTimeout(() => {
        suppressNextBallClick = false;
      }, 140);
    }
  }

  async function showBallActions(event) {
    event.preventDefault();
    clearLongPressTimer();
    if (draggingBall) {
      await window.gadgetAPI.endWindowDrag().catch(() => {});
    }
    resetBallPointerState();
    suppressNextBallClick = false;
    await window.gadgetAPI.showBallActionsDialog().catch(() => {});
  }

  function normalizeTeam(team) {
    const source = team && typeof team === "object" ? team : {};
    const hasScore = source.score !== null && source.score !== undefined && source.score !== "";
    return {
      name: source.name || "TBD",
      flag: source.flag || "🏳️",
      score: hasScore && Number.isFinite(Number(source.score)) ? Number(source.score) : "–",
      scorers: asArray(source.scorers)
    };
  }

  function scorerText(scorer) {
    const player = scorer && scorer.player ? scorer.player : "未知球员";
    const minute = scorer && scorer.minute ? ` ${scorer.minute}` : "";
    const suffix = scorer && scorer.type === "penalty"
      ? " (P)"
      : scorer && scorer.type === "own_goal"
        ? " (OG)"
        : "";
    return `${player}${minute}${suffix}`;
  }

  function latestFinishedMatch(matches) {
    const validMatches = asArray(matches).filter((match) => match && typeof match === "object");
    const timedMatches = validMatches.filter(
      (match) => typeof match.finished_at_bj === "string" && match.finished_at_bj.trim()
    );

    if (timedMatches.length) {
      return [...timedMatches].sort((a, b) =>
        a.finished_at_bj.localeCompare(b.finished_at_bj, "zh-CN")
      )[timedMatches.length - 1];
    }

    return validMatches[validMatches.length - 1] || null;
  }

  function createScorerList(team, align) {
    const list = element("div", `scorer-list scorer-list--${align}`);
    if (!team.scorers.length) {
      list.append(element("span", "scorer scorer--empty", "无进球"));
      return list;
    }
    team.scorers.forEach((scorer) => list.append(element("span", "scorer", scorerText(scorer))));
    return list;
  }

  function createTeam(team, align) {
    const wrapper = element("div", `team team--${align}`);
    wrapper.append(
      element("span", "team__flag", team.flag),
      element("span", "team__name", team.name)
    );
    return wrapper;
  }

  function createMatchCard(match, featured) {
    const teamA = normalizeTeam(match.team_a);
    const teamB = normalizeTeam(match.team_b);
    const card = element("article", `match-card${featured ? " match-card--featured" : ""}`);

    const meta = element("div", "match-meta");
    const metaLeft = element("div", "match-meta__left");
    metaLeft.append(
      element("span", "group-label", match.group || "Group --"),
      element("span", "venue-label", match.venue || "场地待定")
    );
    const status = String(match.status || "TBD");
    const statusKey = status.toLowerCase() === "live" ? "live" : "default";
    meta.append(metaLeft, element("span", `status-badge status-badge--${statusKey}`, status));

    const scoreRow = element("div", "score-row");
    scoreRow.append(
      createTeam(teamA, "left"),
      element("span", "score-value", `${teamA.score} - ${teamB.score}`),
      createTeam(teamB, "right")
    );

    const scorers = element("div", "scorers-grid");
    scorers.append(createScorerList(teamA, "left"), createScorerList(teamB, "right"));
    card.append(meta, scoreRow, scorers);

    const highlights = asArray(match.highlights).slice(0, 2);
    if (highlights.length) {
      const list = element("ul", "highlights");
      highlights.forEach((highlight) => list.append(element("li", "", highlight)));
      card.append(list);
    }

    return card;
  }

  function setError(code) {
    if (statusTimer) window.clearTimeout(statusTimer);
    showingAll = false;
    allMatchesSection.hidden = true;
    moreButton.setAttribute("aria-expanded", "false");
    moreButton.querySelector("span").textContent = "查看更多";
    moreButton.querySelector(".more-button__arrow").textContent = "↓";
    const message = code === "INVALID_JSON"
      ? "战报数据格式错误，请检查 latest.json。"
      : "未找到战报数据，请先生成 data/latest.json。";
    statusMessage.textContent = message;
    statusMessage.className = "status-message status-message--error";
    statusMessage.hidden = false;
    latestContainer.replaceChildren();
    allMatchesContainer.replaceChildren();
    moreButton.hidden = true;
    updatedAt.textContent = "本地战报不可用";
  }

  function showRefreshSuccess() {
    if (statusTimer) window.clearTimeout(statusTimer);
    statusMessage.textContent = "已刷新 · latest.json 数据已重新载入";
    statusMessage.className = "status-message status-message--success";
    statusMessage.hidden = false;
    statusTimer = window.setTimeout(() => {
      statusMessage.hidden = true;
      statusTimer = null;
    }, 1600);
  }

  function renderReport(data) {
    const matches = asArray(data.matches);
    const latest = latestFinishedMatch(matches);

    statusMessage.hidden = true;
    updatedAt.textContent = `更新时间 · ${data.updated_at || "未知"}`;
    latestContainer.replaceChildren();
    allMatchesContainer.replaceChildren();
    matchCount.textContent = `${matches.length} MATCHES`;

    if (latest) {
      latestContainer.append(createMatchCard(latest, true));
    } else {
      latestContainer.append(element("div", "empty-state", "暂无已结束比赛数据。"));
    }

    matches.forEach((match) => allMatchesContainer.append(createMatchCard(match, false)));
    moreButton.hidden = matches.length === 0;
  }

  async function readReport(method) {
    refreshButton.disabled = true;
    refreshButton.textContent = "读取中";
    try {
      const result = await window.gadgetAPI[method]();
      if (!result || !result.ok) {
        setError(result && result.error);
        return;
      }
      renderReport(result.data);
      if (method === "refreshReport") showRefreshSuccess();
    } catch (_error) {
      setError("READ_FAILED");
    } finally {
      refreshButton.disabled = false;
      refreshButton.textContent = "刷新";
    }
  }

  async function expandPanel() {
    await window.gadgetAPI.expandWindow();
    document.body.dataset.mode = "panel";
    ballView.hidden = true;
    panelView.hidden = false;
    await readReport("readLatestReport");
  }

  async function collapsePanel() {
    showingAll = false;
    moreButton.setAttribute("aria-expanded", "false");
    moreButton.querySelector("span").textContent = "查看更多";
    moreButton.querySelector(".more-button__arrow").textContent = "↓";
    allMatchesSection.hidden = true;
    panelView.hidden = true;
    ballView.hidden = false;
    document.body.dataset.mode = "ball";
    await window.gadgetAPI.collapseWindow();
  }

  function toggleAllMatches() {
    showingAll = !showingAll;
    allMatchesSection.hidden = !showingAll;
    moreButton.setAttribute("aria-expanded", String(showingAll));
    moreButton.querySelector("span").textContent = showingAll ? "只看最新" : "查看更多";
    moreButton.querySelector(".more-button__arrow").textContent = showingAll ? "↑" : "↓";
  }

  ballButton.addEventListener("pointerdown", onBallPointerDown);
  ballButton.addEventListener("pointermove", onBallPointerMove);
  ballButton.addEventListener("pointerup", onBallPointerEnd);
  ballButton.addEventListener("pointercancel", onBallPointerEnd);
  ballButton.addEventListener("lostpointercapture", () => {
    if (!draggingBall) resetBallPointerState();
  });
  ballView.addEventListener("contextmenu", showBallActions);
  ballButton.addEventListener("click", (event) => {
    if (suppressNextBallClick) {
      event.preventDefault();
      event.stopPropagation();
      suppressNextBallClick = false;
      return;
    }
    expandPanel();
  });
  collapseButton.addEventListener("click", collapsePanel);
  refreshButton.addEventListener("click", () => readReport("refreshReport"));
  moreButton.addEventListener("click", toggleAllMatches);

  window.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && document.body.dataset.mode === "panel") collapsePanel();
  });
})();
