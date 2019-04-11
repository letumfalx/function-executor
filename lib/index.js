"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var FunctionExecutor = function FunctionExecutor() {
  var stopOnError = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;

  _classCallCheck(this, FunctionExecutor);

  var _list = [];
  var _stopOnError = false;
  Object.defineProperty(this, "stopOnError", {
    enumerable: true,
    configurable: true,
    get: function get() {
      return _stopOnError;
    },
    set: function set(value) {
      return _stopOnError = !!value;
    }
  });

  this.add = function (func) {
    if (typeof func === "function" && _list.indexOf(func) < 0) {
      _list.push(func);

      return true;
    }

    return false;
  };

  this.contains = function (func) {
    return _list.indexOf(func) >= 0;
  };

  this.execute = function () {
    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    if (_stopOnError) {
      _list.forEach(function (func) {
        return func.apply(void 0, args);
      });
    } else {
      var _errors = [];

      _list.forEach(function (func) {
        try {
          func.apply(void 0, args);
        } catch (error) {
          _errors.push(error);
        }
      });

      return _errors.length > 0 ? _errors : void 0;
    }
  };

  this.remove = function (func) {
    var index = _list.indexOf(func);

    if (index > -1) {
      _list.splice(index, 1);

      return true;
    }

    return false;
  };

  this.stopOnError = stopOnError;
};

var _default = FunctionExecutor;
exports["default"] = _default;