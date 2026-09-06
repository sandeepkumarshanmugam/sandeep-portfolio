/**
 * Generates public/sitemap.xml from the app's own route definitions.
 *
 * The routes are read out of src/data/nav.ts and src/data/projects.ts rather
 * than duplicated here, so adding a page or a project updates the sitemap on
 * the next build with no second edit to remember. The script throws if either
 * source yields nothing — a silently empty sitemap is worse than a failed
 * build, because nobody notices it.
 *
 * Runs automatically as part of `npm run build`.
 */
import { readFile, writeFile } from 'node:fs/promises';

const SITE_URL = process.env.SITE_URL ?? 'https://sandeepkumar.dev';

const [navSource, projectSource] = await Promise.all([
  readFile('src/data/nav.ts', 'utf8'),
  readFile('src/data/projects.ts', 'utf8'),
]);

/** Static routes, from the navigation model. */
const navPaths = [...navSource.matchAll(/path:\s*'([^']+)'/g)].map((m) => m[1]);

/** Project detail routes, from the project slugs. */
const slugs = [...projectSource.matchAll(/^\s{4}slug:\s*'([^']+)'/gm)].map((m) => m[1]);

if (navPaths.length === 0) {
  throw new Error('No nav paths found in src/data/nav.ts — sitemap would be empty.');
}
if (slugs.length === 0) {
  throw new Error('No project slugs found in src/data/projects.ts — sitemap would be incomplete.');
}

/** Home first, then the static pages, then the case studies. */
const routes = [
  ...navPaths.map((path) => ({
    path,
    // The home page is the entry point; contact changes least often.
    priority: path === '/' ? '1.0' : '0.8',
    changefreq: 'monthly',
  })),
  ...slugs.map((slug) => ({
    path: `/projects/${slug}`,
    priority: '0.7',
    changefreq: 'yearly',
  })),
];

const lastmod = new Date().toISOString().slice(0, 10);

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${routes
  .map(({ path, priority, changefreq }) => {
    // new URL() keeps the join correct whether or not SITE_URL has a slash.
    const loc = new URL(path, SITE_URL).toString();
    return `  <url>
    <loc>${loc}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`;
  })
  .join('\n')}
</urlset>
`;

await writeFile('public/sitemap.xml', xml, 'utf8');

console.log(
  `sitemap.xml — ${routes.length} URLs (${navPaths.length} pages, ${slugs.length} case studies) at ${SITE_URL}`,
);
