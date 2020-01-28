// mocks
jest.mock('../../utility/docker-command', () => jest.fn());
jest.mock('../../utility/generate-temp-sql-name', () => ({ genFileBase: jest.fn() }));

// import mocks
import dockerCommand from '../../utility/docker-command';
import { genFileBase } from '../../utility/generate-temp-sql-name';

// import sit
import copyScriptToContainer, { __internal } from './copy-temp-scripts-to-container';
const { sqlTempPath, fmtMakeTemp, fmtCopy } = __internal;

describe('execute-request/copy-scripts/copy-temp-script-to-container', () => {
  it('will format temp path creation as expected', () => {
    expect(fmtMakeTemp('container', sqlTempPath)).toEqual(
      'exec -i container mkdir -p /var/opt/mssql/tmp'
    );
  });
  it('will format copy command as expected', () => {
    expect(fmtCopy('from', 'to', 'container')).toEqual('cp "from" container:to');
  });
  it('will copy file into container (happy path)', async () => {
    dockerCommand.mockReset().mockImplementation(() => Promise.resolve());
    genFileBase.mockReset().mockImplementation(() => 'not_random');
    const result = await copyScriptToContainer('containerId', 'test-file');
    expect(result).toEqual({
      from: 'test-file',
      to: `${sqlTempPath}/not_random.sql`,
    });
    expect(genFileBase).toHaveBeenCalledTimes(1);
    expect(dockerCommand).toHaveBeenCalledTimes(2);
    expect(dockerCommand).toHaveBeenNthCalledWith(1, fmtMakeTemp('containerId', sqlTempPath));
    expect(dockerCommand).toHaveBeenNthCalledWith(
      2,
      fmtCopy('test-file', result.to, 'containerId')
    );
  });
});
