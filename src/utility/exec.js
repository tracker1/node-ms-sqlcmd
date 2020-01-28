/* istanbul ignore file */
// pretty conventional wrapper around spawn
import { spawn } from 'child_process';

export default (command, ...args) =>
  new Promise((resolve, reject) => {
    let stdout = '';
    let stderr = '';

    const proc = spawn(command, args);
    proc.stdout.on('data', msg => (stdout += msg.toString('utf8')));
    proc.stderr.on('data', msg => (stderr += msg.toString('utf8')));
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
