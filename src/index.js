class FunctionExecutor {
  /**
   * Creates an instance of Function Executor.
   *
   * @param {boolean} [stopOnError] determines if the execution will stop when encountered an error
   */
  constructor (stopOnError = true) {
    /**
     * The variable where to save the value of the `stopOnError` option
     * for encapsulation purposes only.
     *
     * @type {boolean}
     */
    let _stopOnError = false;

    /**
     * The list of registered functions.
     *
     * @type {EntryFunction[]}
     */
    const _list = [];

    Object.defineProperty(this, 'stopOnError', {
      enumerable: true,
      configurable: true,
      get: () => _stopOnError,
      set: value => {
        _stopOnError = !!value;
      }
    });

    /**
     * Adds a function to the list.
     *
     * @param {EntryFunction} func the function to add
     *
     * @returns true if successfully added, or false if function already in the list or passed argument is not a function
     */
    this.add = func => {
      if (typeof func === 'function' && _list.indexOf(func) < 0) {
        _list.push(func);
        return true;
      }

      return false;
    };

    /**
     * Checks if the function is already in the list.
     *
     * @param {EntryFunction} func the function to search
     *
     * @returns true if the functin is already in the list, otherwise false
     */
    this.contains = func => _list.indexOf(func) > -1;

    /**
     * Removes all functions on the list.
     */
    this.clear = () => {
      _list.splice(0);
    };

    /**
     * Executes all the function. If stopOnError is true, this will
     * throw the first encountered error and doesn't execute the remaining
     * functions, else will execute all the functions and put all errors on
     * the list then return the list after all are executed. If no errors
     * are encountered during executed on stopOnError = false, will return
     * undefined.
     *
     * @param {...any} args the arguments to be passed to functions to execute
     *
     * @returns {undefined|Error[]} undefined if there are no encounted error, or array of errors if stopOnError is false, and there are encountered errors
     */
    this.execute = (...args) => {
      if (_stopOnError) {
        _list.forEach(func => func(...args));
      } else {
        const _errors = [];
        _list.forEach(func => {
          try {
            func(...args);
          } catch (error) {
            _errors.push(error);
          }
        });

        if (_errors.length > 0) return _errors;
      }

      return undefined;
    };

    /**
     * Removes a function from the list.
     *
     * @param {EntryFunction} func the function to remove
     *
     * @returns {boolean} true if successfully removed, or false if function is not in the list
     */
    this.remove = func => {
      const index = _list.indexOf(func);
      if (index > -1) {
        _list.splice(index, 1);
        return true;
      }

      return false;
    };

    /**
     * Determines if the execution will stop if encountered an error.
     *
     * @type {boolean}
     */
    this.stopOnError = !!stopOnError;
  }
}

export default FunctionExecutor;

/**
 * @typedef {(...args: any[]) => any} EntryFunction
 */
