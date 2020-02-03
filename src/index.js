import executeRequest from './execute-request/index';

export default (connectionString, scripts, vars, options) =>
  executeRequest(connectionString, scripts, vars, options);
