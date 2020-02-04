/* istanbul ignore file */
// TODO: temporarily ignore file for coverage
import copyScripts from './copy-scripts/copy-temp-scripts-to-container';
import deleteAll from '../utility/delete-container-files';
import getCommandArgs from './get-command';
import exec from '../utility/exec-echo';

const executeDocker = async (options, scripts, vars) => {
  // copy scripts into container
  scripts = (await copyScripts(options.containerId, scripts)).map(l => l.to);
  const cleanup = () => deleteAll(options.containerId, scripts);

  try {
    const { sqlcmd, containerId, args } = getCommandArgs(options, scripts, vars);

    var result = await exec(options.echo, 'docker', 'exec', '-i', containerId, sqlcmd, ...args);
    await cleanup();
    return result;
  } catch (error) {
    await cleanup();
    throw error;
  }
};

export default executeDocker;
