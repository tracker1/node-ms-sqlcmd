import os from 'os';
import path from 'path';

import generateTempName from './generate-temp-sql-name';

describe('utility/generate-temp-sql-name', () => {
  it('will generate unique names', () => {
    const a = generateTempName();
    const b = generateTempName();
    expect(a).toEqual(expect.stringContaining(path.normalize(`${os.tmpdir()}/sqlcmd_`)));
    expect(a).toEqual(expect.stringMatching(/[\\\/]sqlcmd_[\d]{12}_[\da-z]+.sql$/));
    expect(a).not.toEqual(b);
  });
});
