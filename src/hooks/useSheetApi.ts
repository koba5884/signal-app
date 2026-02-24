import { useState, useCallback } from 'react';
import type { DailyRecord } from '../lib/types';

const GAS_URL = import.meta.env.VITE_GAS_URL as string;

export function useSheetApi(pin: string) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const writeRecord = useCallback(
    async (record: Omit<DailyRecord, 'timestamp'>): Promise<boolean> => {
      if (!GAS_URL) {
        setError('GAS URLが設定されていません。.envファイルを確認してください。');
        return false;
      }
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(GAS_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'text/plain' },
          body: JSON.stringify({
            action: 'write',
            pin,
            data: { ...record, timestamp: new Date().toISOString() },
          }),
          mode: 'no-cors',
        });
        // no-corsモードではレスポンスボディを読めないため、エラーがなければ成功とみなす
        void res;
        return true;
      } catch (e) {
        setError('データの送信に失敗しました。ネットワークを確認してください。');
        return false;
      } finally {
        setLoading(false);
      }
    },
    [pin]
  );

  const fetchRecords = useCallback(
    async (days = 30): Promise<DailyRecord[]> => {
      if (!GAS_URL) {
        setError('GAS URLが設定されていません。.envファイルを確認してください。');
        return [];
      }
      setLoading(true);
      setError(null);
      try {
        const url = `${GAS_URL}?action=read&pin=${encodeURIComponent(pin)}&days=${days}`;
        const res = await fetch(url);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json = await res.json();
        return json.data as DailyRecord[];
      } catch (e) {
        setError('データの取得に失敗しました。');
        return [];
      } finally {
        setLoading(false);
      }
    },
    [pin]
  );

  return { writeRecord, fetchRecords, loading, error };
}
