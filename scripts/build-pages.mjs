import { cp, mkdir, readFile, readdir, writeFile } from 'node:fs/promises';
import { extname, join } from 'node:path';

const source = 'prototype';
const output = '_site';
const basePath = (process.argv[2] ?? '').replace(/\/$/, '');
const sections = ['place', 'events', 'kitchen', 'water', 'visit'];
const rootPaths = /(["'`(,]\s*)\/(?=assets\/|(?:chapters|cinema|poster)\.(?:css|js)\b|(?:place|events|kitchen|water|visit)(?=[\/"'`?#]|$))/g;
const sourceFiles = new Set(['.css', '.html', '.js']);

await cp(source, output, {
  recursive: true,
  filter: path => !['package.json', 'server.mjs', 'vercel.json'].includes(path.split(/[\\/]/).at(-1))
});

async function prefixPaths(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  for (const entry of entries) {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) {
      await prefixPaths(path);
    } else if (sourceFiles.has(extname(path))) {
      const source = await readFile(path, 'utf8');
      let page = source.replace(rootPaths, (_, before) => `${before}${basePath}/`);
      if (path === join(output, 'cinema.js')) {
        page = page.replace('`/${location.search}${hash}`', `\`${basePath}/\${location.search}\${hash}\``);
      }
      await writeFile(path, page);
    }
  }
}

await prefixPaths(output);

// Pages serves directory indexes in place of the prototype server's rewrites.
for (const section of sections) {
  const directory = join(output, section);
  await mkdir(directory, { recursive: true });
  await cp(join(output, 'index.html'), join(directory, 'index.html'));
}

await mkdir(join(output, 'tz', 'pravki'), { recursive: true });
await cp(join(output, 'assets', 'wake4you-tz.html'), join(output, 'tz', 'index.html'));
await cp(join(output, 'assets', 'wake4you-edits.html'), join(output, 'tz', 'pravki', 'index.html'));
