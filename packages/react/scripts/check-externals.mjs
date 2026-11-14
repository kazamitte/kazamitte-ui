import { globSync, readFileSync } from 'node:fs';

// One copy each across the app, or their Contexts and react-dom's internals split.
const SINGLETONS = ['react', 'react-dom', '@ark-ui/react'];

const pkg = JSON.parse(readFileSync('package.json', 'utf8'));
const peers = Object.keys(pkg.peerDependencies ?? {});
const declared = new Set([...peers, ...Object.keys(pkg.dependencies ?? {})]);
const errors = [];

for (const name of SINGLETONS) {
  if (!peers.includes(name)) errors.push(`${name} must be a peer dependency`);
  if (pkg.dependencies?.[name]) errors.push(`${name} is in dependencies`);
}

const IMPORT = /\b(?:from|import)\s*\(?\s*['"]([^'"]+)['"]/g;
const packageOf = (spec) =>
  spec
    .split('/')
    .slice(0, spec.startsWith('@') ? 2 : 1)
    .join('/');

for (const file of globSync('dist/**/*.js')) {
  if (file.includes('node_modules'))
    errors.push(`${file} is a bundled dependency`);
  for (const [, spec] of readFileSync(file, 'utf8').matchAll(IMPORT)) {
    if (spec.startsWith('.')) continue;
    if (!declared.has(packageOf(spec))) {
      errors.push(`${file} imports undeclared "${spec}"`);
    }
  }
}

if (errors.length > 0) {
  console.error('dist externals check failed:');
  for (const e of errors) console.error(`  - ${e}`);
  process.exit(1);
}
