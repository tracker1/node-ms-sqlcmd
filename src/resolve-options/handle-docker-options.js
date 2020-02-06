import getDockerInstance from './get-mssql-docker-instance';
import { generateError, DOCKER_NOT_FOUND } from '../errors';

const handleDockerOptions = async (sqlcmd, options) => {
  if (!options) return null; // nothing to check

  // has a command path, and not set to use docker
  if (sqlcmd && !options.docker) {
    return null; // nothing to do
  }

  // no docker options - check automatic fallback to docker
  if (!options.docker) {
    // only valid auto fallback for localhost
    if (options.server != 'localhost') {
      // will only test against localhost
      return null;
    }

    // if protocol set and not tcp, invalid for auto config
    if (options.protocol && options.protocol !== 'tcp') {
      return null;
    }
  }

  // get matching docker instance
  const dockerProcess = await getDockerInstance(options.port || 1433);

  // no matching docker instance
  if (!dockerProcess) {
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
    server: undefined, // default in-container
    multisubnetFailover: undefined, // clear, not needed
    encryptedConnection: undefined, // clear not needed
    containerId: dockerProcess.containerId, // matching docker container instance
  });
};

export const __internal = {};
export default handleDockerOptions;
