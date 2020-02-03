/* istanbul ignore file */
export default () => {
  // break resolve and reject out of a promise
  let resolve, reject;
  const promise = new Promise((res, rej) => {
    resolve = res;
    reject = rej;
  });

  // return as a future
  return {
    promise,
    resolve,
    reject,
  };
};
