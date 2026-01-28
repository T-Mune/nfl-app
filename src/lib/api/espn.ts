import {
  ESPNScoreboardResponse,
  ESPNEvent,
  ESPNTeamsResponse,
  ESPNTeamDetail,
  ESPNStandingsResponse,
} from '@/types/espn';
import { Game, Team, Standing } from '@/types/nfl';

const BASE_URL = 'https://site.api.espn.com/apis/site/v2/sports/football/nfl';

async function fetchFromESPN<T>(endpoint: string): Promise<T> {
  const url = `${BASE_URL}${endpoint}`;
  const response = await fetch(url, {
    next: { revalidate: 60 }, // Cache for 60 seconds
  });

  if (!response.ok) {
    throw new Error(`ESPN API Error: ${response.statusText}`);
  }

  return response.json();
}

// Convert ESPN event to our Game type
function convertESPNEventToGame(event: ESPNEvent): Game {
  const competition = event.competitions[0];
  const homeTeam = competition.competitors.find((c) => c.homeAway === 'home');
  const awayTeam = competition.competitors.find((c) => c.homeAway === 'away');
  const status = competition.status;

  const isOver = status.type.state === 'post';
  const isInProgress = status.type.state === 'in';

  return {
    GameKey: event.id,
    SeasonType: event.season.type,
    Season: event.season.year,
    Week: event.week.number,
    Date: event.date,
    AwayTeam: awayTeam?.team.abbreviation || '',
    HomeTeam: homeTeam?.team.abbreviation || '',
    AwayScore: awayTeam ? parseInt(awayTeam.score, 10) || null : null,
    HomeScore: homeTeam ? parseInt(homeTeam.score, 10) || null : null,
    Channel: competition.broadcasts?.[0]?.names.join('/') || null,
    PointSpread: null,
    OverUnder: null,
    Quarter: isInProgress ? String(status.period) : null,
    TimeRemaining: isInProgress ? status.displayClock : null,
    Possession: null,
    Down: null,
    Distance: null,
    YardLine: null,
    YardLineTerritory: null,
    RedZone: null,
    AwayScoreQuarter1: awayTeam?.linescores?.[0]?.value ?? null,
    AwayScoreQuarter2: awayTeam?.linescores?.[1]?.value ?? null,
    AwayScoreQuarter3: awayTeam?.linescores?.[2]?.value ?? null,
    AwayScoreQuarter4: awayTeam?.linescores?.[3]?.value ?? null,
    AwayScoreOvertime: awayTeam?.linescores?.[4]?.value ?? null,
    HomeScoreQuarter1: homeTeam?.linescores?.[0]?.value ?? null,
    HomeScoreQuarter2: homeTeam?.linescores?.[1]?.value ?? null,
    HomeScoreQuarter3: homeTeam?.linescores?.[2]?.value ?? null,
    HomeScoreQuarter4: homeTeam?.linescores?.[3]?.value ?? null,
    HomeScoreOvertime: homeTeam?.linescores?.[4]?.value ?? null,
    HasStarted: status.type.state !== 'pre',
    IsInProgress: isInProgress,
    IsOver: isOver,
    Has1stQuarterStarted: status.period >= 1,
    Has2ndQuarterStarted: status.period >= 2,
    Has3rdQuarterStarted: status.period >= 3,
    Has4thQuarterStarted: status.period >= 4,
    IsOvertime: status.period > 4,
    DownAndDistance: null,
    GameEndDateTime: isOver ? event.date : null,
    StadiumID: parseInt(competition.venue.id, 10),
    Closed: isOver,
    // Extended fields for ESPN
    AwayTeamName: awayTeam?.team.displayName || '',
    HomeTeamName: homeTeam?.team.displayName || '',
    AwayTeamLogo: awayTeam?.team.logo || '',
    HomeTeamLogo: homeTeam?.team.logo || '',
    StatusDetail: status.type.shortDetail,
    Venue: competition.venue.fullName,
  };
}

// Get week dates for a specific season and week
function getWeekDates(season: number, week: number): { start: string; end: string } {
  // NFL regular season typically starts first Thursday after Labor Day
  // This is an approximation - we'll use date range to fetch
  const seasonStart = new Date(season, 8, 1); // September 1

  // Find the first Thursday of September
  while (seasonStart.getDay() !== 4) {
    seasonStart.setDate(seasonStart.getDate() + 1);
  }

  // Calculate week start (weeks are 1-indexed)
  const weekStart = new Date(seasonStart);
  weekStart.setDate(weekStart.getDate() + (week - 1) * 7 - 1); // Start from Wednesday

  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekEnd.getDate() + 7);

  const formatDate = (d: Date) =>
    `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, '0')}${String(d.getDate()).padStart(2, '0')}`;

  return {
    start: formatDate(weekStart),
    end: formatDate(weekEnd),
  };
}

// Get current NFL season
export function getCurrentSeason(): number {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth() + 1;
  // NFL season starts in September, so before March we're in the previous season
  return month < 3 ? year - 1 : year;
}

// Get current week (will be determined from API response)
export function getCurrentWeek(): number {
  // Default to week 1, actual week will be fetched from API
  return 1;
}

// Get all weeks for a season
export function getSeasonWeeks(): number[] {
  return Array.from({ length: 18 }, (_, i) => i + 1);
}

// Scores (Live and Final)
export async function getScoresByWeek(
  season: number,
  week: number
): Promise<Game[]> {
  const dates = getWeekDates(season, week);
  const data = await fetchFromESPN<ESPNScoreboardResponse>(
    `/scoreboard?dates=${dates.start}-${dates.end}`
  );

  // Filter events by the requested week
  const weekEvents = data.events.filter(
    (event) => event.week.number === week && event.season.year === season
  );

  return weekEvents.map(convertESPNEventToGame);
}

// Get current scoreboard (live scores)
export async function getLiveScores(): Promise<{ games: Game[]; week: number; season: number }> {
  const data = await fetchFromESPN<ESPNScoreboardResponse>('/scoreboard');

  return {
    games: data.events.map(convertESPNEventToGame),
    week: data.week?.number || 1,
    season: data.season?.year || getCurrentSeason(),
  };
}

// Teams
export async function getTeams(): Promise<Team[]> {
  const data = await fetchFromESPN<ESPNTeamsResponse>('/teams');

  const teams: Team[] = [];
  for (const sport of data.sports) {
    for (const league of sport.leagues) {
      for (const { team } of league.teams) {
        teams.push(convertESPNTeamToTeam(team));
      }
    }
  }

  return teams;
}

function convertESPNTeamToTeam(team: ESPNTeamDetail): Team {
  return {
    TeamID: parseInt(team.id, 10),
    Key: team.abbreviation,
    City: team.location,
    Name: team.name,
    Conference: '', // Will be filled from standings if needed
    Division: '',
    FullName: team.displayName,
    StadiumID: 0,
    ByeWeek: 0,
    HeadCoach: '',
    PrimaryColor: team.color || '',
    SecondaryColor: team.alternateColor || '',
    WikipediaLogoURL: team.logo,
    WikipediaWordMarkURL: '',
  };
}

export async function getTeam(teamKey: string): Promise<Team | undefined> {
  const teams = await getTeams();
  return teams.find((team) => team.Key === teamKey);
}

// Standings
export async function getStandings(season: number): Promise<Standing[]> {
  const data = await fetchFromESPN<ESPNStandingsResponse>(
    `/standings?season=${season}`
  );

  const standings: Standing[] = [];

  for (const conference of data.children) {
    for (const division of conference.standings?.entries || []) {
      // ESPN standings structure varies, handle appropriately
      const team = division.team;
      const stats = division.stats || [];

      const getStat = (name: string) =>
        stats.find((s) => s.name === name)?.value || 0;

      standings.push({
        SeasonType: 2,
        Season: season,
        Conference: conference.abbreviation,
        Division: '', // ESPN groups differently
        Team: team.abbreviation,
        Name: team.displayName,
        Wins: getStat('wins'),
        Losses: getStat('losses'),
        Ties: getStat('ties'),
        Percentage: getStat('winPercent'),
        PointsFor: getStat('pointsFor'),
        PointsAgainst: getStat('pointsAgainst'),
        NetPoints: getStat('pointDifferential'),
        Touchdowns: 0,
        DivisionWins: getStat('divisionWins'),
        DivisionLosses: getStat('divisionLosses'),
        ConferenceWins: getStat('conferenceWins'),
        ConferenceLosses: getStat('conferenceLosses'),
        TeamID: parseInt(team.id, 10),
        DivisionTies: 0,
        ConferenceTies: 0,
        HomeWins: getStat('homeWins'),
        HomeLosses: getStat('homeLosses'),
        AwayWins: getStat('awayWins'),
        AwayLosses: getStat('awayLosses'),
        Streak: 0,
        DivisionRank: 0,
        ConferenceRank: 0,
      });
    }
  }

  return standings;
}

// Helper functions
export function formatGameDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('ja-JP', {
    month: 'short',
    day: 'numeric',
    weekday: 'short',
  });
}

export function formatGameTime(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleTimeString('ja-JP', {
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function getGameStatus(game: Game): string {
  if (game.IsOver || game.Closed) {
    return 'Final';
  }
  if (game.IsInProgress) {
    if (game.Quarter && game.TimeRemaining) {
      return `Q${game.Quarter} ${game.TimeRemaining}`;
    }
    return 'In Progress';
  }
  // Use StatusDetail if available (from ESPN)
  if ((game as Game & { StatusDetail?: string }).StatusDetail) {
    return (game as Game & { StatusDetail?: string }).StatusDetail!;
  }
  return formatGameTime(game.Date);
}

// Group standings by division
export function groupStandingsByDivision(
  standings: Standing[]
): Record<string, Standing[]> {
  const grouped: Record<string, Standing[]> = {};

  standings.forEach((standing) => {
    const key = `${standing.Conference} ${standing.Division}`.trim();
    if (!grouped[key]) {
      grouped[key] = [];
    }
    grouped[key].push(standing);
  });

  // Sort each division by wins (descending)
  Object.keys(grouped).forEach((key) => {
    grouped[key].sort((a, b) => {
      if (b.Wins !== a.Wins) return b.Wins - a.Wins;
      if (b.Percentage !== a.Percentage) return b.Percentage - a.Percentage;
      return b.NetPoints - a.NetPoints;
    });
  });

  return grouped;
}
