/**
 * @typedef {Object} Options The options used by the FunctionExecutor.
 * @property {boolean} stopOnError Determines if executing the functions will stop on the first error encountered.
 */

/**
 * Stores functions that will be executed with the same arguments in one call.
 */
class FunctionExecutor {
  /**
   * Create an instance of Function Executor.
   *
   * @param {Options} options the options to be passed to the constructor
   *
   * @returns {FunctionExecutor}
   */
  static create (options = {}) {
    return new FunctionExecutor(options);
  }

  /**
   * Create an instance of Function Executor.
   *
   * @param {Options} options the options to be used
   */
  constructor (options = {}) {
    /**
     * The this reference.
     *
     * @type {FunctionExecutor}
     */
    const _this = this;

    /**
     * The list of options used.
     */
    const _options = options || {};

    /**
     * The list of all functions registered.
     *
     * @type {function[]}
     */
    const _list = [];

    /**
     * Adds the function to the list. Note that this will not check
     * if the function is already added, resulting to duplicates.
     *
     * @param {Function} func the function to be added
     * @param {null|number} index the index where the function was added
     *
     * @returns {this}
     */
    this.add = (func, index = null) => {
      if (typeof func !== 'function') {
        throw new TypeError('func should be a function');
      }

      index === null
        ? _list.push(func)
        : _list.splice(index, 0, func);

      return _this;
    };

    /**
     * Empties the list.
     *
     * @return {this}
     */
    this.clear = () => {
      _list.splice(0);
      return this;
    };

    /**
     * Checks if the function is already in the list.
     *
     * @param {Function} func the function to check
     *
     * @returns {boolean} true if the function is already in the list, otherwise false
     */
    this.contains = func => _this.indexOf(func) > -1;

    /**
     * The total entries on the list.
     *
     * @returns {number}
     */
    this.count = () => _list.length;

    /**
     * Execute the functions on the list sequentially.
     *
     * @param  {...any} args the arguments that will be used to run the functions
     *
     * @returns {Error[]} the errors thrown while executing the functions if stopOnError is false, or an empty array if stopOnError is true
     * @throws {Error} throws the first error encountered if stopOnError is true
     */
    this.execute = (...args) => {
      const { stopOnError = true } = _options;
      const errors = [];

      if (stopOnError) {
        _list.forEach(func => func(...args));
      } else {
        _list.forEach(func => {
          try {
            func(...args);
          } catch (error) {
            errors.push(error);
          }
        });
      }

      return errors;
    };

    /**
     * Get the function from the given index.
     *
     * @param {number} index the index to get, starts from the end if negative
     *
     * @returns {null|Function} the function on the given index, or null if index does not exists
     */
    this.get = index => {
      index = index < 0 ? _this.count() + index : index;
      return _list[index] || null;
    };

    /**
     * Finds the index of the given function from the list.
     *
     * @param {Function} func the function to check
     *
     * @returns {number} the index of the function on the list, or -1 if not found
     */
    this.indexOf = func => _list.indexOf(func);

    /**
     * Removes the given function from the list.
     *
     * @param {Function} func the function to remove
     *
     * @returns {this}
     */
    this.remove = func => {
      const index = _list.indexOf(func);
      if (index > -1) {
        _list.splice(index, 1);
      }

      return _this;
    };
  }
}

module.exports = FunctionExecutor;
