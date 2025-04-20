/**
 * @filename: lint-staged.config.js
 * @type {import('lint-staged').Configuration}
 */
const config = {
  '!(*.ts)': 'prettier --write --ignore-unknown',
  '*.ts': ['eslint --fix', 'prettier --write'],
};

module.exports = config;
