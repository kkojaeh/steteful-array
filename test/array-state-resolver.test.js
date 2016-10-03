'use strict';
import StatefulArray from "../src/stateful-array";
describe('add', function () {
    var array;
    beforeEach(function () {
        array = new StatefulArray();
        array._stateResolvers = [function(target, added, removed, property, value){
        	if(added){
        		return 'added';
        	}
        	if(removed){
        		return 'removed';
        	}
        }];
    });
    it('추가하면 해당 객체의 상태가 `added` 로 표시', function () {
    	array.push({ a : 1});
    	console.log(array[0]);
        expect(array[0][array._proxyStateProperty]).toBe('added');
    });
});