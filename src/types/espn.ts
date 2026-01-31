// ESPN API Types

export interface ESPNScoreboardResponse {
  leagues: ESPNLeague[];
  season: {
    type: number;
    year: number;
  };
  week: {
    number: number;
  };
  events: ESPNEvent[];
}

export interface ESPNLeague {
  id: string;
  name: string;
  abbreviation: string;
  calendar: ESPNCalendarEntry[];
}

export interface ESPNCalendarEntry {
  label: string;
  value: string;
  startDate: string;
  endDate: string;
  entries?: ESPNCalendarWeek[];
}

export interface ESPNCalendarWeek {
  label: string;
  value: string;
  detail: string;
  startDate: string;
  endDate: string;
}

export interface ESPNEvent {
  id: string;
  date: string;
  name: string;
  shortName: string;
  season: {
    year: number;
    type: number;
  };
  week: {
    number: number;
  };
  competitions: ESPNCompetition[];
  status: ESPNStatus;
}

export interface ESPNCompetition {
  id: string;
  date: string;
  attendance: number;
  venue: ESPNVenue;
  competitors: ESPNCompetitor[];
  status: ESPNStatus;
  broadcasts?: ESPNBroadcast[];
  headlines?: ESPNHeadline[];
}

export interface ESPNVenue {
  id: string;
  fullName: string;
  address: {
    city: string;
    state?: string;
    country?: string;
  };
  indoor: boolean;
}

export interface ESPNCompetitor {
  id: string;
  type: string;
  order: number;
  homeAway: 'home' | 'away';
  winner?: boolean;
  team: ESPNTeam;
  score: string;
  linescores?: ESPNLinescore[];
  records?: ESPNRecord[];
}

export interface ESPNTeam {
  id: string;
  location: string;
  name: string;
  abbreviation: string;
  displayName: string;
  shortDisplayName: string;
  color?: string;
  alternateColor?: string;
  logo: string;
  links?: ESPNLink[];
}

export interface ESPNLinescore {
  value: number;
  displayValue: string;
  period: number;
}

export interface ESPNRecord {
  name: string;
  type: string;
  summary: string;
}

export interface ESPNStatus {
  clock: number;
  displayClock: string;
  period: number;
  type: {
    id: string;
    name: string;
    state: 'pre' | 'in' | 'post';
    completed: boolean;
    description: string;
    detail: string;
    shortDetail: string;
  };
}

export interface ESPNBroadcast {
  market: string;
  names: string[];
}

export interface ESPNHeadline {
  type: string;
  description: string;
  shortLinkText?: string;
}

export interface ESPNLink {
  rel: string[];
  href: string;
  text: string;
}

// ESPN Teams Response
export interface ESPNTeamsResponse {
  sports: {
    leagues: {
      teams: { team: ESPNTeamDetail }[];
    }[];
  }[];
}

export interface ESPNTeamDetail extends ESPNTeam {
  uid: string;
  slug: string;
  record?: {
    items: {
      summary: string;
      stats: { name: string; value: number }[];
    }[];
  };
  standingSummary?: string;
}

// ESPN Standings Response
export interface ESPNStandingsResponse {
  children: ESPNConferenceStandings[];
}

export interface ESPNConferenceStandings {
  name: string;
  abbreviation: string;
  standings: {
    entries: ESPNStandingEntry[];
  };
}

export interface ESPNStandingEntry {
  team: ESPNTeam;
  stats: {
    name: string;
    displayName: string;
    value: number;
    displayValue: string;
  }[];
}

// ESPN News API Types
export interface ESPNNewsResponse {
  header: string;
  articles: ESPNArticle[];
}

export interface ESPNArticle {
  id: number;
  headline: string;
  description: string;
  published: string; // ISO 8601
  lastModified: string;
  premium: boolean;
  images?: ESPNNewsImage[];
  categories?: ESPNNewsCategory[];
  links: {
    web: { href: string };
  };
  byline?: string;
}

export interface ESPNNewsImage {
  id: number;
  type: string;
  url: string;
  caption?: string;
  alt?: string;
  credit?: string;
  height: number;
  width: number;
}

export interface ESPNNewsCategory {
  id: number;
  description: string;
  type: string; // "team" | "athlete" | "league" | "topic"
}
