// UPGRADE WARNING
// Copied from @nrwl/jest/plugins/resolver.js v11.4.0
// Removed .css extension override to support vanilla-extract.
// May need an update whenever @nrwl/jest changes.

const path_1 = require('path')
const fs = require('fs')
const ts = require('typescript')
const defaultResolver_1 = require('jest-resolve/build/defaultResolver')

function getCompilerSetup(rootDir) {
  const tsConfigPath =
    ts.findConfigFile(rootDir, ts.sys.fileExists, 'tsconfig.spec.json') ||
    ts.findConfigFile(rootDir, ts.sys.fileExists, 'tsconfig.test.json') ||
    ts.findConfigFile(rootDir, ts.sys.fileExists, 'tsconfig.jest.json')
  if (!tsConfigPath) {
    console.error(
      `Cannot locate a tsconfig.spec.json. Please create one at ${rootDir}/tsconfig.spec.json`,
    )
  }
  const readResult = ts.readConfigFile(tsConfigPath, ts.sys.readFile)
  const config = ts.parseJsonConfigFileContent(
    readResult.config,
    ts.sys,
    path_1.dirname(tsConfigPath),
  )
  const compilerOptions = config.options
  const host = ts.createCompilerHost(compilerOptions, true)
  return { compilerOptions, host }
}

let compilerSetup
module.exports = function (path, options) {
  const ext = path_1.extname(path)
  if (
    ext === '.scss' ||
    ext === '.sass' ||
    ext === '.less' ||
    ext === '.styl'
  ) {
    return require.resolve('identity-obj-proxy')
  }
  // Try to use the defaultResolver
  try {
    return defaultResolver_1.default(path, options)
  } catch (e) {
    // Fallback to using typescript
    const workspace = JSON.parse(
      fs.readFileSync(
        path_1.join(process.env.NX_WORKSPACE_ROOT, 'workspace.json'),
        { encoding: 'utf-8' },
      ),
    )
    const projectRoot = workspace.projects[process.env.NX_TASK_TARGET_PROJECT]
    compilerSetup =
      compilerSetup ||
      getCompilerSetup((options.rootDir ?? options.basedir) + `/${projectRoot}`)
    const { compilerOptions, host } = compilerSetup
    return ts.resolveModuleName(path, options.basedir, compilerOptions, host)
      .resolvedModule.resolvedFileName
  }
}
