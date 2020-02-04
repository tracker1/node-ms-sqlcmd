/* istanbul ignore file */
// pretty conventional wrapper around spawn
import execEcho from './exec-echo';

export default (command, ...args) => execEcho(false, command, ...args);
