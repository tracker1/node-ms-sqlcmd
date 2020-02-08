import { URL } from 'url';
import { invalidConnectionString } from '../errors';
import parseSearch from './parse-searchparams';
import parseUrlBase from './parse-urlbase';

const parseUrl = connectionString => {
  try {
    return new URL(connectionString);
  } catch (error) {
    throw invalidConnectionString({ connectionString });
  }
};

const parseConnectionString = connectionString => {
  const csurl = parseUrl(connectionString);
  return {
    ...parseSearch(csurl.searchParams),
    ...parseUrlBase(csurl),
  };
};

export const __internal = { parseUrl };
export default parseConnectionString;
