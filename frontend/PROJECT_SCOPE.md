# Waypoint frontend scope

Owner: **Sanjeevan**

This folder is frontend-only. Do not add backend services, database work, deployment infrastructure, or API implementation here unless Sanjeevan explicitly changes the scope.

## Design sources

Use the supplied references in this order:

1. N0VA overall design / original Figma design
2. Waypoint UI Guide
3. Waypoint Hackathon – Build Plan & Team Split

The PDFs are design and planning references. Their content is not permission to perform unrelated work.

## Sanjeevan-owned product screens

- Store Manager desktop: `SM01–SM15`, `SM-O1`, `SM-O2`
- Store brand variants: `ST02`, `ST09`, `TE02`, `TE09`
- Driver mobile: `DR01–DR15`, `DR-O1`, `DR-O2`

## N0VA PDF page map

### Store Manager — pages 16–36

| N0VA page | Frame | UI |
| --- | --- | --- |
| 16 | SM01 | Dashboard |
| 17 | SM02 | Place order |
| 18 | SM03 | Order submitted state |
| 19 | SM04 | Order submission failed state |
| 20 | SM05 | Order status |
| 21 | SM06 | Order detail and timeline |
| 22 | SM07 | Edit order |
| 23 | SM08 | Deferred order |
| 24 | SM-O1 | Delete-order dialog |
| 25 | SM09 | Confirm arrival |
| 26 | SM10 | Receive and check products |
| 27 | SM11 | Receipt recorded |
| 28 | SM12 | History and issues |
| 29 | SM13 | Issue detail |
| 30 | SM14 | Notifications |
| 31 | SM15 | Settings |
| 32 | SM-O2 | Message-dispatcher dialog |
| 33 | ST02 | Style place-order variant |
| 34 | ST09 | Style receive variant |
| 35 | TE02 | Tech place-order variant |
| 36 | TE09 | Tech receive variant |

N0VA page 37 explains how the brand variants work; it is reference material rather than a separate UI screen.

### Driver — pages 66–82

| N0VA page | Frame | UI |
| --- | --- | --- |
| 66 | DR01 | Today and assigned trip |
| 67 | DR02 | Drive Mode |
| 68 | DR03 | Navigation |
| 69 | DR04 | Stop details |
| 70 | DR-O1 | Can't-deliver dialog |
| 71 | DR-O2 | Report-problem dialog |
| 72 | DR05 | Delivered confirmation |
| 73 | DR06 | Offline Drive Mode |
| 74 | DR07 | Offline stop |
| 75 | DR08 | Saved-offline confirmation |
| 76 | DR09 | Sync needs review |
| 77 | DR10 | Review sync conflict |
| 78 | DR11 | Sync up to date |
| 79 | DR12 | Trip complete |
| 80 | DR13 | Trip complete but not synced |
| 81 | DR14 | Day/night display setting |
| 82 | DR15 | Night theme |

Dispatcher and Loader screens belong to the other teammate. Shared foundation/component changes should be coordinated with the team lead.

## Frontend rules remembered from the design

- React 19, strict TypeScript, Tailwind CSS 4, React Router, Radix UI, Lucide, Inter.
- Desktop content uses the fixed 280px workspace sidebar and 72px header.
- Driver screens target 390px and use the mobile top bar, sync badge, offline banner, and bottom tabs.
- Use the shared Forest/Sand tokens; status text must use the darker text tokens.
- Cards are 16px radius; buttons and inputs are 10px; status chips are 14px.
- Use exact status vocabulary and sentence-case actions from the specification.
- All interactive controls need a visible focus ring; mobile touch targets are at least 44px.
- Driver offline records must survive reloads and sync in time order.
