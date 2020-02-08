import docker from '@tracker1/docker-cli';

// docker pull mcr.microsoft.com/mssql-tools
export default () =>
  docker('pull mcr.microsoft.com/mssql-tools')
    .then(() => true)
    .catch(() => false);
