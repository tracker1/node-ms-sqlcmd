/* istanbul ignore file */
// TODO: temporarily ignore file for coverage
import getCommandArgs from './get-command';
import spawn from '../utility/spawn';

const executeLocal = async (options, scripts, variables) => {
  const { sqlcmd, args, vars } = getCommandArgs(options, scripts, variables);

  // Windows path
  if (sqlcmd.indexOf('\\') >= 0) {
    // windows -- var directly
    return await spawn(sqlcmd, [...vars, ...args], { echo: options.echo });
  }

  // linux - sqlcmd uses environment variables
  return await spawn(sqlcmd, args, { echo: options.echo, env: variables });
};

export default executeLocal;
