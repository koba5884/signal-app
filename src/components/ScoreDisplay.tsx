import { calcScoreZone, ZONE_CONFIG, getQuadrant } from '../lib/scoring';
import { QUESTIONS } from '../config/questions';

type Props = {
  totalScore: number;
  energy: number;
  direction: number;
};

export function ScoreDisplay({ totalScore, energy, direction }: Props) {
  const zone = calcScoreZone(totalScore);
  const zoneConfig = ZONE_CONFIG[zone];
  const quadrant = getQuadrant(energy, direction);
  const maxScore = QUESTIONS.length * 2;

  return (
    <div className={`rounded-xl p-5 border ${zoneConfig.bg} ${zoneConfig.border}`}>
      <div className="flex items-center justify-between mb-3">
        <div>
          <p className="text-xs text-slate-400 mb-0.5">今日のスコア</p>
          <div className="flex items-end gap-1">
            <span className="text-4xl font-bold" style={{ color: zoneConfig.color }}>
              {totalScore}
            </span>
            <span className="text-slate-400 text-sm mb-1">/ {maxScore}</span>
          </div>
        </div>
        <div className="text-right">
          <p className="text-2xl mb-1">{quadrant.icon}</p>
          <p className="text-xs font-medium" style={{ color: zoneConfig.color }}>
            {zoneConfig.label}
          </p>
        </div>
      </div>

      <div className="flex gap-3 text-sm">
        <div className="flex-1 bg-slate-900/40 rounded-lg p-2 text-center">
          <p className="text-slate-400 text-xs mb-0.5">エネルギー</p>
          <p className="font-bold text-slate-200">{energy} / 6</p>
        </div>
        <div className="flex-1 bg-slate-900/40 rounded-lg p-2 text-center">
          <p className="text-slate-400 text-xs mb-0.5">方向性</p>
          <p className="font-bold text-slate-200">{direction} / 6</p>
        </div>
        <div className="flex-1 bg-slate-900/40 rounded-lg p-2 text-center">
          <p className="text-slate-400 text-xs mb-0.5">状態</p>
          <p className="font-bold text-slate-200 text-xs">{quadrant.label}</p>
        </div>
      </div>
    </div>
  );
}
