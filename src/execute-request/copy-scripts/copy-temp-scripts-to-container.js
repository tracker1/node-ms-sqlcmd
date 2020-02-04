import dockerCommand from '../../utility/docker-command';
import { genFileBase } from '../../utility/generate-temp-sql-name';

const sqlTempPath = `/var/opt/mssql/tmp`;
const fmtMakeTemp = (containerId, sqlTempPath) => `exec -i ${containerId} mkdir -p ${sqlTempPath}`;
const fmtCopy = (from, to, containerId) => `cp "${from}" ${containerId}:${to}`;

const copyScriptToContainer = async (containerId, from) => {
  // inside mssql containers, can only read/write /var/opt/mssql
  // create a tmp directory
  await dockerCommand(fmtMakeTemp(containerId, sqlTempPath));

  // copy file into container
  var to = `${sqlTempPath}/${genFileBase()}.sql`;
  await dockerCommand(fmtCopy(from, to, containerId));
  return { from, to };
};

export const __internal = { sqlTempPath, fmtMakeTemp, fmtCopy };
export default async (containerId, scripts) =>
  Promise.all(scripts.map(s => copyScriptToContainer(containerId, s)));
