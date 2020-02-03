/* istanbul ignore file */
// pretty conventional wrapper around spawn
import { spawn } from 'child_process';
import PromiseEmitter from './promise-emitter';

export default (command, ...args) =>
  new PromiseEmitter((resolve, reject, emitter) => {
    let stdout = '';
    let stderr = '';

    const proc = spawn(command, args);
    proc.stdout.on('data', msg => {
      msg = msg.toString('utf8');
      stdout += msg;
      emitter.emit('stdout', msg);
    });
    proc.stderr.on('data', msg => {
      msg = msg.toString('utf8');
      stderr += msg;
      emitter.emit('stderr', msg);
    });
    proc.on('exit', code => {
      emitter.emit('exit', code);
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
