/**
 * @filename: lint-staged.config.js
 * @type {import('lint-staged').Configuration}
 */
export default {
  '!(*.ts)': 'prettier --write --ignore-unknown',
  '*.ts': ['eslint --fix', 'prettier --write'],
};
