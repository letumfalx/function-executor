// import FunctionExecutor from '@letumfalx/function-executor';
const FunctionExecutor = require("./lib").default;


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
fexec2.add(fn1);
fexec2.add(fn3);
fexec2.add(fn2);

// NOTE: any functions that was added after the error function will not execute
// OUTPUTS:
// > FN1: Hello
// > Error: Encountered Error
// > (...stacktrace)
// fexec2.execute('Hello');

// to give all the functions a chance to execute, we will set the stopOnError to false
fexec2.stopOnError = false;

// OUTPUTS:
// > FN1: Hello
// > FN2: Hello
const errors = fexec2.execute('Hello');

// if ever there are errors encountered, execute will return an array of errors instead of undefined
// OUTPUTS: [Error]
console.log(errors);

// we can also set the stopOnError on creation by passing it on the constructor
const fexec3 = new FunctionExecutor(false);

// if we want to check if function is already in the list, we can do it by passing the function to its contains method
// OUTPUTS: false
console.log(fexec3.contains(fn1));
