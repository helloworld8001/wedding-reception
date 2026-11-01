import { cp, mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

const input = process.env.PAGES_BASE_URL || process.argv[2];
if (!input) throw new Error('Supply PAGES_BASE_URL or a published site URL as the first argument.');
const url = new URL(input);
if (!['https:', 'http:'].includes(url.protocol) || url.username || url.password || url.search || url.hash) throw new Error('Expected an HTTP(S) site URL without credentials, query or fragment.');
url.pathname = url.pathname.replace(/\/+$/, '') + '/';
const source = fileURLToPath(new URL('../dist/', import.meta.url));
const output = fileURLToPath(new URL('../.artifacts/github-pages/', import.meta.url));
const escape = value => value.replaceAll('&', '&amp;').replaceAll('"', '&quot;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');
let html = await readFile(new URL('../dist/index.html', import.meta.url), 'utf8');
for (const [property, value] of [['og:url', url.href], ['og:image', new URL('assets/cover.jpg', url).href]]) {
  const pattern = new RegExp(`<meta property="${property}" content="[^"]*">`, 'g');
  if ([...html.matchAll(pattern)].length !== 1) throw new Error(`Expected one ${property} tag.`);
  html = html.replace(pattern, () => `<meta property="${property}" content="${escape(value)}">`);
}
await mkdir(new URL('../.artifacts/', import.meta.url), { recursive: true });
await rm(output, { recursive: true, force: true });
await cp(source, output, { recursive: true });
await writeFile(new URL('../.artifacts/github-pages/index.html', import.meta.url), html);
await writeFile(new URL('../.artifacts/github-pages/.nojekyll', import.meta.url), '');
console.log(`Prepared ${output}\nSite URL: ${url.href}`);
