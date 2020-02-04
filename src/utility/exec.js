/* istanbul ignore file */
// pretty conventional wrapper around spawn
import spawn from './spawn';

export default (command, ...args) => spawn(command, args, { echo: false });
