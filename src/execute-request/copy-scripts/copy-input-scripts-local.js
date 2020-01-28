import deleteAll from '../../utility/delete-all';
import generateTempName from '../../utility/generate-temp-sql-name';
import copyFile from '../../utility/copy-utf8-to-utf16le';

const copyInputScripts = async scripts => {
  // scripts is required
  if (!scripts) throw new Error('No sql scripts specified');

  // normalize single string to set of scripts
  if (typeof scripts === 'string') {
    scripts = [scripts];
  }

  // generate list for from/to first - for cleanup in case of error
  const fromToList = scripts.map(from => ({
    from,
    to: generateTempName(),
  }));

  // copy from utf8 to utf16le in temp location
  try {
    await Promise.all(fromToList.map(f => copyFile(f)));
  } catch (error) {
    // In case of error, clean up temporary file(s)
    await deleteAll(fromToList.map(item => item.to));
    throw error;
  }

  // return copied list of files
  return fromToList;
};

export default copyInputScripts;
