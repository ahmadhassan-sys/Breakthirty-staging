// @ts-check
import { defineConfig } from 'astro/config';
import { readdir, readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { join } from 'node:path';
import { transform } from 'esbuild';
import { satteri } from '@astrojs/markdown-satteri';
import blogPlugin from './src/lib/rehype-blog.mjs';

/**
 * Minify the section scripts (public/js → dist/js) after each build.
 * Astro copies public/ untouched, so without this the scripts ship with all their comments and spacing.
 * The readable files in public/js are never changed; `npm run dev` keeps serving them as written.
 * Each script runs on its own (not bundled), so esbuild keeps the top-level names the scripts share.
 */
function minifyPublicScripts() {
  return {
    name: 'b30-minify-public-js',
    hooks: {
      'astro:build:done': async ({ dir, logger }) => {
        const walk = async (d) => {
          const out = [];
          for (const e of await readdir(d, { withFileTypes: true })) {
            const p = join(d, e.name);
            if (e.isDirectory()) out.push(...(await walk(p)));
            else if (e.name.endsWith('.js') && !e.name.endsWith('.min.js')) out.push(p);
          }
          return out;
        };
        const root = join(fileURLToPath(dir), 'js');
        let before = 0, after = 0;
        for (const file of await walk(root)) {
          const src = await readFile(file, 'utf8');
          const { code } = await transform(src, { minify: true, target: 'es2020', legalComments: 'none' });
          await writeFile(file, code);
          before += src.length; after += code.length;
        }
        logger.info(`scripts minified: ${Math.round(before / 1024)} KB → ${Math.round(after / 1024)} KB`);
      },
    },
  };
}

// https://astro.build/config
export default defineConfig({
  site: 'https://www.breakthirty.com',   // canonical URLs and the blog's share links
  integrations: [minifyPublicScripts()],
  // blog posts (src/content/blog): Markdown is shaped into the post template's sections, steps, FAQs and figures
  markdown: { processor: satteri({ hastPlugins: [blogPlugin] }) },
  vite: {
    // keep the CSS exactly as written: the minifier merges some duplicate rules
    // and that changes which one wins in the dark theme
    build: { cssMinify: false },
  },
});
