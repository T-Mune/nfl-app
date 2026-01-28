'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';

interface WeekSelectorProps {
  weeks: number[];
  currentWeek: number;
  season: number;
  currentSeason: number;
}

export function WeekSelector({
  weeks,
  currentWeek,
  season,
  currentSeason,
}: WeekSelectorProps) {
  const prevWeek = currentWeek > 1 ? currentWeek - 1 : null;
  const nextWeek = currentWeek < 18 ? currentWeek + 1 : null;

  return (
    <div className="flex items-center gap-2">
      {/* Previous Week */}
      {prevWeek ? (
        <Link href={`/?season=${season}&week=${prevWeek}`}>
          <Button variant="outline" size="sm">
            ← Week {prevWeek}
          </Button>
        </Link>
      ) : (
        <Button variant="outline" size="sm" disabled>
          ← Week 0
        </Button>
      )}

      {/* Week Dropdown */}
      <select
        value={currentWeek}
        onChange={(e) => {
          const week = e.target.value;
          window.location.href = `/?season=${season}&week=${week}`;
        }}
        className="h-9 rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring"
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
          const newSeason = e.target.value;
          window.location.href = `/?season=${newSeason}&week=${currentWeek}`;
        }}
        className="h-9 rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring"
      >
        {[currentSeason, currentSeason - 1, currentSeason - 2].map((s) => (
          <option key={s} value={s}>
            {s}
          </option>
        ))}
      </select>

      {/* Next Week */}
      {nextWeek ? (
        <Link href={`/?season=${season}&week=${nextWeek}`}>
          <Button variant="outline" size="sm">
            Week {nextWeek} →
          </Button>
        </Link>
      ) : (
        <Button variant="outline" size="sm" disabled>
          Week 19 →
        </Button>
      )}
    </div>
  );
}
