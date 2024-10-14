/** @type import('prettier').Config */
// eslint-disable-next-line import/no-anonymous-default-export
export default {
  overrides: [
    {
      files: ["**/*"],
      // This is for jest-chain, which should always be imprted last
      excludeFiles: ["**/*.d.ts", "setupTests.ts"],
      options: {
        plugins: ["@trivago/prettier-plugin-sort-imports"],
        importOrder: ["^@", "<THIRD_PARTY_MODULES>", "^[./]", "^src/"],
        importOrderSeparation: true,
        importOrderSortSpecifiers: true,
      },
    },
  ],
  arrowParens: "always",
  bracketSameLine: false,
  bracketSpacing: true,
  embeddedLanguageFormatting: "auto",
  singleAttributePerLine: true,
  trailingComma: "none",
  singleQuote: true,
  jsxSingleQuote: true,
};
