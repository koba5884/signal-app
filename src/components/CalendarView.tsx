import type { DailyRecord } from '../lib/types';
import { calcScoreZone, ZONE_CONFIG } from '../lib/scoring';

type Props = {
  records: DailyRecord[];
};

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfMonth(year: number, month: number) {
  return new Date(year, month, 1).getDay();
}

export function CalendarView({ records }: Props) {
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth();

  const recordMap = new Map<string, DailyRecord>();
  records.forEach((r) => recordMap.set(r.date, r));

  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfMonth(year, month);

  const monthStr = `${year}-${String(month + 1).padStart(2, '0')}`;

  const cells: (number | null)[] = [...Array(firstDay).fill(null), ...Array.from({ length: daysInMonth }, (_, i) => i + 1)];
  while (cells.length % 7 !== 0) cells.push(null);

  const dayLabels = ['日', '月', '火', '水', '木', '金', '土'];

  return (
    <div className="bg-slate-800 rounded-xl p-4 border border-slate-700">
      <p className="text-xs text-slate-400 mb-3">
        {year}年{month + 1}月
      </p>
      <div className="grid grid-cols-7 gap-1 mb-1">
        {dayLabels.map((d) => (
          <div key={d} className="text-center text-xs text-slate-500 py-0.5">
            {d}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1">
        {cells.map((day, i) => {
          if (day === null) return <div key={`empty-${i}`} />;
          const dateStr = `${monthStr}-${String(day).padStart(2, '0')}`;
          const record = recordMap.get(dateStr);
          const isToday =
            today.getDate() === day &&
            today.getMonth() === month &&
            today.getFullYear() === year;

          let bg = 'bg-slate-700/30';
          let textColor = 'text-slate-500';
          if (record) {
            const zone = calcScoreZone(record.total_score);
            const cfg = ZONE_CONFIG[zone];
            bg = cfg.bg;
            textColor = 'text-slate-200';
          }

          return (
            <div
              key={dateStr}
              className={`aspect-square rounded flex items-center justify-center text-xs ${bg} ${textColor} ${
                isToday ? 'ring-1 ring-blue-400' : ''
              }`}
            >
              {day}
            </div>
          );
        })}
      </div>
      <div className="flex gap-3 mt-3 flex-wrap text-xs">
        {Object.entries(ZONE_CONFIG).map(([zone, cfg]) => (
          <div key={zone} className="flex items-center gap-1">
            <div className={`w-3 h-3 rounded ${cfg.bg} border ${cfg.border}`} />
            <span className="text-slate-400">{cfg.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
