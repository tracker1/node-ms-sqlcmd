import { SQLCMD_NOT_FOUND_ERROR } from '../errors';

jest.mock('which', () => jest.fn());
const which = require('which');
const { default: findSqlcmd, getPathSeparator } = require('./index');

describe('find-sqlcmd/index', () => {
  describe('getPathSeparator', () => {
    it('will return ; for win32', () => {
      expect(getPathSeparator('win32')).toEqual(';');
    });
    it('will return : for non-win32', () => {
      expect(getPathSeparator('other')).toEqual(':');
    });
  });

  it('will return which result if found', async () => {
    const expected = Math.random().toString();
    // console.log('\n--- IN TEST\n', which, '\n\n----\n');
    which.mockImplementationOnce(() => Promise.resolve(expected));
    const result = await findSqlcmd('win32');
    expect(result).toEqual(expected);
  });

  it('will throw SQLCMD_NOT_FOUND_ERROR if not found', async () => {
    expect.assertions(1);
    which.mockImplementationOnce(() => Promise.reject({ message: 'not found', code: 'ENOENT' }));
    try {
      await findSqlcmd();
    } catch (error) {
      expect(error).toEqual(SQLCMD_NOT_FOUND_ERROR);
    }
  });
});
