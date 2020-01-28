// mocks before imports
jest.mock('which', () => jest.fn());
jest.mock('./find-in-known-paths', () => jest.fn());

// imports
import { SQLCMD_NOT_FOUND_ERROR } from '../errors';
import which from 'which';
import findInKnownPaths from './find-in-known-paths';
import findSqlcmd from './index';

describe('find-sqlcmd/index', () => {
  it('will return which result if found', async () => {
    const expected = Math.random().toString();
    which.mockImplementationOnce(() => Promise.resolve(expected));
    const result = await findSqlcmd();
    expect(result).toEqual(expected);
  });

  it('will return fallback to findInKnownPaths if found', async () => {
    const expected = Math.random().toString();
    which.mockImplementationOnce(() => Promise.reject(null));
    findInKnownPaths.mockImplementationOnce(() => Promise.resolve(expected));
    const result = await findSqlcmd();
    expect(result).toEqual(expected);
  });

  it('will return null if not found', async () => {
    which.mockImplementationOnce(() => Promise.reject(null));
    findInKnownPaths.mockImplementationOnce(() => Promise.reject(null));
    expect(await findSqlcmd()).toEqual(null);
  });
});
