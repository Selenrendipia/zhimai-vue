// package.json的simple-git-hooks中进行配置："commit-msg": "npx commitlint --edit $1"

module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [
      2,
      'always',
      ['feat', 'fix', 'docs', 'style', 'refactor', 'perf', 'test', 'chore', 'revert', 'build']
    ]
  }
}
