import { Slot } from '@radix-ui/react-slot';
import { cva } from 'class-variance-authority';
import { cn } from '../../lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full border text-sm font-semibold tracking-[0.16em] uppercase transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70 focus-visible:ring-offset-2 focus-visible:ring-offset-black disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 shrink-0',
  {
    variants: {
      variant: {
        default:
          'border-white bg-white text-black shadow-[0_0_0_1px_rgba(255,255,255,0.16)] hover:-translate-y-0.5 hover:bg-zinc-200',
        secondary:
          'border-white/15 bg-white/5 text-white backdrop-blur-xl hover:-translate-y-0.5 hover:border-white/30 hover:bg-white/10',
        ghost:
          'border-transparent bg-transparent text-white hover:bg-white/8 hover:text-white',
        destructive:
          'border-white/20 bg-zinc-900 text-white hover:-translate-y-0.5 hover:bg-zinc-800',
      },
      size: {
        default: 'h-11 px-5 py-2.5',
        sm: 'h-9 px-4 text-xs',
        lg: 'h-12 px-6 text-sm',
        icon: 'h-11 w-11 rounded-full',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

function Button({ className, variant, size, asChild = false, ...props }) {
  const Comp = asChild ? Slot : 'button';

  return (
    <Comp
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Button, buttonVariants };