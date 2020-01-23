import which from 'which';
import findInKnownPaths from './find-in-known-paths';
import { SQLCMD_NOT_FOUND_ERROR } from '../errors';

export default async (platform = process.platform) => {
  // search in system path
  let sqlcmd = await which('sqlcmd').catch(() => null);
  if (sqlcmd) return sqlcmd;

  // fallback to known paths
  sqlcmd = await findInKnownPaths().catch(() => null);

  if (!sqlcmd) throw SQLCMD_NOT_FOUND_ERROR;

  return sqlcmd;
};
