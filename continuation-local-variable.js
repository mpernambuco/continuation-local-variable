'use strict';

const async_hooks = require('async_hooks');
const fs = require('fs');
const util = require('util');

function debug(...args) {
  fs.writeSync(1, `${util.format(...args)}\n`);
}

class Variable {
  constructor(name) {
    var self = this;
    self.name = name;
    self.memo = {};
    self.value = undefined;
    self.hook =  async_hooks.createHook({
      init(asyncId, type, triggerAsyncId, resource) { self.save(asyncId); },
      before(asyncId) { self.restore(asyncId); },
      after(asyncId) { },
      destroy(asyncId) { self.destroy(asyncId); }
    });
    self.hook.enable();
  }

  set(value) { this.value = value; }

  get(value) { return this.value; }

  save(asyncId) { this.memo[asyncId] = this.value; }

  restore(asyncId) { this.value = this.memo[asyncId]; }

  destroy(asyncId) { delete this.memo[asyncId]; }
}

const VARIABLES = {};

module.exports = {
  create: function (name) {
    const variable = new Variable(name);
    VARIABLES[name] = variable;
    return variable;
  },
  find: function (name) {
    return VARIABLES[name];
  }
}



