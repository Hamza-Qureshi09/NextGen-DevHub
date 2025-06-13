const types = [
  'init', //feature
  'feat', //feature
  'fix', //bugfix
  'docs', //docs related
  'style', //styles
  'refactor', //code refectoring
  'perf', //performance related
  'test', //code testing
  'build', //code production build
  'ci', //production cicd
  'chore', //dependency updation or version increase
  'revert', //revert changes
  'merge', //merge branches
];

const typeEnum = {
  rules: {
    'type-enum': [2, 'always', types],
  },
  value: () => types,
};

module.exports = {
  extends: ['@commitlint/cli', '@commitlint/config-conventional', '@commitlint/parse'],
  rules: {
    'subject-full-stop': [0, 'never'],
    'type-enum': typeEnum.rules['type-enum'],
    'type-case': [2, 'always', 'lower-case'],
    'type-empty': [2, 'never'],
    'scope-case': [0], // Turning off scope case checking to allow both lower and upper case
    'subject-empty': [2, 'never'],
    'subject-case': [0], // Turning off subject case restrictions
    'header-max-length': [2, 'always', 200],
    'header-full-stop': [0],
  },

  parserPreset: {
    parserOpts: {
      headerPattern: /^(feat|fix|docs|style|refactor|perf|test|build|ci|chore|revert|merge|init)\s*\((.*?)\):\s*(.*)$/,
      headerCorrespondence: ['type', 'scope', 'subject'],
    },
  },
};

// const commitFormats=[
//     {
//         pattern:/^\[([^[]+)\] (feat|fix|docs|style|refactor|perf|test|build|ci|chore|revert|merge) *\\( *([A-Za-z -_]+) *\\): (.+)$/,
//         inputMessage:'git commit -m "[Hamza Qureshi] feat (Auth): implement user authentication system"'
//     },
//     {
//         pattern: /^(feat|fix|docs|style|refactor|perf|test|build|ci|chore|revert|merge)\s*\((.*?)\):\s*(.*)$/,
//         inputMessage:'git commit -m "feat (Auth): implement user authentication system"'
//     }
// ]
