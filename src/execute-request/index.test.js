// mocks
jest.mock('../resolve-options', () => jest.fn());
jest.mock('./copy-scripts/copy-input-scripts-local', () => jest.fn());
jest.mock('./execute-request-local', () => jest.fn());
jest.mock('./execute-request-docker', () => jest.fn());

// import mocks
import executeDocker from './execute-request-docker';
import copyScripts from './copy-scripts/copy-input-scripts-local';
import resolveOptions from '../resolve-options';
import executeLocal from './execute-request-local';

// import sit
import executeRequest from './index';

describe('execute-request/index', () => {
  let options = {};

  const connectionString = 'connectionString';
  const scripts = ['test1', 'test2'];
  const vars = { DatabaseName: 'Foo' };
  const cleanup = jest.fn();

  const scriptList = ['/to/script_1.sql', '/to/script_2.sql'];

  beforeEach(() => {
    options = {};
    cleanup.mockReset().mockImplementation(() => Promise.resolve());
    copyScripts.mockReset().mockImplementation(list =>
      Promise.resolve({
        directory: '/to',
        cleanup,
        list: list.map((from, i) => `/to/script_${i + 1}.sql`),
      })
    );
    resolveOptions.mockReset().mockImplementation(() => options);
    executeLocal.mockReset().mockImplementation(() => Promise.resolve());
    executeDocker.mockReset().mockImplementation(() => Promise.resolve());
  });

  it('will executeLocal (happy path)', async () => {
    await executeRequest(connectionString, scripts, vars);
    expect(copyScripts).toBeCalledWith(scripts);
    expect(executeLocal).toBeCalledWith(options, scriptList, vars);
    expect(executeDocker).toBeCalledTimes(0);
    expect(cleanup).toBeCalled();
  });

  it('will executeDocker (happy path)', async () => {
    options.docker = true;
    await executeRequest(connectionString, scripts, vars);
    expect(copyScripts).toBeCalledWith(scripts);
    expect(executeLocal).toBeCalledTimes(0);
    expect(executeDocker).toBeCalledWith(options, scriptList, vars);
    expect(cleanup).toBeCalled();
  });

  it('will raise error', async () => {
    const expected = Math.random();
    executeLocal.mockReset().mockImplementation(() => Promise.reject(expected));
    try {
      await executeRequest(connectionString, scripts, vars);
    } catch (error) {
      expect(error).toEqual(expected);
      expect(copyScripts).toBeCalledWith(scripts);
      expect(executeLocal).toBeCalledWith(options, scriptList, vars);
      expect(executeDocker).toBeCalledTimes(0);
      expect(cleanup).toBeCalled();
    }
  });
});
