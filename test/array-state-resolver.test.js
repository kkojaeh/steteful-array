import StatefulArray from "../src/stateful-array";
describe('add', function () {
    var array;
    beforeEach(function () {
        array = new StatefulArray([{a : 2}], ['a', 'b']);
        array._stateResolvers = [function(target, added, removed, property, value){
        	if(added){
        		return 'added';
        	}
        	console.log('a', removed);
        	if(removed){
        		return 'removed';
        	}
        }];
    });
    it('추가하면 해당 객체의 상태가 `added` 로 표시', function () {
    	var o = array.push({ a : 1});
        expect(array[1][array._proxyStateProperty]).toBe('added');
    });
    
    it('제거하면 해당 객체의 상태가 `removed` 로 표시', function () {
    	var o = array.shift();
    	
        expect(o[array._proxyStateProperty]).toBe('removed');
    });
});