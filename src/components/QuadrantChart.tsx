import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts';
import type { DailyRecord } from '../lib/types';
import { calcAxes } from '../lib/scoring';

type Props = {
  records: DailyRecord[];
};

export function QuadrantChart({ records }: Props) {
  const recent = records.slice(-7);

  const data = recent.map((r, i) => {
    const { energy, direction } = calcAxes(r);
    return {
      x: direction,
      y: energy,
      date: r.date.slice(5),
      isLatest: i === recent.length - 1,
    };
  });

  if (data.length === 0) {
    return (
      <div className="bg-slate-800 rounded-xl p-4 border border-slate-700">
        <p className="text-slate-400 text-sm">データがありません</p>
      </div>
    );
  }

  const latestData = data.filter((d) => d.isLatest);
  const historyData = data.filter((d) => !d.isLatest);

  return (
    <div className="bg-slate-800 rounded-xl p-4 border border-slate-700">
      <p className="text-xs text-slate-400 mb-1">エネルギー × 方向性（直近7日）</p>
      <div className="flex justify-between text-xs text-slate-500 mb-2">
        <span>← 方向性なし</span>
        <span>方向性あり →</span>
      </div>
      <ResponsiveContainer width="100%" height={180}>
        <ScatterChart margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
          <XAxis
            type="number"
            dataKey="x"
            domain={[0, 6]}
            tick={{ fill: '#94a3b8', fontSize: 10 }}
            name="方向性"
          />
          <YAxis
            type="number"
            dataKey="y"
            domain={[0, 6]}
            tick={{ fill: '#94a3b8', fontSize: 10 }}
            name="エネルギー"
          />
          <Tooltip
            cursor={{ strokeDasharray: '3 3' }}
            contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: 8 }}
            labelStyle={{ color: '#94a3b8' }}
            formatter={(value, name) => [value, name]}
          />
          <ReferenceLine x={3} stroke="#475569" strokeDasharray="4 4" />
          <ReferenceLine y={3} stroke="#475569" strokeDasharray="4 4" />
          <Scatter data={historyData} fill="#475569" opacity={0.7} />
          <Scatter data={latestData} fill="#60a5fa" />
        </ScatterChart>
      </ResponsiveContainer>
      <div className="grid grid-cols-2 gap-1 mt-2 text-xs">
        <div className="bg-slate-900/50 rounded p-1 text-center text-slate-400">
          <span className="text-green-400">↗</span> 右上: 通常運転
        </div>
        <div className="bg-slate-900/50 rounded p-1 text-center text-slate-400">
          <span className="text-yellow-400">→</span> 右下: 漂流モード
        </div>
        <div className="bg-slate-900/50 rounded p-1 text-center text-slate-400">
          <span className="text-orange-400">↑</span> 左上: 消耗モード
        </div>
        <div className="bg-slate-900/50 rounded p-1 text-center text-slate-400">
          <span className="text-red-400">↙</span> 左下: シャットダウン
        </div>
      </div>
    </div>
  );
}
