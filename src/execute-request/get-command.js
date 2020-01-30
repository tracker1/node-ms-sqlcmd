const parseVars = (vars = {}) =>
  Object.entries(vars).reduce((arr, [name, value]) => arr.concat('-v', `${name}=${value}`), []);

const parseScripts = scripts => scripts.reduce((arr, script) => arr.concat('-i', script), []);

const parseOptions = ({
  // parsed options object
  // sqlcmd, //String - unused here
  // containerId, // String - docker only - unused here
  docker, //Boolean - docker only
  protocol, //String
  username, //String
  password, //String
  instance, //String
  database, //String
  server, //String
  port, //Int
  dedicatedAdminConnection, //Boolean
  trustServerCert, //Boolean
  loginTimeout, //Int
  readOnly, //Boolean
  multisubnetFailover, //Boolean
  encryptedConnection, //Boolean
  trustedConnection, //Boolean
}) => {
  const args = [];

  // set -S variable if not going to run in docker
  if (!docker) {
    if (!server) throw new Error('No server specified');
    let svar = server;
    if (protocol) {
      svar = `${protocol}:${svar}`;
    }
    if (instance) {
      svar = `${svar}\\` + instance;
    }
    if (port) {
      svar = `${svar},${port}`;
    }
    args.push('-S', svar);
  }

  if (username) args.push('-U', username);
  if (password) args.push('-P', password);
  if (database) args.push('-d', database);

  if (trustedConnection) args.push('-E');
  if (dedicatedAdminConnection) args.push('-A');
  if (trustServerCert) args.push('-C');
  if (loginTimeout) args.push('-l', `${loginTimeout}`);
  if (readOnly) args.push('-K', 'ReadOnly');
  if (multisubnetFailover) args.push('-M');
  if (encryptedConnection) args.push('-N');

  return args;
};

const getCommand = (options, scripts, vars) => {
  if (!options) throw new Error('No options specified');
  if (!(scripts && scripts.length)) {
    throw new Error('No scripts specified');
  }
  const { sqlcmd, docker = null, containerId = null } = options;
  return {
    sqlcmd,
    docker,
    containerId,
    args: [...parseOptions(options), ...parseVars(vars), ...parseScripts(scripts)],
  };
};

export const __internal = { parseVars, parseScripts, parseOptions, getCommand };
export default getCommand;