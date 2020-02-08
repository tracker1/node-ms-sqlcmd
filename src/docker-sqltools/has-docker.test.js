// mocks before imports
jest.mock('@tracker1/docker-cli', () => jest.fn());

// import mocks
import docker from '@tracker1/docker-cli';

// import sit
import hasDocker from './has-docker';

describe('docker-sqltools/has-docker', () => {
  beforeEach(() => {
    docker.mockReset();
  });

  it('will return true on successful docker pull', async () => {
    docker.mockImplementationOnce(() => Promise.resolve(['values']));
    expect(await hasDocker()).toBeTruthy();
    expect(docker).toHaveBeenCalledWith('pull mcr.microsoft.com/mssql-tools');
  });

  it('will return false on error from docker pull', async () => {
    docker.mockImplementationOnce(() => Promise.reject('no values'));
    expect(await hasDocker()).toBeFalsy();
    expect(docker).toHaveBeenCalledWith('pull mcr.microsoft.com/mssql-tools');
  });
});
