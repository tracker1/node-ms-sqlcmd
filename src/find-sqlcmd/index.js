import which from 'which';
import getKnownPaths from './get-known-paths';
import { SQLCMD_NOT_FOUND_ERROR } from '../errors';

export const getPathSeparator = platform => (platform === 'win32' ? ';' : ':');

export default async (platform = process.platform) => {
  const originalPaths = process.env.PATH;
  let sqlcmd = null;

  try {
    // add knownpaths to environment
    const pathSeparator = getPathSeparator(platform);
    const paths = process.env.PATH.split(pathSeparator);
    process.env.PATH = paths.concat(getKnownPaths(platform)).join(pathSeparator);

    // find sqlcmd in paths
    sqlcmd = await which('sqlcmd');
  } catch (_) {
    sqlcmd = null;
  }

  // restore paths
  process.env.PATH = originalPaths;

  if (sqlcmd) {
    return sqlcmd;
  } else {
    throw SQLCMD_NOT_FOUND_ERROR;
  }
};
