// mocks before imports
jest.mock('../docker-command', () => jest.fn());

// import mocks
import getDockerCommand from '../docker-command';
const dockerCommand = jest.fn();
getDockerCommand.mockReturnValue(dockerCommand);

// import sit
import isDockerListening from './is-docker-mssql-listening';

describe('resolve-options/is-docker-mssql-listening', () => {
  beforeEach(() => {
    dockerCommand.mockReset();
  });

  it('will return false if no port set', async () => {
    dockerCommand.mockReturnValueOnce(Promise.reject('error'));
    expect(await isDockerListening()).toEqual(false);
  });

  it('will return false if unable to docker ps', async () => {
    dockerCommand.mockReturnValueOnce(Promise.reject('error'));
    expect(await isDockerListening(1433)).toEqual(false);
  });

  it('will return false if no list result', async () => {
    dockerCommand.mockReturnValueOnce(Promise.resolve(null));
    expect(await isDockerListening(1433)).toEqual(false);
    expect(dockerCommand).toHaveBeenCalledWith('ps');
  });

  it('will return false if ps list is empty result', async () => {
    dockerCommand.mockReturnValueOnce(Promise.resolve({ containerList: [] }));
    expect(await isDockerListening(1433)).toEqual(false);
    expect(dockerCommand).toHaveBeenCalledWith('ps');
  });

  it('will return false if no ps matches', async () => {
    dockerCommand.mockReturnValueOnce(Promise.resolve({ containerList: [{ ports: '' }] }));
    expect(await isDockerListening(1433)).toEqual(false);
  });

  it('will return true if ps matches', async () => {
    dockerCommand.mockReturnValueOnce(
      Promise.resolve({ containerList: [{ ports: '0.0.0.0:1433->1433/tcp' }] })
    );
    expect(await isDockerListening(1433)).toEqual(true);
  });
});
