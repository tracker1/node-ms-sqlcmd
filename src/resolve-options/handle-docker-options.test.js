// mocks before import
jest.mock('../docker-sqltools', () => ({
  getDockerInstance: jest.fn(),
  hasDocker: jest.fn(),
}));

// import mocks
import { getDockerInstance, hasDocker } from '../docker-sqltools';

// other imports
import { DOCKER_NOT_FOUND } from '../errors';

// import sit
import handleDockerOptions from './handle-docker-options';

describe('resolve-options/handle-docker-options', () => {
  it('resolves null if no options passed', async () => {
    expect(await handleDockerOptions(null, null)).toBeNull();
  });

  it('resolves null if sqlcmd is set and options.docker is not.', async () => {
    expect(await handleDockerOptions('sqlcmd', {})).toBeNull();
  });

  it('resolves null for non-tcp protocol', async () => {
    expect(
      await handleDockerOptions(null, { server: 'localhost', protocol: 'invalid' })
    ).toBeNull();
  });

  describe('server not localhost', () => {
    it('will use docker if available', async () => {
      hasDocker.mockReset().mockReturnValueOnce(Promise.resolve(true));
      expect(await handleDockerOptions(null, { server: 'remote' })).toMatchObject({ docker: true });
    });

    it('will return null if docker not available', async () => {
      hasDocker.mockReset().mockReturnValueOnce(Promise.resolve(false));
      expect(await handleDockerOptions(null, { server: 'remote' })).toEqual(null);
    });

    it('will throw when docker not available with options.docker', async () => {
      hasDocker.mockReset().mockReturnValueOnce(Promise.resolve(false));
      expect.assertions(1);

      try {
        await handleDockerOptions(null, { docker: true, server: 'remote' });
      } catch (error) {
        expect(error.code).toEqual(DOCKER_NOT_FOUND);
      }
    });
  });

  describe('server localhost', () => {
    it('resolves null when no running instance found', async () => {
      getDockerInstance.mockReturnValueOnce(Promise.resolve(null));
      expect(await handleDockerOptions(null, { server: 'localhost' })).toBeNull();
    });

    it('throws for options.docker with no matching instance', async () => {
      expect.assertions(2);
      getDockerInstance.mockReturnValueOnce(Promise.resolve(null));
      try {
        await handleDockerOptions(null, { server: 'localhost', docker: true });
      } catch (error) {
        expect(error.port).toEqual(1433); //default
        expect(error.code).toEqual(DOCKER_NOT_FOUND);
      }
    });

    it('returns expected when match found', async () => {
      const containerId = Math.random().toString();
      getDockerInstance.mockReturnValueOnce(Promise.resolve(containerId));
      expect(
        await handleDockerOptions(null, { server: 'localhost', docker: true, port: 50000 })
      ).toEqual({
        docker: true,
        sqlcmd: '/opt/mssql-tools/bin/sqlcmd',
        protocol: undefined,
        port: undefined,
        server: 'localhost',
        multisubnetFailover: undefined,
        encryptedConnection: undefined,
        containerId,
      });
    });
  });
});
