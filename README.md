# .github: Selldone Custom Layouts

This repository holds the organization's home page and its tooling.

| Path | What it is |
| --- | --- |
| `profile/README.md` | The organization's home page on GitHub. The gallery between `LAYOUTS:START` and `LAYOUTS:END` is generated; edit the rest by hand. |
| `scripts/build-profile.mjs` | Builds the gallery: every public, non-archived repository with a `selldone-layout.json` or the topic `selldone-layout`. |
| `.github/workflows/update-profile.yml` | Runs the builder every six hours, on every push here, and on demand. |
| `assets/` | The organization's avatar and banner. |
| `CONTRIBUTING.md` | The checklist for adding a Layout. |

Run it locally: `node scripts/build-profile.mjs`.
