/* istanbul ignore file */
// TODO: temporarily ignore file for coverage
import getCommandArgs from './get-command';
import exec from '../utility/exec';

const executeLocal = async (options, scripts, vars) => {
  const args = getCommandArgs(options, scripts, vars);

  var runner = exec(options.sqlcmd, ...args);
  if (options.echo) {
    runner.on('stdout', console.log);
    runner.on('stderr', console.error);
  }
  var result = await runner;
  return result;
};

export default executeLocal;
