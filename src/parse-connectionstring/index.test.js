// imports mocks
import { invalidConnectionString } from '../errors';

// import sit
import parseConnectionString from './index';

describe('parse-connectionstring/index - default', () => {
  it('will throw with invalid url string', () => {
    const connectionString = 'invalid url';
    const expectedError = invalidConnectionString({ connectionString });
    expect.assertions(1);
    try {
      var result = parseConnectionString(connectionString);
    } catch (error) {
      expect(error).toEqual(expectedError);
    }
  });
  it('will return as expected for a connection string', () => {
    const baseUrl = 'mssql+tcp://username:password@server:51433/instance/database';
    const params = Object.entries({
      dedicatedAdminConnection: true,
      trustServerCert: true,
      loginTimeout: 15,
      readOnly: true,
      multisubnetFailover: true,
      encryptedConnection: true,
    })
      .map(kv => kv.map(s => encodeURIComponent(String(s))).join('='))
      .join('&');

    expect(parseConnectionString(`${baseUrl}?${params}`)).toEqual({
      protocol: 'tcp',
      username: 'username',
      password: 'password',
      instance: 'instance',
      database: 'database',
      server: 'server',
      port: 51433,
      dedicatedAdminConnection: true,
      trustServerCert: true,
      loginTimeout: 15,
      readOnly: true,
      multisubnetFailover: true,
      encryptedConnection: true,
    });
  });
});
