import type { ComponentProps } from 'react';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import * as DropdownPrimitive from '@radix-ui/react-dropdown-menu';
import * as TooltipPrimitive from '@radix-ui/react-tooltip';
import * as TabsPrimitive from '@radix-ui/react-tabs';
import { X } from 'lucide-react';
import { cn } from '../lib/cn';

export const Dialog = DialogPrimitive.Root;
export const DialogTrigger = DialogPrimitive.Trigger;
export const DialogClose = DialogPrimitive.Close;
export const DialogTitle = DialogPrimitive.Title;
export const DialogDescription = DialogPrimitive.Description;
export function DialogContent({ className, children, ...props }: ComponentProps<typeof DialogPrimitive.Content>) {
  return <DialogPrimitive.Portal><DialogPrimitive.Overlay className="ui-overlay" /><DialogPrimitive.Content className={cn('ui-dialog', className)} {...props}>{children}<DialogPrimitive.Close className="ui-overlay-close" aria-label="Close dialog"><X size={18} /></DialogPrimitive.Close></DialogPrimitive.Content></DialogPrimitive.Portal>;
}
export const Sheet = Dialog;
export const SheetTrigger = DialogTrigger;
export const SheetClose = DialogClose;
export const SheetTitle = DialogTitle;
export const SheetDescription = DialogDescription;
export function SheetContent({ className, ...props }: ComponentProps<typeof DialogPrimitive.Content>) { return <DialogContent className={cn('ui-sheet', className)} {...props} />; }
export const Drawer = Sheet;
export const DrawerContent = SheetContent;
export const DropdownMenu = DropdownPrimitive.Root;
export const DropdownMenuTrigger = DropdownPrimitive.Trigger;
export const DropdownMenuLabel = DropdownPrimitive.Label;
export function DropdownMenuContent({ className, sideOffset = 8, ...props }: ComponentProps<typeof DropdownPrimitive.Content>) { return <DropdownPrimitive.Portal><DropdownPrimitive.Content className={cn('ui-dropdown', className)} sideOffset={sideOffset} {...props} /></DropdownPrimitive.Portal>; }
export function DropdownMenuItem({ className, ...props }: ComponentProps<typeof DropdownPrimitive.Item>) { return <DropdownPrimitive.Item className={cn('ui-dropdown-item', className)} {...props} />; }
export function DropdownMenuSeparator() { return <DropdownPrimitive.Separator className="ui-menu-separator" />; }
export const TooltipProvider = TooltipPrimitive.Provider;
export const Tooltip = TooltipPrimitive.Root;
export const TooltipTrigger = TooltipPrimitive.Trigger;
export function TooltipContent({ className, sideOffset = 6, ...props }: ComponentProps<typeof TooltipPrimitive.Content>) { return <TooltipPrimitive.Portal><TooltipPrimitive.Content className={cn('ui-tooltip', className)} sideOffset={sideOffset} {...props} /></TooltipPrimitive.Portal>; }
export const Tabs = TabsPrimitive.Root;
export function TabsList({ className, ...props }: ComponentProps<typeof TabsPrimitive.List>) { return <TabsPrimitive.List className={cn('ui-tabs-list', className)} {...props} />; }
export function TabsTrigger({ className, ...props }: ComponentProps<typeof TabsPrimitive.Trigger>) { return <TabsPrimitive.Trigger className={cn('ui-tabs-trigger', className)} {...props} />; }
export function TabsContent({ className, ...props }: ComponentProps<typeof TabsPrimitive.Content>) { return <TabsPrimitive.Content className={cn('ui-tabs-content', className)} {...props} />; }
