/* istanbul ignore file */
// pretty conventional wrapper around spawn
import { spawn } from 'child_process';

export default (command, args = [], { echo = false, ...options } = {}) =>
  new Promise((resolve, reject) => {
    let stdout = '';
    let stderr = '';

    if (echo) {
      console.log(`spawn ${command} ${args.join(' ')}`);
    }
    const proc = spawn(command, args, options);
    proc.stdout.on('data', msg => {
      if (echo) process.stdout.write(msg);
      stdout += msg.toString('utf8');
    });
    proc.stderr.on('data', msg => {
      if (echo) process.stderr.write(msg);
      stderr += msg.toString('utf8');
    });
    proc.on('exit', code => {
      if (code === 0) {
        return resolve({ code, stdout, stderr });
      }
      return reject(
        Object.assign(new Error('Execution failed'), { code, stdout, stderr, command, args })
      );
    });
    proc.on('error', error => {
      if (error.code === 'ENOENT' && error.path === command) {
        return reject(
          Object.assign(
            new Error('Execution failed, command not found', { command, args, innerError: error })
          )
        );
      }
      return reject(error);
    });
  });
