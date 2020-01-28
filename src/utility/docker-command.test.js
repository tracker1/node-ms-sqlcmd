// mocks before imports
jest.mock('docker-cli-js', () => ({ Docker: jest.fn() }));

// import mocks;
import { Docker } from 'docker-cli-js';
const dockerCommand = jest.fn();
Docker.mockImplementationOnce(() => ({ command: dockerCommand }));

// other imports
import { DOCKER_NOT_FOUND_ERROR } from '../errors';

// import situation in test
import dc from './docker-command';

describe('utility/docker-command', () => {
  beforeEach(() => {
    dockerCommand.mockReset();
  });

  it('exports as expected', async () => {
    const expected = Math.random();
    dockerCommand.mockImplementationOnce(() => Promise.resolve(expected));

    const result = await dc();
    expect(result).toEqual(expected);
  });

  it('will handle docker not found in linux errors', async () => {
    dockerCommand.mockImplementationOnce(() => Promise.reject('docker: not found'));

    expect.assertions(1);
    try {
      await dc();
    } catch (error) {
      expect(error).toEqual(DOCKER_NOT_FOUND_ERROR);
    }
  });

  it('will handle docker not found in windows errors', async () => {
    dockerCommand.mockImplementationOnce(() =>
      Promise.reject('docker_engine: The system cannot find the file specified')
    );

    expect.assertions(1);
    try {
      await dc();
    } catch (error) {
      expect(error).toEqual(DOCKER_NOT_FOUND_ERROR);
    }
  });

  it('will bubble other strings', async () => {
    const expected = 'other error';
    dockerCommand.mockImplementationOnce(() => Promise.reject(expected));

    expect.assertions(1);
    try {
      await dc();
    } catch (error) {
      expect(error).toEqual(expected);
    }
  });

  it('will bubble other errors', async () => {
    const expected = new Error(Math.random().toString());
    dockerCommand.mockImplementationOnce(() => Promise.reject(expected));

    expect.assertions(1);
    try {
      await dc();
    } catch (error) {
      expect(error).toEqual(expected);
    }
  });
});
