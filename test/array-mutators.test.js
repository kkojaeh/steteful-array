describe('array', function () {
    var array;
    beforeEach(function () {
        array = new StatefulArray();
    });
    it('생성인자가 없다면 비어 있는 Array 와 동일', function () {
        expect(array.length).toBe(0);
    });

    it('생성 인자에 Array 를 전달하면 Array 와 동일', function () {
        array = new StatefulArray(['1', '2', '3']);
        expect(array.length).toBe(3);
        expect(array[0]).toBe('1');
        expect(array[1]).toBe('2');
        expect(array[2]).toBe('3');
    });

    describe('pop', function () {
        it('Array 의 pop() 와 동일하게 동작', function () {
            array.push('1', '2');
            var val = array.pop();
            expect(val).toBe('2');
            expect(array[0]).toBe('1');
            expect(array.length).toBe(1);
        });
    });

    describe('push', function () {
        it('Array 의 push() 와 동일하게 동작', function () {
            array.push('1', '2');
            expect(array.length).toBe(2);
        });
    });

    describe('shift', function () {
        it('Array 의 shift() 와 동일하게 동작', function () {
            array.push('1', '2');
            var shifted = array.shift();
            expect(shifted).toBe('1');
            expect(array.length).toBe(1);
        });
    });

    describe('unshift', function () {
        it('Array 의 shift() 와 동일하게 동작', function () {
            var result = array.unshift('1', '2');

            expect(result).toBe(2);
            expect(array[0]).toBe('1');
            expect(array[1]).toBe('2');
            expect(array.length).toBe(2);
        });
    });

    describe('splice', function () {
        it('Array 의 splice() 와 동일하게 동작', function () {
            array.push('1', '2', '3', '4');
            var result = array.splice(1, 2, '2-1', '3-1');
            expect(result[0]).toBe('2');
            expect(result[1]).toBe('3');
            expect(array[0]).toBe('1');
            expect(array[1]).toBe('2-1');
            expect(array[2]).toBe('3-1');
            expect(array[3]).toBe('4');
            expect(array.length).toBe(4);
        });
    });
});