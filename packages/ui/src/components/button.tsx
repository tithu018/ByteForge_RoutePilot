import type { ComponentProps } from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva } from 'class-variance-authority';
import type { VariantProps } from 'class-variance-authority';
import { LoaderCircle } from 'lucide-react';
import { cn } from '../lib/cn';

const buttonVariants = cva('ui-button', {
  variants: { variant: { primary: 'ui-button-primary', secondary: 'ui-button-secondary', ghost: 'ui-button-ghost', destructive: 'ui-button-destructive' }, size: { default: '', small: 'ui-button-small', icon: 'ui-button-icon' } },
  defaultVariants: { variant: 'primary', size: 'default' },
});
type ButtonProps = ComponentProps<'button'> & VariantProps<typeof buttonVariants> & { asChild?: boolean; loading?: boolean };
export function Button({ className, variant, size, asChild = false, loading = false, disabled, children, type = 'button', ...props }: ButtonProps) {
  const classes = cn(buttonVariants({ variant, size }), className);
  if (asChild) return <Slot className={classes} {...props}>{children}</Slot>;
  return <button className={classes} type={type} disabled={disabled || loading} aria-busy={loading || undefined} {...props}>{loading && <LoaderCircle className="ui-spin" size={16} aria-hidden="true" />}{children}</button>;
}
