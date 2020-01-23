const winPaths = [
  'C:/Program Files/Microsoft SQL Server/Client SDK/ODBC/170/Tools/Binn',
  'C:/Program Files/Microsoft SQL Server/Client SDK/ODBC/130/Tools/Binn',
  'C:/Program Files/Microsoft SQL Server/110/Tools/Binn',
];

export const nowMap = p => p.replace(/^(\w)\:/, m => `/${m[0].toLowerCase()}`);
export const knownNixOnWindowsPaths = winPaths.map(nowMap);

export const winMap = p => p.replace(/\//g, '\\');
export const knownWindowsPaths = winPaths.map(winMap);

export const knownLinuxPaths = ['/opt/mssql-tools/bin'];

export default (platform = process.platform, ostype = process.env.OSTYPE) => {
  var nixOnWindows = platform !== 'win32' && (ostype === 'cygwin' || ostype === 'msys');
  var isWindows = platform === 'win32' || ostype === 'cygwin' || ostype === 'msys';

  if (isWindows && nixOnWindows) {
    return knownNixOnWindowsPaths;
  }
  if (isWindows) {
    return knownWindowsPaths;
  }

  if (platform === 'linux') {
    return knownLinuxPaths;
  }

  return []; // empty array
};
