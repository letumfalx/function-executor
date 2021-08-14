Function Executor
=========

[![Build Status](https://travis-ci.com/letumfalx/function-executor.svg?branch=master)](https://travis-ci.com/letumfalx/function-executor)
[![Coverage Status](https://coveralls.io/repos/github/letumfalx/function-executor/badge.svg?branch=master)](https://coveralls.io/github/letumfalx/function-executor?branch=master)


Used to store functions that can be executed with same arguments with one call.


## Installation

**Using npm:**

    `npm install @letumfalx/function-executor`

**Using yarn:**

    `yarn add @letumfalx/function-executor`


## Usage

**Creates an instance:**
```js
const fexec = new FunctionExecutor();
```

Adds a function:
```js
const fn = function() {};

// this will return true
fexec.add(fn);

// adding non-function will return false
fexec.add("not a function");

// adding already added function will also return false
fexec.add(fn);
```

**Removing a function:**
```js
const fn = function() {};

// we must add first a function
fexec.add(fn);

// removing added function will return true
fexec.remove(fn);

// removing already removed or not yet added function will return false
fexec.remove(fn);
fexec.remove(function() {});

// removing non-function will also return false
fexec.remove("not a function");
```

**Checking if function already in the list:**
```js
const fn = function() {};

fexec.add(fn);

// this will return true as the function is already added
fexec.contains(fn);

// this will return false as the function is not yet added
fexec.contains(function() {});

fexec.remove(fn);

// this will return false as the function is already removed
fexec.contains(fn);

// checking non-function always return false
fexec.contains("not a function");
```

**Setting stopOnError:**
```js

// by default stopOnError is true on creation
let fexec = new FunctionExecutor();
console.log(fexec.stopOnError); // OUTPUTS: true

// you can also pass a boolean to the constructor to set the stopOnError
fexec = new FunctionExecutor(false);
console.log(fexec.stopOnError); // OUTPUTS: false

// you can also change it directly if you like it
fexec.stopOnError = false;
```

**Executing the functions:**
```
const fn1 = function(args1) {
  console.log(args1);
};

const fn2 = function(args1, args2) {
  console.log(args1 + " " + args2);
};

// creating and adding functions
const fexec = new FunctionExecutor();
fexec.add(fn1);
fexec.add(fn2);

// you can execute the added functions
// NOTE: you can pass as many arguments as you want
fexec.execute("1", "2");

// OUTPUTS:
// > 1
// > 1 2

const fn3 = function(args1, args2, args3) {
  throw new Error("Error has occured");
};

const fexec2 = new FunctionExecutor();
fexec2.add(fn1);
fexec2.add(fn3);
fexec2.add(fn2);

// executing the function with stopOnError to true and has encountered an
// error will stop the execution on the errored function and throws the error

fexec2.execute(1, 2, 3);

// OUTPUTS:
// > 1
// > Error: Error has occured
// > (stacktrace here)

// we can set stopOnError to false to give chance to others to be executed
// this will make execute returns the array of errors it encountered
fexec2.stopOnError = false;
fexec2.execute(1, 2, 3); // returns: [Error]

// OUTPUTS:
// > 1
// > 1 2

// NOTE: if stopOnError is set to false and no error encountered, execute will return undefined not an empty array

fexec2.remove(fn3);
fexec2.execute(1, 2, 3); // returns: undefined
```

**Clearing the list:**

```js
const fn1 = function() {};
const fn2 = function() {};

const fexec = new FunctionExecutor();
fexec.add(fn1);
fexec.add(fn2);

// you can remove all functions from the list
fexec.clear();

fexec.contains(fn1);	// returns: false
fexec.contains(fn2);	// returns: false
```

## Tests

```
npm run test
```

## Contributing

In lieu of a formal style guide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code.

