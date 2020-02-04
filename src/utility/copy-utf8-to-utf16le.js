/* istanbul ignore file */
// ignoring difficult to test simple copy transpose file
import { promises as fsp } from 'fs';

const copyFile = async ({ from, to }) => {
  let input = await fsp.readFile(from, 'utf8');
  if (input.charCodeAt(0) !== 0xfeff) input = String.fromCharCode(0xfeff) + input;
  await fsp.writeFile(to, input, 'utf16le');
};

export default copyFile;
