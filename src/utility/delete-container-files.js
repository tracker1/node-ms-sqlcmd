/* istanbul ignore file */
// ignoring difficult to test simple process
import docker from '@tracker1/docker-cli';

const formatDelete = (containerId, file) => `exec -i ${containerId} rm ${file}`;

const deleteFile = (containerId, file) => docker(formatDelete(containerId, file)).catch(() => null);

const deleteFiles = (containerId, list) =>
  Promise.all(list.map(file => deleteFile(containerId, file))).then(() => null);

export default deleteFiles;
