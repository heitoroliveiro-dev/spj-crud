import { useEffect } from 'react';
import { CheckCircle2, X } from 'lucide-react';

export function Toast({ message, onClose, duration = 5000 }) {
  useEffect(() => {
    if (!message) return undefined;

    const timeoutId = window.setTimeout(() => {
      onClose();
    }, duration);

    return () => window.clearTimeout(timeoutId);
  }, [duration, message, onClose]);

  if (!message) return null;

  return (
    <div className="fixed bottom-6 left-1/2 z-60 w-[calc(100%-32px)] max-w-md -translate-x-1/2">
      <div className="flex items-center gap-3 rounded-lg border border-success/30 bg-white px-4 py-3 text-success shadow-xl">
        <CheckCircle2 size={20} className="shrink-0" />
        <p className="flex-1 text-sm font-medium">{message}</p>
        <button
          type="button"
          onClick={onClose}
          className="rounded-md p-1 hover:bg-success/10"
          aria-label="Fechar notificação"
        >
          <X size={16} />
        </button>
      </div>
    </div>
  );
}
