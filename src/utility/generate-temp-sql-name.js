import os from 'os';
import path from 'path';

export const genFileBase = () => {
  const dtm = new Date()
    .toJSON()
    .replace(/\D/g, '')
    .substr(0, 12);
  const rnd = Math.random()
    .toString(26)
    .substr(2)
    .toLowerCase();
  return `sqlcmd_${dtm}_${rnd}`;
};

const tempNameGen = () => {
  const tmp = os.tmpdir();
  return path.normalize(`${tmp}/${genFileBase()}.sql`);
};

export default tempNameGen;
