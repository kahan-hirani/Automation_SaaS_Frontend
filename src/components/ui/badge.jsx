import { cva } from 'class-variance-authority';
import { cn } from '../../lib/utils';

const badgeVariants = cva(
  'inline-flex items-center rounded-full border px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.24em] transition-colors',
  {
    variants: {
      variant: {
        default: 'border-white/15 bg-white/10 text-white',
        muted: 'border-white/10 bg-transparent text-zinc-400',
        outline: 'border-white/25 bg-transparent text-white',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

function Badge({ className, variant, ...props }) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };