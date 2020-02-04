/* istanbul ignore file */
// TODO: temporarily ignore file for coverage
import getCommandArgs from './get-command';
import exec from '../utility/exec-echo';

const executeLocal = async (options, scripts, variables) => {
  const { sqlcmd, args, vars } = getCommandArgs(options, scripts, variables);
  if (sqlcmd.indexOf('\\') >= 0) {
    // windows -- var directly
    return await exec(options.echo, sqlcmd, ...vars, ...args);
  } else {
    // linux - sqlcmd uses environment variables
    const originalEnv = { ...process.env };
    process.env = { ...process.env, ...variables };
    var result = await exec(options.echo, sqlcmd, ...args);
    process.env = originalEnv;
    return result;
  }

  var result = await exec(options.echo, sqlcmd, ...vars, ...args);
  return result;
};

export default executeLocal;
