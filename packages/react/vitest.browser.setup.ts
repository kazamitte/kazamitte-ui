import './src/__tests__/setup/browser.css';
import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/react';
import { afterEach, beforeAll } from 'vitest';

declare global {
  var IS_REACT_ACT_ENVIRONMENT: boolean | undefined;
}

// Ark's rAF/timer updates land outside act(); run after RTL's beforeAll.
beforeAll(() => {
  globalThis.IS_REACT_ACT_ENVIRONMENT = false;
});

afterEach(() => {
  cleanup();
  delete document.documentElement.dataset.mode;
});
