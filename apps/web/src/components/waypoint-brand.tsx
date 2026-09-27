import { Link } from 'react-router';

export function WaypointBrand({ light = false }: { light?: boolean }) {
  return (
    <Link
      to="/"
      className={`waypoint-brand ${light ? 'brand-light' : ''}`}
      aria-label="Waypoint Control Tower home"
    >
      <svg viewBox="0 0 76 52" aria-hidden="true">
        <path
          fill="#58bdff"
          d="M0 0h18L9 16zM22 0h20L32 18zM46 0h30L61 26zM11 20 21 2l10 19-10 20zM34 22 44 3l15 27-12 22z"
        />
        <path
          fill="#168aff"
          d="m0 0 9 16 9-16zM22 0l10 18L42 0zM11 20l10 21 10-20-10 5zM34 22l13 30 12-22-14 4z"
          opacity=".6"
        />
      </svg>
      <span>
        <strong>Waypoint</strong>
        <small>Control Tower</small>
      </span>
    </Link>
  );
}
