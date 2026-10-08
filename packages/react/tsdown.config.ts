import { defineConfig } from 'tsdown';

export default defineConfig({
  entry: ['src/index.ts', 'src/variants.ts', 'src/twmerge-config.ts'],
  unbundle: true,
  format: 'esm',
  platform: 'neutral',
  dts: true,
  copy: ['src/ark-variants.css', 'src/styles.css'],
  publint: true,
  checks: {
    moduleLevelDirective: false,
    pluginTimings: false,
  },
});
