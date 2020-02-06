// mocks before import
jest.mock('./get-mssql-docker-instance', () => jest.fn());

// import mocks
import getDockerInstance from './get-mssql-docker-instance';

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

  describe('!options.docker autodetect', () => {
    it('resolves null when not localhost', async () => {
      expect(await handleDockerOptions(null, { server: 'invalid' })).toBeNull();
    });

    it('resolves null for non-tcp protocol', async () => {
      expect(
        await handleDockerOptions(null, { server: 'localhost', protocol: 'invalid' })
      ).toBeNull();
    });

    it('resolves null when no running instance found', async () => {
      getDockerInstance.mockReturnValueOnce(Promise.resolve(null));
      expect(await handleDockerOptions(null, { server: 'localhost' })).toBeNull();
    });
  });

  it('throws for options.docker with no matching instance', async () => {
    expect.assertions(2);
    getDockerInstance.mockReturnValueOnce(Promise.resolve(null));
    try {
      await handleDockerOptions(null, { docker: true });
    } catch (error) {
      expect(error.port).toEqual(1433); //default
      expect(error.code).toEqual(DOCKER_NOT_FOUND);
    }
  });

  it('returns expected when match found', async () => {
    const containerId = Math.random().toString();
    getDockerInstance.mockReturnValueOnce(Promise.resolve({ containerId }));
    expect(await handleDockerOptions(null, { docker: true, port: 50000 })).toEqual({
      docker: true,
      sqlcmd: '/opt/mssql-tools/bin/sqlcmd',
      protocol: undefined,
      port: undefined,
      server: undefined,
      multisubnetFailover: undefined,
      encryptedConnection: undefined,
      containerId,
    });
  });
});
