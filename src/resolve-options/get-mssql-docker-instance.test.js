// mocks before imports
jest.mock('../utility/docker-command', () => jest.fn());

// import mocks
import dockerCommand from '../utility/docker-command';

// import sit
import getDockerInstance from './get-mssql-docker-instance';

describe('resolve-options/is-docker-mssql-listening', () => {
  beforeEach(() => {
    dockerCommand.mockReset();
  });

  it('will return false if no port set', async () => {
    dockerCommand.mockReturnValueOnce(Promise.reject('error'));
    expect(await getDockerInstance()).toEqual(null);
  });

  it('will return false if unable to docker ps', async () => {
    dockerCommand.mockReturnValueOnce(Promise.reject('error'));
    expect(await getDockerInstance(1433)).toEqual(null);
  });

  it('will return false if no list result', async () => {
    dockerCommand.mockReturnValueOnce(Promise.resolve(null));
    expect(await getDockerInstance(1433)).toEqual(null);
    expect(dockerCommand).toHaveBeenCalledWith('ps');
  });

  it('will return false if ps list is empty result', async () => {
    dockerCommand.mockReturnValueOnce(Promise.resolve({ containerList: [] }));
    expect(await getDockerInstance(1433)).toEqual(null);
    expect(dockerCommand).toHaveBeenCalledWith('ps');
  });

  it('will return false if no ps matches', async () => {
    dockerCommand.mockReturnValueOnce(Promise.resolve({ containerList: [{ ports: '' }] }));
    expect(await getDockerInstance(1433)).toEqual(null);
  });

  it('will return true if ps matches', async () => {
    const expected = { ports: '0.0.0.0:1433->1433/tcp' };
    dockerCommand.mockReturnValueOnce(Promise.resolve({ containerList: [expected] }));
    expect(await getDockerInstance(1433)).toEqual(expected);
  });
});
