import {
  Team,
  Player,
  Game,
  Schedule,
  Standing,
  APIError,
} from '@/types/nfl';

const BASE_URL = 'https://api.sportsdata.io/v3/nfl';
const API_KEY = process.env.SPORTSDATA_API_KEY;

async function fetchFromAPI<T>(endpoint: string): Promise<T> {
  if (!API_KEY) {
    throw new Error('SPORTSDATA_API_KEY is not configured');
  }

  const url = `${BASE_URL}${endpoint}`;
  const response = await fetch(url, {
    headers: {
      'Ocp-Apim-Subscription-Key': API_KEY,
    },
    next: { revalidate: 60 }, // Cache for 60 seconds
  });

  if (!response.ok) {
    const error: APIError = {
      message: `API Error: ${response.statusText}`,
      status: response.status,
    };
    throw error;
  }

  return response.json();
}

// Get current NFL season
export function getCurrentSeason(): number {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth() + 1;
  // NFL season starts in September, so before September we're in the previous season
  return month < 9 ? year - 1 : year;
}

// Get current week (approximate)
export function getCurrentWeek(): number {
  const now = new Date();
  const seasonStart = new Date(getCurrentSeason(), 8, 1); // September 1st
  const diffWeeks = Math.floor(
    (now.getTime() - seasonStart.getTime()) / (7 * 24 * 60 * 60 * 1000)
  );
  return Math.max(1, Math.min(18, diffWeeks + 1));
}

// Teams
export async function getTeams(): Promise<Team[]> {
  return fetchFromAPI<Team[]>('/scores/json/Teams');
}

export async function getTeam(teamKey: string): Promise<Team | undefined> {
  const teams = await getTeams();
  return teams.find((team) => team.Key === teamKey);
}

// Players
export async function getPlayers(): Promise<Player[]> {
  return fetchFromAPI<Player[]>('/stats/json/Players');
}

export async function getPlayersByTeam(teamKey: string): Promise<Player[]> {
  return fetchFromAPI<Player[]>(`/stats/json/Players/${teamKey}`);
}

export async function getPlayer(playerId: number): Promise<Player> {
  return fetchFromAPI<Player>(`/stats/json/Player/${playerId}`);
}

// Scores (Live and Final)
export async function getScoresByWeek(
  season: number,
  week: number
): Promise<Game[]> {
  return fetchFromAPI<Game[]>(`/scores/json/ScoresByWeek/${season}/${week}`);
}

export async function getLiveScores(): Promise<Game[]> {
  const season = getCurrentSeason();
  const week = getCurrentWeek();
  return getScoresByWeek(season, week);
}

// Schedule
export async function getSchedule(season: number): Promise<Schedule[]> {
  return fetchFromAPI<Schedule[]>(`/scores/json/Schedules/${season}`);
}

export async function getScheduleByWeek(
  season: number,
  week: number
): Promise<Schedule[]> {
  const schedule = await getSchedule(season);
  return schedule.filter((game) => game.Week === week);
}

// Standings
export async function getStandings(season: number): Promise<Standing[]> {
  return fetchFromAPI<Standing[]>(`/scores/json/Standings/${season}`);
}

// Group standings by division
export function groupStandingsByDivision(
  standings: Standing[]
): Record<string, Standing[]> {
  const grouped: Record<string, Standing[]> = {};

  standings.forEach((standing) => {
    const key = `${standing.Conference} ${standing.Division}`;
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

// Helper to format game date
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

// Get game status text
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
  return formatGameTime(game.Date);
}

// Get all scores for a season (past game results)
export async function getScoresBySeason(season: number): Promise<Game[]> {
  return fetchFromAPI<Game[]>(`/scores/json/Scores/${season}`);
}

// Get scores by specific date (format: YYYY-MM-DD)
export async function getScoresByDate(date: string): Promise<Game[]> {
  return fetchFromAPI<Game[]>(`/scores/json/ScoresByDate/${date}`);
}

// Get completed games only
export async function getCompletedGamesByWeek(
  season: number,
  week: number
): Promise<Game[]> {
  const games = await getScoresByWeek(season, week);
  return games.filter((game) => game.IsOver || game.Closed);
}

// Get all weeks with games for a season
export function getSeasonWeeks(): number[] {
  return Array.from({ length: 18 }, (_, i) => i + 1);
}
