const presets = ['@babel/preset-env'];
const plugins = [
  [
    '@babel/plugin-transform-modules-commonjs',
    {
      allowTopLevelThis: true,
      loose: true,
      lazy: true,
    },
  ],
];

module.exports = {
  presets,
  plugins,
};
