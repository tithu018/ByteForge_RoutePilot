import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router';
import { WorkspaceLayout } from '../app/workspace-layout';
import WorkspacePage from '../pages/workspace-page';
import { workspaces } from '../app/workspaces';

describe('workspace shell', () => {
  for (const workspace of workspaces) {
    it(`renders the ${workspace.name} placeholder without business claims`, () => {
      render(<MemoryRouter initialEntries={[`/${workspace.id}`]}><Routes><Route path={`/${workspace.id}`} element={<WorkspaceLayout workspace={workspace} />}><Route index element={<WorkspacePage />} /></Route></Routes></MemoryRouter>);
      expect(screen.getByRole('heading', { level: 1, name: `${workspace.name} workspace` })).toBeVisible();
      expect(screen.getByText('Phase 2 · Shell only')).toBeVisible();
      expect(screen.getByRole('link', { name: 'Skip to content' })).toHaveAttribute('href', '#main-content');
    });
  }
});
