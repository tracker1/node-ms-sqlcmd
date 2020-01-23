import which from 'which';
import getKnownPaths from './get-known-paths';
import { SQLCMD_NOT_FOUND_ERROR } from '../errors';

export const getPathSeparator = platform => (platform === 'win32' ? ';' : ':');

export default async (platform = process.platform) => {
  // add knownpaths to environment
  const pathSeparator = getPathSeparator(platform);
  const paths = process.env.PATH.split(pathSeparator)
    .concat(getKnownPaths(platform))
    .join(pathSeparator);

  // find sqlcmd in paths
  return which('sqlcmd', { path: paths }).catch(() => Promise.reject(SQLCMD_NOT_FOUND_ERROR));
};
