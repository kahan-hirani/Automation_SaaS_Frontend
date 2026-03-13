import { cn } from '../../lib/utils';

function Card({ className, ...props }) {
  return (
    <div
      className={cn(
        'rounded-[28px] border border-white/10 bg-white/5 p-6 text-white shadow-[0_30px_80px_rgba(0,0,0,0.45)] backdrop-blur-2xl',
        className
      )}
      {...props}
    />
  );
}

function CardHeader({ className, ...props }) {
  return <div className={cn('flex flex-col gap-2', className)} {...props} />;
}

function CardTitle({ className, ...props }) {
  return (
    <h3
      className={cn('font-display text-3xl leading-none tracking-[0.06em] text-white', className)}
      {...props}
    />
  );
}

function CardDescription({ className, ...props }) {
  return (
    <p
      className={cn('text-sm leading-6 text-zinc-400', className)}
      {...props}
    />
  );
}

function CardContent({ className, ...props }) {
  return <div className={cn(className)} {...props} />;
}

export { Card, CardContent, CardDescription, CardHeader, CardTitle };