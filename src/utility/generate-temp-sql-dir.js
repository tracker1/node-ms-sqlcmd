import os from 'os';
import path from 'path';
import fs from 'fs';

export const md = (directory) =>
  new Promise((resolve, reject) =>
    fs.mkdir(directory, '0777', (err) => (err ? reject(err) : resolve(directory)))
  );

export const genFileBase = () => {
  const dtm = new Date().toJSON().replace(/\D/g, '').substr(0, 12);
  const rnd = Math.random().toString(26).substr(2).toLowerCase();
  return `sqlcmd_${dtm}_${rnd}`;
};

export default async () => md(path.normalize(`${os.tmpdir()}/${genFileBase()}`));
