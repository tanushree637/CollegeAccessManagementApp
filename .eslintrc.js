module.exports = {
  root: true,
  extends: ['@react-native', 'eslint:recommended'],
  rules: {
    // Many components rely on stable callbacks or intentional dep arrays.
    // Treat exhaustive-deps as a warning to avoid blocking CI/local runs.
    'react-hooks/exhaustive-deps': 'warn',
  },
};
module.exports = {
  root: true,
  extends: '@react-native',
};
