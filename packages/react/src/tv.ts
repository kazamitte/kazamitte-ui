import { createTV, type VariantProps } from 'tailwind-variants';
import { configs } from './twmerge-config';

export const tv = createTV({
  twMerge: true,
  twMergeConfig: configs,
});

export type { VariantProps };
