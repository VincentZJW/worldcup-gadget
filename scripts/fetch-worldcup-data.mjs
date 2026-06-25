import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(scriptDir, "..");
const outputDir = path.join(rootDir, "public", "data");
const seedReportPath = path.join(rootDir, "data", "latest.json");

const apiKey = process.env.API_FOOTBALL_KEY || "";
const apiBaseUrl = process.env.API_FOOTBALL_BASE_URL || "https://v3.football.api-sports.io";
const leagueId = process.env.API_FOOTBALL_LEAGUE_ID || "1";
const season = process.env.API_FOOTBALL_SEASON || "2026";
const timezone = process.env.WORLD_CUP_TIMEZONE || "Asia/Shanghai";
const fifaApiBaseUrl = process.env.WORLD_CUP_FIFA_API_BASE_URL || "https://api.fifa.com/api/v3";
const fifaCompetitionId = process.env.WORLD_CUP_COMPETITION_ID || "17";
const fifaSeasonId = process.env.WORLD_CUP_SEASON_ID || "285023";
const fifaStageId = process.env.WORLD_CUP_STAGE_ID || "289273";
const fifaLocale = process.env.WORLD_CUP_LOCALE || "en";
const tournamentStartIso = process.env.WORLD_CUP_START_ISO || "2026-06-11T00:00:00Z";
const tournamentEndIso = process.env.WORLD_CUP_END_ISO || "2026-07-20T23:59:59Z";
const userAgent = "worldcup-gadget-pages/1.0 (+https://github.com/VincentZJW/worldcup-gadget)";

const countryMeta = new Map(
  [
    ["Argentina", ["ARG", "🇦🇷"]],
    ["Australia", ["AUS", "🇦🇺"]],
    ["Belgium", ["BEL", "🇧🇪"]],
    ["Bosnia and Herzegovina", ["BIH", "🇧🇦"]],
    ["Brazil", ["BRA", "🇧🇷"]],
    ["Canada", ["CAN", "🇨🇦"]],
    ["Cape Verde", ["CPV", "🇨🇻"]],
    ["Colombia", ["COL", "🇨🇴"]],
    ["Croatia", ["CRO", "🇭🇷"]],
    ["Curaçao", ["CUW", "🇨🇼"]],
    ["Côte d'Ivoire", ["CIV", "🇨🇮"]],
    ["Czechia", ["CZE", "🇨🇿"]],
    ["Chile", ["CHI", "🇨🇱"]],
    ["Denmark", ["DEN", "🇩🇰"]],
    ["DR Congo", ["COD", "🇨🇩"]],
    ["Congo DR", ["COD", "🇨🇩"]],
    ["Egypt", ["EGY", "🇪🇬"]],
    ["Ecuador", ["ECU", "🇪🇨"]],
    ["England", ["ENG", "🏴"]],
    ["France", ["FRA", "🇫🇷"]],
    ["Germany", ["GER", "🇩🇪"]],
    ["Ghana", ["GHA", "🇬🇭"]],
    ["Haiti", ["HAI", "🇭🇹"]],
    ["Iraq", ["IRQ", "🇮🇶"]],
    ["Japan", ["JPN", "🇯🇵"]],
    ["Korea Republic", ["KOR", "🇰🇷"]],
    ["Mexico", ["MEX", "🇲🇽"]],
    ["Morocco", ["MAR", "🇲🇦"]],
    ["Netherlands", ["NED", "🇳🇱"]],
    ["New Zealand", ["NZL", "🇳🇿"]],
    ["Norway", ["NOR", "🇳🇴"]],
    ["Saudi Arabia", ["KSA", "🇸🇦"]],
    ["Senegal", ["SEN", "🇸🇳"]],
    ["Serbia", ["SRB", "🇷🇸"]],
    ["Panama", ["PAN", "🇵🇦"]],
    ["Paraguay", ["PAR", "🇵🇾"]],
    ["Portugal", ["POR", "🇵🇹"]],
    ["Qatar", ["QAT", "🇶🇦"]],
    ["Scotland", ["SCO", "🏴"]],
    ["South Africa", ["RSA", "🇿🇦"]],
    ["Spain", ["ESP", "🇪🇸"]],
    ["Sweden", ["SWE", "🇸🇪"]],
    ["Switzerland", ["SUI", "🇨🇭"]],
    ["Tunisia", ["TUN", "🇹🇳"]],
    ["Türkiye", ["TUR", "🇹🇷"]],
    ["Turkey", ["TUR", "🇹🇷"]],
    ["Uruguay", ["URU", "🇺🇾"]],
    ["USA", ["USA", "🇺🇸"]]
  ]
);

const groupLetters = Array.from({ length: 12 }, (_, index) => String.fromCharCode(65 + index));
const groupNames = groupLetters.map((letter) => `Group ${letter}`);
const bracketRoundSpecs = [
  ["Round of 32", 16],
  ["Round of 16", 8],
  ["Quarter-finals", 4],
  ["Semi-finals", 2],
  ["Third-place match", 1],
  ["Final", 1]
];
const fallbackGroupTeams = {
  "Group A": ["Mexico", "Korea Republic", "South Africa", "Czechia"],
  "Group B": ["Switzerland", "Canada", "Bosnia and Herzegovina", "Qatar"],
  "Group C": ["Brazil", "Morocco", "Scotland", "Haiti"],
  "Group D": ["USA", "Türkiye", "Australia", "Paraguay"],
  "Group E": ["Germany", "Ecuador", "Côte d'Ivoire", "Curaçao"],
  "Group F": ["Netherlands", "Japan", "Sweden", "Tunisia"],
  "Group G": ["Spain", "Uruguay", "Cape Verde", "Saudi Arabia"],
  "Group H": ["England", "Ghana", "Belgium", "Panama"],
  "Group I": ["France", "Norway", "Senegal", "Iraq"],
  "Group J": ["Argentina", "Croatia", "Egypt", "New Zealand"],
  "Group K": ["Colombia", "Portugal", "DR Congo", "Saudi Arabia"],
  "Group L": ["Uruguay", "Denmark", "Serbia", "Chile"]
};

function log(message) {
  console.log(`[worldcup-data] ${message}`);
}

function cleanText(value, fallback = "") {
  return typeof value === "string" && value.trim() ? value.trim() : fallback;
}

function teamMeta(name, fallbackFlag = "") {
  const normalized = cleanText(name, "TBD");
  const meta = countryMeta.get(normalized);
  if (meta) {
    return { code: meta[0], flag: fallbackFlag || meta[1] };
  }

  const code = normalized
    .replace(/[^A-Za-z]/g, "")
    .slice(0, 3)
    .toUpperCase();
  return { code: code || "TBD", flag: fallbackFlag || "🏳️" };
}

function makeTeam(team = {}, score = null) {
  const name = cleanText(team.name_en || team.name || team.name_zh, "TBD");
  const meta = teamMeta(name, team.flag);
  return {
    name,
    code: meta.code,
    flag: meta.flag,
    score: Number.isFinite(Number(score ?? team.score)) ? Number(score ?? team.score) : null
  };
}

function emptyTeam(name = "TBD", score = null) {
  const meta = teamMeta(name);
  return {
    name,
    code: meta.code,
    flag: meta.flag,
    score
  };
}

function emptyStandingRow(team, rank) {
  const meta = teamMeta(team);
  return {
    rank,
    team,
    flag: meta.flag,
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

function normalizeStandingsGroups(groups = []) {
  const byGroup = new Map(groups.map((group) => [group.group, group]));
  return groupNames.map((groupName) => {
    const existingRows = byGroup.get(groupName)?.rows || [];
    const fallbackTeams = fallbackGroupTeams[groupName] || [];
    const rows = Array.from({ length: 4 }, (_, index) => {
      const existing = existingRows[index];
      if (existing) return { rank: existing.rank || index + 1, ...existing };
      return emptyStandingRow(fallbackTeams[index] || "TBD", index + 1);
    });
    return { group: groupName, rows };
  });
}

function blankKnockoutMatch(roundName, index) {
  return {
    id: `${roundName.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-${index + 1}`,
    date: "",
    time: "",
    stage: roundName,
    status: "TBD",
    home: emptyTeam("TBD"),
    away: emptyTeam("TBD"),
    winner: null
  };
}

function scoreString(home, away) {
  if (home.score === null || home.score === undefined || away.score === null || away.score === undefined) {
    return "";
  }
  return `${home.score}-${away.score}`;
}

function normalizeBracketRounds(rounds = []) {
  const byRound = new Map(rounds.map((round) => [round.name, round]));
  return bracketRoundSpecs.map(([name, count]) => {
    const existingMatches = byRound.get(name)?.matches || [];
    const matches = Array.from({ length: count }, (_, index) => ({
      ...blankKnockoutMatch(name, index),
      ...(existingMatches[index] || {})
    }));
    return { name, matches };
  });
}

function nowIso() {
  return new Date().toISOString();
}

function dateKeyFromText(value) {
  const match = String(value || "").match(/\d{4}-\d{2}-\d{2}/);
  return match ? match[0] : nowIso().slice(0, 10);
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

function dateOnly(date) {
  return date.toISOString().slice(0, 10);
}

function addMinutes(date, minutes) {
  return new Date(date.getTime() + minutes * 60 * 1000);
}

function beijingParts(date) {
  const formatter = new Intl.DateTimeFormat("en-CA", {
    timeZone: timezone,
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
  if (!Number.isFinite(date.getTime())) return "";
  const parts = beijingParts(date);
  return `北京时间 ${parts.year}-${parts.month}-${parts.day} ${parts.hour}:${parts.minute}`;
}

function beijingDateKey(date) {
  if (!Number.isFinite(date.getTime())) return "";
  const parts = beijingParts(date);
  return `${parts.year}-${parts.month}-${parts.day}`;
}

function fifaTeamName(team) {
  return displayNameFromFifa(localized(team?.TeamName, team?.ShortClubName || team?.Abbreviation || "TBD"));
}

function fifaScoreOf(match, side) {
  const team = side === "home" ? match.Home : match.Away;
  const direct = side === "home" ? match.HomeTeamScore : match.AwayTeamScore;
  const value = Number.isFinite(Number(direct)) ? direct : team?.Score;
  return Number.isFinite(Number(value)) ? Number(value) : null;
}

function fifaTeamPayload(match, side) {
  const team = side === "home" ? match.Home : match.Away;
  const name = fifaTeamName(team);
  const meta = teamMeta(name, flagFromFifaTeam(team));
  return {
    name,
    code: meta.code,
    flag: meta.flag,
    score: fifaScoreOf(match, side)
  };
}

function flagFromFifaTeam(team) {
  const code = team?.IdCountry || team?.IdAssociation || team?.Abbreviation || "";
  if (code === "ENG" || code === "SCO") return "🏴";
  const known = [...countryMeta.values()].find(([iso3]) => iso3 === code);
  if (known) return known[1];
  return "";
}

function fifaStatusText(match) {
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

  return [
    match.Status,
    match.MatchStatus,
    match.MatchStatusName,
    match.MatchStatusLocalized,
    match.MatchStatusText,
    match.Period,
    match.MatchPeriod,
    match.Phase
  ].map(textFromValue).filter(Boolean).join(" ").toLowerCase();
}

function fifaMatchMinute(match) {
  const raw = match.MatchTime || match.MatchMinute || match.Minute || match.CurrentMinute || "";
  const text = String(raw).trim();
  if (!text) return "";
  if (/^\d+$/.test(text)) return `${text}'`;
  return text;
}

function fifaMatchEndEstimate(match) {
  const kickoff = new Date(match.Date);
  if (!Number.isFinite(kickoff.getTime())) return new Date();
  const minutes = Number(String(match.MatchTime || "").match(/\d+/)?.[0]);
  return addMinutes(kickoff, Number.isFinite(minutes) ? Math.max(105, minutes + 15) : 120);
}

function fifaStatusOf(match, now = new Date()) {
  const text = fifaStatusText(match);
  const kickoff = new Date(match.Date);
  const hasScores = fifaScoreOf(match, "home") !== null && fifaScoreOf(match, "away") !== null;
  if (/\b(ft|full[-\s]?time|finished|final|completed|ended|played|post[-\s]?match)\b/i.test(text)) return "FT";
  if (Number.isFinite(kickoff.getTime()) && kickoff > now) return "Scheduled";
  if (hasScores) return now >= fifaMatchEndEstimate(match) ? "FT" : "LIVE";
  if (/\b(live|in[-\s]?progress|first half|second half|half[-\s]?time|extra time|penalties)\b/i.test(text) || fifaMatchMinute(match)) {
    return "LIVE";
  }
  return "Scheduled";
}

function eventDescription(event) {
  return localized(event?.EventDescription, "");
}

function eventLabel(event) {
  return localized(event?.TypeLocalized, "");
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

function isFifaGoalEvent(event) {
  const label = eventLabel(event).toLowerCase();
  return event.Type === 0 || event.Type === 34 || label === "goal!" || label === "goal" || label.includes("own goal");
}

function isFifaOwnGoalEvent(event) {
  return event.Type === 34 || eventLabel(event).toLowerCase().includes("own goal");
}

function isFifaPenaltyGoal(event) {
  const text = `${eventLabel(event)} ${eventDescription(event)}`.toLowerCase();
  return text.includes("penalty");
}

function fifaGoalSideFromEvent(event, match, previousScore) {
  const homeGoals = Number(event.HomeGoals);
  const awayGoals = Number(event.AwayGoals);
  if (Number.isFinite(homeGoals) && homeGoals > previousScore.home) return "home";
  if (Number.isFinite(awayGoals) && awayGoals > previousScore.away) return "away";
  if (event.IdTeam === match.Home?.IdTeam) return "home";
  if (event.IdTeam === match.Away?.IdTeam) return "away";
  return "home";
}

async function requestFifaJson(resource, params, headers = {}) {
  const url = new URL(resource.replace(/^\//, ""), `${fifaApiBaseUrl.replace(/\/$/, "")}/`);
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
          "User-Agent": userAgent,
          ...headers
        }
      });
      if (!response.ok) throw new Error(`${response.status} ${response.statusText} from ${url}`);
      return response.json();
    } catch (error) {
      lastError = error;
      if (attempt < 3) await new Promise((resolve) => setTimeout(resolve, attempt * 750));
    }
  }
  throw lastError;
}

async function fetchFifaPaginatedResults(resource, params) {
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
    const payload = await requestFifaJson(resource, requestParams, headers);
    if (!payload || !Array.isArray(payload.Results)) break;
    results.push(...payload.Results);
    continuationHash = payload.ContinuationHash || null;
    continuationToken = payload.ContinuationToken || null;
  } while (continuationHash && continuationToken && !seenHashes.has(continuationHash));

  return results;
}

async function fetchFifaMatches() {
  return fetchFifaPaginatedResults("calendar/matches", new URLSearchParams([
    ["from", tournamentStartIso],
    ["to", tournamentEndIso],
    ["language", fifaLocale],
    ["count", "500"],
    ["idCompetition", fifaCompetitionId],
    ["idSeason", fifaSeasonId]
  ]));
}

async function fetchFifaStandings() {
  return fetchFifaPaginatedResults(
    `calendar/${fifaCompetitionId}/${fifaSeasonId}/${fifaStageId}/standing`,
    new URLSearchParams([
      ["language", fifaLocale],
      ["count", "200"]
    ])
  );
}

async function fetchFifaTimeline(matchId) {
  try {
    const payload = await requestFifaJson(`timelines/${matchId}`, new URLSearchParams([["language", fifaLocale]]));
    return Array.isArray(payload?.Event) ? payload.Event : [];
  } catch (error) {
    log(`Skipping FIFA timeline for ${matchId}: ${error.message}`);
    return [];
  }
}

function readSeedReport() {
  try {
    return JSON.parse(fs.readFileSync(seedReportPath, "utf8"));
  } catch {
    return null;
  }
}

function goalsFromSeedMatch(match) {
  const goals = [];
  for (const side of ["team_a", "team_b"]) {
    const team = makeTeam(match[side]);
    for (const scorer of match[side]?.scorers || []) {
      if (scorer.type === "own_goal") continue;
      goals.push({
        team: team.code,
        player: cleanText(scorer.player, "Unknown"),
        minute: cleanText(scorer.minute, "")
      });
    }
  }
  return goals;
}

function matchFromSeed(match, index) {
  const home = makeTeam(match.team_a);
  const away = makeTeam(match.team_b);
  return {
    id: `seed-${index + 1}`,
    stage: cleanText(match.group, "Group Stage"),
    status: cleanText(match.status, "FT"),
    minute: match.status === "LIVE" ? "LIVE" : "",
    venue: cleanText(match.venue_en || match.venue, ""),
    home,
    away,
    goals: goalsFromSeedMatch(match)
  };
}

function fifaGoalsFromEvents(match, events) {
  const goals = [];
  const previousScore = { home: 0, away: 0 };
  const teams = {
    home: fifaTeamPayload(match, "home"),
    away: fifaTeamPayload(match, "away")
  };
  const sortedEvents = [...events].sort((left, right) => {
    const leftTime = new Date(left.Timestamp || 0).getTime();
    const rightTime = new Date(right.Timestamp || 0).getTime();
    return leftTime - rightTime;
  });

  for (const event of sortedEvents) {
    const homeGoals = Number(event.HomeGoals);
    const awayGoals = Number(event.AwayGoals);
    if (isFifaGoalEvent(event)) {
      const side = fifaGoalSideFromEvent(event, match, previousScore);
      goals.push({
        team: teams[side].code,
        player: extractPlayerName(event),
        minute: event.MatchMinute || "",
        type: isFifaOwnGoalEvent(event) ? "own_goal" : isFifaPenaltyGoal(event) ? "penalty" : "goal"
      });
    }
    if (Number.isFinite(homeGoals)) previousScore.home = homeGoals;
    if (Number.isFinite(awayGoals)) previousScore.away = awayGoals;
  }
  return goals;
}

function fifaMatchToScheduleItem(match, events = [], now = new Date()) {
  const status = fifaStatusOf(match, now);
  const home = fifaTeamPayload(match, "home");
  const away = fifaTeamPayload(match, "away");
  const kickoff = new Date(match.Date);
  const goals = fifaGoalsFromEvents(match, events);
  const stage = localized(match.GroupName, localized(match.StageName, "World Cup"));

  return {
    id: String(match.IdMatch || ""),
    date: beijingDateKey(kickoff),
    time: formatBeijingTime(kickoff),
    stage,
    venue: localized(match.Stadium?.Name, "TBD"),
    status,
    minute: status === "LIVE" ? fifaMatchMinute(match) : "",
    score: status === "FT" || status === "LIVE" ? `${home.score ?? 0}-${away.score ?? 0}` : "",
    home,
    away,
    goals,
    winner: match.Winner || null
  };
}

function fifaLiveData(fixtures, eventsByMatch, now) {
  const featured = fixtures
    .filter((match) => {
      const status = fifaStatusOf(match, now);
      return status === "LIVE" || status === "FT";
    })
    .sort((left, right) => {
      const leftStatus = fifaStatusOf(left, now);
      const rightStatus = fifaStatusOf(right, now);
      if (leftStatus === "LIVE" && rightStatus !== "LIVE") return -1;
      if (rightStatus === "LIVE" && leftStatus !== "LIVE") return 1;
      return new Date(right.Date || 0) - new Date(left.Date || 0);
    })
    .slice(0, 10)
    .map((match) => {
      const item = fifaMatchToScheduleItem(match, eventsByMatch.get(String(match.IdMatch)) || [], now);
      return {
        id: item.id,
        stage: item.stage,
        status: item.status,
        minute: item.minute,
        venue: item.venue,
        home: item.home,
        away: item.away,
        goals: item.goals
      };
    });

  return featured.length ? featured : fallbackLive(readSeedReport()).matches;
}

function fifaSchedule(fixtures, eventsByMatch, now) {
  return fixtures
    .slice()
    .sort((left, right) => new Date(left.Date || 0) - new Date(right.Date || 0))
    .map((match) => fifaMatchToScheduleItem(match, eventsByMatch.get(String(match.IdMatch)) || [], now));
}

function fifaStandings(rows) {
  if (!rows.length) return null;
  const groups = new Map();
  for (const row of rows) {
    const group = localized(row.Group, "Group");
    const name = displayNameFromFifa(localized(row.Team?.Name, row.Team?.ShortClubName || "TBD"));
    const meta = teamMeta(name, flagFromFifaTeam(row.Team));
    if (!groups.has(group)) groups.set(group, []);
    groups.get(group).push({
      rank: Number(row.Position) || groups.get(group).length + 1,
      team: name,
      flag: meta.flag,
      played: Number(row.Played) || 0,
      won: Number(row.Won) || 0,
      drawn: Number(row.Drawn) || 0,
      lost: Number(row.Lost) || 0,
      goalsFor: Number(row.For) || 0,
      goalsAgainst: Number(row.Against) || 0,
      goalDifference: Number(row.GoalsDiference ?? row.GoalsDifference) || 0,
      points: Number(row.Points) || 0
    });
  }

  return normalizeStandingsGroups([...groups.entries()].map(([group, groupRows]) => ({
    group,
    rows: groupRows.sort((left, right) =>
      left.rank - right.rank
      || right.points - left.points
      || right.goalDifference - left.goalDifference
      || right.goalsFor - left.goalsFor
    )
  })));
}

function normalizePlayerKey(name) {
  return String(name || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/gi, " ")
    .trim()
    .toLowerCase();
}

function fifaScorers(schedule, photoByPlayer = new Map()) {
  const scorers = new Map();
  const teamByCode = new Map();
  for (const match of schedule) {
    teamByCode.set(match.home.code, match.home);
    teamByCode.set(match.away.code, match.away);
    for (const goal of match.goals || []) {
      if (!goal.player || goal.type === "own_goal") continue;
      const team = teamByCode.get(goal.team) || emptyTeam("TBD");
      const normalizedName = normalizePlayerKey(goal.player);
      const key = `${normalizedName}-${team.code}`;
      const existing = scorers.get(key) || {
        player: {
          id: key,
          name: goal.player,
          photo: photoByPlayer.get(key) || photoByPlayer.get(normalizedName) || ""
        },
        team: { name: team.name, code: team.code, flag: team.flag },
        goals: 0,
        assists: null,
        penalties: 0,
        minutes: null
      };
      existing.goals += 1;
      if (goal.type === "penalty") existing.penalties += 1;
      scorers.set(key, existing);
    }
  }

  return [...scorers.values()]
    .sort((left, right) =>
      right.goals - left.goals
      || Number(right.penalties || 0) - Number(left.penalties || 0)
      || left.player.name.localeCompare(right.player.name)
    )
    .map((player, index) => ({
      rank: index + 1,
      ...player,
      penalties: player.penalties || null
    }));
}

function fifaBracket(schedule) {
  const knockoutMatches = schedule.filter((match) => !/^Group\s+[A-L]$/i.test(match.stage || ""));
  if (!knockoutMatches.length) return normalizeBracketRounds();
  const rounds = new Map();
  for (const match of knockoutMatches) {
    if (!rounds.has(match.stage)) rounds.set(match.stage, []);
    rounds.get(match.stage).push(match);
  }
  return normalizeBracketRounds([...rounds.entries()].map(([name, matches]) => ({ name, matches })));
}

async function apiFootballPhotoMap() {
  const photos = new Map();
  if (!apiKey) return photos;
  try {
    const payload = await fetchApiFootball("/players/topscorers", { league: leagueId, season });
    for (const entry of payload) {
      const name = entry.player?.name || "";
      const photo = entry.player?.photo || "";
      const stats = entry.statistics?.[0] || {};
      const team = emptyTeam(stats.team?.name || "TBD");
      if (!name || !photo) continue;
      photos.set(normalizePlayerKey(name), photo);
      photos.set(`${normalizePlayerKey(name)}-${team.code}`, photo);
    }
  } catch (error) {
    log(`Skipping API-FOOTBALL player photos: ${error.message}`);
  }
  return photos;
}

async function buildFifaData() {
  log("Fetching FIFA FDH page data.");
  const now = new Date();
  const [fixtures, standingsRows] = await Promise.all([
    fetchFifaMatches(),
    fetchFifaStandings().catch((error) => {
      log(`FIFA standings unavailable: ${error.message}`);
      return [];
    })
  ]);

  const matchesNeedingTimeline = fixtures.filter((match) => {
    const status = fifaStatusOf(match, now);
    return status === "FT" || status === "LIVE";
  });
  const eventsByMatch = new Map();
  for (const match of matchesNeedingTimeline) {
    eventsByMatch.set(String(match.IdMatch), await fetchFifaTimeline(match.IdMatch));
  }

  const updatedAt = nowIso();
  const source = "fifa-fdh";
  const scheduleMatches = fifaSchedule(fixtures, eventsByMatch, now);
  const photoByPlayer = await apiFootballPhotoMap();

  return {
    live: {
      updatedAt,
      timezone,
      source,
      isFallback: false,
      matches: fifaLiveData(fixtures, eventsByMatch, now)
    },
    standings: {
      updatedAt,
      timezone,
      source,
      isFallback: false,
      groups: fifaStandings(standingsRows) || fallbackStandings(readSeedReport()).groups
    },
    schedule: {
      updatedAt,
      timezone,
      source,
      isFallback: false,
      matches: scheduleMatches
    },
    bracket: {
      updatedAt,
      timezone,
      source,
      isFallback: false,
      rounds: fifaBracket(scheduleMatches)
    },
    scorers: {
      updatedAt,
      timezone,
      source,
      isFallback: false,
      players: fifaScorers(scheduleMatches, photoByPlayer)
    }
  };
}

function fallbackLive(seed) {
  const matches = Array.isArray(seed?.matches) && seed.matches.length
    ? seed.matches.map(matchFromSeed).slice(-8).reverse()
    : [
        {
          id: "fallback-live-1",
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
      ];

  return {
    updatedAt: nowIso(),
    timezone,
    source: "local-fallback",
    isFallback: true,
    notice: "数据暂未更新，当前显示示例数据",
    matches
  };
}

function fallbackStandings(seed) {
  const knownRows = new Map([
    [
      "Group B",
      [
        ["Switzerland", 3, 2, 1, 0, 5, 2, 3, 7],
        ["Canada", 3, 1, 1, 1, 4, 4, 0, 4],
        ["Bosnia and Herzegovina", 3, 1, 1, 1, 5, 5, 0, 4],
        ["Qatar", 3, 0, 0, 3, 2, 5, -3, 0]
      ]
    ],
    [
      "Group C",
      [
        ["Brazil", 3, 2, 1, 0, 6, 2, 4, 7],
        ["Morocco", 3, 2, 1, 0, 7, 4, 3, 7],
        ["Scotland", 3, 1, 0, 2, 2, 5, -3, 3],
        ["Haiti", 3, 0, 0, 3, 3, 7, -4, 0]
      ]
    ],
    [
      "Group K",
      [
        ["Colombia", 2, 2, 0, 0, 3, 0, 3, 6],
        ["Portugal", 2, 1, 1, 0, 2, 1, 1, 4],
        ["DR Congo", 2, 0, 1, 1, 1, 2, -1, 1],
        ["Saudi Arabia", 2, 0, 0, 2, 0, 3, -3, 0]
      ]
    ]
  ]);

  const groups = normalizeStandingsGroups(
    groupNames.map((groupName) => ({
      group: groupName,
      rows: (knownRows.get(groupName) || fallbackGroupTeams[groupName].map((team) => [team, 0, 0, 0, 0, 0, 0, 0, 0])).map(
        (row, index) => {
          const [team, played, won, drawn, lost, goalsFor, goalsAgainst, goalDifference, points] = row;
          const meta = teamMeta(team);
          return {
            rank: index + 1,
            team,
            flag: meta.flag,
            played,
            won,
            drawn,
            lost,
            goalsFor,
            goalsAgainst,
            goalDifference,
            points
          };
        }
      )
    }))
  );

  return {
    updatedAt: seed?.updated_at || nowIso(),
    timezone,
    source: "local-fallback",
    isFallback: true,
    notice: "数据暂未更新，当前显示示例数据",
    groups
  };
}

function fallbackSchedule(seed) {
  const matches = [];
  const pairings = [
    [0, 1],
    [2, 3],
    [0, 2],
    [1, 3],
    [0, 3],
    [1, 2]
  ];
  const completedByKey = new Map();

  for (const [index, match] of (seed?.matches || []).entries()) {
    const home = makeTeam(match.team_a);
    const away = makeTeam(match.team_b);
    completedByKey.set(`${home.name}-${away.name}`, {
      id: `seed-completed-${index + 1}`,
      date: dateKeyFromText(match.finished_at_bj),
      time: cleanText(match.finished_at_bj, ""),
      stage: cleanText(match.group, "Group Stage"),
      venue: cleanText(match.venue_en || match.venue, "TBD"),
      status: cleanText(match.status, "FT"),
      score: scoreString(home, away),
      home,
      away
    });
  }

  groupNames.forEach((groupName, groupIndex) => {
    const teams = fallbackGroupTeams[groupName];
    pairings.forEach(([homeIndex, awayIndex], pairingIndex) => {
      const homeName = teams[homeIndex];
      const awayName = teams[awayIndex];
      const completed = completedByKey.get(`${homeName}-${awayName}`);
      if (completed) {
        matches.push(completed);
        return;
      }

      const date = new Date(Date.UTC(2026, 5, 11 + groupIndex + Math.floor(pairingIndex / 2), 12 + (pairingIndex % 3) * 3));
      matches.push({
        id: `group-${groupLetters[groupIndex].toLowerCase()}-${pairingIndex + 1}`,
        date: date.toISOString().slice(0, 10),
        time: date.toISOString(),
        stage: groupName,
        venue: "TBD",
        status: "Scheduled",
        score: "",
        home: emptyTeam(homeName),
        away: emptyTeam(awayName)
      });
    });
  });

  for (const round of normalizeBracketRounds().flatMap((round) => round.matches)) {
    matches.push({
      id: `schedule-${round.id}`,
      date: round.stage === "Final" ? "2026-07-19" : "",
      time: "",
      stage: round.stage,
      venue: "TBD",
      status: "Scheduled",
      score: "",
      home: round.home,
      away: round.away
    });
  }

  return {
    updatedAt: seed?.updated_at || nowIso(),
    timezone,
    source: "local-fallback",
    isFallback: true,
    notice: "数据暂未更新，当前显示示例数据",
    matches
  };
}

function fallbackBracket(seed) {
  return {
    updatedAt: seed?.updated_at || nowIso(),
    timezone,
    source: "local-fallback",
    isFallback: true,
    notice: "数据暂未更新，当前显示示例数据",
    rounds: normalizeBracketRounds()
  };
}

function fallbackScorers(seed) {
  const scorerMap = new Map();
  for (const match of seed?.matches || []) {
    for (const side of ["team_a", "team_b"]) {
      const team = makeTeam(match[side]);
      for (const scorer of match[side]?.scorers || []) {
        if (!scorer.player || scorer.type === "own_goal") continue;
        const key = `${scorer.player}-${team.code}`;
        const current = scorerMap.get(key) || {
          player: { id: key, name: scorer.player, photo: "" },
          team: { name: team.name, code: team.code, flag: team.flag },
          goals: 0,
          assists: 0,
          penalties: null,
          minutes: null
        };
        current.goals += 1;
        scorerMap.set(key, current);
      }
    }
  }

  const samplePlayers = [
    ["Vinícius Júnior", "Brazil", 2, 1, 0, 245],
    ["Lionel Messi", "Argentina", 2, 2, 1, 270],
    ["Kylian Mbappé", "France", 2, 1, 0, 260],
    ["Soufiane Rahimi", "Morocco", 1, 1, 0, 221],
    ["Daniel Muñoz", "Colombia", 1, 0, 0, 180],
    ["Matheus Cunha", "Brazil", 1, 1, 0, 190],
    ["Ruben Vargas", "Switzerland", 1, 0, 0, 210],
    ["Johan Manzambi", "Switzerland", 1, 0, 0, 160],
    ["Promise David", "Canada", 1, 0, 0, 175],
    ["Achraf Hakimi", "Morocco", 1, 0, 0, 270],
    ["Ismael Saibari", "Morocco", 1, 0, 0, 180],
    ["Gessime Yassine", "Morocco", 1, 0, 0, 92],
    ["Lenny Joseph", "Haiti", 1, 0, 0, 210],
    ["Wilson Isidor", "Haiti", 1, 1, 0, 220],
    ["Kerim Alajbegović", "Bosnia and Herzegovina", 1, 0, 0, 170],
    ["Ermin Mahmić", "Bosnia and Herzegovina", 1, 0, 0, 112],
    ["Hassan Al-Haydos", "Qatar", 1, 0, 0, 190],
    ["Cristiano Ronaldo", "Portugal", 1, 0, 1, 210],
    ["Harry Kane", "England", 1, 1, 0, 250],
    ["Christian Pulisic", "USA", 1, 1, 0, 240],
    ["Jamal Musiala", "Germany", 1, 0, 0, 220],
    ["Raphinha", "Brazil", 1, 2, 0, 230],
    ["Jude Bellingham", "England", 1, 0, 0, 240],
    ["Lautaro Martínez", "Argentina", 1, 0, 0, 160]
  ];

  for (const [name, teamName, goals, assists, penalties, minutes] of samplePlayers) {
    const team = emptyTeam(teamName);
    const key = `${name}-${team.code}`;
    if (!scorerMap.has(key)) {
      scorerMap.set(key, {
        player: { id: key, name, photo: "" },
        team: { name: team.name, code: team.code, flag: team.flag },
        goals,
        assists,
        penalties,
        minutes
      });
    }
  }

  const players = [...scorerMap.values()]
    .sort((a, b) => b.goals - a.goals || b.assists - a.assists || a.player.name.localeCompare(b.player.name))
    .map((player, index) => ({ rank: index + 1, ...player }));

  return {
    updatedAt: seed?.updated_at || nowIso(),
    timezone,
    source: "local-fallback",
    isFallback: true,
    notice: "数据暂未更新，当前显示示例数据",
    players
  };
}

function writeJson(fileName, data) {
  fs.mkdirSync(outputDir, { recursive: true });
  fs.writeFileSync(path.join(outputDir, fileName), `${JSON.stringify(data, null, 2)}\n`);
}

async function fetchApiFootball(pathname, params) {
  const url = new URL(pathname, apiBaseUrl);
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== null && value !== "") {
      url.searchParams.set(key, value);
    }
  }

  const response = await fetch(url, {
    headers: {
      "x-apisports-key": apiKey
    }
  });

  if (!response.ok) {
    throw new Error(`API-FOOTBALL ${pathname} failed with ${response.status}`);
  }

  const payload = await response.json();
  if (Array.isArray(payload.errors) && payload.errors.length) {
    throw new Error(`API-FOOTBALL ${pathname} returned errors: ${payload.errors.join(", ")}`);
  }
  if (payload.errors && typeof payload.errors === "object" && Object.keys(payload.errors).length) {
    throw new Error(`API-FOOTBALL ${pathname} returned errors: ${JSON.stringify(payload.errors)}`);
  }

  return payload.response || [];
}

function fixtureStatus(fixture) {
  const short = fixture.fixture?.status?.short || "NS";
  if (["1H", "2H", "ET", "BT", "P", "LIVE", "HT"].includes(short)) return "LIVE";
  if (["FT", "AET", "PEN"].includes(short)) return "FT";
  if (["PST", "CANC", "ABD"].includes(short)) return short;
  return "Scheduled";
}

function fixtureMinute(fixture) {
  const elapsed = fixture.fixture?.status?.elapsed;
  return elapsed ? String(elapsed) : "";
}

function fixtureTeam(apiTeam, score) {
  const meta = teamMeta(apiTeam?.name || "TBD");
  return {
    name: apiTeam?.name || "TBD",
    code: meta.code,
    flag: meta.flag,
    score: Number.isFinite(Number(score)) ? Number(score) : null
  };
}

function apiGoals(events) {
  return events
    .filter((event) => event.type === "Goal")
    .map((event) => {
      const team = teamMeta(event.team?.name || "");
      return {
        team: team.code,
        player: cleanText(event.player?.name, "Unknown"),
        minute: event.time?.elapsed ? `${event.time.elapsed}'` : ""
      };
    });
}

function fixtureToMatch(fixture, events = []) {
  return {
    id: String(fixture.fixture?.id || fixture.id),
    stage: cleanText(fixture.league?.round, "World Cup"),
    status: fixtureStatus(fixture),
    minute: fixtureMinute(fixture),
    venue: cleanText(fixture.fixture?.venue?.name, ""),
    home: fixtureTeam(fixture.teams?.home, fixture.goals?.home),
    away: fixtureTeam(fixture.teams?.away, fixture.goals?.away),
    goals: apiGoals(events)
  };
}

function sortFeaturedFixtures(fixtures) {
  return [...fixtures].sort((a, b) => {
    const statusScore = (fixture) => {
      const status = fixtureStatus(fixture);
      if (status === "LIVE") return 0;
      if (status === "FT") return 1;
      return 2;
    };
    const statusDelta = statusScore(a) - statusScore(b);
    if (statusDelta) return statusDelta;
    return new Date(b.fixture?.date || 0) - new Date(a.fixture?.date || 0);
  });
}

function apiStandings(payload) {
  const groups = payload[0]?.league?.standings || [];
  return normalizeStandingsGroups(groups.map((rows, groupIndex) => ({
    group: rows[0]?.group || `Group ${String.fromCharCode(65 + groupIndex)}`,
    rows: rows.map((row) => ({
      rank: row.rank,
      team: row.team?.name || "TBD",
      flag: teamMeta(row.team?.name || "").flag,
      played: row.all?.played ?? 0,
      won: row.all?.win ?? 0,
      drawn: row.all?.draw ?? 0,
      lost: row.all?.lose ?? 0,
      goalsFor: row.all?.goals?.for ?? 0,
      goalsAgainst: row.all?.goals?.against ?? 0,
      goalDifference: row.goalsDiff ?? 0,
      points: row.points ?? 0
    }))
  })));
}

function apiSchedule(fixtures) {
  return fixtures
    .slice()
    .sort((a, b) => new Date(a.fixture?.date || 0) - new Date(b.fixture?.date || 0))
    .map((fixture) => {
      const home = fixtureTeam(fixture.teams?.home, fixture.goals?.home);
      const away = fixtureTeam(fixture.teams?.away, fixture.goals?.away);
      const status = fixtureStatus(fixture);
      return {
        id: String(fixture.fixture?.id || ""),
        date: (fixture.fixture?.date || "").slice(0, 10),
        time: fixture.fixture?.date || "",
        stage: cleanText(fixture.league?.round, "World Cup"),
        venue: cleanText(fixture.fixture?.venue?.name, ""),
        status,
        score: status === "FT" || status === "LIVE" ? `${home.score ?? 0}-${away.score ?? 0}` : "",
        home,
        away
      };
    });
}

function apiBracket(fixtures) {
  const knockout = fixtures.filter((fixture) => {
    const round = fixture.league?.round || "";
    return !/group/i.test(round) && /(round|final|quarter|semi|third|knockout)/i.test(round);
  });

  if (!knockout.length) {
    return fallbackBracket(null).rounds;
  }

  const normalizeRoundName = (roundName) => {
    if (/round of 32|1\/16|32/i.test(roundName)) return "Round of 32";
    if (/round of 16|1\/8|16/i.test(roundName)) return "Round of 16";
    if (/quarter/i.test(roundName)) return "Quarter-finals";
    if (/semi/i.test(roundName)) return "Semi-finals";
    if (/third/i.test(roundName)) return "Third-place match";
    if (/final/i.test(roundName)) return "Final";
    return roundName;
  };
  const rounds = new Map();
  for (const fixture of knockout) {
    const roundName = normalizeRoundName(fixture.league?.round || "Knockout");
    if (!rounds.has(roundName)) rounds.set(roundName, []);
    const match = fixtureToMatch(fixture);
    match.date = (fixture.fixture?.date || "").slice(0, 10);
    match.time = fixture.fixture?.date || "";
    match.winner = fixture.teams?.home?.winner ? match.home.code : fixture.teams?.away?.winner ? match.away.code : null;
    rounds.get(roundName).push(match);
  }

  return normalizeBracketRounds([...rounds.entries()].map(([name, matches]) => ({ name, matches })));
}

function apiScorers(payload) {
  return payload.map((entry, index) => {
    const stats = entry.statistics?.[0] || {};
    const team = emptyTeam(stats.team?.name || "TBD");
    return {
      rank: index + 1,
      player: {
        id: String(entry.player?.id || entry.player?.name || index + 1),
        name: entry.player?.name || "Unknown",
        photo: entry.player?.photo || ""
      },
      team: { name: team.name, code: team.code, flag: team.flag },
      goals: stats.goals?.total ?? 0,
      assists: stats.goals?.assists ?? 0,
      penalties: stats.penalty?.scored ?? null,
      minutes: stats.games?.minutes ?? null
    };
  });
}

async function buildApiData() {
  const fixtures = await fetchApiFootball("/fixtures", { league: leagueId, season, timezone });
  const standings = await fetchApiFootball("/standings", { league: leagueId, season });
  const scorers = await fetchApiFootball("/players/topscorers", { league: leagueId, season });
  const featuredFixtures = sortFeaturedFixtures(fixtures).slice(0, 10);
  const eventEntries = [];

  for (const fixture of featuredFixtures.slice(0, 8)) {
    try {
      const fixtureId = fixture.fixture?.id;
      const events = fixtureId ? await fetchApiFootball("/fixtures/events", { fixture: fixtureId }) : [];
      eventEntries.push([String(fixtureId), events]);
    } catch (error) {
      log(`Skipping fixture events: ${error.message}`);
    }
  }

  const eventsByFixture = new Map(eventEntries);
  const updatedAt = nowIso();
  const source = "api-football";

  return {
    live: {
      updatedAt,
      timezone,
      source,
      isFallback: false,
      matches: featuredFixtures.map((fixture) =>
        fixtureToMatch(fixture, eventsByFixture.get(String(fixture.fixture?.id)) || [])
      )
    },
    standings: {
      updatedAt,
      timezone,
      source,
      isFallback: false,
      groups: apiStandings(standings)
    },
    schedule: {
      updatedAt,
      timezone,
      source,
      isFallback: false,
      matches: apiSchedule(fixtures)
    },
    bracket: {
      updatedAt,
      timezone,
      source,
      isFallback: false,
      rounds: apiBracket(fixtures)
    },
    scorers: {
      updatedAt,
      timezone,
      source,
      isFallback: false,
      players: apiScorers(scorers)
    }
  };
}

function buildFallbackData() {
  const seed = readSeedReport();
  return {
    live: fallbackLive(seed),
    standings: fallbackStandings(seed),
    schedule: fallbackSchedule(seed),
    bracket: fallbackBracket(seed),
    scorers: fallbackScorers(seed)
  };
}

async function main() {
  let data;
  try {
    data = await buildFifaData();
  } catch (error) {
    log(`FIFA fetch failed: ${error.message}`);
  }

  if (!data && apiKey) {
    try {
      log("Fetching API-FOOTBALL data.");
      data = await buildApiData();
    } catch (error) {
      log(`API-FOOTBALL fetch failed: ${error.message}`);
    }
  }

  if (!data) {
    log("Writing fallback page data.");
    data = buildFallbackData();
  }

  writeJson("worldcup-live.json", data.live);
  writeJson("worldcup-standings.json", data.standings);
  writeJson("worldcup-schedule.json", data.schedule);
  writeJson("worldcup-bracket.json", data.bracket);
  writeJson("worldcup-scorers.json", data.scorers);
  log(`Wrote ${path.relative(rootDir, outputDir)}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
