/* istanbul ignore file */
// TODO: temporarily ignore file for coverage

import getCommandArgs from './get-command-arguments';

const executeLocal = async (options, scripts, vars) => {
  const args = getCommandArgs(options, scripts, vars);

  // TODO: run process
};

export default executeLocal;
