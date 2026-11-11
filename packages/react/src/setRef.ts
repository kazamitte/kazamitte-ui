import type { Ref } from 'react';

// For wrappers that must derive a ref (a different element type, or one chosen
// at runtime) from the `Ref` prop the app passed in.
export const setRef = <T>(ref: Ref<T> | undefined, value: T | null): void => {
  if (typeof ref === 'function') ref(value);
  else if (ref) ref.current = value;
};
