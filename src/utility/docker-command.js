/* istanbul ignore file */
// ignoring difficult to test simple file
import { Docker } from 'docker-cli-js';
import { DOCKER_NOT_FOUND_ERROR } from '../errors';

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

// default instance only
let _docker;

export default command => {
  _docker = _docker || new Docker();
  return _docker.command(command).catch(handleDockerCommandError);
};
