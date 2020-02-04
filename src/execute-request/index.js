import resolveOptions from '../resolve-options';
import copyScripts from './copy-scripts/copy-input-scripts-local';
import deleteAll from '../utility/delete-all';
import executeLocal from './execute-request-local';
import executeDocker from './execute-request-docker';

const executeRequest = async (connectionString, scripts, vars, directOptions /* echo */) => {
  const options = Object.assign(await resolveOptions(connectionString), directOptions);
  const scriptList = (await copyScripts(scripts)).map(l => l.to);
  const cleanup = () => deleteAll(scriptList);

  try {
    if (options.docker) {
      await executeDocker(options, scriptList, vars);
    } else {
      await executeLocal(options, scriptList, vars);
    }
    await cleanup();
  } catch (error) {
    await cleanup();
    throw error;
  }
};

export default executeRequest;
