// mocks before imports
jest.mock('../../utility/delete-all', () => jest.fn().mockResolvedValue(null));
jest.mock('../../utility/generate-temp-sql-name', () => jest.fn());
jest.mock('../../utility/copy-utf8-to-utf16le', () => jest.fn());

// import mocks
import deleteAll from '../../utility/delete-all';
import generateTempName from '../../utility/generate-temp-sql-name';
import copyFile from '../../utility/copy-utf8-to-utf16le';

// import sit
import copyInputScriptsLocal from './copy-input-scripts-local';

describe('execute-request/copy-input-scripts-local', () => {
  beforeEach(() => {
    let num = 0;
    generateTempName.mockReset().mockImplementation(() => `/tmp/${++num}`);
    copyFile.mockReset().mockReturnValue(Promise.resolve());
  });

  it('will throw when no scripts specified', () => {
    expect(copyInputScriptsLocal()).rejects.toThrow('No sql scripts specified');
  });

  it('will handle string input', async () => {
    const str = Math.random().toString();
    const result = await copyInputScriptsLocal(str);
    expect(result).toBeInstanceOf(Array);
    expect(result.length).toEqual(1);
    expect(result[0]).toEqual({
      from: str,
      to: '/tmp/1',
    });
  });

  it('will copy each file', async () => {
    const input = ['test', 'test2'];
    const result = await copyInputScriptsLocal(input);
    expect(result).toEqual([
      { from: 'test', to: '/tmp/1' },
      { from: 'test2', to: '/tmp/2' },
    ]);
    expect(copyFile).toHaveBeenCalledTimes(2);
    expect(copyFile).toHaveBeenNthCalledWith(1, result[0]);
    expect(copyFile).toHaveBeenNthCalledWith(2, result[1]);
  });

  it('will unlink all to files on error', async () => {
    copyFile.mockReset().mockImplementation(() => Promise.reject('NoCopy'));
    const input = ['test', 'test2'];
    expect.assertions(3);
    try {
      await copyInputScriptsLocal(input);
    } catch (error) {
      expect(error).toEqual('NoCopy');
      expect(deleteAll).toHaveBeenCalledTimes(1);
      expect(deleteAll).toHaveBeenCalledWith(['/tmp/1', '/tmp/2']);
    }
  });
});
