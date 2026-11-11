'use client';

import type { ComponentPropsWithRef } from 'react';
import { ark } from '@ark-ui/react';
import { tv } from '../../tv';

// Tailwind only sees class names written out in full, so the child variants
// below repeat the utilities of Blockquote, Code, CodeBlock, Link and Table
// instead of building them from those components' strings. The browser test
// compares computed styles against the real components to catch drift.
const proseStyles = tv({
  base: [
    'text-body-16 base-fg',
    '[&>:first-child]:mt-0 [&>:last-child]:mb-0',
    // headings (sizes follow Heading's defaults per level)
    '[&_:is(h1,h2,h3,h4,h5,h6)]:mt-8 [&_:is(h1,h2,h3,h4,h5,h6)]:mb-3 [&_:is(h1,h2,h3,h4,h5,h6)]:font-bold [&_:is(h1,h2,h3,h4,h5,h6)]:base-fg-strong',
    '[&_h1]:text-highlight-32 [&_h2]:text-highlight-28 [&_h3]:text-highlight-24 [&_h4]:text-highlight-22 [&_h5]:text-body-18 [&_h6]:text-body-16',
    // flow
    '[&_:is(p,ul,ol,pre,blockquote,table)]:my-4',
    // lists
    '[&_:is(ul,ol)]:ps-6 [&_ol]:list-decimal [&_ul]:list-disc',
    '[&_li]:my-1 [&_li>:is(ul,ol)]:my-1',
    '[&_li:has(>input[type=checkbox])]:-ms-6 [&_li:has(>input[type=checkbox])]:list-none',
    '[&_input[type=checkbox]]:me-2 [&_input[type=checkbox]]:size-4 [&_input[type=checkbox]]:align-middle',
    // link (Link)
    '[&_a]:rounded-tight [&_a]:link-fg [&_a]:underline [&_a]:underline-offset-2 [&_a]:transition-colors [&_a:hover]:link-fg-strong',
    '[&_a:focus-visible]:outline-2 [&_a:focus-visible]:outline-offset-2 [&_a:focus-visible]:primary-focus-ring',
    // inline code (Code), not the code inside pre
    '[&_:not(pre)>code]:rounded-tight [&_:not(pre)>code]:base-bg-muted [&_:not(pre)>code]:px-1.5 [&_:not(pre)>code]:py-0.5 [&_:not(pre)>code]:font-mono [&_:not(pre)>code]:text-mono-14 [&_:not(pre)>code]:base-fg-strong',
    // code block (CodeBlock)
    '[&_pre]:overflow-x-auto [&_pre]:rounded-surface [&_pre]:border [&_pre]:base-border-muted [&_pre]:base-bg-muted [&_pre]:px-5 [&_pre]:py-4 [&_pre]:font-mono [&_pre]:text-mono-14 [&_pre]:base-fg-strong',
    '[&_pre:focus-visible]:outline-2 [&_pre:focus-visible]:outline-offset-2 [&_pre:focus-visible]:primary-focus-ring',
    // blockquote (Blockquote)
    '[&_blockquote]:border-s-3 [&_blockquote]:base-border-selected [&_blockquote]:ps-4 [&_blockquote]:text-body-16 [&_blockquote]:base-fg',
    // table (Table)
    '[&_table]:w-full [&_table]:border-collapse [&_table]:text-dense-14 [&_table]:base-fg',
    '[&_th]:border-b [&_th]:base-border-solid [&_th]:px-3 [&_th]:py-2 [&_th]:text-start [&_th]:font-semibold [&_th]:base-fg-strong',
    '[&_td]:border-b [&_td]:base-border-muted [&_td]:px-3 [&_td]:py-2 [&_td]:align-top',
    // rule and image
    '[&_hr]:my-8 [&_hr]:border-0 [&_hr]:border-t [&_hr]:base-border-muted',
    '[&_img]:h-auto [&_img]:max-w-full [&_img]:rounded-surface',
  ],
});

export const Prose = ({
  className,
  ...props
}: ComponentPropsWithRef<typeof ark.div>) => (
  <ark.div className={proseStyles({ className })} {...props} />
);
