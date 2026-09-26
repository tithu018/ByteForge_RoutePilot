import type { ComponentProps, ReactNode } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '../lib/cn';
import { Button } from './button';

export function Card({ className, ...props }: ComponentProps<'section'>) { return <section className={cn('ui-card', className)} {...props} />; }
export function CardHeader({ className, ...props }: ComponentProps<'div'>) { return <div className={cn('ui-card-header', className)} {...props} />; }
export function CardContent({ className, ...props }: ComponentProps<'div'>) { return <div className={cn('ui-card-content', className)} {...props} />; }
export function PageHeader({ eyebrow, title, description, actions }: { eyebrow?: string; title: string; description?: string; actions?: ReactNode }) {
  return <header className="ui-page-header"><div>{eyebrow && <p className="ui-eyebrow">{eyebrow}</p>}<h1>{title}</h1>{description && <p className="ui-page-description">{description}</p>}</div>{actions && <div className="ui-page-actions">{actions}</div>}</header>;
}
export function Table({ className, ...props }: ComponentProps<'table'>) { return <div className="ui-table-scroll"><table className={cn('ui-table', className)} {...props} /></div>; }
export function TableHead(props: ComponentProps<'thead'>) { return <thead {...props} />; }
export function TableBody(props: ComponentProps<'tbody'>) { return <tbody {...props} />; }
export function TableRow(props: ComponentProps<'tr'>) { return <tr {...props} />; }
export function TableHeader({ scope = 'col', ...props }: ComponentProps<'th'>) { return <th scope={scope} {...props} />; }
export function TableCell(props: ComponentProps<'td'>) { return <td {...props} />; }
export function Pagination({ page, pageCount, onPageChange }: { page: number; pageCount: number; onPageChange: (page: number) => void }) {
  const total = Math.max(1, pageCount);
  return <nav className="ui-pagination" aria-label="Pagination"><Button variant="secondary" size="icon" aria-label="Previous page" disabled={page <= 1} onClick={() => onPageChange(page - 1)}><ChevronLeft size={18} /></Button><span aria-live="polite">Page {page} of {total}</span><Button variant="secondary" size="icon" aria-label="Next page" disabled={page >= total} onClick={() => onPageChange(page + 1)}><ChevronRight size={18} /></Button></nav>;
}
