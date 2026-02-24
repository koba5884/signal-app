import type { AlertResult } from '../lib/types';

type Props = {
  alerts: AlertResult[];
};

const SEVERITY_STYLE = {
  info: 'border-blue-500 bg-blue-900/30 text-blue-300',
  warning: 'border-yellow-500 bg-yellow-900/30 text-yellow-200',
  alert: 'border-red-500 bg-red-900/30 text-red-200',
};

const SEVERITY_ICON = {
  info: 'ℹ️',
  warning: '⚠️',
  alert: '🔴',
};

export function AlertBanner({ alerts }: Props) {
  if (alerts.length === 0) return null;

  return (
    <div className="space-y-2">
      {alerts.map((alert) => (
        <div
          key={alert.id}
          className={`border rounded-lg p-3 text-sm ${SEVERITY_STYLE[alert.severity]}`}
        >
          <div className="flex items-center gap-2 font-medium mb-1">
            <span>{SEVERITY_ICON[alert.severity]}</span>
            <span>{alert.name}</span>
          </div>
          <p className="opacity-90 leading-relaxed">{alert.description}</p>
        </div>
      ))}
    </div>
  );
}
