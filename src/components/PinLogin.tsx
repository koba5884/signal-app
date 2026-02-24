import { useState } from 'react';

type Props = {
  onLogin: (pin: string) => void;
};

export function PinLogin({ onLogin }: Props) {
  const [input, setInput] = useState('');
  const [error, setError] = useState('');

  const handleDigit = (d: string) => {
    if (input.length >= 4) return;
    const next = input + d;
    setInput(next);
    setError('');
    if (next.length === 4) {
      onLogin(next);
    }
  };

  const handleDelete = () => {
    setInput((prev) => prev.slice(0, -1));
    setError('');
  };

  const dots = Array.from({ length: 4 }, (_, i) => i < input.length);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-8">
      <p className="text-4xl mb-4">📡</p>
      <h1 className="text-2xl font-bold text-slate-100 mb-1">Signal</h1>
      <p className="text-slate-400 text-sm mb-10">PINを入力してください</p>

      <div className="flex gap-4 mb-10">
        {dots.map((filled, i) => (
          <div
            key={i}
            className={`w-4 h-4 rounded-full border-2 transition-all ${
              filled ? 'bg-blue-500 border-blue-500' : 'border-slate-500'
            }`}
          />
        ))}
      </div>

      {error && <p className="text-red-400 text-sm mb-4">{error}</p>}

      <div className="grid grid-cols-3 gap-4 w-64">
        {['1', '2', '3', '4', '5', '6', '7', '8', '9', '', '0', '⌫'].map((d, i) => {
          if (d === '') return <div key={i} />;
          const isDelete = d === '⌫';
          return (
            <button
              key={d}
              onClick={() => (isDelete ? handleDelete() : handleDigit(d))}
              className={`h-14 rounded-xl text-xl font-medium transition-colors ${
                isDelete
                  ? 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                  : 'bg-slate-800 text-slate-100 hover:bg-slate-700 border border-slate-700'
              }`}
            >
              {d}
            </button>
          );
        })}
      </div>
    </div>
  );
}
