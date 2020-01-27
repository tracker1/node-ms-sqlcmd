import * as errors from './errors';

describe('errors.js - error helpers and constants', () => {
  it('exports expected defaults', () => {
    expect(errors.default).toEqual({
      wrapUnexpectedError: errors.wrapUnexpectedError,
      invalidConnectionString: errors.invalidConnectionString,
      SQLCMD_NOT_FOUND_ERROR: errors.SQLCMD_NOT_FOUND_ERROR,
      DOCKER_NOT_FOUND_ERROR: errors.DOCKER_NOT_FOUND_ERROR,
    });
  });
  it('wrapUnexpectedError returns an expected result', () => {
    const innerError = Math.random();
    expect(errors.wrapUnexpectedError(innerError)).toMatchObject({
      message: errors.UNEXPECTED_ERROR_MESSAGE,
      code: errors.UNEXPECTED_ERROR,
      innerError,
    });
  });
  it('invalidConnectionString returns an expected result', () => {
    const testProp = Math.random();
    expect(errors.invalidConnectionString({ testProp })).toMatchObject({
      message: errors.INVALID_CONNECTION_STRING_MESSAGE,
      code: errors.INVALID_CONNECTION_STRING,
      testProp,
    });
  });
});
