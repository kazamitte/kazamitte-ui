import { globSync, readFileSync } from 'node:fs';

const DIRECTIVE = /^['"]use client['"]/;
const hasDirective = (file) => DIRECTIVE.test(readFileSync(file, 'utf8'));

const missing = globSync('src/**/*.{ts,tsx}', {
  exclude: ['src/**/__tests__/**', 'src/**/*.d.ts'],
})
  .filter(hasDirective)
  .map((file) => file.replace(/^src/, 'dist').replace(/\.tsx?$/, '.js'))
  .filter((out) => !hasDirective(out));

if (missing.length > 0) {
  console.error("'use client' missing from:");
  for (const out of missing) console.error(`  - ${out}`);
  process.exit(1);
}
