import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';
import { CheckCircleIcon, Loader2, XCircleIcon } from 'lucide-react';
import { QueryStatus } from '@/lib/hooks/common/useQueryStatus';
import { useMemo } from 'react';

const buttonVariants = cva(
  'inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        default: 'primary-surface text-foreground hover:bg-primary/90 border',
        destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
        outline: 'border border-input bg-background hover:bg-accent hover:text-accent-foreground',
        secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
        ghost: 'hover:bg-accent hover:text-accent-foreground',
        link: 'text-primary underline-offset-4 hover:underline',
      },
      size: {
        xs: 'h-6 px-2 py-1 text-xs',
        default: 'h-10 px-4 py-2',
        sm: 'h-9 rounded-md px-3',
        lg: 'h-11 rounded-md px-8',
        icon: 'h-10 w-10',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  status?: QueryStatus;
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ status, className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button';
    // ...(someCondition && {b: 5})

    const content = useMemo(() => {
      if (status === 'loading') {
        return <Loader2 className='mr-2 h-4 w-4 animate-spin' />;
      }
      if (status === 'error') {
        return <XCircleIcon className='mr-2 h-4 w-4 text-red-500' />;
      }

      if (status === 'success') {
        return <CheckCircleIcon className='mr-2 h-4 w-4 text-green-500' />;
      }
      return props.children;
    }, [status, props.children]);

    const extendedProps = {
      ...props,
      ...(status && status !== 'idle' ? { disabled: true } : {}),
      children: content,
    };

    return (
      <Comp
        className={cn(
          buttonVariants({
            variant,
            size,
            className,
          })
        )}
        ref={ref}
        {...extendedProps}
      />
    );
  }
);
Button.displayName = 'Button';

export { Button, buttonVariants };
