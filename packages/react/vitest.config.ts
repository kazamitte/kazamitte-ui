import { playwright } from '@vitest/browser-playwright';
import { defineConfig } from 'vitest/config';

const BROWSER_TESTS = 'src/**/__tests__/browser/**/*.test.{ts,tsx}';

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
          exclude: ['**/node_modules/**', '**/.git/**', BROWSER_TESTS],
        },
      },
      {
        extends: true,
        // Pre-bundled up front: a mid-run re-bundle reloads and fails importing tests.
        optimizeDeps: {
          include: [
            '@ark-ui/react',
            '@ark-ui/react/color-picker',
            '@ark-ui/react/date-input',
            '@ark-ui/react/date-picker',
            '@ark-ui/react/drawer',
            '@ark-ui/react/locale',
            '@ark-ui/react/portal',
            '@ark-ui/react/rating-group',
            '@ark-ui/react/timer',
            '@ark-ui/react/tour',
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
