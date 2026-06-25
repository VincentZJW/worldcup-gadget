#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";

const DEFAULT_API_BASE_URL = "https://api.fifa.com/api/v3";
const DEFAULT_COMPETITION_ID = "17";
const DEFAULT_SEASON_ID = "285023";
const DEFAULT_STAGE_ID = "289273";
const DEFAULT_LOCALE = "en";
const DEFAULT_LOOKBACK_DAYS = 3;
const DEFAULT_LOOKAHEAD_DAYS = 2;
const RECENT_MATCH_LIMIT = 8;
const TOURNAMENT_START_ISO = "2026-06-11T00:00:00Z";
const TOURNAMENT_END_ISO = "2026-07-20T23:59:59Z";
const USER_AGENT = "worldcup-gadget-feed/1.0 (+https://github.com/VincentZJW/worldcup-gadget)";

const ISO3_TO_ISO2 = Object.freeze({
  AFG: "AF",
  ALB: "AL",
  ALG: "DZ",
  ARG: "AR",
  AUS: "AU",
  AUT: "AT",
  BEL: "BE",
  BIH: "BA",
  BRA: "BR",
  CAN: "CA",
  CIV: "CI",
  COL: "CO",
  COD: "CD",
  CPV: "CV",
  CRO: "HR",
  CUW: "CW",
  CZE: "CZ",
  ECU: "EC",
  EGY: "EG",
  ENG: "GB",
  ESP: "ES",
  FRA: "FR",
  GER: "DE",
  GHA: "GH",
  HAI: "HT",
  IRN: "IR",
  IRQ: "IQ",
  JOR: "JO",
  JPN: "JP",
  KOR: "KR",
  KSA: "SA",
  MAR: "MA",
  MEX: "MX",
  NED: "NL",
  NOR: "NO",
  NZL: "NZ",
  PAN: "PA",
  PAR: "PY",
  POR: "PT",
  QAT: "QA",
  RSA: "ZA",
  SCO: "GB",
  SEN: "SN",
  SUI: "CH",
  SWE: "SE",
  TUN: "TN",
  TUR: "TR",
  URU: "UY",
  USA: "US",
  UZB: "UZ"
});

const SPECIAL_FLAGS = Object.freeze({
  ENG: "🏴",
  SCO: "🏴"
});

const TEAM_ZH = Object.freeze({
  Algeria: "阿尔及利亚",
  Argentina: "阿根廷",
  Australia: "澳大利亚",
  Austria: "奥地利",
  Belgium: "比利时",
  "Bosnia and Herzegovina": "波黑",
  Brazil: "巴西",
  Canada: "加拿大",
  Colombia: "哥伦比亚",
  "Congo DR": "刚果民主共和国",
  "Costa Rica": "哥斯达黎加",
  Croatia: "克罗地亚",
  Curaçao: "库拉索",
  "Czech Republic": "捷克",
  "Côte d'Ivoire": "科特迪瓦",
  "DR Congo": "刚果民主共和国",
  Ecuador: "厄瓜多尔",
  Egypt: "埃及",
  England: "英格兰",
  France: "法国",
  Germany: "德国",
  Ghana: "加纳",
  Haiti: "海地",
  Iran: "伊朗",
  Iraq: "伊拉克",
  Japan: "日本",
  Jordan: "约旦",
  Korea: "韩国",
  Mexico: "墨西哥",
  Morocco: "摩洛哥",
  Netherlands: "荷兰",
  "New Zealand": "新西兰",
  Norway: "挪威",
  Panama: "巴拿马",
  Paraguay: "巴拉圭",
  Portugal: "葡萄牙",
  Qatar: "卡塔尔",
  "Saudi Arabia": "沙特阿拉伯",
  Scotland: "苏格兰",
  Senegal: "塞内加尔",
  "South Africa": "南非",
  Spain: "西班牙",
  Sweden: "瑞典",
  Switzerland: "瑞士",
  Tunisia: "突尼斯",
  Türkiye: "土耳其",
  Uruguay: "乌拉圭",
  USA: "美国",
  Uzbekistan: "乌兹别克斯坦"
});

function parseArgs(argv) {
  const options = {};
  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (!arg.startsWith("--")) continue;
    const [key, inlineValue] = arg.split("=", 2);
    if (inlineValue !== undefined) {
      options[key.slice(2)] = inlineValue;
    } else if (argv[index + 1] && !argv[index + 1].startsWith("--")) {
      options[key.slice(2)] = argv[index + 1];
      index += 1;
    } else {
      options[key.slice(2)] = true;
    }
  }
  return options;
}

function numberOption(value, fallback) {
  const number = Number(value);
  return Number.isFinite(number) ? number : fallback;
}

function addDays(date, days) {
  const next = new Date(date);
  next.setUTCDate(next.getUTCDate() + days);
  return next;
}

function addMinutes(date, minutes) {
  return new Date(date.getTime() + minutes * 60 * 1000);
}

function dateOnly(date) {
  return date.toISOString().slice(0, 10);
}

function startOfUtcDay(date) {
  return new Date(`${dateOnly(date)}T00:00:00Z`);
}

function endOfUtcDay(date) {
  return new Date(`${dateOnly(date)}T23:59:59Z`);
}

function beijingParts(date) {
  const formatter = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Shanghai",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23"
  });
  return Object.fromEntries(formatter.formatToParts(date).map((part) => [part.type, part.value]));
}

function formatBeijingTime(date) {
  const parts = beijingParts(date);
  return `北京时间 ${parts.year}-${parts.month}-${parts.day} ${parts.hour}:${parts.minute}`;
}

function beijingDate(date) {
  const parts = beijingParts(date);
  return `${parts.year}-${parts.month}-${parts.day}`;
}

function localized(list, fallback = "") {
  if (!Array.isArray(list)) return fallback;
  const preferred = list.find((item) => item && item.Locale === "en-GB")
    || list.find((item) => item && item.Locale && item.Locale.startsWith("en"))
    || list[0];
  return preferred && typeof preferred.Description === "string" && preferred.Description.trim()
    ? preferred.Description.trim()
    : fallback;
}

function displayNameFromFifa(rawName) {
  if (!rawName) return "";
  const trimmed = String(rawName).trim();
  return trimmed.replace(/[\p{L}][\p{L}'’-]*/gu, (word) => {
    const letters = word.replace(/[^\p{L}]/gu, "");
    if (letters.length <= 1 || letters !== letters.toLocaleUpperCase("en")) return word;
    return word
      .toLocaleLowerCase("en")
      .replace(/^\p{L}/u, (match) => match.toLocaleUpperCase("en"));
  });
}

function teamName(team) {
  return localized(team && team.TeamName, team && (team.ShortClubName || team.Abbreviation) || "TBD");
}

function teamZhName(name) {
  return TEAM_ZH[name] || name;
}

function flagFromTeam(team) {
  const code = team && (team.IdCountry || team.IdAssociation || team.Abbreviation);
  if (!code) return "🏳️";
  if (SPECIAL_FLAGS[code]) return SPECIAL_FLAGS[code];
  const iso2 = ISO3_TO_ISO2[code] || (code.length === 2 ? code : "");
  if (!iso2 || iso2.length !== 2) return "🏳️";
  return iso2
    .toUpperCase()
    .replace(/./g, (char) => String.fromCodePoint(127397 + char.charCodeAt(0)));
}

function teamPayload(team) {
  const name = teamName(team);
  return {
    name,
    flag: flagFromTeam(team),
    score: Number.isFinite(Number(team && team.Score)) ? Number(team.Score) : null,
    scorers: [],
    name_zh: teamZhName(name),
    name_en: name
  };
}

function scoreOf(match, side) {
  const team = side === "home" ? match.Home : match.Away;
  const direct = side === "home" ? match.HomeTeamScore : match.AwayTeamScore;
  const value = Number.isFinite(Number(direct)) ? direct : team && team.Score;
  return Number.isFinite(Number(value)) ? Number(value) : null;
}

function isFutureMatch(match, now) {
  return new Date(match.Date) > now;
}

function statusText(match) {
  const textFromValue = (value) => {
    if (typeof value === "string") return value;
    if (Array.isArray(value)) return localized(value, "");
    if (value && typeof value === "object") {
      return [
        textFromValue(value.Name),
        textFromValue(value.Description),
        textFromValue(value.ShortName),
        textFromValue(value.Type),
        textFromValue(value.Value),
        textFromValue(value.Code)
      ].filter(Boolean).join(" ");
    }
    return value === null || value === undefined ? "" : String(value);
  };
  const values = [
    match.Status,
    match.MatchStatus,
    match.MatchStatusName,
    match.MatchStatusLocalized,
    match.MatchStatusText,
    match.Period,
    match.MatchPeriod,
    match.Phase
  ];
  return values
    .map(textFromValue)
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
}

function hasMatchScores(match) {
  return scoreOf(match, "home") !== null && scoreOf(match, "away") !== null;
}

function matchMinute(match) {
  const raw = match.MatchTime || match.MatchMinute || match.Minute || match.CurrentMinute || "";
  const text = String(raw).trim();
  if (!text) return "";
  if (/^\d+$/.test(text)) return `${text}'`;
  return text;
}

function hasFinishedStatus(match) {
  const text = statusText(match);
  return /\b(ft|full[-\s]?time|finished|final|completed|ended|played|post[-\s]?match)\b/i.test(text);
}

function hasLiveStatus(match) {
  const text = statusText(match);
  return /\b(live|in[-\s]?progress|first half|second half|half[-\s]?time|extra time|penalties)\b/i.test(text)
    || Boolean(matchMinute(match));
}

function estimatedFinished(match, now) {
  return now >= matchEndEstimate(match);
}

function statusOf(match, now) {
  if (hasFinishedStatus(match)) return "FT";
  if (isFutureMatch(match, now)) return "SCHEDULED";
  if (hasMatchScores(match)) return estimatedFinished(match, now) ? "FT" : "LIVE";
  if (hasLiveStatus(match)) return "LIVE";
  return "LIVE";
}

function isFinishedMatch(match, now) {
  return statusOf(match, now) === "FT";
}

function isLiveMatch(match, now) {
  return statusOf(match, now) === "LIVE";
}

function matchEndEstimate(match) {
  const kickoff = new Date(match.Date);
  if (!Number.isFinite(kickoff.getTime())) return new Date();
  const minuteText = typeof match.MatchTime === "string" ? match.MatchTime : "";
  const minutes = Number(minuteText.match(/\d+/)?.[0]);
  return addMinutes(kickoff, Number.isFinite(minutes) ? Math.max(105, minutes + 15) : 120);
}

function eventDescription(event) {
  return localized(event && event.EventDescription, "");
}

function extractPlayerName(event) {
  const description = eventDescription(event);
  if (!description) return "Unknown player";
  const beforeTeam = description.split(" (")[0];
  const beforeVerb = beforeTeam
    .replace(/\s+scores.*$/i, "")
    .replace(/\s+converts.*$/i, "")
    .trim();
  return displayNameFromFifa(beforeVerb || beforeTeam || description);
}

function eventLabel(event) {
  return localized(event && event.TypeLocalized, "");
}

function isGoalEvent(event) {
  const label = eventLabel(event).toLowerCase();
  return event.Type === 0 || event.Type === 34 || label === "goal!" || label === "goal" || label.includes("own goal");
}

function isOwnGoalEvent(event) {
  return event.Type === 34 || eventLabel(event).toLowerCase().includes("own goal");
}

function goalSideFromEvent(event, match, previousScore) {
  const homeGoals = Number(event.HomeGoals);
  const awayGoals = Number(event.AwayGoals);
  if (Number.isFinite(homeGoals) && homeGoals > previousScore.home) return "home";
  if (Number.isFinite(awayGoals) && awayGoals > previousScore.away) return "away";
  if (event.IdTeam === (match.Home && match.Home.IdTeam)) return "home";
  if (event.IdTeam === (match.Away && match.Away.IdTeam)) return "away";
  return "home";
}

async function requestJson(apiBaseUrl, resource, params, headers = {}) {
  const url = new URL(resource.replace(/^\//, ""), `${apiBaseUrl.replace(/\/$/, "")}/`);
  if (params) {
    for (const [key, value] of params.entries()) {
      url.searchParams.set(key, value);
    }
  }

  let lastError = null;
  for (let attempt = 1; attempt <= 3; attempt += 1) {
    try {
      const response = await fetch(url, {
        headers: {
          Accept: "application/json",
          "User-Agent": USER_AGENT,
          ...headers
        }
      });

      if (!response.ok) {
        throw new Error(`${response.status} ${response.statusText} from ${url.toString()}`);
      }

      return response.json();
    } catch (error) {
      lastError = error;
      if (attempt < 3) {
        await new Promise((resolve) => setTimeout(resolve, attempt * 750));
      }
    }
  }

  throw lastError;
}

async function fetchPaginatedResults(apiBaseUrl, resource, params) {
  const results = [];
  const seenHashes = new Set();
  let continuationHash = null;
  let continuationToken = null;

  do {
    const requestParams = new URLSearchParams(params);
    const headers = {};
    if (continuationHash && continuationToken) {
      seenHashes.add(continuationHash);
      requestParams.set("continuationhash", continuationHash);
      headers["x-mdp-continuation-token"] = continuationToken;
    }

    const payload = await requestJson(apiBaseUrl, resource, requestParams, headers);
    if (!payload || !Array.isArray(payload.Results)) break;
    results.push(...payload.Results);
    continuationHash = payload.ContinuationHash || null;
    continuationToken = payload.ContinuationToken || null;
  } while (continuationHash && continuationToken && !seenHashes.has(continuationHash));

  return results;
}

async function fetchMatches(apiBaseUrl, config, fromDate, toDate) {
  const params = new URLSearchParams([
    ["from", `${dateOnly(startOfUtcDay(fromDate))}T00:00:00Z`],
    ["to", `${dateOnly(endOfUtcDay(toDate))}T23:59:59Z`],
    ["language", config.locale],
    ["count", "500"],
    ["idCompetition", config.competitionId],
    ["idSeason", config.seasonId]
  ]);
  return fetchPaginatedResults(apiBaseUrl, "calendar/matches", params);
}

async function fetchTimeline(apiBaseUrl, matchId, locale) {
  try {
    const payload = await requestJson(apiBaseUrl, `timelines/${matchId}`, new URLSearchParams([["language", locale]]));
    return Array.isArray(payload && payload.Event) ? payload.Event : [];
  } catch (error) {
    console.warn(`Timeline unavailable for ${matchId}: ${error.message}`);
    return [];
  }
}

async function fetchStandings(apiBaseUrl, config) {
  const params = new URLSearchParams([
    ["language", config.locale],
    ["count", "200"]
  ]);
  return fetchPaginatedResults(
    apiBaseUrl,
    `calendar/${config.competitionId}/${config.seasonId}/${config.stageId}/standing`,
    params
  );
}

function applyGoalEvents(match, reportMatch, events) {
  const previousScore = { home: 0, away: 0 };
  const sortedEvents = [...events].sort((left, right) => {
    const leftTime = new Date(left.Timestamp || 0).getTime();
    const rightTime = new Date(right.Timestamp || 0).getTime();
    return leftTime - rightTime;
  });

  for (const event of sortedEvents) {
    const homeGoals = Number(event.HomeGoals);
    const awayGoals = Number(event.AwayGoals);

    if (isGoalEvent(event)) {
      const side = goalSideFromEvent(event, match, previousScore);
      const scorer = {
        player: extractPlayerName(event),
        minute: event.MatchMinute || "",
        type: isOwnGoalEvent(event) ? "own_goal" : "goal"
      };
      if (side === "home") {
        reportMatch.team_a.scorers.push(scorer);
      } else {
        reportMatch.team_b.scorers.push(scorer);
      }
    }

    if (Number.isFinite(homeGoals)) previousScore.home = homeGoals;
    if (Number.isFinite(awayGoals)) previousScore.away = awayGoals;
  }
}

function finalLineEn(match) {
  const home = match.team_a.name_en;
  const away = match.team_b.name_en;
  const homeScore = match.team_a.score;
  const awayScore = match.team_b.score;
  if (match.status === "LIVE") {
    if (homeScore === awayScore) return `${home} and ${away} are level ${homeScore}-${awayScore}`;
    const leader = homeScore > awayScore ? home : away;
    const trailer = homeScore > awayScore ? away : home;
    const leaderScore = Math.max(homeScore, awayScore);
    const trailerScore = Math.min(homeScore, awayScore);
    return `${leader} lead ${trailer} ${leaderScore}-${trailerScore}`;
  }
  if (homeScore === awayScore) return `${home} drew ${homeScore}-${awayScore} with ${away}`;
  const winner = homeScore > awayScore ? home : away;
  const loser = homeScore > awayScore ? away : home;
  const winnerScore = Math.max(homeScore, awayScore);
  const loserScore = Math.min(homeScore, awayScore);
  return `${winner} beat ${loser} ${winnerScore}-${loserScore}`;
}

function finalLineZh(match) {
  const home = match.team_a.name_zh;
  const away = match.team_b.name_zh;
  const homeScore = match.team_a.score;
  const awayScore = match.team_b.score;
  if (match.status === "LIVE") {
    if (homeScore === awayScore) return `${home} ${homeScore}-${awayScore} 暂平${away}`;
    const leader = homeScore > awayScore ? home : away;
    const trailer = homeScore > awayScore ? away : home;
    const leaderScore = Math.max(homeScore, awayScore);
    const trailerScore = Math.min(homeScore, awayScore);
    return `${leader} ${leaderScore}-${trailerScore} 暂时领先${trailer}`;
  }
  if (homeScore === awayScore) return `${home} ${homeScore}-${awayScore} 战平${away}`;
  const winner = homeScore > awayScore ? home : away;
  const loser = homeScore > awayScore ? away : home;
  const winnerScore = Math.max(homeScore, awayScore);
  const loserScore = Math.min(homeScore, awayScore);
  return `${winner} ${winnerScore}-${loserScore} 击败${loser}`;
}

function scorerLine(match, lang) {
  const allScorers = [
    ...match.team_a.scorers.map((scorer) => ({ ...scorer, team: lang === "zh" ? match.team_a.name_zh : match.team_a.name_en })),
    ...match.team_b.scorers.map((scorer) => ({ ...scorer, team: lang === "zh" ? match.team_b.name_zh : match.team_b.name_en }))
  ];
  if (!allScorers.length) {
    return lang === "zh" ? "双方均未取得进球。" : "Neither side scored.";
  }
  return allScorers
    .slice(0, 4)
    .map((scorer) => `${scorer.player} ${scorer.minute}${scorer.type === "own_goal" ? " OG" : ""}`)
    .join(", ");
}

function addHighlights(match) {
  match.highlights_en = [
    `${finalLineEn(match)} in ${match.group}.`,
    scorerLine(match, "en"),
    `The match was played at ${match.venue_en}.`
  ];
  match.highlights_zh = [
    `${finalLineZh(match)}，比赛属于 ${match.group}。`,
    scorerLine(match, "zh"),
    `比赛场地：${match.venue_zh}。`
  ];
  match.highlights = match.highlights_zh;
}

async function toReportMatch(apiBaseUrl, config, match) {
  const status = statusOf(match, config.now);
  const reportMatch = {
    group: localized(match.GroupName, "Group"),
    status,
    minute: status === "LIVE" ? matchMinute(match) : "",
    venue: localized(match.Stadium && match.Stadium.Name, "TBD"),
    kickoff_at_bj: formatBeijingTime(new Date(match.Date)),
    finished_at_bj: status === "FT"
      ? formatBeijingTime(matchEndEstimate(match))
      : formatBeijingTime(new Date(match.Date)),
    team_a: teamPayload(match.Home),
    team_b: teamPayload(match.Away)
  };
  reportMatch.venue_en = reportMatch.venue;
  reportMatch.venue_zh = reportMatch.venue;

  if (reportMatch.status === "FT" || reportMatch.status === "LIVE") {
    const events = await fetchTimeline(apiBaseUrl, match.IdMatch, config.locale);
    applyGoalEvents(match, reportMatch, events);
  }

  addHighlights(reportMatch);
  return reportMatch;
}

function toFixture(match) {
  const home = teamPayload(match.Home);
  const away = teamPayload(match.Away);
  delete home.score;
  delete home.scorers;
  delete away.score;
  delete away.scorers;
  return {
    time_bj: formatBeijingTime(new Date(match.Date)),
    team_a: home,
    team_b: away,
    group: localized(match.GroupName, "Group")
  };
}

function groupStandingsLines(standings, groups) {
  const linesEn = [];
  const linesZh = [];
  for (const groupId of groups) {
    const rows = standings
      .filter((row) => row.IdGroup === groupId)
      .sort((left, right) => Number(left.Position) - Number(right.Position))
      .slice(0, 4);
    if (!rows.length) continue;

    const groupName = localized(rows[0].Group, "Group");
    const leader = rows[0];
    const second = rows[1];
    const leaderName = localized(leader.Team && leader.Team.Name, leader.Team && leader.Team.ShortClubName || "TBD");
    const secondName = second
      ? localized(second.Team && second.Team.Name, second.Team && second.Team.ShortClubName || "TBD")
      : "";

    linesEn.push(
      second
        ? `${groupName}: ${leaderName} lead with ${leader.Points} points, followed by ${secondName} on ${second.Points}.`
        : `${groupName}: ${leaderName} lead with ${leader.Points} points.`
    );
    linesZh.push(
      second
        ? `${groupName}：${teamZhName(leaderName)} 以 ${leader.Points} 分领跑，${teamZhName(secondName)} ${second.Points} 分紧随其后。`
        : `${groupName}：${teamZhName(leaderName)} 以 ${leader.Points} 分领跑。`
    );
  }
  return { linesEn, linesZh };
}

function summaryFromMatches(matches) {
  if (!matches.length) {
    return {
      zh: "当前时间窗口内暂无已结束的世界杯比赛。",
      en: "No finished FIFA World Cup matches are available in the selected window."
    };
  }

  return {
    zh: matches.slice(-4).map(finalLineZh).join("，") + "。",
    en: matches.slice(-4).map(finalLineEn).join("; ") + "."
  };
}

function buildDateRange(matches, now) {
  if (!matches.length) return beijingDate(now);
  const dates = matches.map((match) => {
    const raw = String(match.finished_at_bj || "").match(/\d{4}-\d{2}-\d{2}/);
    return raw ? raw[0] : beijingDate(now);
  });
  const unique = [...new Set(dates)].sort();
  return unique.length === 1 ? unique[0] : `${unique[0]} to ${unique[unique.length - 1]}`;
}

function validateReport(report) {
  if (!report || typeof report !== "object" || Array.isArray(report)) {
    throw new Error("Report root must be an object.");
  }
  if (!Array.isArray(report.matches)) {
    throw new Error("Report matches must be an array.");
  }
  for (const [index, match] of report.matches.entries()) {
    if (!match.team_a || !match.team_b) throw new Error(`Match ${index} is missing team data.`);
    if (typeof match.team_a.name !== "string" || typeof match.team_b.name !== "string") {
      throw new Error(`Match ${index} is missing team names.`);
    }
    if (!Array.isArray(match.team_a.scorers) || !Array.isArray(match.team_b.scorers)) {
      throw new Error(`Match ${index} is missing scorer arrays.`);
    }
  }
}

function stableReport(report) {
  const clone = JSON.parse(JSON.stringify(report));
  delete clone.updated_at;
  if (clone.source) {
    delete clone.source.fetched_at;
  }
  return clone;
}

function readExistingReport(outputPath) {
  try {
    return JSON.parse(fs.readFileSync(outputPath, "utf8"));
  } catch (_error) {
    return null;
  }
}

function writeJsonIfChanged(outputPath, report) {
  const existing = readExistingReport(outputPath);
  if (existing && JSON.stringify(stableReport(existing)) === JSON.stringify(stableReport(report))) {
    console.log(`No semantic feed changes for ${outputPath}.`);
    return false;
  }

  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  const tempPath = `${outputPath}.tmp`;
  fs.writeFileSync(tempPath, `${JSON.stringify(report, null, 2)}\n`, "utf8");
  fs.renameSync(tempPath, outputPath);
  console.log(`Wrote ${outputPath}.`);
  return true;
}

async function buildReport(config) {
  const fromDate = addDays(config.now, -config.lookbackDays);
  const toDate = addDays(config.now, config.lookaheadDays);
  let matches = await fetchMatches(config.apiBaseUrl, config, fromDate, toDate);

  let finished = matches
    .filter((match) => isFinishedMatch(match, config.now))
    .sort((left, right) => new Date(left.Date) - new Date(right.Date));

  const live = matches
    .filter((match) => isLiveMatch(match, config.now))
    .sort((left, right) => new Date(left.Date) - new Date(right.Date));

  if (!finished.length) {
    const fallbackMatches = await fetchMatches(config.apiBaseUrl, config, addDays(config.now, -10), config.now);
    finished = fallbackMatches
      .filter((match) => isFinishedMatch(match, config.now))
      .sort((left, right) => new Date(left.Date) - new Date(right.Date))
      .slice(-8);
  }

  const future = matches
    .filter((match) => isFutureMatch(match, config.now))
    .sort((left, right) => new Date(left.Date) - new Date(right.Date))
    .slice(0, 8);

  const selectedMatches = [
    ...finished.slice(-RECENT_MATCH_LIMIT),
    ...live
  ]
    .sort((left, right) => new Date(left.Date) - new Date(right.Date))
    .slice(-RECENT_MATCH_LIMIT);

  const reportMatches = await Promise.all(
    selectedMatches.map((match) => toReportMatch(config.apiBaseUrl, config, match))
  );

  const standings = await fetchStandings(config.apiBaseUrl, config).catch((error) => {
    console.warn(`Standings unavailable: ${error.message}`);
    return [];
  });
  const relevantGroupIds = new Set(selectedMatches.map((match) => match.IdGroup).filter(Boolean));
  const standingsLines = groupStandingsLines(standings, relevantGroupIds);
  const summary = summaryFromMatches(reportMatches);

  const report = {
    updated_at: formatBeijingTime(config.now),
    date_range: buildDateRange(reportMatches, config.now),
    summary: summary.zh,
    matches: reportMatches,
    standings_changes: standingsLines.linesZh,
    today_fixtures: future.map(toFixture),
    news: [],
    summary_zh: summary.zh,
    summary_en: summary.en,
    standings_changes_zh: standingsLines.linesZh,
    standings_changes_en: standingsLines.linesEn,
    source: {
      provider: "FIFA FDH API",
      api_base_url: config.apiBaseUrl,
      idCompetition: config.competitionId,
      idSeason: config.seasonId,
      idStage: config.stageId,
      fetched_at: config.now.toISOString()
    }
  };

  validateReport(report);
  return report;
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const now = new Date(args.now || process.env.WORLD_CUP_NOW || Date.now());
  if (!Number.isFinite(now.getTime())) throw new Error("Invalid --now / WORLD_CUP_NOW value.");

  const force = Boolean(args.force || process.env.WORLD_CUP_FORCE === "1");
  const tournamentStart = addDays(new Date(TOURNAMENT_START_ISO), -2);
  const tournamentEnd = addDays(new Date(TOURNAMENT_END_ISO), 2);
  if (!force && (now < tournamentStart || now > tournamentEnd)) {
    console.log(`Outside tournament window at ${now.toISOString()}; no feed update needed.`);
    return;
  }

  const outputPath = path.resolve(args.output || process.env.WORLD_CUP_OUTPUT || "data/latest.json");
  const config = {
    apiBaseUrl: args.apiBaseUrl || process.env.WORLD_CUP_API_BASE_URL || DEFAULT_API_BASE_URL,
    competitionId: String(args.competitionId || process.env.WORLD_CUP_COMPETITION_ID || DEFAULT_COMPETITION_ID),
    seasonId: String(args.seasonId || process.env.WORLD_CUP_SEASON_ID || DEFAULT_SEASON_ID),
    stageId: String(args.stageId || process.env.WORLD_CUP_STAGE_ID || DEFAULT_STAGE_ID),
    locale: String(args.locale || process.env.WORLD_CUP_LOCALE || DEFAULT_LOCALE),
    lookbackDays: numberOption(args.lookbackDays || process.env.WORLD_CUP_LOOKBACK_DAYS, DEFAULT_LOOKBACK_DAYS),
    lookaheadDays: numberOption(args.lookaheadDays || process.env.WORLD_CUP_LOOKAHEAD_DAYS, DEFAULT_LOOKAHEAD_DAYS),
    now
  };

  const report = await buildReport(config);
  if (args.stdout) {
    process.stdout.write(`${JSON.stringify(report, null, 2)}\n`);
    return;
  }
  writeJsonIfChanged(outputPath, report);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
