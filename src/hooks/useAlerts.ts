import { useMemo } from 'react';
import { evaluateAlerts } from '../lib/alerts';
import type { DailyRecord, AlertResult } from '../lib/types';

export function useAlerts(history: DailyRecord[]): AlertResult[] {
  return useMemo(() => evaluateAlerts(history), [history]);
}
