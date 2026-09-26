import { Link, useLocation, useOutletContext } from 'react-router';
import { ArrowRight, CircleDashed, Layers3, LockKeyhole, MoveRight } from 'lucide-react';
import { Badge, Button, Card, PageHeader } from '@waypoint/ui';
import type { Workspace } from '../app/workspaces';

export default function WorkspacePage() {
  const workspace = useOutletContext<Workspace>();
  const location = useLocation();
  const section = workspace.navigation.find((item) => location.pathname.endsWith(`/${item.path}`) && item.path);
  const Icon = section?.icon ?? workspace.icon;
  return <><PageHeader eyebrow="WAYPOINT GROUP / DELIVERY OPERATIONS" title={section?.label ?? `${workspace.name} workspace`} description={section ? 'A reserved place in the approved product architecture.' : workspace.subtitle} actions={<Badge tone="info"><CircleDashed size={13} aria-hidden="true" />Phase 2 · Shell only</Badge>} />
    <div className="workspace-intro"><div className="intro-copy"><div className="intro-icon"><Icon size={25} strokeWidth={1.6} aria-hidden="true" /></div><h2>{section ? `${section.label}, ready for the next phase.` : workspace.title}</h2><p>{section ? `${section.label} is a navigation placeholder. This workflow has not been implemented.` : workspace.description}</p><div className="intro-status"><span />Application structure is in place</div></div><div className="intro-note"><span className="note-kicker">DESIGN BEFORE DELIVERY</span><p>Connected roles.<br />Clear decisions.<br /><span>One shared operation.</span></p><div className="note-footer"><Layers3 size={15} aria-hidden="true" /> Approved Phase 1 baseline</div></div></div>
    <div className="section-heading"><div><p className="ui-eyebrow">WORKSPACE BLUEPRINT</p><h2>{section ? 'Implementation boundary' : 'Designed around your work'}</h2></div><span className="section-caption">Planned capabilities · not yet available</span></div>
    <div className="scope-grid">{workspace.scope.map(({ title, description, icon: ScopeIcon }, index) => <Card key={title} className="scope-card"><div className="scope-card-top"><span className="scope-icon"><ScopeIcon size={21} strokeWidth={1.6} aria-hidden="true" /></span><span className="scope-index">0{index + 1}</span></div><h3>{title}</h3><p>{description}</p><span className="scope-status"><LockKeyhole size={12} aria-hidden="true" />Later implementation phase</span></Card>)}</div>
    <Card className="handoff-card"><div className="handoff-heading"><div><h3>A connected delivery journey</h3><p>The approved workflow connects every role. No business actions are enabled yet.</p></div><Badge>Design reference</Badge></div><ol className="journey">{['Order', 'Plan', 'Load', 'Deliver', 'Receive'].map((step, index) => <li key={step}><span className="journey-number">{index + 1}</span><span>{step}</span>{index < 4 && <MoveRight size={18} aria-hidden="true" />}</li>)}</ol></Card>
    <div className="foundation-callout"><div><strong>Foundation, without fabricated data.</strong><p>Check live API connectivity and explore the shared interface primitives.</p></div><Button asChild variant="secondary"><Link to="/foundation">Explore foundation<ArrowRight size={16} aria-hidden="true" /></Link></Button></div>
  </>;
}
