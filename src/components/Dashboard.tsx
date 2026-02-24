import type { DailyRecord } from '../lib/types';
import { ScoreDisplay } from './ScoreDisplay';
import { TrendChart } from './TrendChart';
import { QuadrantChart } from './QuadrantChart';
import { CalendarView } from './CalendarView';
import { AlertBanner } from './AlertBanner';
import { calcAxes } from '../lib/scoring';
import { useAlerts } from '../hooks/useAlerts';

type Props = {
  records: DailyRecord[];
  loading: boolean;
};

export function Dashboard({ records, loading }: Props) {
  const today = new Date().toISOString().slice(0, 10);
  const todayRecord = records.find((r) => r.date === today);
  const alerts = useAlerts(records);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <p className="text-slate-400">読み込み中...</p>
      </div>
    );
  }

  return (
    <div className="pb-6">
      <div className="px-4 pt-5 pb-3">
        <h1 className="text-slate-100 text-lg font-semibold">ダッシュボード</h1>
      </div>

      <div className="px-4 space-y-4">
        {alerts.length > 0 && <AlertBanner alerts={alerts} />}

        {todayRecord ? (
          (() => {
            const { energy, direction } = calcAxes(todayRecord);
            return (
              <ScoreDisplay
                totalScore={todayRecord.total_score}
                energy={energy}
                direction={direction}
              />
            );
          })()
        ) : (
          <div className="bg-slate-800 rounded-xl p-5 border border-slate-700 text-center">
            <p className="text-slate-400 text-sm">今日のチェックはまだです</p>
            <p className="text-slate-500 text-xs mt-1">「入力」タブからチェックしてください</p>
          </div>
        )}

        <TrendChart records={records} />
        <QuadrantChart records={records} />
        <CalendarView records={records} />
      </div>
    </div>
  );
}
