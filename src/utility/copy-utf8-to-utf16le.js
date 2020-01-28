/* istanbul ignore file */
// ignoring difficult to test simple copy transpose file
import fs from 'fs';
import stripBomStream from 'strip-bom-stream';

const copyFile = async ({ from, to }) =>
  new Promise((resolve, reject) => {
    const readStream = fs.createReadStream(from, 'utf8');
    const writeStream = fs.createWriteStream(to, 'utf16le');

    // write BOM into new stream - stripping just in case from read stream
    writeStream.write('\ufeff');

    readStream
      .pipe(stripBomStream())
      .pipe(writeStream)
      .on('close', resolve)
      .on('error', reject);
  });

export default copyFile;
