import {
  ArrowRight,
  BarChart3,
  Box,
  Cloud,
  Headphones,
  MapPin,
  Play,
  ShieldCheck,
  Smartphone,
  Truck,
  Users,
} from 'lucide-react';
import { Link } from 'react-router';
import { Button } from '@waypoint/ui';
import { WaypointBrand } from '../components/waypoint-brand';
import { RouteMap } from '../components/route-map';

const features = [
  {
    icon: Box,
    title: 'Order Management',
    text: 'Keep outlet demand, requested dates and order details together.',
  },
  {
    icon: MapPin,
    title: 'Delivery Planning',
    text: 'Review trips, vehicle capacity and allocation constraints.',
  },
  {
    icon: Truck,
    title: 'Fleet & Deliveries',
    text: 'Follow recorded trip progress across your delivery network.',
  },
  {
    icon: Smartphone,
    title: 'Driver Workspace',
    text: 'Access assigned stops and capture delivery events.',
  },
  {
    icon: BarChart3,
    title: 'Operations Overview',
    text: 'Bring orders, exceptions and deferrals into one view.',
  },
];
export default function LandingPage() {
  return (
    <main className="landing-page">
      <section className="landing-hero" id="about">
        <header className="landing-nav public-width">
          <WaypointBrand light />
          <nav aria-label="Main navigation">
            <a href="#about">About</a>
            <a href="#features">Services</a>
            <a href="#features">Features</a>
            <a href="#contact">Contact</a>
            <a href="#teams">Our teams</a>
          </nav>
          <Button asChild>
            <Link to="/login">
              Sign in <ArrowRight size={15} />
            </Link>
          </Button>
        </header>
        <div className="landing-hero-copy public-width">
          <p className="spaced-label">DELIVER SMARTER. GO FURTHER.</p>
          <h1>
            SMART DELIVERY
            <br />
            PLANNING FOR
            <br />
            <em>MODERN RETAIL</em>
          </h1>
          <p>
            Waypoint Control Tower connects your orders, delivery plans, warehouse teams and drivers
            in one operational workspace.
          </p>
          <div className="landing-actions">
            <Button asChild>
              <Link to="/login">
                Get Started <ArrowRight size={17} />
              </Link>
            </Button>
            <a className="tour-link" href="#features">
              <span>
                <Play size={17} />
              </span>
              Explore the platform
            </a>
          </div>
        </div>
        <div className="hero-pagination" aria-hidden="true">
          <i />
          <i />
          <i />
        </div>
      </section>
      <section className="landing-contact public-width" id="contact">
        <div className="contact-panel">
          <h2>Contact Us</h2>
          <p>Let’s build a more efficient delivery operation together.</p>
          <div>
            <Headphones size={19} />
            <span>Contact your workspace administrator</span>
          </div>
          <div>
            <ShieldCheck size={19} />
            <Link to="/login">Access your authorized workspace</Link>
          </div>
          <div>
            <MapPin size={20} />
            <span>
              Waypoint Group
              <br />
              Delivery operations
            </span>
          </div>
        </div>
        <RouteMap compact labels={['Waypoint Group', 'Delivery network', 'Store outlets']} />
      </section>
      <section className="landing-features" id="features">
        <div className="public-width">
          <div className="landing-section-heading">
            <div>
              <p className="spaced-label">WHAT WE OFFER</p>
              <h2>Core Platform Features</h2>
            </div>
            <Link to="/login">
              Open your workspace <ArrowRight size={16} />
            </Link>
          </div>
          <div className="feature-grid">
            {features.map(({ icon: Icon, title, text }) => (
              <article key={title}>
                <span className="round-icon">
                  <Icon size={27} />
                </span>
                <h3>{title}</h3>
                <p>{text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
      <section className="landing-impact" id="teams">
        <div className="impact-left">
          <p className="spaced-label">ONE CONNECTED OPERATION</p>
          <h2>Clarity at Every Handoff</h2>
          <div className="impact-stats">
            {[
              [Box, 'Orders', 'Store demand'],
              [Users, '4 roles', 'Connected teams'],
              [Truck, 'Trips', 'Delivery progress'],
              [Cloud, 'Events', 'Recorded updates'],
            ].map(([Icon, value, label]) => {
              const Symbol = Icon as typeof Box;
              return (
                <div key={String(value)}>
                  <Symbol size={24} />
                  <span>
                    <strong>{String(value)}</strong>
                    <small>{String(label)}</small>
                  </span>
                </div>
              );
            })}
          </div>
        </div>
        <div className="impact-quote">
          <span>“</span>
          <div>
            <p>
              From the planning desk to the loading dock and the final delivery, every team shares a
              clearer picture.
            </p>
            <div className="quote-author">
              <span className="round-icon">
                <Users size={24} />
              </span>
              <div>
                <strong>Waypoint Group</strong>
                <small>Dispatcher · Loader · Driver · Store Manager</small>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
