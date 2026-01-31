import {
  ESPNScoreboardResponse,
  ESPNEvent,
  ESPNTeamsResponse,
  ESPNTeamDetail,
  ESPNStandingsResponse,
} from '@/types/espn';
import { Game, Team, Standing } from '@/types/nfl';

const BASE_URL = 'https://site.api.espn.com/apis/site/v2/sports/football/nfl';

// Season types
export enum SeasonType {
  PRESEASON = 1,
  REGULAR = 2,
  POSTSEASON = 3,
}

export function getSeasonTypeLabel(type: number): string {
  switch (type) {
    case SeasonType.PRESEASON:
      return 'Preseason';
    case SeasonType.REGULAR:
      return 'Regular Season';
    case SeasonType.POSTSEASON:
      return 'Postseason';
    default:
      return 'Unknown';
  }
}

export function getSeasonTypeShortLabel(type: number): string {
  switch (type) {
    case SeasonType.PRESEASON:
      return 'PRE';
    case SeasonType.REGULAR:
      return 'REG';
    case SeasonType.POSTSEASON:
      return 'POST';
    default:
      return '';
  }
}

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

// Get all weeks for a season type
export function getSeasonWeeks(seasonType: number = SeasonType.REGULAR): number[] {
  switch (seasonType) {
    case SeasonType.PRESEASON:
      return Array.from({ length: 4 }, (_, i) => i + 1); // 4 preseason weeks
    case SeasonType.REGULAR:
      return Array.from({ length: 18 }, (_, i) => i + 1); // 18 regular season weeks
    case SeasonType.POSTSEASON:
      return Array.from({ length: 5 }, (_, i) => i + 1); // Wild Card, Divisional, Conference, Pro Bowl, Super Bowl
    default:
      return Array.from({ length: 18 }, (_, i) => i + 1);
  }
}

// Scores (Live and Final)
export async function getScoresByWeek(
  season: number,
  week: number,
  seasonType: number = SeasonType.REGULAR
): Promise<Game[]> {
  // For non-regular season, we'll fetch all events and filter by week
  // The API's calendar provides proper date ranges for each season type
  const data = await fetchFromESPN<ESPNScoreboardResponse>(
    `/scoreboard?seasontype=${seasonType}&week=${week}`
  );

  // Filter events by the requested week, season, and season type
  const weekEvents = data.events.filter(
    (event) =>
      event.week.number === week &&
      event.season.year === season &&
      event.season.type === seasonType
  );

  return weekEvents.map(convertESPNEventToGame);
}

// Get current scoreboard (live scores)
export async function getLiveScores(): Promise<{
  games: Game[];
  week: number;
  season: number;
  seasonType: number;
}> {
  const data = await fetchFromESPN<ESPNScoreboardResponse>('/scoreboard');

  return {
    games: data.events.map(convertESPNEventToGame),
    week: data.week?.number || 1,
    season: data.season?.year || getCurrentSeason(),
    seasonType: data.season?.type || SeasonType.REGULAR,
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

// Standings (uses different base URL)
export async function getStandings(season: number): Promise<Standing[]> {
  const url = `https://site.web.api.espn.com/apis/v2/sports/football/nfl/standings?season=${season}`;
  const response = await fetch(url, {
    next: { revalidate: 60 },
  });

  if (!response.ok) {
    throw new Error(`ESPN Standings API Error: ${response.statusText}`);
  }

  const data = await response.json();

  const standings: Standing[] = [];

  // Handle the ESPN standings structure
  const conferences = data.children || [];

  for (const conference of conferences) {
    const entries = conference.standings?.entries || [];

    for (const entry of entries) {
      const team = entry.team;
      if (!team) continue;

      const stats = entry.stats || [];

      const getStat = (name: string): number => {
        const stat = stats.find((s: { name: string; value: number }) => s.name === name);
        return stat?.value || 0;
      };

      standings.push({
        SeasonType: 2,
        Season: season,
        Conference: conference.abbreviation || '',
        Division: '', // ESPN groups by conference, not division
        Team: team.abbreviation || '',
        Name: team.displayName || team.name || '',
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
        ConferenceWins: 0,
        ConferenceLosses: 0,
        TeamID: parseInt(team.id, 10) || 0,
        DivisionTies: 0,
        ConferenceTies: 0,
        HomeWins: 0,
        HomeLosses: 0,
        AwayWins: 0,
        AwayLosses: 0,
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

// ============ Team Roster ============

export interface ESPNRosterResponse {
  team: {
    id: string;
    abbreviation: string;
    displayName: string;
    color: string;
    logo: string;
  };
  athletes: ESPNRosterGroup[];
}

export interface ESPNRosterGroup {
  position: string;
  items: ESPNAthlete[];
}

export interface ESPNAthlete {
  id: string;
  firstName: string;
  lastName: string;
  fullName: string;
  displayName: string;
  weight?: number;
  displayWeight?: string;
  height?: number;
  displayHeight?: string;
  age?: number;
  dateOfBirth?: string;
  jersey?: string;
  position?: {
    abbreviation: string;
    displayName: string;
  };
  college?: {
    name: string;
    shortName: string;
  };
  headshot?: {
    href: string;
  };
  experience?: {
    years: number;
  };
  status?: {
    type: string;
    name: string;
  };
}

export interface RosterPlayer {
  id: string;
  firstName: string;
  lastName: string;
  fullName: string;
  jersey: string;
  position: string;
  positionGroup: string;
  height: string;
  weight: string;
  age: number;
  college: string;
  experience: number;
  headshot: string;
  status: string;
}

// Get team roster
export async function getTeamRoster(teamId: string): Promise<RosterPlayer[]> {
  const data = await fetchFromESPN<ESPNRosterResponse>(`/teams/${teamId}/roster`);

  const players: RosterPlayer[] = [];

  for (const group of data.athletes || []) {
    for (const athlete of group.items || []) {
      players.push({
        id: athlete.id,
        firstName: athlete.firstName,
        lastName: athlete.lastName,
        fullName: athlete.fullName || athlete.displayName,
        jersey: athlete.jersey || '-',
        position: athlete.position?.abbreviation || '',
        positionGroup: group.position,
        height: athlete.displayHeight || '-',
        weight: athlete.displayWeight || '-',
        age: athlete.age || 0,
        college: athlete.college?.shortName || athlete.college?.name || '-',
        experience: athlete.experience?.years || 0,
        headshot: athlete.headshot?.href || '',
        status: athlete.status?.name || 'Active',
      });
    }
  }

  return players;
}

// Get team by ID (ESPN uses numeric IDs)
export async function getTeamById(teamId: string): Promise<Team | undefined> {
  const teams = await getTeams();
  return teams.find((team) => String(team.TeamID) === teamId);
}

// Get team ID from abbreviation (e.g., "KC" -> "12")
export async function getTeamIdFromAbbreviation(abbr: string): Promise<string | undefined> {
  const teams = await getTeams();
  const team = teams.find((t) => t.Key.toUpperCase() === abbr.toUpperCase());
  return team ? String(team.TeamID) : undefined;
}
