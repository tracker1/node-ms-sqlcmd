export const knownWindowsPaths = [
  'C:/Program Files/Microsoft SQL Server/Client SDK/ODBC/170/Tools/Binn',
  'C:/Program Files/Microsoft SQL Server/110/Tools/Binn',
];

export const knownLinuxPaths = ['/opt/mssql-tools/bin'];

export default (platform = process.platform) => {
  switch (platform) {
    case 'win32':
      return knownWindowsPaths;
    case 'linux':
      return knownLinuxPaths;
    default:
      return []; // empty array, docker is still supported if available
  }
};
