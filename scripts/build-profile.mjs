// Rebuilds the gallery on the organization's home page (profile/README.md).
//
// Every PUBLIC, non-archived repository of the organization that is a Selldone
// Layout gets a card: a repository with a selldone-layout.json at its root, or
// with the topic "selldone-layout". Private repositories are never listed. A
// repository that turns public is picked up on the next run (the workflow runs
// every six hours, on every push here, and on demand).
//
// Only the part between <!-- LAYOUTS:START --> and <!-- LAYOUTS:END --> is
// rewritten; the rest of profile/README.md is edited by hand.
//
// usage: node scripts/build-profile.mjs        (GITHUB_TOKEN optional; ORG defaults below)
import fs from "node:fs";

const ORG = process.env.ORG || "selldone-custom-layouts";
const FILE = new URL("../profile/README.md", import.meta.url);
const token = process.env.GITHUB_TOKEN;
const headers = {
  Accept: "application/vnd.github+json",
  "User-Agent": `${ORG}-profile-builder`,
  ...(token ? { Authorization: `Bearer ${token}` } : {}),
};

async function api(path) {
  const r = await fetch(`https://api.github.com${path}`, { headers });
  if (!r.ok) throw new Error(`GitHub ${r.status} for ${path}`);
  return r.json();
}

async function rawJson(repo, file) {
  const url = `https://raw.githubusercontent.com/${ORG}/${repo.name}/${repo.default_branch}/${file}`;
  const r = await fetch(url, { headers: { "User-Agent": headers["User-Agent"] } });
  if (!r.ok) return null;
  try {
    return await r.json();
  } catch {
    return null;
  }
}

const esc = (s) => String(s ?? "").replace(/[<>]/g, (c) => (c === "<" ? "&lt;" : "&gt;")).replace(/\|/g, "\\|");

async function main() {
  const repos = [];
  for (let page = 1; ; page++) {
    const batch = await api(`/orgs/${ORG}/repos?type=public&per_page=100&page=${page}`);
    repos.push(...batch);
    if (batch.length < 100) break;
  }

  const cards = [];
  for (const repo of repos) {
    if (repo.private || repo.archived || repo.name === ".github") continue;
    const meta = await rawJson(repo, "selldone-layout.json");
    const tagged = (repo.topics || []).includes("selldone-layout");
    if (!meta && !tagged) continue;
    const m = meta || {};
    const base = `https://github.com/${ORG}/${repo.name}`;
    const cover = m.cover ? `https://raw.githubusercontent.com/${ORG}/${repo.name}/${repo.default_branch}/${m.cover}` : null;
    cards.push({
      name: m.name || repo.name,
      kind: m.kind || "",
      summary: m.summary || repo.description || "",
      live: m.live || repo.homepage || "",
      cover,
      repo: base,
      wiki: repo.has_wiki ? `${base}/wiki` : null,
      ai: repo.has_wiki ? `${base}/wiki/Install-with-AI` : null,
      tags: m.tags || [],
      pushed: repo.pushed_at,
    });
  }
  cards.sort((a, b) => String(b.pushed).localeCompare(String(a.pushed)));

  const cell = (c) => {
    const img = c.cover
      ? `<a href="${c.live || c.repo}"><img src="${c.cover}" alt="${esc(c.name)}" width="100%"></a><br>`
      : "";
    const links = [
      c.live && `<a href="${c.live}">Live shop</a>`,
      `<a href="${c.repo}">Code</a>`,
      c.wiki && `<a href="${c.wiki}">Wiki</a>`,
      c.ai && `<a href="${c.ai}">Set up with AI</a>`,
    ]
      .filter(Boolean)
      .join(" · ");
    const kind = c.kind ? `<br><sub>${esc(c.kind)}</sub>` : "";
    return `<td width="50%" valign="top">${img}<b><a href="${c.repo}">${esc(c.name)}</a></b>${kind}<br>${esc(c.summary)}<br><br>${links}</td>`;
  };

  let gallery;
  if (!cards.length) {
    gallery = "_No public Layouts yet._";
  } else {
    const rows = [];
    for (let i = 0; i < cards.length; i += 2) rows.push(`<tr>${cell(cards[i])}${cards[i + 1] ? cell(cards[i + 1]) : '<td width="50%"></td>'}</tr>`);
    gallery = `<table>\n${rows.join("\n")}\n</table>\n\n<sub>${cards.length} public Layout${cards.length === 1 ? "" : "s"} · this list updates itself.</sub>`;
  }

  const text = fs.readFileSync(FILE, "utf8");
  const next = text.replace(/<!-- LAYOUTS:START -->[\s\S]*<!-- LAYOUTS:END -->/, `<!-- LAYOUTS:START -->\n${gallery}\n<!-- LAYOUTS:END -->`);
  if (next !== text) {
    fs.writeFileSync(FILE, next);
    console.log(`profile/README.md updated: ${cards.length} layout(s)`);
  } else {
    console.log(`profile/README.md unchanged: ${cards.length} layout(s)`);
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
