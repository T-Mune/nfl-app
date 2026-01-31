'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { getSeasonTypeLabel, getSeasonTypeShortLabel } from '@/lib/api/espn';

interface WeekSelectorProps {
  weeks: number[];
  currentWeek: number;
  season: number;
  seasonType: number;
  currentSeason: number;
  currentSeasonType?: number;
}

export function WeekSelector({
  weeks,
  currentWeek,
  season,
  seasonType,
  currentSeason,
}: WeekSelectorProps) {
  const prevWeek = currentWeek > 1 ? currentWeek - 1 : null;
  const nextWeek = currentWeek < weeks.length ? currentWeek + 1 : null;

  const buildUrl = (w: number, s?: number, st?: number) => {
    const params = new URLSearchParams();
    params.set('week', String(w));
    params.set('season', String(s ?? season));
    params.set('seasonType', String(st ?? seasonType));
    return `/?${params.toString()}`;
  };

  return (
    <div className="flex flex-wrap items-center gap-2">
      {/* Previous Week */}
      {prevWeek ? (
        <Link href={buildUrl(prevWeek)}>
          <Button variant="outline" size="sm" className="hidden sm:flex">
            ← Week {prevWeek}
          </Button>
          <Button variant="outline" size="sm" className="sm:hidden">
            ←
          </Button>
        </Link>
      ) : (
        <Button variant="outline" size="sm" disabled className="hidden sm:flex">
          ← Week 0
        </Button>
      )}

      {/* Season Type Selector */}
      <select
        value={seasonType}
        onChange={(e) => {
          const newSeasonType = parseInt(e.target.value, 10);
          window.location.href = buildUrl(1, season, newSeasonType);
        }}
        className="h-9 rounded-md border border-input bg-background px-2 sm:px-3 py-1 text-xs sm:text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring"
        title={getSeasonTypeLabel(seasonType)}
      >
        <option value={1}>{getSeasonTypeShortLabel(1)}</option>
        <option value={2}>{getSeasonTypeShortLabel(2)}</option>
        <option value={3}>{getSeasonTypeShortLabel(3)}</option>
      </select>

      {/* Week Dropdown */}
      <select
        value={currentWeek}
        onChange={(e) => {
          const week = parseInt(e.target.value, 10);
          window.location.href = buildUrl(week);
        }}
        className="h-9 rounded-md border border-input bg-background px-2 sm:px-3 py-1 text-xs sm:text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring"
      >
        {weeks.map((week) => (
          <option key={week} value={week}>
            Week {week}
          </option>
        ))}
      </select>

      {/* Season Selector */}
      <select
        value={season}
        onChange={(e) => {
          const newSeason = parseInt(e.target.value, 10);
          window.location.href = buildUrl(currentWeek, newSeason);
        }}
        className="h-9 rounded-md border border-input bg-background px-2 sm:px-3 py-1 text-xs sm:text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring"
      >
        {[currentSeason, currentSeason - 1, currentSeason - 2].map((s) => (
          <option key={s} value={s}>
            {s}
          </option>
        ))}
      </select>

      {/* Next Week */}
      {nextWeek ? (
        <Link href={buildUrl(nextWeek)}>
          <Button variant="outline" size="sm" className="hidden sm:flex">
            Week {nextWeek} →
          </Button>
          <Button variant="outline" size="sm" className="sm:hidden">
            →
          </Button>
        </Link>
      ) : (
        <Button variant="outline" size="sm" disabled className="hidden sm:flex">
          Week {weeks.length + 1} →
        </Button>
      )}
    </div>
  );
}
