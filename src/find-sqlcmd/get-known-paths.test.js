import getKnownPaths, {
  knownWindowsPaths,
  knownNixOnWindowsPaths,
  knownLinuxPaths,
} from './get-known-paths';

describe('find-sqlcmd/get-known-paths.js', () => {
  it('will return default from process.platform', () => {
    expect(getKnownPaths()).toEqual(getKnownPaths(process.platform, process.env.OSTYPE));
  });

  it('will return expected default for windows', () => {
    expect(getKnownPaths('win32', null)).toEqual(knownWindowsPaths);
  });

  it('will return expected results for nix on windows (cygwin)', () => {
    expect(getKnownPaths('other', 'cygwin')).toEqual(knownNixOnWindowsPaths);
  });

  it('will return expected results for nix on windows (msys)', () => {
    expect(getKnownPaths('other', 'msys')).toEqual(knownNixOnWindowsPaths);
  });

  it('will return expected default for linux', () => {
    expect(getKnownPaths('linux', null)).toEqual(knownLinuxPaths);
  });

  it('will return empty array for other platforms', () => {
    expect(getKnownPaths(Math.random())).toEqual([]);
  });
});
