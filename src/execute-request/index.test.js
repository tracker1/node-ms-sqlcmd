// mocks
jest.mock('../resolve-options', () => jest.fn());
jest.mock('./copy-scripts/copy-input-scripts-local', () =>
  jest
    .fn()
    .mockImplementation(list => Promise.resolve(list.map(from => ({ from, to: `/to/${from}` }))))
);
jest.mock('../utility/delete-all', () => jest.fn().mockImplementation(() => Promise.resolve()));
jest.mock('./execute-request-local', () => jest.fn());
jest.mock('./execute-request-docker', () => jest.fn());

// import mocks
import executeDocker from './execute-request-docker';
import copyScripts from './copy-scripts/copy-input-scripts-local';
import deleteAll from '../utility/delete-all';
import resolveOptions from '../resolve-options';
import executeLocal from './execute-request-local';

// import sit
import executeRequest from './index';

describe('execute-request/index', () => {
  const options = {};

  const connectionString = 'connectionString';
  const scripts = ['test1', 'test2'];
  const vars = { DatabaseName: 'Foo' };

  const scriptList = ['/to/test1', '/to/test2'];

  beforeEach(() => {
    resolveOptions.mockReset().mockImplementation(() => options);
    executeLocal.mockReset().mockImplementation(() => Promise.resolve());
    executeDocker.mockReset().mockImplementation(() => Promise.resolve());
  });

  it('will executeLocal (happy path)', async () => {
    await executeRequest(connectionString, scripts, vars);
    expect(copyScripts).toBeCalledWith(scripts);
    expect(executeLocal).toBeCalledWith(options, scriptList, vars);
    expect(executeDocker).toBeCalledTimes(0);
    expect(deleteAll).toBeCalledWith(scriptList);
  });

  it('will executeDocker (happy path)', async () => {
    options.docker = true;
    await executeRequest(connectionString, scripts, vars);
    expect(copyScripts).toBeCalledWith(scripts);
    expect(executeLocal).toBeCalledTimes(0);
    expect(executeDocker).toBeCalledWith(options, scriptList, vars);
    expect(deleteAll).toBeCalledWith(scriptList);
  });

  it('will raise error', async () => {
    const expected = Math.random();
    jest.fn().mockRejectedValue(expected);
    try {
      await executeRequest(connectionString, scripts, vars);
    } catch (error) {
      expect(error).toEqual(expected);
      expect(copyScripts).toBeCalledWith(scripts);
      expect(executeLocal).toBeCalledWith(options, scriptList, vars);
      expect(executeDocker).toBeCalledTimes(0);
      expect(deleteAll).toBeCalledWith(scriptList);
    }
  });
});
