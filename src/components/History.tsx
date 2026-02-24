import { useState } from 'react';
import type { DailyRecord } from '../lib/types';
import { calcScoreZone, ZONE_CONFIG, calcAxes } from '../lib/scoring';
import { QUESTIONS } from '../config/questions';

type Props = {
  records: DailyRecord[];
  loading: boolean;
};

const OPTION_LABELS = ['C', 'B', 'A'];

function formatDate(dateStr: string): string {
  // "2026-02-24T15:00:00.000Z" や "2026-02-24" を "2026/02/24" に整形
  return dateStr.slice(0, 10).replace(/-/g, '/');
}

function formatTimestamp(ts: string): string {
  if (!ts) return '';
  try {
    const d = new Date(ts);
    if (isNaN(d.getTime())) return ts;
    return d.toLocaleString('ja-JP', {
      year: 'numeric', month: '2-digit', day: '2-digit',
      hour: '2-digit', minute: '2-digit',
    });
  } catch {
    return ts;
  }
}

export function History({ records, loading }: Props) {
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <p className="text-slate-400">読み込み中...</p>
      </div>
    );
  }

  const sorted = [...records].sort((a, b) => b.date.localeCompare(a.date));
  const selectedRecord = sorted.find((r) => r.date === selectedDate);

  return (
    <div className="pb-6">
      <div className="px-4 pt-5 pb-3">
        <h1 className="text-slate-100 text-lg font-semibold">履歴</h1>
      </div>

      {selectedRecord && (
        <div className="px-4 mb-4">
          <div className="bg-slate-800 rounded-xl p-4 border border-slate-700">
            <div className="flex items-center justify-between mb-3">
              <div>
                <p className="text-slate-200 font-medium">{formatDate(selectedRecord.date)}</p>
                {selectedRecord.timestamp && (
                  <p className="text-slate-400 text-xs mt-0.5">入力: {formatTimestamp(selectedRecord.timestamp)}</p>
                )}
              </div>
              <button
                onClick={() => setSelectedDate(null)}
                className="text-slate-400 text-xs hover:text-slate-200"
              >
                閉じる
              </button>
            </div>
            <div className="space-y-2">
              {QUESTIONS.map((q) => {
                const val = selectedRecord[q.id as keyof DailyRecord] as number;
                return (
                  <div key={q.id} className="flex items-center gap-2 text-sm">
                    <span
                      className={`text-xs font-bold w-4 text-center ${
                        val === 2 ? 'text-green-400' : val === 1 ? 'text-yellow-400' : 'text-red-400'
                      }`}
                    >
                      {OPTION_LABELS[val]}
                    </span>
                    <span className="text-slate-300 flex-1 truncate">{q.label}</span>
                  </div>
                );
              })}
            </div>
            {selectedRecord.memo && (
              <div className="mt-3 pt-3 border-t border-slate-700">
                <p className="text-xs text-slate-400 mb-1">メモ</p>
                <p className="text-sm text-slate-300">{selectedRecord.memo}</p>
              </div>
            )}
            {selectedRecord.alerts && (
              <div className="mt-3 pt-3 border-t border-slate-700">
                <p className="text-xs text-slate-400">アラート: {selectedRecord.alerts}</p>
              </div>
            )}
          </div>
        </div>
      )}

      <div className="px-4 space-y-2">
        {sorted.length === 0 && (
          <p className="text-slate-400 text-sm text-center py-8">記録がありません</p>
        )}
        {sorted.map((record) => {
          const zone = calcScoreZone(record.total_score);
          const cfg = ZONE_CONFIG[zone];
          const { energy, direction } = calcAxes(record);
          const isSelected = selectedDate === record.date;

          return (
            <button
              key={record.date}
              onClick={() => setSelectedDate(isSelected ? null : record.date)}
              className={`w-full text-left rounded-xl p-3 border transition-colors ${
                isSelected ? 'border-blue-500 bg-blue-900/20' : `border-slate-700 ${cfg.bg} hover:border-slate-500`
              }`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-200 text-sm font-medium">{formatDate(record.date)}</p>
                  <p className="text-slate-400 text-xs mt-0.5">
                    E:{energy} D:{direction}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-lg" style={{ color: cfg.color }}>
                    {record.total_score}
                  </p>
                  <p className="text-xs" style={{ color: cfg.color }}>
                    {cfg.label}
                  </p>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
