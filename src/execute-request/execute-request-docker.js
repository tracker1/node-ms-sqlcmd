/* istanbul ignore file */
// TODO: temporarily ignore file for coverage
import copyScripts from './copy-scripts/copy-temp-scripts-to-container';
import deleteAll from '../utility/delete-container-files';
import getCommandArgs from './get-command';
import exec from '../utility/exec';

const executeDocker = async (options, scripts, vars) => {
  // copy scripts into container
  scripts = (await copyScripts(options.containerId, scripts)).map(l => l.to);
  const cleanup = () => deleteAll(options.containerId, scripts);

  try {
    const args = getCommandArgs(options, scripts, vars);

    var runner = exec('docker', 'exec', '-i', options.containerId, options.sqlcmd, ...args);
    if (options.echo) {
      runner.on('stdout', console.log);
      runner.on('stderr', console.error);
    }
    var result = await runner;
    await cleanup();
    return result;
  } catch (error) {
    await cleanup();
    throw error;
  }
};

export default executeDocker;
