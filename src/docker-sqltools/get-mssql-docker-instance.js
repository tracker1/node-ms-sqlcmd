import docker from '@tracker1/docker-cli';

// check for docker process listening on given port
const getDockerInstance = port =>
  docker('ps')
    .then(
      result =>
        result.containerList.filter(c => c.ports.indexOf(`:${+port}->1433/tcp`) >= 0)[0].containerId
    )
    .catch(() => null);

export default getDockerInstance;
