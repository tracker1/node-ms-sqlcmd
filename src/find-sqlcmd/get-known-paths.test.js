import getKnownPaths, { knownWindowsPaths, knownLinuxPaths } from './get-known-paths';

describe('find-sqlcmd/get-known-paths.js', () => {
  it('will return default from process.platform', () => {
    expect(getKnownPaths()).toEqual(getKnownPaths(process.platform));
  });

  it('will return expected default for windows', () => {
    expect(getKnownPaths('win32')).toEqual(knownWindowsPaths);
  });

  it('will return expected default for linux', () => {
    expect(getKnownPaths('linux')).toEqual(knownLinuxPaths);
  });

  it('will return empty array for other platforms', () => {
    expect(getKnownPaths(Math.random())).toEqual([]);
  });
});
