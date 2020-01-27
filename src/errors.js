export const UNEXPECTED_ERROR = 'UNEXPECTED_ERROR';
export const UNEXPECTED_ERROR_MESSAGE = 'Unexpected Error, see innerError for details.';

export const INVALID_CONNECTION_STRING = 'INVALID_CONNECTION_STRING';
export const INVALID_CONNECTION_STRING_MESSAGE = 'The specified connection string is not valid.';

export const SQLCMD_NOT_FOUND = 'SQLCMD_NOT_FOUND';
export const SQLCMD_NOT_FOUND_MESSAGE = 'The sqlcmd executable was not found.';

export const DOCKER_NOT_FOUND = 'DOCKER_NOT_FOUND';
export const DOCKER_NOT_FOUND_MESSAGE = 'The docker command was not found.';

export const generateError = (message, props) =>
  Object.assign(new Error(message), { stack: undefined, ...props });

export const wrapUnexpectedError = innerError =>
  generateError(UNEXPECTED_ERROR_MESSAGE, { code: UNEXPECTED_ERROR, innerError });

export const invalidConnectionString = props =>
  generateError(INVALID_CONNECTION_STRING_MESSAGE, { code: INVALID_CONNECTION_STRING, ...props });

export const SQLCMD_NOT_FOUND_ERROR = generateError(SQLCMD_NOT_FOUND_MESSAGE, {
  code: SQLCMD_NOT_FOUND,
});

export const DOCKER_NOT_FOUND_ERROR = generateError(DOCKER_NOT_FOUND_MESSAGE, {
  code: DOCKER_NOT_FOUND,
});

export default {
  wrapUnexpectedError,
  invalidConnectionString,
  SQLCMD_NOT_FOUND_ERROR,
  DOCKER_NOT_FOUND_ERROR,
};
