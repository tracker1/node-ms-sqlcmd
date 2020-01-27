import { Docker } from 'docker-cli-js';
import { DOCKER_NOT_FOUND_ERROR } from './errors';

let _dockerCommand = null;

const handleDockerCommandError = error => {
  // error is raw string
  if (typeof error === 'string') {
    // missing docker, in linux
    if (error.indexOf('docker: not found') >= 0) {
      throw DOCKER_NOT_FOUND_ERROR;
    }
    // missing docker in windows
    if (error.indexOf('docker_engine: The system cannot find the file specified') >= 0) {
      throw DOCKER_NOT_FOUND_ERROR;
    }
  }

  // rethrow if not an expected docker not found error case
  throw error;
};

const createDockerCommand = docker => command =>
  docker.command(command).catch(handleDockerCommandError);

const getDockerCommand = () => {
  // if cached fn, return it
  if (_dockerCommand) return _dockerCommand;

  // cache result command (async, returns promise)
  return (_dockerCommand = createDockerCommand(new Docker()));
};

const reset = () => (_dockerCommand = null);

export const __internal = { reset };
export default getDockerCommand;
