// mocks before imports
jest.mock('glob', () => jest.fn());
jest.mock('isexe', () => jest.fn());
jest.mock('./known-paths', () => jest.fn());

// import mocks
import glob from 'glob';
import isexe from 'isexe';
import getKnownPaths from './known-paths';

// imports
import find from './find-in-known-paths';

describe('find-sqlcmd/find-in-known-paths', () => {
  const paths = ['/version/001', '/version/002'];
  const expected = '/version/002';

  const arrangeHappyPath = () => {
    getKnownPaths.mockReset().mockImplementation(() => paths);
    isexe.mockReset().mockImplementation((fp, cb) => cb(null, fp));
    glob.mockReset().mockImplementation((fs, cb) => cb(null, fs));
  };

  it('will return highest version found first', async () => {
    arrangeHappyPath();
    const result = await find();
    expect(result).toEqual(expected);
  });

  it('will not throw when glob returns an error', async () => {
    arrangeHappyPath();
    glob.mockReset().mockImplementation((fs, cb) => cb(new Error('Test')));
    const result = await find();
    expect(result).toBe(null);
  });

  it('will not throw when isexe returns an error', async () => {
    arrangeHappyPath();
    isexe.mockReset().mockImplementation((fs, cb) => cb(new Error('Test')));
    const result = await find();
    expect(result).toEqual(null);
  });

  it('will return null when there is no match', async () => {
    arrangeHappyPath();
    getKnownPaths.mockReset().mockImplementation(() => []);
    const result = await find();
    expect(result).toEqual(null);
  });
});
