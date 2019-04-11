
declare class FunctionExecutor {

  /**
   * Creates an instance of Function Executor.
   */
  constructor();

  /**
   * Creates an instance of Function Executor.
   * @param stopOnError determines if the execution will stop when 
   *                    encountered an error or not
   */
  constructor(stopOnError?: Boolean);

  /**
   * Determines if the execution will stop if encountered an error.
   */
  stopOnError: Boolean;

  /**
   * Adds a function to the list.
   * @param func the function to be added
   * @returns true if successfully added, or false if function 
   *          already in the list or passed argument is not a function
   */
  add(func: Function): Boolean;

  /**
   * Checks if the function is already in the list.
   * @param func the function to be searched
   * @returns true if the functin is already in the list, otherwise false
   */
  contains(func: Function): Boolean;

  /**
   * Executes all the function. If stopOnError is true, this will 
   * throw the first encountered error and doesn't execute the remaining 
   * functions, else will execute all the functions and put all errors on 
   * the list then return the list after all are executed. If no errors 
   * are encountered during executed on stopOnError = false, will return 
   * undefined.
   * 
   * @returns undefined if there are no encounted error, or array of errors 
   *          if stopOnError is false, and there are encountered errors
   */
  execute(...args: any[]): void|Error[];

  /**
   * Removes a function from the list.
   * @param func the function to be removed
   * @returns true if successfully removed, or false if function is 
   *          not in the list
   */
  remove(func: Function): Boolean;

}

export default FunctionExecutor;