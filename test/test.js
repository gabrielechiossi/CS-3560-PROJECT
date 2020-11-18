const { string } = require('yargs');

const expect = require('chai').expect;
//const userInfo = require('../userInfo');

describe('userInfo', function(){
    it('puts together name and age', function(){
        expect(userInfo("Bob", "18"), "Bob 18");
    });
});

const userInfo = function(name, age) {
    return name + " " +age;
}

module.exports = userInfo;
