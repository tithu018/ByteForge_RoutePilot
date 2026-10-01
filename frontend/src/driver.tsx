import { AlertTriangle, Check, CheckCircle2, Clock3, Info, MapPin, Navigation, RefreshCw, SignalZero } from 'lucide-react';
import {
  ActionButton,
  ActionLink,
  Card,
  DriverModal,
  DriverShell,
  IconBubble,
  KeyRows,
  RadioCard,
  StatusChip,
} from './ui';

const stops = [
  ['1', 'OUT008', 'Window 05:00–07:30', '04:34'],
  ['2', 'OUT010', 'Window 05:00–07:30', '04:57'],
  ['3', 'OUT009', 'Window 04:00–07:45', '05:19'],
  ['4', 'OUT011', 'Window 03:00–08:00', '05:43'],
  ['5', 'OUT014', 'Window 05:30–08:00', '06:05'],
] as const;

function StopList() {
  return <Card className="stop-list">{stops.map(([number, outlet, window, time]) => <div className="stop-list-row" key={outlet}><span className="stop-number">{number}</span><div><strong>{outlet}</strong><small>{window}</small></div><strong>{time}</strong></div>)}</Card>;
}

function NextStopCard({ outlet = 'OUT010', stop = '2', eta = '04:57', window = '05:00–07:30', done = '1', night = false }: { outlet?: string; stop?: string; eta?: string; window?: string; done?: string; night?: boolean }) {
  return <Card className="next-stop-card"><span className="overline">Next stop</span><h1>{outlet}</h1><p>Stop {stop} of 5 · Rear dock</p><div className="eta-grid"><div><small>ETA</small><strong>{eta}</strong></div><div><small>Window</small><strong>{window}</strong></div></div>{!night && <StatusChip tone="warning"><Clock3 size={14} />{stop === '2' ? 'Window opens at 05:00' : 'Inside window'}</StatusChip>}<div className="progress-row"><span><i style={{ width: `${Number(done) * 20}%` }} /></span><strong>{done} of 5 stops done</strong></div></Card>;
}

export function DriverToday() {
  return <DriverShell time="03:58" active="today"><h1 className="driver-page-title">Today</h1><Card><div className="driver-card-title"><h2>Trip 1 · Colombo</h2><StatusChip tone="success">Loaded</StatusChip></div><KeyRows rows={[["Vehicle", 'VEH012 · ambient truck'], ["Departs", '04:08'], ["Stops", '5 · 216 units'], ["Loaded", '03:52 at Peliyagoda']]} /></Card><div className="driver-info"><Info /><p><strong>Loader note · OUT010</strong>1 carton of Instant noodles was damaged and not loaded. The store already knows.</p></div><StopList /><ActionLink className="full driver-primary" to="/driver/dr02">Start trip</ActionLink></DriverShell>;
}

export function DriveMode() {
  return <DriverShell time="04:50" subtitle="Driving · Stop 1 delivered 04:36" active="trip"><NextStopCard /><ActionLink className="full driver-primary" to="/driver/dr04">I’ve stopped safely</ActionLink><ActionLink className="full" kind="secondary" to="/driver/dr03">Open navigation</ActionLink><p className="driver-helper">Delivery details unlock after you’ve stopped. Navigation is optional.</p></DriverShell>;
}

export function DriverNavigation() {
  return <div className="driver-stage"><main className="driver-app navigation-app"><div className="phone-status map-status"><strong>04:51</strong><span>4G ▮ ▮ ▮</span></div><div className="turn-banner"><Navigation /><div><strong>Turn right in 300 m</strong><small>then continue 1.1 km</small></div></div><div className="map-canvas"><div className="road road-a" /><div className="road road-b" /><div className="road road-c" /><div className="river" /><div className="route-line route-a" /><div className="route-line route-b" /><span className="map-pin start"><MapPin /></span><span className="map-pin end"><MapPin /></span></div><div className="map-footer"><div><strong>OUT010 · Stop 2 of 5</strong><small>ETA 04:57 · 3.9 km · 8 min</small></div><StatusChip>Illustrative map</StatusChip><ActionLink className="full" kind="secondary" to="/driver/dr02">Exit navigation</ActionLink><p>Voice guidance is on. Keep your eyes on the road.</p></div></main></div>;
}

export function StopDetails() {
  return <DriverShell time="04:58" subtitle="Stopped at OUT010" active="trip"><Card className="stop-detail"><span className="overline">Stop 2 of 5</span><h1>OUT010</h1><KeyRows rows={[["Dock", 'Rear dock'], ["Parking", 'Normal'], ["Window", '05:00–07:30'], ["Order", 'ORD0096797 · 45 units']]} /></Card><div className="warning-banner driver-warning"><AlertTriangle /><div><strong>Expected shortfall</strong><p>1 carton of Instant noodles was damaged at loading and isn’t on the truck.</p></div></div><ActionLink className="full driver-primary" to="/driver/dr05">Mark delivered</ActionLink><ActionLink className="full" kind="secondary" to="/driver/dr-o1">Can’t deliver</ActionLink><ActionLink className="full" kind="ghost" to="/driver/dr-o2">Report a problem</ActionLink><p className="driver-helper">The store manager confirms what arrived and reports any goods issues.</p></DriverShell>;
}

export function CantDeliverDialog() {
  return <DriverModal title="Can’t deliver to OUT010" description="Choose a reason. The Dispatcher and the store see it straight away."><div className="radio-stack compact-radios"><RadioCard title="Store closed" /><RadioCard title="No access or parking" /><RadioCard title="Refused by the store" /><RadioCard title="Outside the delivery window" /><RadioCard title="Other" checked /></div><label className="field-label">Note (required for Other)<input placeholder="Describe what happened" /></label><div className="modal-actions"><ActionLink kind="secondary" to="/driver/dr04">Cancel</ActionLink><ActionButton>Record</ActionButton></div></DriverModal>;
}

export function ReportProblemDialog() {
  return <DriverModal title="Report a problem" description="For trip problems only — the store reports any issues with goods when it confirms receipt."><div className="radio-stack compact-radios"><RadioCard title="Running late" checked /><RadioCard title="Can’t access the outlet" /><RadioCard title="Vehicle problem" /><RadioCard title="Other" /></div><label className="field-label">Note (optional)<input defaultValue="e.g. road closed near the outlet" /></label><div className="modal-actions"><ActionLink kind="secondary" to="/driver/dr04">Cancel</ActionLink><ActionButton>Send</ActionButton></div></DriverModal>;
}

export function StopDelivered() {
  return <DriverShell time="05:03" subtitle="Stop 2 of 5 done" active="trip"><Card className="delivered-card"><IconBubble icon={CheckCircle2} /><h1>Delivered</h1><p>OUT010’s store manager will confirm what arrived.</p><KeyRows rows={[["Stop", '2 of 5 · OUT010'], ["Recorded", 'Wed 25 Mar · 05:03'], ["Sync", <StatusChip tone="success">Up to date</StatusChip>]]} /></Card><Card className="next-mini"><span className="overline">Next</span><h2>OUT009 · ETA 05:19</h2><p>Window 04:00–07:45</p></Card><ActionLink className="full driver-primary" to="/driver/dr06">Resume driving</ActionLink></DriverShell>;
}

export function OfflineDriveMode() {
  return <DriverShell time="05:12" subtitle="Driving · 2 of 5 done" status="Saved offline" tone="neutral" offline active="trip"><NextStopCard outlet="OUT009" stop="3" eta="05:19" window="04:00–07:45" done="2" /><ActionLink className="full driver-primary" to="/driver/dr07">I’ve stopped safely</ActionLink><ActionLink className="full" kind="secondary" to="/driver/dr03">Open navigation</ActionLink><p className="driver-helper">Delivery details unlock after you’ve stopped. Navigation is optional.</p></DriverShell>;
}

export function OfflineStop() {
  return <DriverShell time="05:19" subtitle="Stopped at OUT009" status="Saved offline" tone="neutral" offline active="trip"><Card className="stop-detail"><span className="overline">Stop 3 of 5</span><h1>OUT009</h1><KeyRows rows={[["Dock", 'Rear dock'], ["Parking", 'Normal'], ["Window", '04:00–07:45'], ["Order", 'ORD0096796 · 38 units']]} /></Card><ActionLink className="full driver-primary" to="/driver/dr08">Mark delivered</ActionLink><ActionLink className="full" kind="secondary" to="/driver/dr-o1">Can’t deliver</ActionLink><ActionLink className="full" kind="ghost" to="/driver/dr-o2">Report a problem</ActionLink><p className="driver-helper">The store manager confirms what arrived and reports any goods issues.</p></DriverShell>;
}

export function OfflineSaved() {
  return <DriverShell time="05:21" subtitle="Stop 3 of 5 done" status="Saved offline" tone="neutral" offline active="trip"><Card className="saved-card"><IconBubble icon={SignalZero} tone="warning" /><h1>Saved offline</h1><p>The delivery is kept on this phone and sends automatically when the signal returns. It won’t be lost if the app restarts.</p><KeyRows rows={[["Stop", '3 of 5 · OUT009'], ["Recorded", 'Wed 25 Mar · 05:21 (phone time)'], ["Waiting to sync", '1 record']]} /></Card><Card className="next-mini"><span className="overline">Next</span><h2>OUT011 · ETA 05:43</h2><p>Window 03:00–08:00</p></Card><ActionLink className="full driver-primary" to="/driver/dr09">Resume driving</ActionLink></DriverShell>;
}

const syncedRows = [
  ['OUT008 · Delivered', 'Stop 1 · 04:36'], ['OUT010 · Delivered', 'Stop 2 · 05:03'], ['OUT009 · Delivered', 'Stop 3 · 05:21'],
] as const;

function SyncRows({ complete = false }: { complete?: boolean }) {
  return <div className="sync-rows">{syncedRows.map(([title, detail], index) => <Card className="sync-row" key={title}><div><strong>{title}</strong><small>{detail}{complete && index === 2 ? ' · kept your record' : ''}</small></div><StatusChip tone={complete || index < 2 ? 'success' : 'warning'}>{complete || index < 2 ? 'Synced' : 'Needs review'}</StatusChip></Card>)}</div>;
}

export function SyncNeedsReview() {
  return <DriverShell time="05:40" subtitle="Back online · syncing" status="Needs review" tone="warning" active="sync"><h1 className="driver-page-title">Sync</h1><div className="warning-banner driver-warning"><AlertTriangle /><div><strong>1 record needs your review</strong><p>Everything else sent in time order. Nothing is treated as synced until the server confirms it.</p></div></div><SyncRows /><ActionLink className="full driver-primary" to="/driver/dr10">Review OUT009</ActionLink></DriverShell>;
}

export function SyncConflict() {
  return <DriverShell time="05:41" subtitle="Sync" status="Needs review" tone="warning" active="sync"><h1 className="driver-page-title">Review OUT009</h1><p className="driver-lead">While you were offline, the server marked this stop as “Driver offline — status unknown”. Your phone has the delivery.</p><div className="radio-stack"><RadioCard title="Keep my record" description="Delivered at 05:21 (phone time). Recommended — it’s what happened." checked /><RadioCard title="Keep the server’s status" description="Leaves the stop unconfirmed. The Dispatcher follows up." /></div><ActionLink className="full driver-primary" to="/driver/dr11">Confirm and sync</ActionLink><p className="driver-helper">Both versions stay in the audit trail — nothing is overwritten silently.</p></DriverShell>;
}

export function SyncUpToDate() {
  return <DriverShell time="05:42" subtitle="All records sent" active="sync"><h1 className="driver-page-title">Sync</h1><div className="success-banner"><CheckCircle2 /><div><strong>Up to date</strong><p>All 3 records are on the server. Pending count cleared.</p></div></div><SyncRows complete /><ActionLink className="full driver-primary" to="/driver/dr12">Continue trip</ActionLink></DriverShell>;
}

export function TripComplete() {
  return <DriverShell time="06:14" subtitle="All stops visited" active="trip"><h1 className="driver-page-title">Trip complete</h1><Card><KeyRows rows={[["Stops delivered", '5 of 5'], ["Can’t deliver", 'None'], ["Problems reported", 'None'], ["Records", '5 synced']]} /></Card><div className="success-banner"><CheckCircle2 /><div><strong>Everything is synced</strong><p>Return VEH012 to Peliyagoda depot.</p></div></div><ActionButton className="full driver-primary">End trip</ActionButton></DriverShell>;
}

export function TripNotSynced() {
  return <DriverShell time="06:10" subtitle="All stops visited" status="1 not synced" tone="neutral" active="trip"><h1 className="driver-page-title">Trip complete</h1><Card><KeyRows rows={[["Stops delivered", '5 of 5'], ["Can’t deliver", 'None'], ["Problems reported", 'None'], ["Records", '4 synced · 1 waiting']]} /></Card><div className="warning-banner driver-warning"><AlertTriangle /><div><strong>OUT014 isn’t synced yet</strong><p>You can’t end the trip until every delivery record reaches the server.</p></div></div><ActionButton className="full" disabled>End trip</ActionButton><ActionLink className="full" kind="secondary" to="/driver/dr09">Go to Sync</ActionLink></DriverShell>;
}

export function DriverDisplay() {
  return <DriverShell time="04:45" title="Settings" subtitle="Driver · VEH012" active="trip"><h1 className="driver-page-title">Display</h1><p className="driver-lead">Night mode dims the screen for driving in the dark. Colours keep the same meaning in both modes.</p><div className="radio-stack"><RadioCard title="Day mode" description="Light screen for daytime." checked /><RadioCard title="Night mode" description="Dark screen with softer brightness." /></div><Card className="switch-row"><span>Switch automatically after sunset</span><label><input type="checkbox" defaultChecked /><i /></label></Card><ActionLink className="full" kind="secondary" to="/driver/dr15">Preview Drive Mode at night</ActionLink><ActionLink className="full" kind="ghost" to="/driver/dr02">Back to trip</ActionLink></DriverShell>;
}

export function DriveModeNight() {
  return <DriverShell time="04:50" subtitle="Night mode" night active="trip"><NextStopCard night /><ActionLink className="full driver-primary night-button" to="/driver/dr04">I’ve stopped safely</ActionLink><ActionLink className="full night-secondary" kind="secondary" to="/driver/dr03">Open navigation</ActionLink><p className="driver-helper">Sample page: night colours are prototype values, not yet saved as styles.</p></DriverShell>;
}
