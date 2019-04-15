Function Executor
=========

Used to store functions that can be executed with same arguments with one call.


## Installation

**Using npm:**

    `npm install @letumfalx/function-executor`
    
**Using yarn:**

    `yarn add @letumfalx/function-executor`
    
   
## Usage

```js
import FunctionExecutor from '@letumfalx/function-executor';


const fn1 = str => console.log(`FN1: ${str}`);
const fn2 = str => console.log(`FN2: ${str}`);

const fexec = new FunctionExecutor();

// adds a function 
fexec.add(fn1);

// succesful addition of function returns true
// OUTPUTS: true
console.log(fexec.add(fn2));

// adding already added function will fail and returns false
// OUTPUTS: false
console.log(fexec.add(fn1));

// executes the function inside fexec with argument 'Hello'
// this will execute the added functions sequentially
// OUTPUTS:
// > FN1: Hello
// > FN2: Hello
fexec.execute('Hello');

// removes a function successfully will return true
// OUTPUTS: true
console.log(fexec.remove(fn2));

// removing functions that are not added or already removed will fail and returns false
// OUTPUTS: false
console.log(fexec.remove(fn2));

// also removed functions will not be executed
// OUTPUTS:
// > FN1: Hello
fexec.execute('Hello');

// By default, if ever an error encountered, the execution will canceled and throws the error
const fexec2 = new FunctionExecutor();

const fn3 = () => { throw new Error('Encountered Error') };
fexec.add(fn1);
fexec.add(fn3);
fexec.add(fn2);

// NOTE: any functions that was added after the error function will not execute
// OUTPUTS:
// > FN1: Hello
// > Error: Encountered Error
// > (...stacktrace)
fexec.execute('Hello');

// to give all the functions a chance to execute, we will set the stopOnError to false
fexec.stopOnError = false;

let errors;

// OUTPUTS:
// > FN1: Hello
// > FN2: Hello
const errors = fexec.execute('Hello');

// if ever there are errors encountered, execute will return an array of errors instead of undefined
// OUTPUTS: [Error]
console.log(errors);






















