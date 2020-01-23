import { invalidConnectionString } from '../errors';

const parseProtocol = protocol => {
  switch (protocol) {
    case 'mssql:':
      return null; // default
    case 'mssql+tcp:':
      return { protocol: 'tcp' };
    case 'mssql+lpc:':
      return { protocol: 'lpc' };
    case 'mssql+np:':
      return { protocol: 'np' };
    case 'mssql+docker:':
      return { docker: true };
    default:
      throw invalidConnectionString({ message: 'Invalid Protocol', protocol });
  }
};

const parseUsernamePassword = ({ username, password }) => {
  if (username && !password) {
    throw invalidConnectionString({ message: `Missing Passphrase`, username });
  }
  if (username) return { username, password };
  return { trustedConnection: true };
};

const parsePath = pathname => {
  const parts = pathname.split(/[\\\/]+/g).filter(p => p);
  if (parts.length === 0) return null;
  if (parts.length === 1) return { database: parts[0] };
  return { database: parts[1], instance: parts[0] };
};

const parseUrlBase = url => ({
  ...parseProtocol(url.protocol),
  ...parseUsernamePassword(url),
  ...parsePath(url.pathname),
  server: url.hostname,
  port: +url.port || null, // will set against default later...
});

export const __internal = { parseProtocol, parseUsernamePassword, parsePath };
export default parseUrlBase;
