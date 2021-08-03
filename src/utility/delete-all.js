import { promises as fsp } from 'fs';

export default (list) => Promise.all(list.map((item) => fsp.unlink(item).catch(() => null)));
