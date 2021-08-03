const parseBool = (value, defaultValue) => {
  switch (String(value).toLocaleLowerCase()) {
    case 'true':
    case 't':
    case 'yes':
    case 'y':
    case '1':
      return true;
    case 'false':
    case 'f':
    case 'no':
    case 'n':
    case '0':
      return false;
    default:
      return defaultValue;
  }
};

const parseSeconds = (v, { min = 1 /* 1 second */, max = 300 /* 5 minutes*/ } = {}) => {
  var s = Math.round(+v);
  if (s < min || s >= max) return null;
  return s;
};

const mapParam = ([name, value]) => {
  switch (name.toLocaleLowerCase()) {
    case 'dedicatedadminconnection':
      return { dedicatedAdminConnection: parseBool(value, false) || null };
    case 'trustservercert':
      return { trustServerCert: parseBool(value, false) || null };
    case 'logintimeout':
      return { loginTimeout: parseSeconds(value) };
    case 'readonly':
      return { readOnly: parseBool(value, false) || null };
    case 'multisubnetfailover':
      return { multisubnetFailover: parseBool(value, false) || null };
    case 'encryptedconnection':
      return { encryptedConnection: parseBool(value, false) || null };
  }
  return {};
};

const clearNull = (o) =>
  Object.entries(o)
    .filter((kv) => kv[1] !== null)
    .reduce((o, [k, v]) => Object.assign(o, { [k]: v }), {});

const reduceParam = (o, param) => Object.assign(o, mapParam(param));

const parseParams = (params) => clearNull(params.reduce(reduceParam, {}));

export const __internal = { parseBool, parseSeconds, mapParam, reduceParam };
export default (searchParams) => parseParams(Array.from(searchParams));
