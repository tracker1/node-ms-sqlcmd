// mocks before imports
jest.mock('./handle-docker-options', () => jest.fn());
jest.mock('../find-sqlcmd', () => jest.fn());
jest.mock('../parse-connectionstring', () => jest.fn());

// mocks and other imports
import findSqlCmd from '../find-sqlcmd';
import parseConnectionString from '../parse-connectionstring';
import handleDockerOptions from './handle-docker-options';
import { SQLCMD_NOT_FOUND_ERROR } from '../errors';

// import sit
import resolveOptions from './index';

describe('resolve-options/index', () => {
  const cs = 'connection-string-input';
  const sqlcmd = 'sqlcmd path';
  let options = { result: Math.random() };

  beforeEach(() => {
    // happy path defaults
    options = { result: Math.random() }; // reset options each time
    findSqlCmd.mockReset().mockReturnValue(Promise.resolve(sqlcmd));
    parseConnectionString.mockReset().mockReturnValue(options);
    handleDockerOptions.mockReset().mockReturnValue(Promise.resolve(null));
  });

  it('will throw SQLCMD_NOT_FOUND_ERROR when sqlcmd not found and no dockerOptions', async () => {
    expect.assertions(1);
    findSqlCmd.mockReset().mockReturnValue(Promise.resolve(null));
    try {
      await resolveOptions(cs);
    } catch (error) {
      expect(error).toEqual(SQLCMD_NOT_FOUND_ERROR);
    }
  });

  it('will return docker options if present', async () => {
    const expected = { result: Math.random() };
    handleDockerOptions.mockReset().mockReturnValueOnce(Promise.resolve(expected));
    expect(await resolveOptions(cs)).toEqual(expected);
  });

  it('will return expected results (happy path)', async () => {
    const expected = {
      sqlcmd,
      ...options,
      port: null,
    };
    expect(await resolveOptions(cs)).toEqual(expected);
  });

  it('will use null port for tcp when not set', async () => {
    parseConnectionString.mockReset().mockReturnValueOnce({ protocol: 'tcp' });
    expect(await resolveOptions(cs)).toMatchObject({ protocol: 'tcp', port: null });
  });

  it('will use specified port for tcp when not set', async () => {
    parseConnectionString.mockReset().mockReturnValueOnce({ protocol: 'tcp', port: 5000 });
    expect(await resolveOptions(cs)).toMatchObject({ protocol: 'tcp', port: 5000 });
  });
});
