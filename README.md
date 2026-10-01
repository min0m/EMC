# ESEN Microsoft Club — Website

The official website for the ESEN Microsoft Club (EMC): a lightweight community portal with project showcases, events, team stories, learning resources, a photo archive, and an interactive shell.

## What's inside

- **Home** — club introduction, community impact stats, and department overview
- **Projects** — filterable showcase cards with tech stacks and previews
- **Events** — event cards with a recap reel link and downloadable iCalendar files
- **Community** — the board, grouped by leadership, departments, and operations
- **Resources** — learning paths plus Microsoft Learn, Student Pack, and design links
- **Interactive shell** — a small CLI you can type commands into
- **Archive** — filterable, lazy-loaded photo archive with an accessible lightbox
- **FAQ** — the basics for visitors and students

The site remains dependency-free and needs no build step or server. Content is separated into `js/data.js`, behavior into `js/app.js`, styles into `css/styles.css`, and the existing visual assets into `assets/images/`. Typography uses Syne (display), Source Sans 3 (body), and IBM Plex Mono (labels) via Google Fonts.

## Updating the site

To update content, edit the arrays in `js/data.js`. Update layout in `index.html`, behavior in `js/app.js`, and visual styling in `css/styles.css`. The live site updates automatically within a minute of each commit.

## Integration Day recap reel

The Integration Day card in **Events** has a "Watch the reel on Instagram" button. Its target is the `reel` field of the Integration Day event in `js/data.js` — it is currently empty (`reel: ''`), so the button shows a "link coming soon" toast instead of navigating. Paste the published Instagram reel URL into that field and the button starts opening it in a new tab.
