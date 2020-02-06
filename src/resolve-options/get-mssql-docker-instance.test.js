// mocks before imports
jest.mock('@tracker1/docker-cli', () => jest.fn());

// import mocks
import docker from '@tracker1/docker-cli';

// import sit
import getDockerInstance from './get-mssql-docker-instance';

describe('resolve-options/is-docker-mssql-listening', () => {
  beforeEach(() => {
    docker.mockReset();
  });

  it('will return false if no port set', async () => {
    docker.mockReturnValueOnce(Promise.reject('error'));
    expect(await getDockerInstance()).toEqual(null);
  });

  it('will return false if unable to docker ps', async () => {
    docker.mockReturnValueOnce(Promise.reject('error'));
    expect(await getDockerInstance(1433)).toEqual(null);
  });

  it('will return false if no list result', async () => {
    docker.mockReturnValueOnce(Promise.resolve(null));
    expect(await getDockerInstance(1433)).toEqual(null);
    expect(docker).toHaveBeenCalledWith('ps');
  });

  it('will return false if ps list is empty result', async () => {
    docker.mockReturnValueOnce(Promise.resolve({ containerList: [] }));
    expect(await getDockerInstance(1433)).toEqual(null);
    expect(docker).toHaveBeenCalledWith('ps');
  });

  it('will return false if no ps matches', async () => {
    docker.mockReturnValueOnce(Promise.resolve({ containerList: [{ ports: '' }] }));
    expect(await getDockerInstance(1433)).toEqual(null);
  });

  it('will return true if ps matches', async () => {
    const expected = { ports: '0.0.0.0:1433->1433/tcp' };
    docker.mockReturnValueOnce(Promise.resolve({ containerList: [expected] }));
    expect(await getDockerInstance(1433)).toEqual(expected);
  });
});
