const { spawn } = require('child_process')

if (!process.env.RUN_POSTINSTALL_SCHEMAS) process.exit(0)
const cmd = spawn('yarn schemas', {
  shell: true,
  stdio: 'inherit',
})
cmd.on('exit', (code) => {
  process.exit(code)
})
