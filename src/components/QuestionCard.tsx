import type { Question } from '../lib/types';

type Props = {
  question: Question;
  index: number;
  selectedValue: number | undefined;
  onChange: (id: string, value: number) => void;
};

const OPTION_LABELS = ['A', 'B', 'C'];

export function QuestionCard({ question, index, selectedValue, onChange }: Props) {
  return (
    <div className="bg-slate-800 rounded-xl p-4 border border-slate-700">
      <p className="text-xs text-slate-400 mb-1">Q{index + 1}</p>
      <p className="text-slate-100 font-medium mb-3 leading-snug">{question.label}</p>
      <div className="space-y-2">
        {question.options.map((option, i) => {
          const isSelected = selectedValue === option.value;
          return (
            <button
              key={option.type}
              onClick={() => onChange(question.id, option.value)}
              className={`w-full text-left rounded-lg px-3 py-2.5 text-sm transition-all duration-150 border ${
                isSelected
                  ? 'bg-blue-600 border-blue-500 text-white'
                  : 'bg-slate-700/50 border-slate-600 text-slate-300 hover:bg-slate-700 hover:border-slate-500'
              }`}
            >
              <span className={`font-bold mr-2 ${isSelected ? 'text-blue-200' : 'text-slate-400'}`}>
                {OPTION_LABELS[i]}
              </span>
              {option.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
