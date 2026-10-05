import { readFileSync } from 'node:fs';

const errors = [];

const agent = process.env.npm_config_user_agent ?? '';
if (!agent.startsWith('pnpm/')) {
  errors.push(`publish with pnpm (got "${agent || 'unknown'}")`);
}

const pkg = JSON.parse(
  readFileSync(new URL('../package.json', import.meta.url)),
);
const GIT_SPEC = /^(github:|git\+|git:|https?:\/\/)|^[\w-]+\/[\w.-]+(#|$)/;
for (const field of ['dependencies', 'peerDependencies']) {
  for (const [name, spec] of Object.entries(pkg[field] ?? {})) {
    if (GIT_SPEC.test(spec)) {
      errors.push(`${field}.${name} is a git dependency (${spec})`);
    }
  }
}

if (errors.length > 0) {
  console.error('prepublish check failed:');
  for (const e of errors) console.error(`  - ${e}`);
  process.exit(1);
}
