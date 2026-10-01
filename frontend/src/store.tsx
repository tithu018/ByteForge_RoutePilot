import {
  AlertTriangle,
  Bell,
  CalendarDays,
  Camera,
  Check,
  CheckCircle2,
  CircleAlert,
  Info,
  MessageSquare,
  Package,
  Search,
  ShoppingBasket,
  Trash2,
} from 'lucide-react';
import {
  ActionButton,
  ActionLink,
  Card,
  IconBubble,
  KeyRows,
  ModalPage,
  PageHeading,
  Quantity,
  RadioCard,
  ResultCard,
  StatusChip,
  StoreShell,
  Timeline,
} from './ui';

type Product = { name: string; code: string; meta: string; qty?: number; tag?: string; price?: string };

const freshProducts: Product[] = [
  { name: 'Basmati rice', code: 'FR-D01', meta: '10 × 1 kg bag · 10.4 kg · 0.014 m³', qty: 5 },
  { name: 'Red lentils (dhal)', code: 'FR-D02', meta: '10 × 1 kg bag · 10.3 kg · 0.014 m³', qty: 4 },
  { name: 'White sugar', code: 'FR-D03', meta: '10 × 1 kg pack · 10.2 kg · 0.013 m³', qty: 3 },
  { name: 'Wheat flour', code: 'FR-D04', meta: '10 × 1 kg pack · 10.3 kg · 0.017 m³', qty: 3 },
  { name: 'Ceylon black tea', code: 'FR-D05', meta: '12 × 500 g pack · 6.4 kg · 0.021 m³' },
  { name: 'Instant noodles', code: 'FR-D07', meta: '12 × 5-pack · 4.2 kg · 0.046 m³', qty: 9 },
  { name: 'Cream crackers', code: 'FR-D08', meta: '12 × 490 g pack · 6.4 kg · 0.048 m³', qty: 10 },
  { name: 'Canned mackerel', code: 'FR-D09', meta: '24 × 425 g can · 11.2 kg · 0.021 m³', qty: 1 },
  { name: 'Vegetable oil', code: 'FR-D10', meta: '12 × 1 L bottle · 12.8 kg · 0.018 m³' },
  { name: 'Bottled water', code: 'FR-D11', meta: '12 × 1.5 L bottle · 19.0 kg · 0.026 m³', qty: 1 },
  { name: 'Laundry soap bar', code: 'FR-D12', meta: '36 × 115 g bar · 4.5 kg · 0.008 m³' },
  { name: 'Toilet tissue', code: 'FR-D13', meta: '10 × 4-roll pack · 4.8 kg · 0.062 m³', qty: 10 },
  { name: 'Fresh milk', code: 'FR-C01', meta: '12 × 1 L carton · 12.8 kg · 0.019 m³', tag: 'Chilled' },
  { name: 'Set yoghurt', code: 'FR-C02', meta: '24 × 80 g cup · 2.4 kg · 0.011 m³', tag: 'Chilled' },
  { name: 'Cheddar cheese block', code: 'FR-C03', meta: '12 × 200 g block · 2.7 kg · 0.007 m³', tag: 'Chilled' },
  { name: 'Salted butter', code: 'FR-C04', meta: '24 × 200 g pack · 5.2 kg · 0.009 m³', tag: 'Chilled' },
];

const styleProducts: Product[] = [
  { name: "Men's formal shirts", code: 'ST-01', meta: 'Carton · 24 pcs · 10.1 kg · 0.143 m³', qty: 6 },
  { name: "Men's denim jeans", code: 'ST-02', meta: 'Carton · 20 pcs · 14.3 kg · 0.156 m³' },
  { name: "Women's kurta tops", code: 'ST-03', meta: 'Carton · 30 pcs · 9.9 kg · 0.175 m³', qty: 12 },
  { name: 'Cotton T-shirts', code: 'ST-04', meta: 'Carton · 40 pcs · 11.7 kg · 0.181 m³' },
  { name: "Kids' school uniforms", code: 'ST-05', meta: 'Carton · 30 sets · 12.4 kg · 0.183 m³', qty: 1 },
  { name: 'Batik sarongs', code: 'ST-06', meta: 'Carton · 40 pcs · 13.3 kg · 0.139 m³' },
  { name: 'Handloom sarees', code: 'ST-07', meta: 'Carton · 12 pcs · 9.0 kg · 0.120 m³', qty: 1 },
  { name: "Men's leather shoes", code: 'ST-08', meta: 'Carton · 12 pairs · 13.0 kg · 0.254 m³', qty: 8 },
  { name: "Women's sandals", code: 'ST-09', meta: 'Carton · 18 pairs · 10.8 kg · 0.244 m³', qty: 1 },
  { name: 'Bath towels', code: 'ST-10', meta: 'Carton · 24 pcs · 16.4 kg · 0.203 m³', qty: 12 },
  { name: 'Bed linen sets', code: 'ST-11', meta: 'Carton · 10 sets · 18.4 kg · 0.228 m³' },
  { name: 'Travel backpacks', code: 'ST-12', meta: 'Carton · 10 pcs · 9.7 kg · 0.320 m³', qty: 7 },
];

const techProducts: Product[] = [
  { name: 'Double-door refrigerator 345 L', code: 'TE-01', meta: 'Pallet · 2 units · 188.0 kg · 1.080 m³', tag: 'Fragile', price: 'LKR 378,000' },
  { name: 'Front-load washing machine 8 kg', code: 'TE-02', meta: 'Pallet · 3 units · 257.0 kg · 1.190 m³', qty: 2, tag: 'Fragile', price: 'LKR 456,000' },
  { name: '55” 4K LED TV', code: 'TE-03', meta: 'Pallet · 6 units · 132.0 kg · 0.780 m³', tag: 'Fragile', price: 'LKR 1,290,000' },
  { name: 'Split air conditioner 12,000 BTU', code: 'TE-04', meta: 'Pallet · 4 sets · 196.0 kg · 0.640 m³', price: 'LKR 620,000' },
  { name: 'Microwave oven 25 L', code: 'TE-05', meta: 'Pallet · 12 units · 178.0 kg · 0.690 m³', tag: 'Fragile', price: 'LKR 420,000' },
  { name: 'Chest freezer 300 L', code: 'TE-06', meta: 'Pallet · 2 units · 142.0 kg · 1.020 m³', price: 'LKR 330,000' },
  { name: '15” laptop', code: 'TE-07', meta: 'Crate · 20 units · 58.0 kg · 0.180 m³', tag: 'Fragile', price: 'LKR 3,900,000' },
  { name: 'Smartphone', code: 'TE-08', meta: 'Crate · 50 units · 21.0 kg · 0.070 m³', tag: 'Fragile', price: 'LKR 4,750,000' },
  { name: 'Rice cooker 1.8 L', code: 'TE-09', meta: 'Pallet · 16 units · 96.0 kg · 0.520 m³', price: 'LKR 208,000' },
  { name: 'Gas cooker, 4 burners', code: 'TE-10', meta: 'Pallet · 4 units · 176.0 kg · 0.980 m³', price: 'LKR 340,000' },
  { name: 'Inverter battery 150 Ah', code: 'TE-11', meta: 'Pallet · 8 units · 335.2 kg · 0.584 m³', price: 'LKR 520,000' },
  { name: 'Home UPS 1 kVA', code: 'TE-12', meta: 'Pallet · 10 units · 265.0 kg · 0.303 m³', qty: 1, price: 'LKR 480,000' },
];

export function StoreDashboard() {
  return <StoreShell active="dashboard"><PageHeading title="Dashboard" subtitle="Tue 24 Mar 2026 · 15:40" />
    <div className="dashboard-top">
      <Card className="metric-card"><span className="overline">Next order cutoff</span><strong className="big-stat">20 min</strong><p>Orders for Wed 25 Mar close at 16:00.</p><ActionLink to="/store/sm02">Place order</ActionLink></Card>
      <Card className="metric-card"><span className="overline">Next planned arrival</span><h2>Wed 25 Mar · 05:00–07:30</h2><p>Chilled orders ORD0096518 and ORD0096654 (both rolled over with priority), plus your dry order once submitted.</p><StatusChip tone="warning">Deferred → Wed 25 Mar</StatusChip></Card>
      <Card className="metric-card"><span className="overline">Awaiting your confirmation</span><h2>ORD0096653 · Dry</h2><p>Delivered today. 44 units expected — the loader flagged a shortfall before departure.</p><div className="inline-actions"><StatusChip tone="success">Delivered</StatusChip><ActionLink to="/store/sm09">Confirm receipt</ActionLink></div></Card>
    </div>
    <Card className="attention-card"><h2>Needs your attention</h2>
      <div className="attention-row"><AlertTriangle /><div><strong>Chilled orders deferred two days in a row</strong><p>ORD0096518 (Mon 23) and ORD0096654 (Tue 24) were both deferred. Both arrive Wed 25 Mar with priority.</p></div><ActionLink kind="secondary" to="/store/sm08">View deferral</ActionLink></div>
      <div className="attention-row"><AlertTriangle /><div><strong>Shortfall expected on ORD0096653</strong><p>The loader flagged 2 units short before the truck left. Check this when you confirm receipt.</p></div><ActionLink kind="secondary" to="/store/sm06">View order</ActionLink></div>
    </Card>
    <div className="dashboard-bottom"><Card><h2>Recent issue</h2><div className="empty-state"><IconBubble icon={CheckCircle2} /><div><strong>No open issues</strong><p>Issues you report when confirming receipt appear here with their status.</p></div></div></Card><Card><h2>Planning ahead</h2><div className="planning-row"><IconBubble icon={CalendarDays} /><div><strong>Wed 25 Mar is a payday</strong><p>Consider payday demand when you place tomorrow’s order.</p></div></div><div className="planning-row"><IconBubble icon={CalendarDays} /><div><strong>Sinhala & Tamil New Year</strong><p>No deliveries Sun 12 – Tue 14 Apr. Demand builds from Sat 4 Apr.</p></div></div></Card></div>
  </StoreShell>;
}

function OrderPage({ products, outlet = 'Fresh', outletId = 'OUT010', mall = false }: { products: Product[]; outlet?: 'Fresh' | 'Style' | 'Tech'; outletId?: string; mall?: boolean }) {
  const isStyle = outlet === 'Style'; const isTech = outlet === 'Tech';
  const selected = products.filter((product) => product.qty);
  const filters = isStyle ? ['All', 'Menswear', 'Womenswear', 'Footwear', 'Home textiles'] : isTech ? ['All', 'Large appliances', 'TV & audio', 'Computing', 'Power'] : ['All', 'Dry', 'Chilled', 'Essentials'];
  return <StoreShell active="order" outlet={outlet} outletId={outletId} mall={mall} cutoff={isStyle ? 'Weekly order · cutoff Wed 25 Mar 16:00' : isTech ? 'Cutoff Thu 26 Mar 16:00' : undefined}>
    <PageHeading title="Place order" subtitle={isStyle ? 'Weekly order · Delivery Thu 26 Mar 2026 · Order cutoff Wed 25 Mar, 16:00' : isTech ? 'Delivery Fri 27 Mar 2026 · Order cutoff Thu 26 Mar, 16:00' : 'Delivery date: Wed 25 Mar 2026 · Order cutoff 16:00'} />
    {(isStyle || isTech) && <div className="info-banner"><Info /> <div><strong>{isStyle ? 'Mall delivery slot 10:30–12:30' : 'Mall delivery slot 10:00–12:00'}</strong><p>{outletId} receives deliveries at the mall dock. {isTech ? 'High-value and fragile items are flagged for careful handling.' : 'Orders outside the slot are rescheduled.'}</p></div></div>}
    <div className="order-layout"><Card className="catalogue"><div className="catalogue-toolbar"><label><Search size={18} /><input aria-label="Search products" placeholder="Search by name or code" /></label><ActionButton kind="secondary">Repeat last order</ActionButton></div><div className="filter-row">{filters.map((filter, index) => <button className={index === 0 ? 'active' : ''} type="button" key={filter}>{filter}</button>)}</div>
      <div className="product-list">{products.map((product) => <div className="product-row" key={product.code}><IconBubble icon={Package} /><div className="product-copy"><strong>{product.name}</strong><small>{product.code} · {product.meta}</small><div><StatusChip tone="success">{product.tag ?? (isStyle || isTech ? 'Ambient' : product.code.includes('-C') ? 'Chilled' : 'Dry')}</StatusChip>{product.price && <b>{product.price}</b>}</div></div>{product.qty ? <Quantity value={product.qty} /> : <ActionButton kind="secondary">Add</ActionButton>}</div>)}</div>
    </Card><Card className="basket"><div className="basket-title"><h2>Basket</h2><StatusChip>{selected.length} products</StatusChip></div><KeyRows rows={[["Delivery", isStyle ? 'Thu 26 Mar · 10:30–12:30' : isTech ? 'Fri 27 Mar · 10:00–12:00' : 'Wed 25 Mar · 05:00–07:30']]} /><span className="overline">Order lines</span><div className="basket-lines">{selected.map((product) => <div key={product.code}><span>{product.name}</span><strong>× {product.qty}</strong></div>)}</div><KeyRows rows={[["Total", isStyle ? '48 cartons · 580.3 kg · 10.213 m³' : isTech ? '3 pallets · 779.0 kg · 2.683 m³' : '45 units · 359.0 kg · 1.878 m³'], ...(isTech ? [["Declared value", 'LKR 1,392,000'], ["Fragile items", 'Yes · washing machines']] as Array<[string,string]> : [])]} />{isTech && <label className="field-label">Handling note (optional)<input placeholder="e.g. keep upright, 2-person lift" /></label>}<ActionLink className="full" to="/store/sm03">{isStyle ? 'Submit weekly order' : 'Submit order'}</ActionLink><ActionButton className="full" kind="secondary">Save draft</ActionButton>{!isStyle && !isTech && <div className="planning-tip"><CalendarDays /><span><strong>Wed 25 Mar is a payday</strong>Consider payday demand when ordering essentials.</span></div>}</Card></div>
  </StoreShell>;
}

export const FreshOrder = () => <OrderPage products={freshProducts} />;
export const StyleOrder = () => <OrderPage products={styleProducts} outlet="Style" outletId="OUT017" mall />;
export const TechOrder = () => <OrderPage products={techProducts} outlet="Tech" outletId="OUT022" mall />;

export function OrderSubmitted() {
  return <StoreShell active="order"><div className="center-result"><ResultCard title="Order submitted" description="Waypoint received your order. The dispatcher will confirm it in the planning queue."><KeyRows rows={[["Order ID", 'ORD0096797'], ["Received by server", 'Tue 24 Mar 2026 · 15:59'], ["Delivery", 'Wed 25 Mar · 05:00–07:30'], ["Dry", '8 products · 45 units · 359.0 kg · 1.878 m³'], ["Status", <StatusChip tone="warning">Submitted</StatusChip>]]} /><div className="inline-actions"><ActionLink to="/store/sm05">View order status</ActionLink><ActionLink kind="secondary" to="/store/sm01">Back to dashboard</ActionLink></div></ResultCard></div></StoreShell>;
}

export function OrderFailed() {
  return <StoreShell active="order"><PageHeading title="Place order" subtitle="Delivery date: Wed 25 Mar 2026" /><div className="center-result"><Card className="failure-card"><div className="alert-title"><AlertTriangle /><div><h2>Not submitted yet — saved on this device</h2><p>We couldn’t reach Waypoint, so your order hasn’t been sent. Retry before the 16:00 cutoff.</p></div></div><KeyRows rows={[["Draft saved", 'Tue 24 Mar · 15:59'], ["Time left before cutoff", '2 min'], ["Dry", '8 products · 45 units · 359.0 kg · 1.878 m³'], ["Status", <StatusChip tone="warning">Pending — not submitted</StatusChip>]]} /><p className="helper">Your basket and quantities are safe. Keep editing or retry when the connection returns.</p><div className="inline-actions"><ActionLink to="/store/sm03">Retry now</ActionLink><ActionLink kind="secondary" to="/store/sm02">Keep editing</ActionLink></div></Card></div></StoreShell>;
}

const orderRows = [
  ['ORD0096797', 'Dry', 'Wed 25 Mar · 05:00–07:30', '45', 'Submitted', 'Edit'],
  ['ORD0096654', 'Chilled', 'Wed 25 Mar · 05:00–07:30', '40', 'Deferred', 'View'],
  ['ORD0096653', 'Dry', 'Tue 24 Mar · delivered', '44', 'Delivered', 'View'],
] as const;

export function OrderStatus() {
  return <StoreShell active="status"><PageHeading title="Order status" subtitle="Active orders for OUT010" /><Card className="table-card"><div className="data-table order-table"><div className="table-head"><span>Order</span><span>Type</span><span>Delivery</span><span>Units</span><span>Status</span><span /></div>{orderRows.map((row) => <div className="table-row" key={row[0]}>{row.map((cell, index) => index === 4 ? <StatusChip key={cell} tone={cell === 'Delivered' ? 'success' : 'warning'}>{cell}</StatusChip> : index === 5 ? <ActionLink kind="ghost" to={row[0] === 'ORD0096797' ? '/store/sm07' : row[0] === 'ORD0096654' ? '/store/sm08' : '/store/sm06'} key={cell}>{cell}</ActionLink> : <span key={`${cell}-${index}`}>{cell}</span>)}</div>)}</div><p className="table-note">Status steps: Submitted → Confirmed → Allocated → Loaded → Out for delivery → Delivered; or Deferred</p></Card></StoreShell>;
}

export function OrderDetail() {
  return <StoreShell active="status"><PageHeading backTo="/store/sm05" backLabel="Order status" title="ORD0096653 · Dry (ambient)" subtitle="Delivery Tue 24 Mar 2026 · 05:00–07:30" /><div className="two-column"><Card><h2>Status timeline</h2><Timeline items={[["Submitted", 'Fri 20 Mar', 'done'], ["Confirmed", 'Accepted in the depot planning queue', 'done'], ["Allocated", 'Vehicle VEH012 · Route 012-A', 'done'], ["Loaded", 'Loader flagged 2 units short before departure', 'done'], ["Out for delivery", '04:08 from Peliyagoda', 'done'], ["Delivered", 'Waiting for your receipt confirmation', 'current']]} /></Card><Card className="summary-card"><h2>Order summary</h2><KeyRows rows={[["Units", '44'], ["Weight", '300.0 kg'], ["Volume", '1.878 m³'], ["Delivery window", '05:00–07:30'], ["Status", 'Delivered']]} /><ActionLink className="full" to="/store/sm09">Confirm receipt</ActionLink><ActionLink className="full" kind="secondary" to="/store/sm-o2">Message the dispatcher</ActionLink></Card></div></StoreShell>;
}

export function EditOrder() {
  const editing = freshProducts.filter((product) => product.qty).slice(0, 8);
  return <StoreShell active="status"><PageHeading backTo="/store/sm05" backLabel="Order status" title="Edit ORD0096797" subtitle="Dry (ambient) · Delivery Wed 25 Mar 2026" /><div className="info-banner"><Info /><div><strong>You can edit or delete this order until loading starts</strong><p>Current status: Submitted. Changes go to the dispatcher straight away.</p></div></div><div className="edit-layout"><Card><div className="section-title-row"><h2>Products in this order</h2><ActionButton kind="secondary">Add products</ActionButton></div>{editing.map((product) => <div className="product-row compact" key={product.code}><IconBubble icon={Package} /><div className="product-copy"><strong>{product.name}</strong><small>{product.code} · {product.meta}</small><StatusChip tone="success">Dry</StatusChip></div><Quantity value={product.qty ?? 0} /></div>)}</Card><Card className="summary-card"><h2>Order totals</h2><KeyRows rows={[["Products", '8'], ["Units", '45'], ["Weight", '359.0 kg'], ["Volume", '1.878 m³'], ["Status", <StatusChip tone="warning">Submitted</StatusChip>]]} /></Card></div><div className="spread-actions"><div><ActionButton>Save changes</ActionButton><ActionLink kind="secondary" to="/store/sm05">Cancel</ActionLink></div><ActionLink kind="danger" to="/store/sm-o1">Delete order</ActionLink></div></StoreShell>;
}

export function DeferredOrder() {
  return <StoreShell active="status"><PageHeading backTo="/store/sm05" backLabel="Order status" title="ORD0096654 · Chilled" subtitle="Deferred from Tue 24 Mar to Wed 25 Mar 2026" /><div className="two-column wide-main"><div><Card><div className="section-title-row"><h2>Why this order was deferred</h2><StatusChip tone="warning">Deferred</StatusChip></div><p>Chilled vehicle capacity for your delivery run was full on Tue 24 Mar.</p><KeyRows rows={[["Original delivery", 'Tue 24 Mar'], ["New delivery date", 'Wed 25 Mar · 05:00–07:30'], ["Priority", 'Rolled over with priority']]} /></Card><div className="warning-banner"><AlertTriangle /><div><strong>Second deferral in a row</strong><p>Your Mon 23 Mar chilled order ORD0096518 was deferred too. Both arrive Wed 25 Mar with priority. Consecutive deferrals are flagged to the dispatcher.</p></div></div><div className="inline-actions"><ActionButton>Acknowledge</ActionButton><ActionLink kind="secondary" to="/store/sm-o2">Message the dispatcher</ActionLink></div></div><Card className="summary-card"><h2>Order</h2><KeyRows rows={[["Units", '40'], ["Weight", '293.5 kg'], ["Volume", '1.683 m³'], ["Temperature", 'Chilled']]} /></Card></div></StoreShell>;
}

export function DeleteOrderDialog() {
  return <ModalPage icon={Trash2} title="Delete ORD0096797?" description="This removes your dry order for Wed 25 Mar. You can only do this until loading starts."><div className="modal-actions"><ActionLink kind="secondary" to="/store/sm07">Keep order</ActionLink><ActionButton kind="danger">Delete order</ActionButton></div></ModalPage>;
}

export function ReceiveArrival() {
  return <StoreShell active="receive"><PageHeading title="Did the delivery arrive?" subtitle="Step 1 of 2 · ORD0096653 · Dry (ambient)" /><div className="two-column wide-main"><div><Card><h2>Delivery</h2><KeyRows rows={[["Delivered by", 'VEH022 · marked delivered at 04:44'], ["Expected", '44 units · 8 products'], ["Loader note", 'Cream crackers (FR-D08): 2 cartons short']]} /></Card><div className="info-banner"><Info /><div><strong>Confirm arrival first</strong><p>Next you’ll check each product and report anything missing or damaged.</p></div></div><div className="inline-actions"><ActionLink to="/store/sm10">Confirm arrival</ActionLink><ActionButton kind="secondary">It hasn’t arrived</ActionButton></div></div><Card className="step-card"><h2>Receiving</h2><div className="step active"><span>1</span><div><strong>Confirm arrival</strong><small>Tell us the delivery reached the outlet</small></div></div><div className="step"><span>2</span><div><strong>Check products</strong><small>Received in full, short or damaged</small></div></div></Card></div></StoreShell>;
}

const receivedProducts = [
  ['Basmati rice · FR-D01', 2, 2, 'OK'], ['Red lentils (dhal) · FR-D02', 2, 2, 'OK'], ['Wheat flour · FR-D04', 9, 9, 'OK'], ['Ceylon black tea · FR-D05', 8, 8, 'OK'], ['Instant noodles · FR-D07', 10, 10, 'OK'], ['Cream crackers · FR-D08', 10, 8, 'Short 2'], ['Bottled water · FR-D11', 1, 1, 'OK'], ['Toilet tissue · FR-D13', 2, 2, 'OK'],
] as const;

function ReceivePage({ outlet = 'Fresh' }: { outlet?: 'Fresh' | 'Style' | 'Tech' }) {
  const isStyle = outlet === 'Style'; const isTech = outlet === 'Tech';
  const products = isStyle ? [["Men's denim jeans · ST-02",12,12,'OK'], ["Women's kurta tops · ST-03",5,5,'OK'], ['Cotton T-shirts · ST-04',10,10,'OK'], ["Men's leather shoes · ST-08",1,1,'OK'], ["Women's sandals · ST-09",1,1,'OK'], ['Bath towels · ST-10',10,10,'OK'], ['Bed linen sets · ST-11',9,9,'OK'], ['Travel backpacks · ST-12',9,9,'OK']] as const : isTech ? [['Split air conditioner 12,000 BTU · TE-04',2,2,'OK'], ['55” 4K LED TV · TE-03',1,1,'Packaging damaged'], ['Microwave oven 25 L · TE-05',1,1,'OK'], ['Inverter battery 150 Ah · TE-11',1,1,'OK']] as const : receivedProducts;
  return <StoreShell active="receive" outlet={outlet} outletId={isStyle ? 'OUT017' : isTech ? 'OUT022' : 'OUT010'} mall={isStyle || isTech} cutoff={isStyle ? 'Weekly order · cutoff Wed 25 Mar 16:00' : isTech ? 'Cutoff Thu 26 Mar 16:00' : 'Cutoff 16:00 · 16 min left'}><PageHeading title="Confirm receipt" subtitle={isStyle ? 'ORD0096105 · Weekly order · Delivered Thu 19 Mar 2026' : isTech ? 'ORD0096662 · Delivered Tue 24 Mar 2026 · 5 pallets' : 'Step 2 of 2 · ORD0096653 · Dry (ambient) · Delivered Tue 24 Mar'} />{!isStyle && !isTech && <div className="warning-banner"><AlertTriangle /><div><strong>Expected shortfall</strong><p>The loader flagged 2 cartons of Cream crackers (FR-D08) short before the truck left.</p></div></div>}<div className="receive-layout"><div><Card><h2>What did you receive?</h2><div className="radio-stack"><RadioCard title="Received in full" description={isTech ? 'Every pallet arrived with no damage.' : 'Every product arrived in the expected quantity, with no damage.'} checked={isStyle} /><RadioCard title="Received short or damaged" description="Some items are missing or damaged. An issue will be opened." checked={!isStyle && !isTech} />{!isStyle && <RadioCard title="Accept with reservation" description="Accept the delivery but record a concern with a note, a photo, or both." checked={isTech} />}</div></Card><Card className="product-check-card"><h2>Check each product</h2><div className="receive-table"><div className="table-head"><span>Product</span><span>Expected</span><span>Received</span><span>Check</span></div>{products.map(([name, expected, received, check]) => <div className={check !== 'OK' ? 'table-row issue' : 'table-row'} key={name}><strong>{name}</strong><span>{expected}</span><Quantity value={received} /><StatusChip tone={check === 'OK' ? 'success' : 'warning'}>{check}</StatusChip></div>)}</div></Card>{(!isStyle) && <Card><h2>{isTech ? 'Reservation details' : 'Note and photo'}</h2><label className="field-label">Note<textarea defaultValue={isTech ? 'Outer wrap of the TV pallet is crushed on one corner. Units look intact — will check on unpacking.' : '2 cartons of Cream crackers missing — matches the loader’s flag.'} /></label><div className="photo-row"><button type="button"><Camera />{isTech ? 'Photo attached' : 'Add photo'}</button><button type="button">＋<span>{isTech ? 'Add another' : 'Add a photo'}</span></button><p>A note, a photo, or both. Photos help if damage is found later.</p></div></Card>}</div><Card className="summary-card"><h2>Counts</h2><KeyRows rows={isStyle ? [["Expected", '57 cartons'], ["You received", '57 cartons'], ["Weight", '778.8 kg'], ["Volume", '12.017 m³']] : isTech ? [["Expected", '5 pallets'], ["You received", '5 pallets'], ["Weight", '1037.2 kg'], ["Declared value", 'LKR 3,470,000']] : [["Expected", '44 units · 8 products'], ["Loader confirmed", '42 units'], ["You received", '42 units']]} /><ActionLink className="full" to="/store/sm11">{isTech ? 'Accept with reservation' : 'Confirm receipt'}</ActionLink>{!isStyle && !isTech && <ActionLink className="full" kind="secondary" to="/store/sm09">Cancel</ActionLink>}</Card></div></StoreShell>;
}

export const ReceiveProducts = () => <ReceivePage />;
export const StyleReceive = () => <ReceivePage outlet="Style" />;
export const TechReceive = () => <ReceivePage outlet="Tech" />;

export function ReceiptRecorded() {
  return <StoreShell active="receive"><div className="center-result"><ResultCard title="Receipt recorded" description="The dispatcher can now see your confirmation and the reported shortfall."><KeyRows rows={[["Order", 'ORD0096653'], ["Recorded", 'Tue 24 Mar 2026 · 15:45'], ["Received", '42 of 44 units'], ["Issue opened", 'ISS-0417'], ["Issue status", <StatusChip tone="warning">Reported</StatusChip>]]} /><div className="inline-actions"><ActionLink to="/store/sm13">View issue</ActionLink><ActionLink kind="secondary" to="/store/sm01">Back to dashboard</ActionLink></div></ResultCard></div></StoreShell>;
}

const historyRows = [
  ['ORD0096797','Wed 25 Mar','Dry','45','Submitted'], ['ORD0096654','Tue 24 Mar','Chilled','40','Deferred'], ['ORD0096653','Tue 24 Mar','Dry','44','Delivered · issue'], ['ORD0096518','Mon 23 Mar','Chilled','40','Deferred'], ['ORD0096517','Mon 23 Mar','Dry','56','Delivered'], ['ORD0096380','Sat 21 Mar','Dry','65','Delivered'], ['ORD0096245','Fri 20 Mar','Dry','59','Delivered'], ['ORD0096095','Thu 19 Mar','Chilled','57','Delivered'], ['ORD0096094','Thu 19 Mar','Dry','52','Delivered'],
];

export function HistoryIssues() {
  return <StoreShell active="history"><PageHeading title="History & issues" subtitle="Orders and issue cases for OUT010" /><Card className="table-card"><h2>Issue cases</h2><div className="data-table issue-table"><div className="table-head"><span>Case</span><span>Order</span><span>Problem</span><span>Status</span><span /></div><div className="table-row"><strong>ISS-0417</strong><span>ORD0096653</span><span>2 units short (dry)</span><StatusChip tone="success">Resolved</StatusChip><ActionLink kind="ghost" to="/store/sm13">Open</ActionLink></div></div></Card><Card className="table-card"><div className="section-title-row"><h2>Order history</h2><StatusChip tone="warning">2 consecutive chilled deferrals</StatusChip></div><div className="data-table history-table"><div className="table-head"><span>Order</span><span>Delivery date</span><span>Type</span><span>Units</span><span>Status</span></div>{historyRows.map((row) => <div className="table-row" key={row[0]}>{row.slice(0,4).map((cell) => <span key={cell}>{cell}</span>)}<StatusChip tone={row[4].includes('Deferred') ? 'warning' : row[4].includes('Submitted') ? 'neutral' : 'success'}>{row[4]}</StatusChip></div>)}</div></Card></StoreShell>;
}

export function IssueDetail() {
  return <StoreShell active="history"><PageHeading backTo="/store/sm12" backLabel="History & issues" title="ISS-0417 · 2 cartons of Cream crackers short" subtitle="ORD0096653 · Dry (ambient) · Tue 24 Mar 2026" /><div className="two-column wide-main"><div><Card><h2>Case progress</h2><Timeline items={[["Reported", 'Tue 24 Mar · by you, on receipt', 'done'], ["Acknowledged", 'By the dispatcher', 'done'], ["Under review", 'Loader, driver and store counts compared', 'done'], ["Resolved", 'Waiting for you to confirm or reopen', 'current']]} /></Card><Card><h2>Outcome</h2><p>Shortfall confirmed at loading. OUT010’s account is credited for the 2 missing cartons of Cream crackers (FR-D08).</p><div className="inline-actions"><ActionButton>Confirm outcome</ActionButton><ActionButton kind="secondary">Reopen once</ActionButton><small className="helper">You can reopen a resolved case once.</small></div></Card></div><Card className="summary-card"><h2>Evidence compared</h2><KeyRows rows={[["Loader confirmed", '42 of 44'], ["Driver proof", 'Delivered 42 · photo'], ["Store receipt", '42 of 44']]} /><StatusChip tone="success">Verified: loading stage</StatusChip></Card></div></StoreShell>;
}

const notificationItems = [
  ['Chilled order deferred again', 'ORD0096654 moved to Wed 25 Mar — the second deferral in a row.', 'warning'], ['Shortfall flagged at loading', 'ORD0096653: the loader reported 2 units short before departure.', 'warning'], ['Order delivered', 'ORD0096653 has arrived. Please confirm receipt.', 'success'], ['Issue update', 'ISS-0417 is resolved. Confirm or reopen the outcome.', 'success'],
] as const;

export function Notifications() {
  return <StoreShell active="notifications"><PageHeading title="Notifications" subtitle="4 unread" /><Card className="notification-list">{notificationItems.map(([title, text, tone]) => <div className="notification-row" key={title}><span className="unread-dot" /><IconBubble icon={tone === 'warning' ? AlertTriangle : Bell} tone={tone} /><div><strong>{title}</strong><p>{text}</p><small>Today</small></div><ActionButton kind="ghost">Acknowledge</ActionButton><ActionButton kind="secondary">View</ActionButton></div>)}</Card></StoreShell>;
}

export function Settings() {
  return <StoreShell active="settings"><PageHeading title="Settings" subtitle="Notifications and outlet details" /><div className="settings-grid"><Card><h2>Notify me about</h2>{['Deferrals','Arrival-time changes','Shortfall warnings','Issue updates'].map((label) => <label className="toggle-row" key={label}><span>{label}</span><input type="checkbox" defaultChecked /><span className="toggle" /></label>)}</Card><Card><h2>Outlet details</h2><KeyRows rows={[["Outlet", 'OUT010'], ["Brand", 'Fresh'], ["District", 'Colombo'], ["Depot", 'Peliyagoda'], ["Dock type", 'Rear dock'], ["Parking", 'Normal'], ["Delivery window", '05:00–07:30']]} /><ActionButton kind="secondary">Request a change</ActionButton></Card></div><Card><h2>Planned closure</h2><p>Tell the dispatcher in advance if the outlet will be closed, so deliveries can be rescheduled.</p><div className="closure-row"><label className="field-label">Closure date<input type="text" placeholder="Select a date" /></label><ActionLink kind="secondary" to="/store/sm-o2">Notify the dispatcher</ActionLink></div></Card></StoreShell>;
}

export function MessageDispatcherDialog() {
  return <ModalPage title="Message the dispatcher" description="Messages are sent inside Waypoint and linked to the order or case."><StatusChip>About ORD0096654</StatusChip><label className="field-label modal-field">Message<textarea placeholder="Write your message" /></label><p className="helper"><MessageSquare size={15} />Replies appear in Notifications.</p><div className="modal-actions"><ActionLink kind="secondary" to="/store/sm08">Cancel</ActionLink><ActionButton>Send message</ActionButton></div></ModalPage>;
}
