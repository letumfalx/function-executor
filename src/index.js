
class FunctionExecutor {
  
  constructor(stopOnError = true)  {

    const _list = [];
    let _stopOnError = false;

    Object.defineProperty(this, "stopOnError", {
      enumerable: true,
      configurable: true,
      get: () => _stopOnError,
      set: value => _stopOnError = !!value,
    });

    this.add = func => {
      if(typeof func === "function" && _list.indexOf(func) < 0) {
        _list.push(func);
        return true;
      }
      return false;
    };

    this.contains = func => {
      return _list.indexOf(func) >= 0;
    };

    this.execute = (...args) => {

      if(_stopOnError) {
        _list.forEach(func => func(...args));
      }
      else {

        const _errors = [];
        _list.forEach(func => {
          try {
            func(...args);
          }
          catch(error) {
            _errors.push(error);
          }
        });

        return _errors.length > 0 ? _errors : void 0;
      }
    };

    this.remove = func => {
      const index = _list.indexOf(func);
      if(index > -1) {
        _list.splice(index, 1);
        return true;
      }
      return false;
    };

    this.clear = () => _list.splice(0);

    this.stopOnError = stopOnError;

  }

}

export default FunctionExecutor;