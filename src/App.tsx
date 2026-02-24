import { useState, useEffect, useCallback } from 'react';
import { PinLogin } from './components/PinLogin';
import { CheckForm } from './components/CheckForm';
import { Dashboard } from './components/Dashboard';
import { History } from './components/History';
import { useSheetApi } from './hooks/useSheetApi';
import type { DailyRecord, TabName } from './lib/types';

const PIN_KEY = 'signal_pin';

export default function App() {
  const [pin, setPin] = useState<string>(() => localStorage.getItem(PIN_KEY) ?? '');
  const [tab, setTab] = useState<TabName>('check');
  const [records, setRecords] = useState<DailyRecord[]>([]);

  const { fetchRecords, loading } = useSheetApi(pin);

  const loadRecords = useCallback(async () => {
    if (!pin) return;
    const data = await fetchRecords(60);
    setRecords(data);
  }, [pin, fetchRecords]);

  useEffect(() => {
    if (pin) loadRecords();
  }, [pin, loadRecords]);

  const handleLogin = (enteredPin: string) => {
    localStorage.setItem(PIN_KEY, enteredPin);
    setPin(enteredPin);
  };

  if (!pin) {
    return <PinLogin onLogin={handleLogin} />;
  }

  const today = new Date().toISOString().slice(0, 10);
  const todayRecord = records.find((r) => r.date === today) ?? null;

  const TAB_CONFIG: { id: TabName; label: string; icon: string }[] = [
    { id: 'check', label: '入力', icon: '✏️' },
    { id: 'dashboard', label: 'ダッシュボード', icon: '📊' },
    { id: 'history', label: '履歴', icon: '📋' },
  ];

  return (
    <div className="max-w-[480px] mx-auto min-h-screen flex flex-col relative bg-slate-900">
      <div className="flex-1 overflow-y-auto pb-16">
        {tab === 'check' && (
          <CheckForm
            pin={pin}
            history={records}
            onSubmitted={loadRecords}
            todayRecord={todayRecord}
          />
        )}
        {tab === 'dashboard' && <Dashboard records={records} loading={loading} />}
        {tab === 'history' && <History records={records} loading={loading} />}
      </div>

      <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[480px] bg-slate-900 border-t border-slate-800 flex">
        {TAB_CONFIG.map((t) => (
          <button
            key={t.id}
            onClick={() => {
              setTab(t.id);
              if (t.id === 'dashboard' || t.id === 'history') loadRecords();
            }}
            className={`flex-1 flex flex-col items-center py-2.5 gap-0.5 text-xs transition-colors ${
              tab === t.id ? 'text-blue-400' : 'text-slate-500 hover:text-slate-300'
            }`}
          >
            <span className="text-lg leading-none">{t.icon}</span>
            <span>{t.label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
}
