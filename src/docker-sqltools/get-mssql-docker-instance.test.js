// mocks before imports
jest.mock('@tracker1/docker-cli', () => jest.fn());

// import mocks
import docker from '@tracker1/docker-cli';

// import sit
import getDockerInstance from './get-mssql-docker-instance';

describe('docker-sqltools/get-mssql-docker-instance', () => {
  beforeEach(() => {
    docker.mockReset();
  });

  it('will return null if no port set', async () => {
    docker.mockReturnValueOnce(Promise.reject('error'));
    expect(await getDockerInstance()).toEqual(null);
  });

  it('will return null if unable to docker ps', async () => {
    docker.mockReturnValueOnce(Promise.reject('error'));
    expect(await getDockerInstance(1433)).toEqual(null);
  });

  it('will return null if no list result', async () => {
    docker.mockReturnValueOnce(Promise.resolve(null));
    expect(await getDockerInstance(1433)).toEqual(null);
    expect(docker).toHaveBeenCalledWith('ps');
  });

  it('will return null if ps list is empty result', async () => {
    docker.mockReturnValueOnce(Promise.resolve({ containerList: [] }));
    expect(await getDockerInstance(1433)).toEqual(null);
    expect(docker).toHaveBeenCalledWith('ps');
  });

  it('will return null if no ps matches', async () => {
    docker.mockReturnValueOnce(Promise.resolve({ containerList: [{ ports: '' }] }));
    expect(await getDockerInstance(1433)).toEqual(null);
  });

  it('will return containerId if ps matches', async () => {
    const expected = { containerId: Math.random(), ports: '0.0.0.0:1433->1433/tcp' };
    docker.mockReturnValueOnce(Promise.resolve({ containerList: [expected] }));
    expect(await getDockerInstance(1433)).toEqual(expected.containerId);
  });
});
