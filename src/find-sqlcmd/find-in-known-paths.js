import globAsync from 'glob';
import isexeAsync from 'isexe';
import getKnownPaths from './known-paths';

const glob = (p) =>
  new Promise((resolve) =>
    globAsync(p, (error, result) => (error ? resolve(null) : resolve(result)))
  );
const isexe = (p) =>
  new Promise((resolve) =>
    isexeAsync(p, (error, result) => (error ? resolve(false) : resolve(result)))
  );

export default async () => {
  var pathsToSearch = getKnownPaths();
  var pathsFound = (await Promise.all(pathsToSearch.map(glob)))
    .filter((p) => p) // only non-null values
    .sort()
    .reverse();

  for (const fp of pathsFound) {
    if (await isexe(fp)) {
      return fp;
    }
  }
  return null;
};
