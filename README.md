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

The site remains dependency-free and needs no build step or server. Content is separated into `js/data.js`, behavior into `js/app.js`, styles into `css/styles.css`, and the existing visual assets into `assets/images/`.

## Hosting on GitHub Pages

1. Create a public GitHub repository.
2. Upload the repository contents, including the `css`, `js`, and `assets` folders.
3. Go to **Settings → Pages**, set Source to "Deploy from a branch," pick the `main` branch and `/ (root)` folder, then Save.
4. After a minute or two, your site is live at `https://yourusername.github.io/your-repo-name/`.

## Updating the site

To update content, edit the arrays in `js/data.js`. Update layout in `index.html`, behavior in `js/app.js`, and visual styling in `css/styles.css`. The live site updates automatically within a minute of each commit.

## The Join Us form

The membership form posts to Web3Forms, which forwards submissions straight to email — no backend required. The form's access key is embedded in `index.html`; if it ever needs to be regenerated, get a new one at [web3forms.com](https://web3forms.com) and swap the `value` on the hidden `access_key` input.

## Notes

- The page is dark-themed by default but includes a light/dark toggle (saved to the visitor's browser).
- Images are regular files with `loading="lazy"` on below-the-fold media. Replace the placeholder social, team, alumni, and project links with the club's verified URLs before launch.
- `CNAME` is intentionally unchanged until the club confirms its official domain; `emcclub.tk` should be replaced with an owned `.tn`, `.org`, or GitHub Pages domain before publishing.
