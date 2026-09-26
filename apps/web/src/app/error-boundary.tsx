import { Component } from 'react';
import type { ErrorInfo, ReactNode } from 'react';
import { ErrorState } from '@waypoint/ui';

export class ErrorBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  override state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  override componentDidCatch(_error: Error, _info: ErrorInfo): void { console.error('The application could not render. Reload to retry.'); }
  override render() { return this.state.failed ? <main className="standalone-state"><ErrorState description="The application encountered a display error. Reload this page to try again." onRetry={() => window.location.reload()} /></main> : this.props.children; }
}
