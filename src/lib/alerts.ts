import type { DailyRecord, AlertResult, AlertSeverity } from './types';

type AlertRule = {
  id: string;
  name: string;
  description: string;
  condition: (history: DailyRecord[]) => boolean;
  severity: AlertSeverity;
};

const ALERT_RULES: AlertRule[] = [
  {
    id: 'alert_motivation_3d',
    name: '意欲喪失3日継続',
    description: 'Q4（意欲）が3日連続でCになっています。じっくり休むことも大切です。',
    severity: 'alert',
    condition: (history) => {
      const recent = history.slice(-3);
      return recent.length === 3 && recent.every((r) => r.q_motivation === 0);
    },
  },
  {
    id: 'alert_june_pattern',
    name: '消耗パターン',
    description: '対人関係と意欲が同時に落ちた状態が続いています。過去につらかった時期と近い状態です。信頼できる人に声をかけることを選択肢に入れてみてください。',
    severity: 'alert',
    condition: (history) => {
      const recent = history.slice(-2);
      return recent.length === 2 && recent.every((r) => r.q_social === 0 && r.q_motivation === 0);
    },
  },
  {
    id: 'alert_weekly_decline',
    name: '週次下降トレンド',
    description: '今週の平均スコアが先週より大きく下がっています。無理しすぎていないか確認してみてください。',
    severity: 'warning',
    condition: (history) => {
      if (history.length < 14) return false;
      const thisWeek = history.slice(-7);
      const lastWeek = history.slice(-14, -7);
      const thisAvg = thisWeek.reduce((s, r) => s + r.total_score, 0) / thisWeek.length;
      const lastAvg = lastWeek.reduce((s, r) => s + r.total_score, 0) / lastWeek.length;
      return lastAvg - thisAvg >= 3;
    },
  },
  {
    id: 'alert_self_eval_5d',
    name: '自己否定5日継続',
    description: '自己評価が5日続けてCになっています。「ダメだった」という評価は一時的なシグナルです。',
    severity: 'alert',
    condition: (history) => {
      const recent = history.slice(-5);
      return recent.length === 5 && recent.every((r) => r.q_self_eval === 0);
    },
  },
  {
    id: 'alert_energy_drain',
    name: 'エネルギー枯渇',
    description: 'エネルギー（睡眠・食欲・身体）が3日続けて低下しています。',
    severity: 'warning',
    condition: (history) => {
      const recent = history.slice(-3);
      return (
        recent.length === 3 &&
        recent.every((r) => r.q_sleep + r.q_appetite + r.q_body <= 2)
      );
    },
  },
  {
    id: 'alert_all_b',
    name: '全面惰性モード',
    description: '全問B（まあまあ）が3日続いています。停滞感があるかもしれません。',
    severity: 'info',
    condition: (history) => {
      const recent = history.slice(-3);
      return (
        recent.length === 3 &&
        recent.every(
          (r) =>
            r.q_sleep === 1 &&
            r.q_appetite === 1 &&
            r.q_social === 1 &&
            r.q_motivation === 1 &&
            r.q_body === 1 &&
            r.q_self_eval === 1
        )
      );
    },
  },
  {
    id: 'alert_shutdown',
    name: 'シャットダウン警告',
    description: '合計スコアが非常に低い状態が続いています。過去のつらかった時期と近い状態です。信頼できる人に声をかけることを選択肢に入れてみてください。',
    severity: 'alert',
    condition: (history) => {
      const recent = history.slice(-2);
      return recent.length === 2 && recent.every((r) => r.total_score <= 3);
    },
  },
];

export function evaluateAlerts(history: DailyRecord[]): AlertResult[] {
  return ALERT_RULES.filter((rule) => rule.condition(history)).map(({ id, name, description, severity }) => ({
    id,
    name,
    description,
    severity,
  }));
}

export function alertsToString(alerts: AlertResult[]): string {
  return alerts.map((a) => a.id).join(',');
}
