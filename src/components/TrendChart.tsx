import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts';
import type { DailyRecord } from '../lib/types';
import { QUESTIONS } from '../config/questions';

type Props = {
  records: DailyRecord[];
};

const MAX_SCORE = QUESTIONS.length * 2;

export function TrendChart({ records }: Props) {
  const data = records.slice(-14).map((r) => ({
    date: r.date.slice(5),
    score: r.total_score,
  }));

  if (data.length === 0) {
    return (
      <div className="bg-slate-800 rounded-xl p-4 border border-slate-700">
        <p className="text-slate-400 text-sm">データがありません</p>
      </div>
    );
  }

  return (
    <div className="bg-slate-800 rounded-xl p-4 border border-slate-700">
      <p className="text-xs text-slate-400 mb-3">スコア推移（直近14日）</p>
      <ResponsiveContainer width="100%" height={160}>
        <LineChart data={data} margin={{ top: 4, right: 4, left: -24, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
          <XAxis dataKey="date" tick={{ fill: '#94a3b8', fontSize: 10 }} />
          <YAxis domain={[0, MAX_SCORE]} tick={{ fill: '#94a3b8', fontSize: 10 }} />
          <Tooltip
            contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: 8 }}
            labelStyle={{ color: '#94a3b8' }}
            itemStyle={{ color: '#60a5fa' }}
          />
          <ReferenceLine y={10} stroke="#22c55e" strokeDasharray="4 4" />
          <ReferenceLine y={7} stroke="#eab308" strokeDasharray="4 4" />
          <ReferenceLine y={4} stroke="#f97316" strokeDasharray="4 4" />
          <Line
            type="monotone"
            dataKey="score"
            stroke="#60a5fa"
            strokeWidth={2}
            dot={{ fill: '#60a5fa', r: 3 }}
            activeDot={{ r: 5 }}
            name="スコア"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
