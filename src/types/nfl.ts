// NFL Team
export interface Team {
  TeamID: number;
  Key: string;
  City: string;
  Name: string;
  Conference: string;
  Division: string;
  FullName: string;
  StadiumID: number;
  ByeWeek: number;
  HeadCoach: string;
  PrimaryColor: string;
  SecondaryColor: string;
  WikipediaLogoURL: string;
  WikipediaWordMarkURL: string;
}

// NFL Player
export interface Player {
  PlayerID: number;
  Team: string;
  Number: number;
  FirstName: string;
  LastName: string;
  Position: string;
  Status: string;
  Height: string;
  Weight: number;
  BirthDate: string;
  College: string;
  Experience: number;
  FantasyPosition: string;
  Active: boolean;
  PhotoUrl: string;
}

// NFL Game/Score
export interface Game {
  GameKey: string;
  SeasonType: number;
  Season: number;
  Week: number;
  Date: string;
  AwayTeam: string;
  HomeTeam: string;
  AwayScore: number | null;
  HomeScore: number | null;
  Channel: string | null;
  PointSpread: number | null;
  OverUnder: number | null;
  Quarter: string | null;
  TimeRemaining: string | null;
  Possession: string | null;
  Down: number | null;
  Distance: number | null;
  YardLine: number | null;
  YardLineTerritory: string | null;
  RedZone: boolean | null;
  AwayScoreQuarter1: number | null;
  AwayScoreQuarter2: number | null;
  AwayScoreQuarter3: number | null;
  AwayScoreQuarter4: number | null;
  AwayScoreOvertime: number | null;
  HomeScoreQuarter1: number | null;
  HomeScoreQuarter2: number | null;
  HomeScoreQuarter3: number | null;
  HomeScoreQuarter4: number | null;
  HomeScoreOvertime: number | null;
  HasStarted: boolean;
  IsInProgress: boolean;
  IsOver: boolean;
  Has1stQuarterStarted: boolean;
  Has2ndQuarterStarted: boolean;
  Has3rdQuarterStarted: boolean;
  Has4thQuarterStarted: boolean;
  IsOvertime: boolean;
  DownAndDistance: string | null;
  GameEndDateTime: string | null;
  StadiumID: number;
  Closed: boolean;
  // ESPN extended fields
  AwayTeamName?: string;
  HomeTeamName?: string;
  AwayTeamLogo?: string;
  HomeTeamLogo?: string;
  StatusDetail?: string;
  Venue?: string;
}

// NFL Schedule (simplified game info)
export interface Schedule {
  GameKey: string;
  SeasonType: number;
  Season: number;
  Week: number;
  Date: string;
  AwayTeam: string;
  HomeTeam: string;
  Channel: string;
  PointSpread: number | null;
  OverUnder: number | null;
  StadiumID: number;
}

// NFL Standing
export interface Standing {
  SeasonType: number;
  Season: number;
  Conference: string;
  Division: string;
  Team: string;
  Name: string;
  Wins: number;
  Losses: number;
  Ties: number;
  Percentage: number;
  PointsFor: number;
  PointsAgainst: number;
  NetPoints: number;
  Touchdowns: number;
  DivisionWins: number;
  DivisionLosses: number;
  ConferenceWins: number;
  ConferenceLosses: number;
  TeamID: number;
  DivisionTies: number;
  ConferenceTies: number;
  HomeWins: number;
  HomeLosses: number;
  AwayWins: number;
  AwayLosses: number;
  Streak: number;
  DivisionRank: number;
  ConferenceRank: number;
}

// Player Season Stats
export interface PlayerSeasonStats {
  PlayerID: number;
  Name: string;
  Team: string;
  Position: string;
  PassingYards: number;
  PassingTouchdowns: number;
  PassingInterceptions: number;
  RushingYards: number;
  RushingTouchdowns: number;
  ReceivingYards: number;
  ReceivingTouchdowns: number;
  Receptions: number;
  Tackles: number;
  Sacks: number;
  Interceptions: number;
}

// API Response types
export interface APIError {
  message: string;
  status: number;
}

// Season type enum
export enum SeasonType {
  Preseason = 1,
  Regular = 2,
  Postseason = 3,
}

// NFL Conferences and Divisions
export const NFL_CONFERENCES = ['AFC', 'NFC'] as const;
export const NFL_DIVISIONS = ['East', 'North', 'South', 'West'] as const;

export type Conference = (typeof NFL_CONFERENCES)[number];
export type Division = (typeof NFL_DIVISIONS)[number];
