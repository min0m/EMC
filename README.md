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

## Recruitment

Recruitment is **open**. Members apply with the form in the Join Us section, which posts to web3forms.

The Integration Day business reservation form has been removed from the site entirely.

> The web3forms access key is committed in `src/App.tsx` as `WEB3FORMS_KEY`. It ships in the client bundle, so anyone can read it and submit as the club. That is fine for a public application form, but treat the key as public and rotate it if you ever add anything sensitive behind it. Moving it to an `import.meta.env.VITE_WEB3FORMS_KEY` variable keeps it out of git.

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

