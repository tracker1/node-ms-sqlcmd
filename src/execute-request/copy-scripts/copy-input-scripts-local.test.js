// mocks before imports
jest.mock('rimraf', () => jest.fn());
jest.mock('../../utility/generate-temp-sql-dir', () => jest.fn());
jest.mock('../../utility/copy-utf8-to-utf16le', () => jest.fn());

// import mocks
import rimraf from 'rimraf';
import generateTempDir from '../../utility/generate-temp-sql-dir';
import copyFile from '../../utility/copy-utf8-to-utf16le';

// other imports
import path from 'path';

// import sit
import copyInputScriptsLocal from './copy-input-scripts-local';

describe('execute-request/copy-input-scripts-local', () => {
  beforeEach(() => {
    let num = 0;
    rimraf.mockReset().mockImplementation((_, cb) => cb(null));
    generateTempDir.mockReset().mockImplementation(() => Promise.resolve(`/tmp/${++num}`));
    copyFile.mockReset().mockImplementation(({ to }) => Promise.resolve(to));
  });

  it('will throw when no scripts specified', () => {
    expect(copyInputScriptsLocal()).rejects.toThrow('No sql scripts specified');
  });

  it('will handle string input', async () => {
    const str = Math.random().toString();
    const result = await copyInputScriptsLocal(str);
    expect(result).toEqual({
      directory: '/tmp/1',
      cleanup: expect.any(Function),
      list: [path.normalize(`/tmp/1/${str}`)],
    });
  });

  it('will copy each file', async () => {
    const input = ['test', 'test2'];
    const result = await copyInputScriptsLocal(input);
    expect(result).toEqual({
      directory: '/tmp/1',
      cleanup: expect.any(Function),
      list: [path.normalize('/tmp/1/test'), path.normalize('/tmp/1/test2')],
    });
    expect(copyFile).toHaveBeenCalledTimes(2);
    expect(copyFile).toHaveBeenNthCalledWith(1, { from: 'test', to: result.list[0] });
    expect(copyFile).toHaveBeenNthCalledWith(2, { from: 'test2', to: result.list[1] });
  });

  it('will unlink all to files on error', async () => {
    copyFile.mockReset().mockImplementation(() => Promise.reject('NoCopy'));
    const input = ['test', 'test2'];
    expect.assertions(3);
    try {
      await copyInputScriptsLocal(input);
    } catch (error) {
      expect(error).toEqual('NoCopy');
      expect(rimraf).toHaveBeenCalledTimes(1);
      expect(rimraf).toHaveBeenCalledWith('/tmp/1', expect.any(Function));
    }
  });

  it('will supress rimraf error', async () => {
    const str = Math.random().toString();
    const result = await copyInputScriptsLocal(str);
    rimraf.mockReset().mockImplementation((_, cb) => cb('error'));
    await result.cleanup();
  });
});
