import dockerCommand from '../utility/docker-command';

// check for docker process listening on given port
const getDockerInstance = port =>
  dockerCommand('ps')
    .then(
      result =>
        result.containerList.filter(c => c.ports.indexOf(`:${+port}->1433/tcp`) >= 0)[0] || null
    )
    .catch(() => null);

export default getDockerInstance;
