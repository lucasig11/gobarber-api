module.exports = {
    presets: [
      [
        '@babel/preset-env',
        {
          targets: {
            node: 'current'
          }
        }
      ],
      '@babel/preset-typescript'
    ],
    plugins: [
      'babel-plugin-transform-typescript-metadata',
      ['module-resolver', {
        alias: {
          '@shared': './src/shared',
          '@config': './src/config',
          '@modules': './src/modules',
          '@users': './src/modules/users',
          '@appointments': './src/modules/appointments'
        }
      }],
      ["@babel/plugin-proposal-decorators", { "legacy": true }],
      ["@babel/plugin-proposal-class-properties", { "loose": false }],
    ],
    ignore: [
      '**/*.spec.ts'
    ]
  }