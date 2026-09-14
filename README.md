# ESEN Microsoft Club — Website

The official website for the ESEN Microsoft Club (EMC): a single self-contained HTML page with the club's home page, departments, photo gallery, and a membership application form.

## What's inside

- **Home** — intro to the club and its ecosystem
- **Departments** — Project, Talent Acquisition, Marketing, and Entrepreneurship, each with a description and photo
- **Pics** — a filterable photo gallery of club events and workshops
- **Join Us** — a membership application form that submits directly to email via [Web3Forms](https://web3forms.com)

Everything — logos, photos, styles, and scripts — is embedded in the one `index.html` file. There's no build step, no server, and no external assets folder to keep track of.

## Hosting on GitHub Pages

1. Create a public GitHub repository.
2. Upload `index.html` to the repository root (Add file → Upload files → Commit).
3. Go to **Settings → Pages**, set Source to "Deploy from a branch," pick the `main` branch and `/ (root)` folder, then Save.
4. After a minute or two, your site is live at `https://yourusername.github.io/your-repo-name/`.

## Updating the site

To make changes, edit `index.html` and re-upload it through **Add file → Upload files**, replacing the existing one, then commit. The live site updates automatically within a minute of each commit.

## The Join Us form

The membership form posts to Web3Forms, which forwards submissions straight to email — no backend required. The form's access key is embedded in `index.html`; if it ever needs to be regenerated, get a new one at [web3forms.com](https://web3forms.com) and swap the `value` on the hidden `access_key` input.

## Notes

- The page is dark-themed by default but includes a light/dark toggle (saved to the visitor's browser).
- All photos and the club logo are embedded as base64, which keeps the file large (a few MB) but means it's fully portable — one file, nothing else needed.
