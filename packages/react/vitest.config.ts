import { globSync, readFileSync } from 'node:fs';
import { playwright } from '@vitest/browser-playwright';
import { defineConfig } from 'vitest/config';

const BROWSER_TESTS = 'src/**/__tests__/browser/**/*.test.{ts,tsx}';
const PREBUNDLE_TESTS = 'src/**/__tests__/prebundle/**/*.test.{ts,tsx}';

const arkSubpaths = [
  ...new Set(
    globSync('src/**/*.{ts,tsx}', { exclude: ['src/**/__tests__/**'] }).flatMap(
      (file) =>
        Array.from(
          readFileSync(file, 'utf8').matchAll(
            /from '(@ark-ui\/react\/[\w-]+)'/g,
          ),
          ([, spec]) => spec,
        ),
    ),
  ),
].sort();

export default defineConfig({
  test: {
    globals: true,
    testTimeout: 10000,
    projects: [
      {
        extends: true,
        test: {
          name: 'unit',
          environment: 'jsdom',
          pool: 'vmThreads',
          setupFiles: ['./vitest.setup.ts'],
          exclude: [
            '**/node_modules/**',
            '**/.git/**',
            BROWSER_TESTS,
            PREBUNDLE_TESTS,
          ],
        },
      },
      {
        extends: true,
        test: {
          name: 'prebundle',
          include: [PREBUNDLE_TESTS],
          environment: 'jsdom',
          setupFiles: ['./vitest.setup.ts'],
          // Same as an app that pre-bundles the kit. Vitest leaves only react
          // out of the bundle, so react-dom must be left out too, or Ark's
          // flushSync goes to a second copy and panels never update.
          deps: {
            optimizer: {
              client: {
                enabled: true,
                include: ['@kazamitte/kazamitte-ui'],
                exclude: ['react-dom'],
              },
            },
          },
        },
      },
      {
        extends: true,
        // Pre-bundled up front: a mid-run re-bundle reloads and fails importing tests.
        optimizeDeps: {
          include: [
            ...arkSubpaths,
            '@tanstack/react-table',
            '@testing-library/jest-dom/vitest',
            '@testing-library/react',
            'lucide-react',
            'react',
            'react-dom',
            'react/jsx-dev-runtime',
            'recharts',
            'tailwind-variants',
          ],
        },
        test: {
          name: 'browser',
          include: [BROWSER_TESTS],
          setupFiles: ['./vitest.browser.setup.ts'],
          browser: {
            enabled: true,
            headless: true,
            provider: playwright(),
            instances: [{ browser: 'chromium' }],
          },
        },
      },
    ],
  },
});
