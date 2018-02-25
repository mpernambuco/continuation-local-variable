# continuation-local-variable
Variables scoped by a chain of asynchrounous calls

## How it works

```js
    const Variable = require('continuation-local-variable');

    const User = Variable.create('user');
    User.set("Moe");

    setTimeout(function() {
      print(Variable.find('user').value());  // prints 'Moe'
    }, 1000);

    // User name will be 'Larry' for the chain of async operations
    // starting with `setTimeout`
    User.set("Larry"); sets
    setTimeout(function() {
      print(Variable.find('user').value());  // prints 'Larry'
      // http request
      axios.get('http://www.github.com').then(() => {
        print(Variable.find('user').value());  // still prints 'Larry'
      })
    }, 500);

    // User name is 'Curly' for the async chain starting with the next `setTimeout`
    User.set("Curly");
    setTimeout(function() {
      print(Variable.find('user').value());  // prints 'Curly'
      process.nextTick(() => {
        print(Variable.find('user').value());  // prints 'Curly'
      });
    }, 500);

```

## Requirements

NodeJS 8.9 or above

## API  Reference

### Variable.create(variableName)
Creates a new async scoped variable

### Variable.find(variableName)
Finds an existing variable

### Variable.set(value)
Sets the value of the variable.
This value will hold for the duration of the next asynchronous call chain.

### Variable.get()
Returns the value of this variable.








