/* istanbul ignore file */
// TODO: temporarily ignore file for coverage
import copyScripts from './copy-scripts/copy-temp-scripts-to-container';
import deleteAll from '../utility/delete-container-files';
import getCommandArgs from './get-command';
import spawn from '../utility/spawn';

const executeDockerSqlContainer = async (options, scripts, variables) => {
  // copy scripts into container
  let { list, cleanup } = await copyScripts(options.containerId, scripts);

  try {
    const { sqlcmd, containerId, args, vars } = getCommandArgs(options, list, variables);

    var result = await spawn(
      'docker',
      [
        'exec',
        '-i',
        // map sqlcmd var entries to docker variable entries
        ...vars.map(v => (v === '-v' ? '-e' : v)),
        containerId,
        sqlcmd,
        ...args,
      ],
      { echo: options.echo }
    );
    await cleanup();
    return result;
  } catch (error) {
    await cleanup();
    throw error;
  }
};

const executeDockerSqltools = async (options, scripts, variables) => {
  throw new Error('Docker mssql-tools logic not ready.');
};

const executeDocker = async (options, scripts, variables) => {
  if (options.containerId) {
    return executeDockerSqlContainer(options, scripts, variables);
  }
  return executeDockerSqltools(options, scripts, variables);
};

export default executeDocker;
