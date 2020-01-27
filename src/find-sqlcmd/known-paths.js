const linuxPaths = ['/opt/ms-tools/bin/sqlcmd'];

const knownPaths = [
  'C:/Program Files/Microsoft SQL Server/Client SDK/ODBC/*/Tools/Binn/sqlcmd.exe',
  'C:/Program Files/Microsoft SQL Server/*/Tools/Binn/sqlcmd.exe',
];

const knownPathsNix = knownPaths.map(p => p.replace(/^(\w)\:/, m => m[0].toLowerCase()));

const getKnownPaths = (platform = process.platform, ostype = process.env.OSTYPE) => {
  if (platform === 'linux') return linuxPaths;
  if (platform === 'win32') return knownPaths;
  if (ostype === 'cygwin' || ostype === 'msys') return knownPathsNix;
  return []; // no known paths to search
};

export const __internal = { linuxPaths, knownPaths, knownPathsNix };

export default getKnownPaths;
