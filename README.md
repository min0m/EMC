# ESEN Microsoft Club — Website

The official website for the ESEN Microsoft Club (EMC): a lightweight community portal with project showcases, events, team and alumni stories, learning resources, a photo archive, and a membership application form.

## What's inside

- **Home** — club introduction, recruitment status, and community impact stats
- **Projects** — filterable showcase cards with tech stacks, repositories, and demos
- **Events** — upcoming workshops with RSVP links and downloadable iCalendar files
- **Community** — executive bureau, alumni highlights, and member testimonials
- **Resources** — roadmaps plus Azure for Students, GitHub Student Pack, and Microsoft Learn links
- **Join Us** — department matcher quiz, recruitment timeline, FAQ, and application form
- **Archive** — filterable, lazy-loaded photo archive with an accessible lightbox

The site remains dependency-free and needs no build step or server. Content is separated into `js/data.js`, behavior into `js/app.js`, styles into `css/styles.css`, and the existing visual assets into `assets/images/`. Typography uses Syne (display), Source Sans 3 (body), and IBM Plex Mono (labels) via Google Fonts.

## Updating the site

To update content, edit the arrays in `js/data.js`. Update layout in `index.html`, behavior in `js/app.js`, and visual styling in `css/styles.css`. The live site updates automatically within a minute of each commit.

## The Join Us form

The membership form posts to Web3Forms, which forwards submissions straight to email — no backend required. The form's access key is embedded in `index.html`; if it ever needs to be regenerated, get a new one at [web3forms.com](https://web3forms.com) and swap the `value` on the hidden `access_key` input.
