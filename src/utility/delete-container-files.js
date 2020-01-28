/* istanbul ignore file */
// ignoring difficult to test simple process
import dockerCommand from './docker-command';

const formatDelete = (containerId, file) => `exec -i ${containerId} rm ${file}`;

const deleteFile = (containerId, file) =>
  dockerCommand(formatDelete(containerId, file)).catch(() => null);

const deleteFiles = (containerId, list) =>
  Promise.all(list.map(file => deleteFile(containerId, file))).then(() => null);

export default deleteFiles;
