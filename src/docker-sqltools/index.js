/* istanbul ignore file */
import getDockerInstanceFn from './get-mssql-docker-instance';
import hasDockerFn from './has-docker';

export const getDockerInstance = getDockerInstanceFn;
export const hasDocker = hasDockerFn;

export default { getDockerInstance, hasDocker };
