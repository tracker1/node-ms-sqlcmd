// mocks
jest.mock('fs', () => ({
  mkdir: jest.fn(),
}));

//
import fs from 'fs';

// other imports
import os from 'os';
import path from 'path';

import generateTempDir from './generate-temp-sql-dir';

describe('utility/generate-temp-sql-dir', () => {
  it('will generate unique names', async () => {
    fs.mkdir.mockReset().mockImplementation((_dir, _opts, cb) => cb(null));
    const a = await generateTempDir();
    const b = await generateTempDir();
    expect(a).toEqual(expect.stringContaining(path.normalize(`${os.tmpdir()}/sqlcmd_`)));
    expect(a).toEqual(expect.stringMatching(/[\\\/]sqlcmd_[\d]{12}_[\da-z]+$/));
    expect(a).not.toEqual(b);
  });

  it('will elevate error from mkdir', async () => {
    const expected = Math.random();
    fs.mkdir.mockReset().mockImplementationOnce((_dir, _opts, cb) => cb(expected));

    expect.assertions(1);
    try {
      await generateTempDir();
    } catch (error) {
      expect(error).toEqual(expected);
    }
  });
});
