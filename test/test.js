
const expect = require('chai').expect;
//const userInfo = require('../userInfo');

describe('userInfo', function(){
    it('puts together name and age', function(){
        expect(userInfo("Bob", "18"), "Bob 18");
    });

    it('check if the parameter are empty', function(){
        expect(userInfo("", ""), false);
    });
});

const userInfo = function(name, age) {
    if(typeof name === 'string' && typeof age === 'string'){
        return name + " " + age;
    }else if(name === null && age === null){
        return false;
    }
}

module.exports = userInfo;
