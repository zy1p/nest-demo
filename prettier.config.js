/**
 * @see https://prettier.io/docs/configuration
 * @type {import("prettier").Config}
 */
const config = {
  singleQuote: true,
  trailingComma: 'all',
  plugins: ['@ianvs/prettier-plugin-sort-imports'],
  importOrder: [
    '<TYPES>',
    '',
    '^@nestjs/(.*)$',
    '',
    '<THIRD_PARTY_MODULES>',
    '',
    '^[.]',
  ],
  importOrderParserPlugins: ['typescript', 'decorators-legacy', ''],
  importOrderTypeScriptVersion: '5.0.0',
  importOrderCaseSensitive: false,
};

module.exports = config;
