# Reference artwork

Generated with the built-in `image_gen` tool on 27 September 2026. These photographs are illustrative UI artwork, not actual fleet, outlet, or competition data. Originals remain in the local Codex generated-images directory. The application consumes these workspace copies:

- [Highway hero](../../apps/web/public/images/waypoint-highway.png): landing, dispatcher, planning, loader, driver, tracking.
- [Portrait login background](../../apps/web/public/images/waypoint-login.png): login.
- [Storefront hero](../../apps/web/public/images/waypoint-store.png): store dashboard.

The Waypoint mark is an application-native SVG in `apps/web/src/components/waypoint-brand.tsx`. The maps are native SVG schematics in `route-map.tsx`, with an explicit non-GPS label. They are not generated map images or geographical data.

## Exact generation prompts

### Highway hero

Reference input: the user-supplied `ChatGPT Image Sep 27, 2026, 07_51_43 AM.png` landing-page image.

> Create a clean photographic background asset for the website in the reference. Reproduce ONLY its top hero photograph without ANY UI, text, logos, buttons, cards, icons, maps, borders or interface. Very wide 2.5:1 cinematic photograph: silver modern European semi truck driving toward viewer on divided highway, truck positioned at 68% horizontal, visible cab and long trailer, sunset golden light from right, dark navy dramatic clouds at left, mountain ridge and city skyline in middle distance, motion blur asphalt across foreground. Keep left 45% darker with open composition to overlay headline. Match reference camera angle, lighting, subject size, road perspective, color and realism very closely. Image should fill whole canvas. Save generated asset for local website use.

### Storefront hero

> Photorealistic very wide website banner photograph, 3:1. Modern neighborhood grocery supermarket with glass front and warmly illuminated interior on right half, small simple sign reading 'Fresh Market'. Twilight dusk, dark navy cloudy sky and distant mountains at left, asphalt parking area in foreground. Composition: supermarket facade fills right 55%, left 45% open dark for overlay title. Cinematic realistic architectural photo, warm amber interior, navy shadows, matching a premium logistics website. No UI, no other text, no logo, no people. Save local web asset.

### Portrait login background

> Create only the photographic background for a logistics website sign-in page. Portrait aspect ratio 1:1.15, 1000 wide by 1150 tall. Dark navy moody sky fills top 45%, sunset sun at right around 45% height, distant mountains and city lights in the middle 40%-65%. Highway fills bottom 35%. Silver semi truck cab and trailer SMALL in bottom right: cab centered at x72%, y69%, total vehicle bounding box x60%-90%, y53%-83%. Truck is only 30% canvas width and 30% canvas height. Plenty of dark negative space at left and upper half for HTML text overlay. Dark navy cinematic photo, gold sunset, realistic city, slight highway motion blur. No text, branding, UI, logos, cards, or icons. Main constraint: small truck low right, huge open sky and city, NOT a giant truck close-up.
