import which from 'which';
import findInKnownPaths from './find-in-known-paths';

export default async (platform = process.platform) => {
  // search in system path
  let sqlcmd = await which('sqlcmd').catch(() => null);
  if (sqlcmd) return sqlcmd;

  // fallback to known paths
  sqlcmd = await findInKnownPaths().catch(() => null);

  // don't throw here
  return sqlcmd;
};
