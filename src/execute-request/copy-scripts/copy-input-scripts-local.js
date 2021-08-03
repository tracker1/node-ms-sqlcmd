import path from 'path';
import rimrafFn from 'rimraf';
import generateTempDir from '../../utility/generate-temp-sql-dir';
import copyFile from '../../utility/copy-utf8-to-utf16le';

const rimraf = (dir) =>
  new Promise((resolve, reject) => rimrafFn(dir, (err) => (err ? reject(err) : resolve())));

const copyInputScripts = async (scripts) => {
  // scripts is required
  if (!scripts) throw new Error('No sql scripts specified');

  // normalize single string to set of scripts
  if (typeof scripts === 'string') {
    scripts = [scripts];
  }

  const directory = await generateTempDir();
  const cleanup = () => rimraf(directory).catch((_) => null);

  // generate list for from/to first - for cleanup in case of error
  const scriptList = scripts.map((from) => ({
    from,
    to: path.normalize(`${directory}/${path.basename(from)}`),
  }));

  // copy from utf8 to utf16le in temp location
  try {
    return {
      directory,
      cleanup,
      list: await Promise.all(scriptList.map((f) => copyFile(f))),
    };
  } catch (error) {
    // In case of error, clean up temporary file(s)
    await cleanup(directory);
    throw error;
  }
};

export default copyInputScripts;
