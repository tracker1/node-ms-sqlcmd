import docker from '@tracker1/docker-cli';
import { genFileBase } from '../../utility/generate-temp-sql-dir';

const fmtMakeTemp = (containerId, sqlTempPath) => `exec -i ${containerId} mkdir -p ${sqlTempPath}`;
const fmtCleanup = (containerId, sqlTempPath) => `exec -i ${containerId} rm -rf ${sqlTempPath}`;
const fmtCopy = (from, to, containerId) => `cp "${from}" ${containerId}:${to}`;

const copyScriptToContainer = async (containerId, sqlTempPath, from, index) => {
  // copy file into container
  var to = `${sqlTempPath}/script_${index + 1}.sql`;
  await docker(fmtCopy(from, to, containerId));
  return to;
};

const copyScripts = async (containerId, scripts) => {
  const directory = `/var/opt/mssql/tmp/${genFileBase()}`;

  await docker(fmtMakeTemp(containerId, directory));
  const cleanup = () => docker(fmtCleanup(containerId, directory)).catch(() => null);

  try {
    const list = await Promise.all(
      scripts.map((s, i) => copyScriptToContainer(containerId, directory, s, i))
    );
    return { directory, list, cleanup };
  } catch (error) {
    cleanup();
    throw error;
  }
};

export const __internal = { fmtMakeTemp, fmtCleanup, fmtCopy };
export default copyScripts;
