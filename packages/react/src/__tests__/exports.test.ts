import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

// Vitest runs from the package root.
const at = (path: string) => join(process.cwd(), path);
const pkg = JSON.parse(readFileSync(at('package.json'), 'utf8')) as {
  sideEffects: string[];
  exports: Record<string, unknown>;
  publishConfig: { exports: Record<string, unknown> };
};

const folders = readdirSync(at('src/components'), {
  withFileTypes: true,
})
  .filter((entry) => entry.isDirectory())
  .map((entry) => entry.name);

const kebab = (name: string) =>
  name
    .replace(/([A-Z]+)([A-Z][a-z])/g, '$1-$2')
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
    .toLowerCase();

const NON_COMPONENT = new Set([
  '.',
  './variants',
  './twmerge-config',
  './styles.css',
  './package.json',
  './testing/observers',
]);

const componentEntries = (exports: Record<string, unknown>) =>
  Object.fromEntries(
    Object.entries(exports).filter(([key]) => !NON_COMPONENT.has(key)),
  );

describe('package exports', () => {
  it('has one subpath per component folder', () => {
    expect(componentEntries(pkg.exports)).toEqual(
      Object.fromEntries(
        folders.map((name) => [
          `./${kebab(name)}`,
          `./src/components/${name}/index.ts`,
        ]),
      ),
    );
  });

  it('publishes the same subpaths from dist', () => {
    expect(componentEntries(pkg.publishConfig.exports)).toEqual(
      Object.fromEntries(
        folders.map((name) => [
          `./${kebab(name)}`,
          {
            types: `./dist/components/${name}/index.d.ts`,
            default: `./dist/components/${name}/index.js`,
          },
        ]),
      ),
    );
  });

  it('keeps every component in the root entry', () => {
    const index = readFileSync(at('src/index.ts'), 'utf8');
    for (const name of folders) {
      expect(index).toContain(`export * from './components/${name}';`);
    }
  });

  it('marks only CSS as having side effects', () => {
    expect(pkg.sideEffects).toEqual(['**/*.css']);
  });
});
