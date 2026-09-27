import { useState } from 'react';
import { Button, Dialog, DialogContent, DialogDescription, DialogTitle } from '@waypoint/ui';

export function AccessHelp({ label = 'Get Support' }: { label?: string }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button type="button" className="text-link" onClick={() => setOpen(true)}>
        {label}
      </button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogTitle>Workspace access</DialogTitle>
          <DialogDescription>
            Use the email and password issued for your Waypoint account. Your account determines
            which workspace you can access.
          </DialogDescription>
          <p>
            For a forgotten password or a new account, contact your workspace administrator.
            Self-service password reset and third-party sign-in are not configured.
          </p>
          <Button onClick={() => setOpen(false)}>Got it</Button>
        </DialogContent>
      </Dialog>
    </>
  );
}
