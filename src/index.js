import executeRequest from './execute-request/index';

/**
 * Runs sqlcmd either locally or via local docker mssql container
 * @param string connectionString - Connection string in URI format
 * @param string[] scripts - List of scripts to run
 * @param object vars - Variables to inject into the script environment
 * @param object options - Additional options (echo: echos stdio, other options passed to spawn, such as env)
 */
export default (connectionString, scripts, vars, options) =>
  executeRequest(connectionString, scripts, vars || {}, options || {});
