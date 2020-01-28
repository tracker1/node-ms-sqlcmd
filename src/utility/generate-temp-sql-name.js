import os from 'os';
import path from 'path';

const tempNameGen = () => {
  const tmp = os.tmpdir();
  const dtm = new Date()
    .toJSON()
    .replace(/\D/g, '')
    .substr(0, 12);
  const rnd = Math.random()
    .toString(26)
    .substr(2)
    .toLowerCase();
  return path.normalize(`${tmp}/sqlcmd_${dtm}_${rnd}.sql`);
};

export default tempNameGen;
