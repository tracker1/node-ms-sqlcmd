import findSqlCmd from '../find-sqlcmd';
import parseConnectionString from '../parse-connectionstring';
import handleDockerOptions from './handle-docker-options';
import { SQLCMD_NOT_FOUND_ERROR } from '../errors';

const resolveOptions = async (mssqlConnectionString) => {
  // get sqlcmd command path
  let sqlcmd = await findSqlCmd();

  // parse querystring
  let options = parseConnectionString(mssqlConnectionString);

  // check for docker instance options - return them if found
  const dockerOptions = await handleDockerOptions(sqlcmd, options);
  if (dockerOptions) return dockerOptions;

  // no sqlcmd, nothing to run, throw
  if (!sqlcmd) {
    throw SQLCMD_NOT_FOUND_ERROR;
  }

  // port only set if protocol is explicitely tcp, set default port if unset
  const port = options.protocol && options.protocol !== 'tcp' ? null : options.port || 1433;

  // normalize return values
  return {
    sqlcmd,
    ...options,
    port,
  };
};

export default resolveOptions;
