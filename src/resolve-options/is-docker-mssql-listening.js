import getDockerCommand from '../docker-command';

// check for docker process listening on given port
const isDockerListening = port =>
  getDockerCommand()('ps')
    .then(
      result =>
        !!result.containerList.filter(c => c.ports.indexOf(`:${+port}->1433/tcp`) >= 0).length
    )
    .catch(() => false);

export default isDockerListening;
