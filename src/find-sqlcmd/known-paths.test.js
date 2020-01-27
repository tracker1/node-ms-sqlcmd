import getKnownPaths, { __internal } from './known-paths';
const { linuxPaths, knownPaths, knownPathsNix } = __internal;

describe('find-sqlcmd/known-paths', () => {
  it('will return linuxPaths if platform is linux', () => {
    expect(getKnownPaths('linux', null)).toEqual(linuxPaths);
  });
  it('will return knownPaths if platform is windows', () => {
    expect(getKnownPaths('win32', null)).toEqual(knownPaths);
  });
  it('will return knownPathsNix if OSTYPE is cygwin', () => {
    expect(getKnownPaths(null, 'cygwin')).toEqual(knownPathsNix);
  });
  it('will return knownPathsNix if OSTYPE is msys', () => {
    expect(getKnownPaths(null, 'msys')).toEqual(knownPathsNix);
  });
  it('will return [] if no platform or ostype match', () => {
    expect(getKnownPaths(null, null)).toEqual([]);
  });
  it('will match system as default', () => {
    expect(getKnownPaths()).toEqual(getKnownPaths(process.platform, process.env.OSTYPE));
  });
});
