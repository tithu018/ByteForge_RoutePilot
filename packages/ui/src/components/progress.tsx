import { Check } from 'lucide-react';

export function CapacityBar({ label, value, maximum, unit }: { label: string; value: number; maximum: number; unit: string }) {
  const valid = Number.isFinite(value) && Number.isFinite(maximum) && value >= 0 && maximum > 0;
  if (!valid) return <div className="ui-capacity"><strong>{label}</strong><p>Capacity unavailable</p></div>;
  const overflow = value > maximum;
  const format = (number: number) => new Intl.NumberFormat('en', { maximumFractionDigits: 2 }).format(number);
  return <div className="ui-capacity"><div><strong>{label}</strong><span>{format(value)} / {format(maximum)} {unit}</span></div><div role="meter" aria-label={label} aria-valuemin={0} aria-valuemax={maximum} aria-valuenow={Math.min(value, maximum)} aria-valuetext={`${format(value)} of ${format(maximum)} ${unit}${overflow ? ', over capacity' : ''}`} className={`ui-capacity-track ${overflow ? 'is-over' : ''}`}><span style={{ width: `${Math.min(100, value / maximum * 100)}%` }} /></div><p>{overflow ? `Over by ${format(value - maximum)} ${unit}` : `${format(maximum - value)} ${unit} remaining`}</p></div>;
}
export interface TimelineItem { id: string; title: string; description?: string; time?: string }
export function Timeline({ items, label }: { items: TimelineItem[]; label: string }) { return <ol className="ui-timeline" aria-label={label}>{items.map((item) => <li key={item.id}><span className="ui-timeline-dot" aria-hidden="true" /><div><strong>{item.title}</strong>{item.description && <p>{item.description}</p>}{item.time && <span className="ui-help">{item.time}</span>}</div></li>)}</ol>; }
export function StepIndicator({ steps, current }: { steps: string[]; current: number }) { return <ol className="ui-steps" aria-label="Progress">{steps.map((label, index) => <li key={label} aria-current={current === index ? 'step' : undefined} data-state={index < current ? 'complete' : current === index ? 'current' : 'upcoming'}><span aria-hidden="true">{index < current ? <Check size={14} /> : index + 1}</span>{label}</li>)}</ol>; }
