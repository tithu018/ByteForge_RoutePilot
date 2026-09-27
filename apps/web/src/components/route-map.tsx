import { useId, useState } from 'react';
import { MapPin, Minus, Plus, Truck } from 'lucide-react';

/** Deliberately schematic: the API does not supply geographic coordinates or live GPS. */
export function RouteMap({
  labels = [],
  compact = false,
}: {
  labels?: string[];
  compact?: boolean;
}) {
  const id = useId().replaceAll(':', '');
  const [zoom, setZoom] = useState(1);
  const [routes, setRoutes] = useState(true);
  return (
    <div className={`route-map ${compact ? 'map-compact' : ''}`}>
      <div className="map-art" style={{ transform: `scale(${zoom})` }}>
        <svg viewBox="0 0 700 330" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
          <defs>
            <pattern
              id={id}
              width="55"
              height="42"
              patternTransform="rotate(-18)"
              patternUnits="userSpaceOnUse"
            >
              <rect width="55" height="42" fill="#eef0ed" />
              <path d="M0 0H55V42H0Z M22 0V42 M0 20H55" stroke="#fff" strokeWidth="3" fill="none" />
            </pattern>
          </defs>
          <rect width="700" height="330" fill={`url(#${id})`} />
          <path
            d="M0 35 95 10 145 76 118 135 36 143ZM485 0l65 98 115-28 35-70ZM570 210l130-40v160H595Z M185 225l64-22 50 90-50 37h-64Z"
            fill="#d4e8d5"
          />
          <path
            d="M290-20c-65 75 85 106 6 174s30 83-15 192"
            stroke="#c0dce9"
            strokeWidth="35"
            fill="none"
          />
          <path
            d="M-20 265 720 50M98-10l315 360M533-10 399 350"
            stroke="#fff"
            strokeWidth="12"
            fill="none"
          />
          <path
            d="M-20 265 720 50M98-10l315 360M533-10 399 350"
            stroke="#f3d28c"
            strokeWidth="5"
            fill="none"
          />
          <path
            d="M0 120 700 270M65 0l10 330M360 0l250 330"
            stroke="#fff"
            strokeWidth="7"
            fill="none"
          />
          {routes && (
            <>
              <path
                d="M170 240 215 185 325 195 375 130 480 98 545 150"
                fill="none"
                stroke="#0963ff"
                strokeWidth="5"
                strokeLinejoin="round"
              />
              <path d="m375 130 12-55 79-28" fill="none" stroke="#ff9019" strokeWidth="4" />
              <path d="m480 98 58 116-70 58" fill="none" stroke="#17924a" strokeWidth="4" />
            </>
          )}
        </svg>
        {[
          { x: 24, y: 71 },
          { x: 53, y: 39 },
          { x: 76, y: 45 },
        ].map((point, i) => (
          <div key={i} className="map-point" style={{ left: `${point.x}%`, top: `${point.y}%` }}>
            <span>{i === 0 ? <Truck size={18} /> : <MapPin size={18} />}</span>
            <small>{labels[i] ?? ['Depot', 'Delivery area', 'Outlet'][i]}</small>
          </div>
        ))}
      </div>
      <span className="map-disclosure">Route schematic · Not live GPS</span>
      {!compact && (
        <label className="map-layer">
          <input type="checkbox" checked={routes} onChange={(e) => setRoutes(e.target.checked)} />{' '}
          Planned routes
        </label>
      )}
      <div className="map-controls">
        <button
          aria-label="Zoom in"
          disabled={zoom >= 1.6}
          onClick={() => setZoom(Math.min(1.6, zoom + 0.2))}
        >
          <Plus size={17} />
        </button>
        <button
          aria-label="Zoom out"
          disabled={zoom <= 1}
          onClick={() => setZoom(Math.max(1, zoom - 0.2))}
        >
          <Minus size={17} />
        </button>
      </div>
    </div>
  );
}
