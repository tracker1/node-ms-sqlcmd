/* istanbul ignore file */
// ignoring difficult to test simple copy transpose file
import { promises as fsp } from 'fs';

const copyFile = async ({ from, to }) => {
  let input = await fsp.readFile(from, 'utf16le');
  if (input.charCodeAt(0) === 0xfeff) input = input.slice(1);
  await fsp.writeFile(to, input, 'utf8');
};

export default copyFile;
