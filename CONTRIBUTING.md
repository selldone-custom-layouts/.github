# Adding a Layout to Selldone Custom Layouts

Every official custom Selldone Layout lives in this organization. Follow this checklist for each new one, so it is easy to find, easy to recognise, and easy to set up.

## 1. The repository

- [ ] **Name:** `official-<shop>`, e.g. `official-molino`.
- [ ] **Created in this organization**, or transferred into it. Keep the Selldone storefront as a fetch-only `upstream` remote:
  ```bash
  git remote add upstream https://github.com/selldone/storefront.git
  git remote set-url --push upstream DISABLED
  ```
- [ ] **No secrets:** no tokens, `.selldone.env`, sessions or keys in any commit. `VITE_*` values are public.
- [ ] **Visibility:** public to appear in the gallery, private while it is a draft or belongs to a client.
- [ ] **Description:** one line naming the shop and its kind.
- [ ] **Homepage:** the live shop's URL.
- [ ] **Topics:** `selldone`, `selldone-layout`, `storefront` and the kind (e.g. `grocery`, `marketplace`, `car-rental`).
- [ ] **Wiki enabled.**

## 2. `selldone-layout.json` at the root

This is the card the gallery shows:

```json
{
  "name": "Molino Market Hall",
  "shop": "molino",
  "kind": "Grocery marketplace",
  "summary": "One or two sentences: what the storefront is and what makes it different.",
  "live": "https://molino.selldone.shop",
  "cover": "docs/screenshots/cover.jpg",
  "screenshots": ["docs/screenshots/desktop-home.jpg", "docs/screenshots/phone-home.jpg"],
  "tags": ["grocery", "marketplace"],
  "package": "kalio-market-hall",
  "base": "selldone/storefront",
  "status": "live"
}
```

## 3. Screenshots from the live shop

Put them in `docs/screenshots/`:

- [ ] `cover.jpg`: 1600×900, the desktop home with the phone home beside it.
- [ ] Desktop at 1440×900: `desktop-home.jpg`, `desktop-aisle.jpg` (or the category page), `desktop-product.jpg`, `desktop-basket.jpg` (with products in it).
- [ ] Phone at 390×844: the same four pages.
- [ ] The kind's own key pages too, e.g. booking or the seller page.

## 4. README.md

- [ ] The cover, the name, a one-line summary and badges: live shop, wiki, set up with AI.
- [ ] Links: live shop, Install with AI, Manual Setup, Shop Requirements, and this organization.
- [ ] Highlights, page by page.
- [ ] A screenshot table: desktop and phone.
- [ ] A "Use it on your shop" table linking every wiki page.
- [ ] A quick start for developers.
- [ ] Where things are in the code.
- [ ] Credits: built on selldone/storefront (MIT).
- [ ] Keep Selldone's original README as `README.selldone.md`.

## 5. The wiki

Keep the source in `docs/wiki/` so AI agents that clone the repository read the same text. Publish it to the GitHub wiki.

The first page must be created once in the browser; after that, push to `<repo>.wiki.git`.

| Page | Content |
| --- | --- |
| `Home` | What it is, how a Selldone Layout works, links |
| `Install-with-AI` | What to prepare, a copy-paste prompt for Claude Code / Codex, what the agent does, what only the owner does (CLI sign-in and 2FA) |
| `Manual-Setup` | Fork, remotes, install, `.env`, dev server, `manifest.json` identity, updates from upstream |
| `Shop-Requirements` | The shop data and settings the design needs |
| `Build-and-Upload` | The release script and why each step exists |
| `Go-Live` | Attaching the exact version, domains inheriting, Home = shop page, verification, custom domain |
| `Customize` | Tokens, where each part is, rules that keep it working |
| `Troubleshooting` | Blank page, MIME, rejected uploads, old version showing, filters, map… |
| `_Sidebar` | Navigation |

## 6. After it is public

The gallery on the organization's home page updates on its own: every six hours, or right away from **Actions › Update the Layouts gallery › Run workflow** in this repository. Check that the card shows the cover, the name and the links.
