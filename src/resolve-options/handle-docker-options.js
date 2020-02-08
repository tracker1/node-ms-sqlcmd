import { getDockerInstance, hasDocker } from '../docker-sqltools';

import { generateError, DOCKER_NOT_FOUND } from '../errors';

const handleDockerOptions = async (sqlcmd, options) => {
  if (!options) return null; // nothing to check

  // has a command path, and not set to use docker
  if (sqlcmd && !options.docker) {
    return null; // nothing to do
  }

  // if protocol set and not tcp, invalid for docker use
  if (options.protocol && options.protocol !== 'tcp') {
    return null;
  }

  // remote server - use docker mssql-tools path
  if (options.server !== 'localhost') {
    if (await hasDocker()) {
      // set docker true, but do not override other options
      return { ...options, docker: true, sqlcmd: '/opt/mssql-tools/bin/sqlcmd' };
    }

    // expecting docker locally
    if (options.docker) {
      throw generateError('Unable to load mssql-tools via docker locally', {
        code: DOCKER_NOT_FOUND,
      });
    }

    // autodetect failed - return null
    return null;
  }

  // get matching docker instance
  const containerId = await getDockerInstance(options.port || 1433);

  // no matching docker instance
  if (!containerId) {
    // if expecting a docker instance
    if (options.docker) {
      throw generateError(
        `Unable to find matching docker instance listening on port ${options.port || 1433}->1433`,
        { code: DOCKER_NOT_FOUND, port: options.port || 1433 }
      );
    }

    // autodetect failed - return null
    return null;
  }

  // override some defaults against docker options.
  return Object.assign({}, options, {
    docker: true,
    sqlcmd: '/opt/mssql-tools/bin/sqlcmd',
    protocol: undefined, // default in-container
    port: undefined, // default in-container
    server: 'localhost', // will use default
    multisubnetFailover: undefined, // clear, not needed
    encryptedConnection: undefined, // clear not needed
    containerId, // matching docker container instance
  });
};

export const __internal = {};
export default handleDockerOptions;
