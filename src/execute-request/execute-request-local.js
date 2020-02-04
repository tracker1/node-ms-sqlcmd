/* istanbul ignore file */
// TODO: temporarily ignore file for coverage
import getCommandArgs from './get-command';
import exec from '../utility/exec-echo';

const executeLocal = async (options, scripts, vars) => {
  const { sqlcmd, args } = getCommandArgs(options, scripts, vars);

  var result = await exec(options.echo, sqlcmd, ...args);
  return result;
};

export default executeLocal;
