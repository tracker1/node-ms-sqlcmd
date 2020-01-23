import { INVALID_CONNECTION_STRING } from '../errors';

// import sit
import parseUrlBase, { __internal } from './parse-urlbase';
const { parseProtocol, parseUsernamePassword, parsePath } = __internal;

describe('parse-connectionstring/parse-urlbase', () => {
  describe('parseProtocol', () => {
    it('will return null for "mssql:"', () => {
      expect(parseProtocol('mssql:')).toEqual(null);
    });
    it('will return expected for "mssql+tcp:"', () => {
      expect(parseProtocol('mssql+tcp:')).toEqual({ protocol: 'tcp' });
    });
    it('will return expected for "mssql+lpc:"', () => {
      expect(parseProtocol('mssql+lpc:')).toEqual({ protocol: 'lpc' });
    });
    it('will return expected for "mssql+np:"', () => {
      expect(parseProtocol('mssql+np:')).toEqual({ protocol: 'np' });
    });
    it('will return expected for "mssql+docker:"', () => {
      expect(parseProtocol('mssql+docker:')).toEqual({ docker: true });
    });
    it('will throw for unexpected protocols', () => {
      expect.assertions(1);
      try {
        parseProtocol('invalid:');
      } catch (error) {
        expect(error).toMatchObject({
          code: INVALID_CONNECTION_STRING,
          protocol: 'invalid:',
        });
      }
    });
  });

  describe('parseUsernamePassword', () => {
    it('will return expected with username and password set', () => {
      const username = Math.random().toString();
      const password = Math.random().toString();
      expect(parseUsernamePassword({ username, password })).toEqual({ username, password });
    });
    it('will return trustedConnection with no username or passwprd set', () => {
      expect(parseUsernamePassword({})).toEqual({ trustedConnection: true });
    });
    it('will throw for username without password', () => {
      expect.assertions(1);
      try {
        expect(parseUsernamePassword({ username: 'test' }));
      } catch (error) {
        expect(error).toMatchObject({
          code: INVALID_CONNECTION_STRING,
          username: 'test',
        });
      }
    });
  });

  describe('parsePath', () => {
    it('will return null with no path values', () => {
      expect(parsePath('/')).toEqual(null);
    });
    it('will return database name with single', () => {
      expect(parsePath('/dbname')).toEqual({ database: 'dbname' });
    });
    it('will return database and instance when both specified', () => {
      expect(parsePath('/inst/dbname')).toEqual({ instance: 'inst', database: 'dbname' });
    });
  });

  describe('parseUrlBase', () => {
    it('will parse parameters as expected', () => {
      var url = new URL('mssql+docker://username:password@server/instance/database');
      expect(parseUrlBase(url)).toEqual({
        docker: true,
        username: 'username',
        password: 'password',
        instance: 'instance',
        database: 'database',
        server: 'server',
        port: null,
      });
    });

    it('will convert port to a numeric value', () => {
      var url = new URL('mssql+tcp://username:password@server:51433/instance/database');
      expect(parseUrlBase(url)).toEqual({
        protocol: 'tcp',
        username: 'username',
        password: 'password',
        instance: 'instance',
        database: 'database',
        server: 'server',
        port: 51433,
      });
    });
  });
});
