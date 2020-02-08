// mocks
jest.mock('@tracker1/docker-cli', () => jest.fn());
jest.mock('../../utility/generate-temp-sql-dir', () => ({ genFileBase: jest.fn() }));

// import mocks
import docker from '@tracker1/docker-cli';
import { genFileBase } from '../../utility/generate-temp-sql-dir';

// import sit
import copyScripts, { __internal } from './copy-temp-scripts-to-container';
const { fmtMakeTemp, fmtCleanup, fmtCopy } = __internal;

describe('execute-request/copy-scripts/copy-temp-script-to-container', () => {
  it('will run as expected (happy path)', async () => {
    docker.mockReset().mockImplementation(() => Promise.resolve());
    genFileBase.mockReset().mockImplementation(() => 'not_random');
    const result = await copyScripts('containerId', ['test1', 'test2']);
    expect(result).toEqual({
      directory: '/var/opt/mssql/tmp/not_random',
      cleanup: expect.any(Function),
      list: [
        '/var/opt/mssql/tmp/not_random/script_1.sql',
        '/var/opt/mssql/tmp/not_random/script_2.sql',
      ],
    });
    expect(docker).toHaveBeenCalledTimes(3);
    expect(docker).toHaveBeenNthCalledWith(
      1,
      fmtMakeTemp('containerId', '/var/opt/mssql/tmp/not_random')
    );
    expect(docker).toHaveBeenNthCalledWith(
      2,
      fmtCopy('test1', '/var/opt/mssql/tmp/not_random/script_1.sql', 'containerId')
    );
    expect(docker).toHaveBeenNthCalledWith(
      3,
      fmtCopy('test2', '/var/opt/mssql/tmp/not_random/script_2.sql', 'containerId')
    );

    await result.cleanup();
    expect(docker).toHaveBeenCalledTimes(4);
    expect(docker).toHaveBeenNthCalledWith(
      4,
      fmtCleanup('containerId', '/var/opt/mssql/tmp/not_random')
    );
  });

  it('will handle copy errors as expected', async () => {
    docker.mockReset().mockImplementation(cmd => {
      if (/mkdir/.test(cmd)) return Promise.resolve();
      return Promise.reject('error');
    });
    genFileBase.mockReset().mockImplementation(() => 'not_random');

    expect.assertions(2);
    try {
      await copyScripts('containerId', ['test1', 'test2']);
    } catch (error) {
      expect(error).toEqual('error');
      expect(docker).toHaveBeenCalledWith(
        fmtCleanup('containerId', '/var/opt/mssql/tmp/not_random')
      );
    }
  });
});
