/* istanbul ignore file */
// TODO: temporarily ignore file for coverage
import path from 'path';
import copyScripts from './copy-scripts/copy-temp-scripts-to-container';
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
  // get directory from first script
  const directory = path.dirname(scripts[0]);

  // temp directory for inside contaner (volume mount)
  const tmpDir = `/tmp/${path.basename(directory)}`;

  // adjust list for in-container paths
  const list = scripts.map(s => `${tmpDir}/${path.basename(s)}`);

  // get command and args
  const { sqlcmd, args, vars } = getCommandArgs(options, list, variables);

  // run in a container
  return spawn(
    'docker',
    [
      'run',
      '-i',
      '--rm',
      '-v',
      `${directory}:${tmpDir}`,

      // map sqlcmd var entries to docker variable entries
      ...vars.map(v => (v === '-v' ? '-e' : v)),

      'mcr.microsoft.com/mssql-tools',

      sqlcmd,
      ...args,
    ],
    { echo: options.echo }
  );
};

const executeDocker = async (options, scripts, variables) => {
  if (options.containerId) {
    return executeDockerSqlContainer(options, scripts, variables);
  }
  return executeDockerSqltools(options, scripts, variables);
};

export default executeDocker;
