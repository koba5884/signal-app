import { QUESTIONS } from '../config/questions';
import type { DailyRecord, ScoreZone, QuadrantPosition } from './types';

export function calcScoreZone(totalScore: number): ScoreZone {
  const maxScore = QUESTIONS.length * 2;
  const ratio = totalScore / maxScore;
  if (ratio >= 10 / 12) return 'green';
  if (ratio >= 7 / 12) return 'yellow';
  if (ratio >= 4 / 12) return 'orange';
  return 'red';
}

export const ZONE_CONFIG: Record<ScoreZone, { label: string; color: string; bg: string; border: string }> = {
  green:  { label: '通常運転',         color: '#22c55e', bg: 'bg-green-900/30',  border: 'border-green-500' },
  yellow: { label: '軽い疲労・怠け寄り', color: '#eab308', bg: 'bg-yellow-900/30', border: 'border-yellow-500' },
  orange: { label: '注意ゾーン',       color: '#f97316', bg: 'bg-orange-900/30', border: 'border-orange-500' },
  red:    { label: '要注意',           color: '#ef4444', bg: 'bg-red-900/30',    border: 'border-red-500' },
};

export function calcAxes(record: Partial<DailyRecord>): { energy: number; direction: number } {
  const energy = (record.q_sleep ?? 0) + (record.q_appetite ?? 0) + (record.q_body ?? 0);
  const direction = (record.q_social ?? 0) + (record.q_motivation ?? 0) + (record.q_self_eval ?? 0);
  return { energy, direction };
}

export function getQuadrant(energy: number, direction: number): QuadrantPosition {
  const energyHigh = energy >= 4;
  const directionHigh = direction >= 4;

  if (energyHigh && directionHigh) {
    return { energy, direction, label: '通常運転', icon: '✅' };
  } else if (energyHigh && !directionHigh) {
    return { energy, direction, label: '漂流モード', icon: '🔄' };
  } else if (!energyHigh && directionHigh) {
    return { energy, direction, label: '消耗モード', icon: '⚠️' };
  } else {
    return { energy, direction, label: 'シャットダウン', icon: '🚨' };
  }
}
