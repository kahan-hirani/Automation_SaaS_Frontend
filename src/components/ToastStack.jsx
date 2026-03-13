import { AnimatePresence, motion } from 'framer-motion';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';
import { Button } from './ui/button';
import { cn } from '../lib/utils';

const toastStyles = {
  success: {
    icon: CheckCircle2,
    border: 'border-emerald-300/40',
    glow: 'from-emerald-200/20',
  },
  error: {
    icon: AlertCircle,
    border: 'border-rose-300/40',
    glow: 'from-rose-200/20',
  },
  info: {
    icon: Info,
    border: 'border-white/20',
    glow: 'from-white/15',
  },
};

const ToastStack = ({ toasts, onDismiss }) => {
  return (
    <div className="pointer-events-none fixed right-4 top-4 z-[70] flex w-[min(92vw,420px)] flex-col gap-3">
      <AnimatePresence>
        {toasts.map((toast) => {
          const style = toastStyles[toast.type] || toastStyles.info;
          const Icon = style.icon;

          return (
            <motion.div
              key={toast.id}
              layout
              initial={{ opacity: 0, y: -12, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.98 }}
              transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
              className={cn(
                'pointer-events-auto relative overflow-hidden rounded-3xl border bg-black/90 px-4 py-4 shadow-[0_22px_60px_rgba(0,0,0,0.55)] backdrop-blur-xl',
                style.border
              )}
            >
              <div className={cn('pointer-events-none absolute inset-0 bg-gradient-to-r to-transparent opacity-80', style.glow)} />
              <div className="relative flex items-start gap-3">
                <div className="mt-0.5 rounded-full border border-white/15 bg-white/5 p-1.5">
                  <Icon className="h-4 w-4 text-white" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs uppercase tracking-[0.24em] text-zinc-500">{toast.type || 'info'}</p>
                  <p className="mt-1 text-sm leading-6 text-zinc-200">{toast.message}</p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => onDismiss(toast.id)}
                  aria-label="Dismiss notification"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
};

export default ToastStack;
