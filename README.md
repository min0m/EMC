# ESEN Microsoft Club — Website

The official website for the ESEN Microsoft Club (EMC): a lightweight community portal with project showcases, events, team and alumni stories, learning resources, a photo archive, and a membership section.

Built with **React 19 + TypeScript + Vite**.

## What's inside

- **Home** — club introduction, recruitment status, and community impact stats
- **Projects** — filterable showcase cards with tech stacks, repositories, and demos
- **Events** — Integration Day, with a link to the club's Instagram reel
- **Community** — executive bureau, alumni highlights, and member testimonials
- **Resources** — roadmaps plus Azure for Students, GitHub Student Pack, and Microsoft Learn links
- **Join Us** — department matcher quiz, recruitment timeline, and FAQ
- **Archive** — filterable, lazy-loaded photo archive with an accessible lightbox
- **Shell** — a small interactive terminal with a handful of commands

## Recruitment status

Recruitment for the current intake is **closed**. The membership application form and the Integration Day business reservation form have both been removed. Those sections now show a closed-state panel that links to `contact@emcclub.tn`.

## Project structure

```
index.html            Vite entry point (head, SEO meta, font links)
src/
  App.tsx             the entire site: data, behaviour, and markup
  index.css           design tokens and all component styles
  main.tsx            React entry point
public/
  assets/images/      site imagery, served at /assets/images/...
legacy/               the previous dependency-free site, kept as reference only
```

`base` is set to `./` in `vite.config.ts`, so the build works from a domain root or a project subpath.

## Working on the site

```bash
npm install
npm run dev        # dev server with hot reload
npm run build      # typecheck + production build into dist/
npm run preview    # serve the production build locally
npm run typecheck  # types only
```

To change content, edit the data arrays at the top of `src/App.tsx` — `PROJECTS`, `TEAM`, `GALLERY`, `FAQ_ITEMS`, `EVENTS`, and the quiz steps. Layout lives in the JSX, styling in `src/index.css`.

## Deploying

`npm run build` outputs a static site to `dist/`. Upload that directory to your host.

> **Note for GitHub Pages:** the site is now a build-step project rather than a plain static repo, so GitHub Pages cannot build it from source on its own. Add a GitHub Actions workflow that runs `npm ci && npm run build` and publishes `dist/`, and keep `dist/` out of version control. The previous no-build layout is preserved in `legacy/` if you need to fall back.