/* istanbul ignore file */
import { EventEmitter } from 'events';
import createFuture from './future';

/**
 * PromiseEmitter class - Combines Promise and EventEmitter
 * @param {*} fn is a funtion that should accept (resolve, reject, emitter)
 */
function PromiseEmitter(fn) {
  const { resolve, reject, promise } = createFuture();

  // add eventemitter to promise
  Object.assign(promise, EventEmitter.prototype);
  EventEmitter.call(promise);

  // run fn call out of band
  setTimeout(() => fn.call(promise, resolve, reject, promise), 1);

  return promise;
}

export default PromiseEmitter;
