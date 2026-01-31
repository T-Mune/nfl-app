'use client';

import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Standing } from '@/types/nfl';
import { OverallTable } from './OverallTable';
import { ConferenceView } from './ConferenceView';
import { DivisionView } from './DivisionView';

type ViewMode = 'overall' | 'conference' | 'division';

interface StandingsSelectorProps {
  standings: Record<string, Standing[]>;
  season: number;
}

export function StandingsSelector({
  standings,
  season,
}: StandingsSelectorProps) {
  const [viewMode, setViewMode] = useState<ViewMode>('division');

  // フラット化して全チーム取得
  const allTeams = Object.values(standings).flat();

  // Overall: 全チームを勝率順にソート
  const sortedTeams = [...allTeams].sort((a, b) => {
    if (b.Percentage !== a.Percentage) return b.Percentage - a.Percentage;
    if (b.Wins !== a.Wins) return b.Wins - a.Wins;
    return b.NetPoints - a.NetPoints;
  });

  // Conference: AFC/NFCごとに16チームずつ
  const afcTeams = allTeams
    .filter((team) => team.Conference === 'AFC')
    .sort((a, b) => {
      if (b.Percentage !== a.Percentage) return b.Percentage - a.Percentage;
      if (b.Wins !== a.Wins) return b.Wins - a.Wins;
      return b.NetPoints - a.NetPoints;
    });

  const nfcTeams = allTeams
    .filter((team) => team.Conference === 'NFC')
    .sort((a, b) => {
      if (b.Percentage !== a.Percentage) return b.Percentage - a.Percentage;
      if (b.Wins !== a.Wins) return b.Wins - a.Wins;
      return b.NetPoints - a.NetPoints;
    });

  return (
    <div>
      <Tabs value={viewMode} onValueChange={(v) => setViewMode(v as ViewMode)}>
        <TabsList className="mb-4 grid grid-cols-3 w-full sm:w-auto">
          <TabsTrigger value="overall" className="text-sm sm:text-base">
            Overall
          </TabsTrigger>
          <TabsTrigger value="conference" className="text-sm sm:text-base">
            Conference
          </TabsTrigger>
          <TabsTrigger value="division" className="text-sm sm:text-base">
            Division
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overall">
          <OverallTable teams={sortedTeams} season={season} />
        </TabsContent>

        <TabsContent value="conference">
          <ConferenceView afcTeams={afcTeams} nfcTeams={nfcTeams} />
        </TabsContent>

        <TabsContent value="division">
          <DivisionView standings={standings} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
