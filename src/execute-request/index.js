import resolveOptions from '../resolve-options';
import copyScripts from './copy-scripts/copy-input-scripts-local';
import executeLocal from './execute-request-local';
import executeDocker from './execute-request-docker';

const executeRequest = async (connectionString, scripts, vars, directOptions /* echo */) => {
  const options = Object.assign(await resolveOptions(connectionString), directOptions);

  let { cleanup, list } = await copyScripts(scripts);

  try {
    if (options.docker) {
      await executeDocker(options, list, vars);
    } else {
      await executeLocal(options, list, vars);
    }
    await cleanup();
  } catch (error) {
    await cleanup();
    throw error;
  }
};

export default executeRequest;
