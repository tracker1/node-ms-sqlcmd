// sit
import getCommandDefault, { __internal } from './get-command';
const { parseVars, parseScripts, parseOptions, getCommand } = __internal;

const getFullOptions = (opts = {}) => ({
  sqlcmd: 'sqlcmd',
  docker: false,
  containerId: undefined,
  protocol: 'tcp',
  username: 'username',
  password: 'password',
  instance: 'some-instance',
  database: 'master',
  server: 'localhost',
  port: 6433,
  dedicatedAdminConnection: true,
  trustServerCert: true,
  loginTimeout: 15,
  readOnly: true,
  multisubnetFailover: true,
  encryptedConnection: true,
  trustedConnection: true,
  ...opts,
});

describe('execute-request/get-command', () => {
  describe('getCommand', () => {
    it('will export getCommand as default', () => {
      expect(getCommandDefault).toEqual(getCommand);
    });
    it('will return expected composite results', () => {
      const options = getFullOptions();
      const scripts = [Math.random(), Math.random()];
      const vars = {
        key1: Math.random(),
        key2: Math.random(),
      };
      expect(getCommand(options, scripts, vars)).toEqual({
        sqlcmd: options.sqlcmd,
        docker: options.docker,
        containerId: null,
        vars: parseVars(vars),
        args: [...parseOptions(options), ...parseScripts(scripts)],
      });
    });
    it('will throw with no options', () => {
      expect(() => getCommand()).toThrowError('No options specified');
    });
    it('will throw with no scripts', () => {
      expect(() => getCommand({}, null)).toThrowError('No scripts specified');
    });
    it('will default null for sqlcmd, docker and containerId', () => {
      const options = getFullOptions();
      delete options.docker;
      delete options.containerId;
      const scripts = [Math.random(), Math.random()];
      const vars = {
        key1: Math.random(),
        key2: Math.random(),
      };
      expect(getCommand(options, scripts, vars)).toEqual(
        expect.objectContaining({
          sqlcmd: 'sqlcmd',
          docker: null,
          containerId: null,
        })
      );
    });
  });

  describe('parseVars', () => {
    it('will handle empty value', () => {
      expect(parseVars()).toEqual([]);
    });
    it('will return expected result', () => {
      expect(parseVars({ a: 1, b: 2 })).toEqual(['-v', 'a=1', '-v', 'b=2']);
    });
  });

  describe('parseScripts', () => {
    it('will return expected result', () => {
      expect(parseScripts(['first', 'second'])).toEqual(['-i', 'first', '-i', 'second']);
    });
  });

  describe('parseOptions', () => {
    it('will return as expected with all non-docker options set', () => {
      const options = getFullOptions();
      expect(parseOptions(options)).toEqual([
        '-S',
        'tcp:localhost\\some-instance,6433',
        '-U',
        'username',
        '-P',
        'password',
        '-d',
        'master',
        '-E',
        '-A',
        '-C',
        '-l',
        '15',
        '-K',
        'ReadOnly',
        '-M',
        '-N',
      ]);
    });
    it('will return as expected with no server options set', () => {
      expect(parseOptions({ server: 'test' })).toEqual(['-S', 'tcp:test,1433']);
    });
    it('will throw when server not set, docker false', () => {
      expect(() => parseOptions({})).toThrowError('No server specified');
    });
    it('will return as expected with all docker options set', () => {
      const options = getFullOptions({ docker: true });
      expect(parseOptions(options)).toEqual([
        '-U',
        'username',
        '-P',
        'password',
        '-d',
        'master',
        '-E',
        '-A',
        '-C',
        '-l',
        '15',
        '-K',
        'ReadOnly',
        '-M',
        '-N',
      ]);
    });
    it('will default server decorations if not set', () => {
      const options = getFullOptions({ protocol: null, instance: null, port: null });
      expect(parseOptions(options)).toEqual([
        '-S',
        'tcp:localhost,1433',
        '-U',
        'username',
        '-P',
        'password',
        '-d',
        'master',
        '-E',
        '-A',
        '-C',
        '-l',
        '15',
        '-K',
        'ReadOnly',
        '-M',
        '-N',
      ]);
    });
    it('will default server decorations for non-tcp', () => {
      const options = getFullOptions({ protocol: 'lpc', instance: null, port: 5000 });
      expect(parseOptions(options)).toEqual([
        '-S',
        'lpc:localhost',
        '-U',
        'username',
        '-P',
        'password',
        '-d',
        'master',
        '-E',
        '-A',
        '-C',
        '-l',
        '15',
        '-K',
        'ReadOnly',
        '-M',
        '-N',
      ]);
    });
  });
});
