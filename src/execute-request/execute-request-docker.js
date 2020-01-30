/* istanbul ignore file */
// TODO: temporarily ignore file for coverage
import copyScripts from './copy-scripts/copy-temp-scripts-to-container';
import deleteAll from '../utility/delete-container-files';
import getCommandArgs from './get-command-arguments';

const executeDocker = async (options, scripts, vars) => {
  // copy scripts into container
  scripts = (await copyScripts(options.containerId, scriptList)).map(l => l.to);
  const cleanup = () => deleteAll(options.containerId, scripts);

  try {
    const args = getCommandArgs(options, scripts, vars);

    // todo execute request in docker

    await cleanup();
  } catch (error) {
    await cleanup();
    throw error;
  }
};

export default executeDocker;
