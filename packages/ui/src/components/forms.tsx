import type { ComponentProps, ReactNode } from 'react';
import { Search } from 'lucide-react';
import { cn } from '../lib/cn';

export function Input({ className, ...props }: ComponentProps<'input'>) { return <input className={cn('ui-input', className)} {...props} />; }
export function Textarea({ className, ...props }: ComponentProps<'textarea'>) { return <textarea className={cn('ui-input ui-textarea', className)} {...props} />; }
export function Select({ className, ...props }: ComponentProps<'select'>) { return <select className={cn('ui-input ui-select', className)} {...props} />; }
export function Checkbox({ className, ...props }: Omit<ComponentProps<'input'>, 'type'>) { return <input type="checkbox" className={cn('ui-checkbox', className)} {...props} />; }
export function Radio({ className, ...props }: Omit<ComponentProps<'input'>, 'type'>) { return <input type="radio" className={cn('ui-checkbox', className)} {...props} />; }
export function FormField({ id, label, description, error, required, children }: { id: string; label: string; description?: string; error?: string; required?: boolean; children: ReactNode }) {
  return <div className="ui-field"><label htmlFor={id}>{label}{required && <span aria-hidden="true"> *</span>}</label>{children}{description && <p id={`${id}-description`} className="ui-help">{description}</p>}{error && <p id={`${id}-error`} className="ui-field-error" role="alert">{error}</p>}</div>;
}
export function SearchInput({ label, className, ...props }: Omit<ComponentProps<'input'>, 'type'> & { label: string }) {
  return <div className={cn('ui-search', className)}><Search size={18} aria-hidden="true" /><Input type="search" aria-label={label} {...props} /></div>;
}
export function FilterBar({ children, className, ...props }: ComponentProps<'div'>) { return <div className={cn('ui-filter-bar', className)} role="group" {...props}>{children}</div>; }
