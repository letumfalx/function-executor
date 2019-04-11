
declare class FunctionExecutor {

  constructor();
  constructor(stopOnError: Boolean);

  add(func: Function): Boolean;
  contains(func: Function): Boolean;
  execute(...args: any[]): null|Error[];
  remove(func: Function): Boolean;

}

export default FunctionExecutor;