import parseSearchParams, { __internal } from './parse-searchparams';

const { parseBool } = __internal;

describe('parse-connectionstring/parse-searchparams', () => {
  it('will return as expected for the happy path', () => {
    expect(
      parseSearchParams([
        ['dedicatedAdminConnection', 'true'],
        ['trustServerCert', 'true'],
        ['loginTimeout', '15'],
        ['readOnly', 'true'],
        ['multisubnetFailover', 'true'],
        ['encryptedConnection', 'true'],
        ['unknown option', ''],
      ])
    ).toEqual({
      dedicatedAdminConnection: true,
      trustServerCert: true,
      loginTimeout: 15,
      readOnly: true,
      multisubnetFailover: true,
      encryptedConnection: true,
    });
  });
  it('will return empty for default / out of range', () => {
    expect(
      parseSearchParams([
        ['dedicatedAdminConnection', 'false'],
        ['trustServerCert', 'false'],
        ['loginTimeout', '0'],
        ['readOnly', 'false'],
        ['multisubnetFailover', 'false'],
        ['encryptedConnection', 'false'],
      ])
    ).toEqual({});
  });

  describe('parseBool', () => {
    it('will return default for nomatch', () => {
      expect(parseBool('invalid', 'anything')).toEqual('anything');
    });
  });
});
