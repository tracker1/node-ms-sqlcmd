/* istanbul ignore file */
// ignoring difficult to test simple copy transpose file
import fs from 'fs';
import stripBomStream from 'strip-bom-stream';

const copyFile = async ({ from, to }) =>
  new Promise((resolve, reject) => {
    fs.createReadStream(from, 'utf16le')
      .pipe(stripBomStream())
      .pipe(fs.createWriteStream(to, 'utf8'))
      .on('close', resolve)
      .on('error', reject);
  });

export default copyFile;
