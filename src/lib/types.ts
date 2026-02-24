export type OptionType = 'a' | 'b' | 'c';

export type QuestionOption = {
  value: number;
  label: string;
  type: OptionType;
};

export type Question = {
  id: string;
  category: 'energy' | 'direction';
  label: string;
  options: QuestionOption[];
  signalWeight?: number;
};

export type DailyRecord = {
  date: string;
  timestamp: string;
  q_sleep: number;
  q_appetite: number;
  q_social: number;
  q_motivation: number;
  q_body: number;
  q_self_eval: number;
  total_score: number;
  c_count: number;
  alerts: string;
  memo: string;
};

export type ScoreZone = 'green' | 'yellow' | 'orange' | 'red';

export type QuadrantPosition = {
  energy: number;
  direction: number;
  label: string;
  icon: string;
};

export type AlertSeverity = 'info' | 'warning' | 'alert';

export type AlertResult = {
  id: string;
  name: string;
  description: string;
  severity: AlertSeverity;
};

export type FormAnswers = {
  [key: string]: number | undefined;
};

export type TabName = 'check' | 'dashboard' | 'history';
