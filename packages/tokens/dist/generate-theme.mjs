// indent width: 2 half-width spaces
const INDENT = " ".repeat(2);

/**
 * Role token names.
 *
 * These mirror the `--r-<role>-*` custom properties that
 * `theme/color/default.css` defines and `base/color/utility.css`
 * consumes, so generated themes are drop-in replacements for it.
 */
const ROLE_TOKENS = [
  "bg",
  "bg-subtle",
  "bg-muted",
  "bg-selected",
  "bg-solid",
  "border-subtle",
  "border-muted",
  "border-selected",
  "border-solid",
  "fg-strong",
  "fg",
  "fg-muted",
  "fg-subtle",
  "fg-contrast",
  "focus-ring",
];

const roleBlock = (role, color) => {
  const lines = ROLE_TOKENS.map(
    (t) => `${INDENT}--r-${role}-${t}: var(--c-${color}-${t});`,
  );
  return lines.join("\n");
};

const linkBlock = (color) =>
  [
    `${INDENT}--r-link-fg: var(--c-${color}-fg-muted);`,
    `${INDENT}--r-link-fg-strong: var(--c-${color}-fg);`,
  ].join("\n");

/** Generates the contents of a color theme stylesheet. */
export const generateColorTheme = (theme) => {
  const { base, primary, secondary, link } = theme;

  return `:root {
${INDENT}/* base - ${base} */
${roleBlock("base", base)}

${INDENT}/* primary - ${primary} */
${roleBlock("primary", primary)}

${INDENT}/* secondary - ${secondary} */
${roleBlock("secondary", secondary)}

${INDENT}/* link - ${link} */
${linkBlock(link)}
}
`;
};
