module.exports = {
  name: 'application-templates-institution-collaboration',
  preset: '../../../../jest.config.js',
  transform: {
    '^.+\\.[tj]sx?$': [
      'babel-jest',
      { cwd: __dirname, configFile: './babel-jest.config.json' },
    ],
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  coverageDirectory:
    '../../../../coverage/libs/application/templates/institution-collaboration',
}
