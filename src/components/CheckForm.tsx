import { useState } from 'react';
import { QUESTIONS } from '../config/questions';
import { QuestionCard } from './QuestionCard';
import { ScoreDisplay } from './ScoreDisplay';
import type { FormAnswers, DailyRecord } from '../lib/types';
import { calcAxes } from '../lib/scoring';
import { evaluateAlerts, alertsToString } from '../lib/alerts';
import { useSheetApi } from '../hooks/useSheetApi';

type Props = {
  pin: string;
  history: DailyRecord[];
  onSubmitted: () => void;
  todayRecord: DailyRecord | null;
};

export function CheckForm({ pin, history, onSubmitted, todayRecord }: Props) {
  const today = new Date().toLocaleDateString('ja-JP', { year: 'numeric', month: 'long', day: 'numeric', weekday: 'short' });
  const todayIso = new Date().toISOString().slice(0, 10);

  const initAnswers = (): FormAnswers => {
    if (todayRecord) {
      return {
        q_sleep: todayRecord.q_sleep,
        q_appetite: todayRecord.q_appetite,
        q_social: todayRecord.q_social,
        q_motivation: todayRecord.q_motivation,
        q_body: todayRecord.q_body,
        q_self_eval: todayRecord.q_self_eval,
      };
    }
    return {};
  };

  const [answers, setAnswers] = useState<FormAnswers>(initAnswers);
  const [memo, setMemo] = useState(todayRecord?.memo ?? '');
  const [submitted, setSubmitted] = useState(false);
  const { writeRecord, loading, error } = useSheetApi(pin);

  const answeredCount = QUESTIONS.filter((q) => answers[q.id] !== undefined).length;
  const allAnswered = answeredCount === QUESTIONS.length;

  const totalScore = allAnswered
    ? QUESTIONS.reduce((sum, q) => sum + (answers[q.id] ?? 0), 0)
    : 0;

  const { energy, direction } = calcAxes({
    q_sleep: answers.q_sleep,
    q_appetite: answers.q_appetite,
    q_social: answers.q_social,
    q_motivation: answers.q_motivation,
    q_body: answers.q_body,
    q_self_eval: answers.q_self_eval,
  });

  const handleChange = (id: string, value: number) => {
    setAnswers((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async () => {
    if (!allAnswered) return;

    const cCount = QUESTIONS.filter((q) => answers[q.id] === 0).length;

    const newRecord: DailyRecord = {
      date: todayIso,
      timestamp: new Date().toISOString(),
      q_sleep: answers.q_sleep ?? 0,
      q_appetite: answers.q_appetite ?? 0,
      q_social: answers.q_social ?? 0,
      q_motivation: answers.q_motivation ?? 0,
      q_body: answers.q_body ?? 0,
      q_self_eval: answers.q_self_eval ?? 0,
      total_score: totalScore,
      c_count: cCount,
      alerts: '',
      memo,
    };

    const historyWithToday = [...history.filter((r) => r.date !== todayIso), newRecord];
    const alerts = evaluateAlerts(historyWithToday);
    newRecord.alerts = alertsToString(alerts);

    const ok = await writeRecord(newRecord);
    if (ok) {
      setSubmitted(true);
      onSubmitted();
    }
  };

  if (submitted) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center px-4">
        <p className="text-4xl mb-4">✅</p>
        <p className="text-slate-200 font-medium text-lg mb-2">今日のチェック完了</p>
        <p className="text-slate-400 text-sm">記録しました。お疲れさまです。</p>
      </div>
    );
  }

  return (
    <div className="pb-6">
      <div className="px-4 pt-5 pb-3">
        <p className="text-slate-400 text-xs">{today}</p>
        <h1 className="text-slate-100 text-lg font-semibold mt-0.5">今日のチェック</h1>
        {todayRecord && (
          <p className="text-xs text-blue-400 mt-1">今日はすでに回答済みです（上書き可能）</p>
        )}
      </div>

      {allAnswered && (
        <div className="px-4 mb-4">
          <ScoreDisplay totalScore={totalScore} energy={energy} direction={direction} />
        </div>
      )}

      <div className="px-4 space-y-3">
        {QUESTIONS.map((q, i) => (
          <QuestionCard
            key={q.id}
            question={q}
            index={i}
            selectedValue={answers[q.id]}
            onChange={handleChange}
          />
        ))}

        <div className="bg-slate-800 rounded-xl p-4 border border-slate-700">
          <label className="text-xs text-slate-400 block mb-2">メモ（任意）</label>
          <textarea
            value={memo}
            onChange={(e) => setMemo(e.target.value)}
            placeholder="今日の気づきや一言..."
            className="w-full bg-slate-700/50 text-slate-200 text-sm rounded-lg px-3 py-2 border border-slate-600 resize-none outline-none focus:border-blue-500 placeholder-slate-500"
            rows={2}
          />
        </div>

        {error && (
          <p className="text-red-400 text-sm text-center">{error}</p>
        )}

        <button
          onClick={handleSubmit}
          disabled={!allAnswered || loading}
          className={`w-full py-3.5 rounded-xl font-semibold text-sm transition-all ${
            allAnswered && !loading
              ? 'bg-blue-600 hover:bg-blue-500 text-white'
              : 'bg-slate-700 text-slate-500 cursor-not-allowed'
          }`}
        >
          {loading ? '送信中...' : allAnswered ? `記録する（${answeredCount}/${QUESTIONS.length}）` : `回答中 ${answeredCount}/${QUESTIONS.length}`}
        </button>
      </div>
    </div>
  );
}
