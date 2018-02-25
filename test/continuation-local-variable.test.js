'use strict';

const chai = require('chai');
const fs = require('fs');
const axios = require('axios');
const util = require('util');
const Variable = require('../continuation-local-variable');

chai.should();

// debug won't start any async operation
function debug(...args) {
  fs.writeSync(1, `${util.format(...args)}\n`);
}

describe('AsyncScope', () => {
  it('preserves scope during multiple interwoven async call chains', function () {
    const User = Variable.create('user');
    let pending=3;
    return new Promise(function(resolve, reject) {
      User.set("Moe");
      setTimeout(function() {
        const name = Variable.find('user').get();
        debug('Moe: ', name);
        name.should.eql("Moe");
        if (--pending == 0) resolve();
      }, 1000);

      User.set("Larry");
      setTimeout(function() {
        const name = Variable.find('user').get()
        debug('Larry: ', name);
        name.should.eql("Larry");
        axios.get('http://www.github.com').then(() => {
          const name2 = Variable.find('user').get();
          debug('Larry after http request: ', name2);
          name2.should.eql("Larry");
          if (--pending == 0) resolve();
        })
      }, 500);

      User.set("Curly");
      setTimeout(function() {
        const name = Variable.find('user').get();
        debug('Curly: ', name);
        name.should.eql("Curly");
        process.nextTick(() => {
          const name2 = Variable.find('user').get();
          debug('Curly after nextTick: ', name2);
          name2.should.eql("Curly");
          if (--pending == 0) resolve();
        });
      }, 500);
    });
  });
});
