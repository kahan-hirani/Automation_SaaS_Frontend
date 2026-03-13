import { cn } from '../../lib/utils';

function Input({ className, ...props }) {
  return (
    <input
      className={cn(
        'flex h-12 w-full rounded-2xl border border-white/12 bg-black/60 px-4 py-3 text-sm text-white placeholder:text-zinc-500 transition duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60 focus-visible:ring-offset-2 focus-visible:ring-offset-black disabled:cursor-not-allowed disabled:opacity-50',
        className
      )}
      {...props}
    />
  );
}

export { Input };