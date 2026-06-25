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
    ["Czechia", ["CZE", "🇨🇿"]],
    ["DR Congo", ["COD", "🇨🇩"]],
    ["Congo DR", ["COD", "🇨🇩"]],
    ["Ecuador", ["ECU", "🇪🇨"]],
    ["England", ["ENG", "🏴"]],
    ["France", ["FRA", "🇫🇷"]],
    ["Germany", ["GER", "🇩🇪"]],
    ["Haiti", ["HAI", "🇭🇹"]],
    ["Japan", ["JPN", "🇯🇵"]],
    ["Korea Republic", ["KOR", "🇰🇷"]],
    ["Mexico", ["MEX", "🇲🇽"]],
    ["Morocco", ["MAR", "🇲🇦"]],
    ["Netherlands", ["NED", "🇳🇱"]],
    ["Norway", ["NOR", "🇳🇴"]],
    ["Panama", ["PAN", "🇵🇦"]],
    ["Paraguay", ["PAR", "🇵🇾"]],
    ["Portugal", ["POR", "🇵🇹"]],
    ["Qatar", ["QAT", "🇶🇦"]],
    ["Scotland", ["SCO", "🏴"]],
    ["South Africa", ["RSA", "🇿🇦"]],
    ["Sweden", ["SWE", "🇸🇪"]],
    ["Switzerland", ["SUI", "🇨🇭"]],
    ["Tunisia", ["TUN", "🇹🇳"]],
    ["Türkiye", ["TUR", "🇹🇷"]],
    ["Turkey", ["TUR", "🇹🇷"]],
    ["Uruguay", ["URU", "🇺🇾"]],
    ["USA", ["USA", "🇺🇸"]]
  ]
);

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

function nowIso() {
  return new Date().toISOString();
}

function dateKeyFromText(value) {
  const match = String(value || "").match(/\d{4}-\d{2}-\d{2}/);
  return match ? match[0] : nowIso().slice(0, 10);
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
  const groups = [
    {
      group: "Group B",
      rows: [
        ["Switzerland", "🇨🇭", 3, 2, 1, 0, 5, 2, 3, 7],
        ["Canada", "🇨🇦", 3, 1, 1, 1, 4, 4, 0, 4],
        ["Bosnia and Herzegovina", "🇧🇦", 3, 1, 1, 1, 5, 5, 0, 4],
        ["Qatar", "🇶🇦", 3, 0, 0, 3, 2, 5, -3, 0]
      ]
    },
    {
      group: "Group C",
      rows: [
        ["Brazil", "🇧🇷", 3, 2, 1, 0, 6, 2, 4, 7],
        ["Morocco", "🇲🇦", 3, 2, 1, 0, 7, 4, 3, 7],
        ["Scotland", "🏴", 3, 1, 0, 2, 2, 5, -3, 3],
        ["Haiti", "🇭🇹", 3, 0, 0, 3, 3, 7, -4, 0]
      ]
    },
    {
      group: "Group K",
      rows: [
        ["Colombia", "🇨🇴", 2, 2, 0, 0, 3, 0, 3, 6],
        ["Portugal", "🇵🇹", 2, 1, 1, 0, 2, 1, 1, 4],
        ["DR Congo", "🇨🇩", 2, 0, 1, 1, 1, 2, -1, 1],
        ["Saudi Arabia", "🇸🇦", 2, 0, 0, 2, 0, 3, -3, 0]
      ]
    }
  ].map((group) => ({
    group: group.group,
    rows: group.rows.map((row, index) => {
      const [team, flag, played, won, drawn, lost, goalsFor, goalsAgainst, goalDifference, points] = row;
      return {
        rank: index + 1,
        team,
        flag,
        played,
        won,
        drawn,
        lost,
        goalsFor,
        goalsAgainst,
        goalDifference,
        points
      };
    })
  }));

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
  const seedFixtures = Array.isArray(seed?.today_fixtures) ? seed.today_fixtures : [];
  const matches = seedFixtures.map((fixture, index) => ({
    id: `seed-schedule-${index + 1}`,
    date: dateKeyFromText(fixture.time_bj),
    time: cleanText(fixture.time_bj, "TBD"),
    stage: cleanText(fixture.group, "Group Stage"),
    venue: cleanText(fixture.venue, "TBD"),
    status: "Scheduled",
    score: "",
    home: makeTeam(fixture.team_a),
    away: makeTeam(fixture.team_b)
  }));

  if (!matches.length) {
    matches.push(
      {
        id: "fallback-schedule-1",
        date: "2026-06-26",
        time: "北京时间 2026-06-26 04:00",
        stage: "Group E",
        venue: "Philadelphia Stadium",
        status: "Scheduled",
        score: "",
        home: { name: "Ecuador", code: "ECU", flag: "🇪🇨", score: null },
        away: { name: "Germany", code: "GER", flag: "🇩🇪", score: null }
      },
      {
        id: "fallback-schedule-2",
        date: "2026-06-26",
        time: "北京时间 2026-06-26 10:00",
        stage: "Group D",
        venue: "Los Angeles Stadium",
        status: "Scheduled",
        score: "",
        home: { name: "Türkiye", code: "TUR", flag: "🇹🇷", score: null },
        away: { name: "USA", code: "USA", flag: "🇺🇸", score: null }
      }
    );
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
    rounds: [
      {
        name: "Round of 32",
        matches: Array.from({ length: 4 }, (_, index) => ({
          id: `r32-${index + 1}`,
          status: "TBD",
          home: { name: "TBD", code: "TBD", flag: "🏳️", score: null },
          away: { name: "TBD", code: "TBD", flag: "🏳️", score: null }
        }))
      },
      {
        name: "Quarter-finals",
        matches: Array.from({ length: 2 }, (_, index) => ({
          id: `qf-${index + 1}`,
          status: "TBD",
          home: { name: "TBD", code: "TBD", flag: "🏳️", score: null },
          away: { name: "TBD", code: "TBD", flag: "🏳️", score: null }
        }))
      },
      {
        name: "Final",
        matches: [
          {
            id: "final-1",
            status: "TBD",
            home: { name: "TBD", code: "TBD", flag: "🏳️", score: null },
            away: { name: "TBD", code: "TBD", flag: "🏳️", score: null }
          }
        ]
      }
    ]
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
          player: scorer.player,
          team: team.name,
          flag: team.flag,
          goals: 0,
          assists: 0,
          penalties: null
        };
        current.goals += 1;
        scorerMap.set(key, current);
      }
    }
  }

  const players = [...scorerMap.values()]
    .sort((a, b) => b.goals - a.goals || a.player.localeCompare(b.player))
    .slice(0, 10)
    .map((player, index) => ({ rank: index + 1, ...player }));

  if (!players.length) {
    players.push(
      { rank: 1, player: "Vinícius Júnior", team: "Brazil", flag: "🇧🇷", goals: 2, assists: 0, penalties: null },
      { rank: 2, player: "Soufiane Rahimi", team: "Morocco", flag: "🇲🇦", goals: 1, assists: 1, penalties: null },
      { rank: 3, player: "Daniel Muñoz", team: "Colombia", flag: "🇨🇴", goals: 1, assists: 0, penalties: null }
    );
  }

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
  return groups.map((rows, groupIndex) => ({
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
  }));
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

  const rounds = new Map();
  for (const fixture of knockout) {
    const roundName = fixture.league?.round || "Knockout";
    if (!rounds.has(roundName)) rounds.set(roundName, []);
    rounds.get(roundName).push(fixtureToMatch(fixture));
  }

  return [...rounds.entries()].map(([name, matches]) => ({ name, matches }));
}

function apiScorers(payload) {
  return payload.slice(0, 20).map((entry, index) => {
    const stats = entry.statistics?.[0] || {};
    return {
      rank: index + 1,
      player: entry.player?.name || "Unknown",
      team: stats.team?.name || "TBD",
      flag: teamMeta(stats.team?.name || "").flag,
      goals: stats.goals?.total ?? 0,
      assists: stats.goals?.assists ?? 0,
      penalties: stats.penalty?.scored ?? null
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
      matches: apiSchedule(fixtures).slice(0, 80)
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
  if (apiKey) {
    try {
      log("Fetching API-FOOTBALL data.");
      data = await buildApiData();
    } catch (error) {
      log(`API fetch failed, writing fallback data: ${error.message}`);
      data = buildFallbackData();
    }
  } else {
    log("API_FOOTBALL_KEY is not set, writing fallback data.");
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
