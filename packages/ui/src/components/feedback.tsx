import type { ComponentProps, ReactNode } from 'react';
import { AlertCircle, CheckCircle2, Info, Inbox } from 'lucide-react';
import { Toaster as SonnerToaster } from 'sonner';
import { cn } from '../lib/cn';
import { Button } from './button';

export type Tone = 'neutral' | 'info' | 'success' | 'warning' | 'critical';
export function Badge({ tone = 'neutral', className, ...props }: ComponentProps<'span'> & { tone?: Tone }) { return <span className={cn('ui-badge', `ui-tone-${tone}`, className)} {...props} />; }
export const StatusChip = Badge;
export function Alert({ title, children, tone = 'info', className }: { title: string; children?: ReactNode; tone?: Tone; className?: string }) {
  const Icon = tone === 'critical' || tone === 'warning' ? AlertCircle : tone === 'success' ? CheckCircle2 : Info;
  return <div className={cn('ui-alert', `ui-tone-${tone}`, className)} role={tone === 'critical' ? 'alert' : 'status'}><Icon size={20} aria-hidden="true" /><div><strong>{title}</strong>{children && <div className="ui-alert-body">{children}</div>}</div></div>;
}
export function Skeleton({ className, ...props }: ComponentProps<'div'>) { return <div aria-hidden="true" className={cn('ui-skeleton', className)} {...props} />; }
export function EmptyState({ title, description, action, icon }: { title: string; description: string; action?: ReactNode; icon?: ReactNode }) {
  return <div className="ui-empty"><div className="ui-empty-icon" aria-hidden="true">{icon ?? <Inbox size={24} />}</div><h2>{title}</h2><p>{description}</p>{action}</div>;
}
export function ErrorState({ title = 'This view could not be loaded', description = 'Try again. No changes have been made.', onRetry }: { title?: string; description?: string; onRetry?: () => void }) {
  return <div role="alert" className="ui-empty"><AlertCircle size={28} aria-hidden="true" /><h2>{title}</h2><p>{description}</p>{onRetry && <Button variant="secondary" onClick={onRetry}>Try again</Button>}</div>;
}
export function Toaster() { return <SonnerToaster position="bottom-right" closeButton toastOptions={{ className: 'ui-toast' }} />; }
export { toast } from 'sonner';
