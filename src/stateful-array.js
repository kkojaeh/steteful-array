/**
 * StatefulArray 의 생성자 Initialize `StatefulArray`
 * 
 * @param {Array|Undefined}
 *            array
 * @return {StatefulArray}
 * @api public
 */

function StatefulArray(array, properties) {
    this._defaultId = this._generateDefaultId();
    this._proxyStates = {};
    this._proxyProperties = properties || [];
    array = array || [];

    if (Array.isArray(array)) {
        // create array-like object
        var length = this.length = array.length;
        for (var i = 0; i < length; i++) {
            this[i] = this._wrap(array[i]);
        }
    }
    this.on('add', this._onAdd);
    this.on('remove', this._onRemove);
}

StatefulArray.prototype = new Array();

Emitter(StatefulArray.prototype);

/**
 * 마지막 요소를 제거하고 해당 요소를 리턴한다. Removes the last element from an array and
 * returns that element
 * 
 * @return {Mixed} removed element
 * @api public
 */

StatefulArray.prototype.pop = function () {
    var ret = Array.prototype.pop.apply(this, arguments);
    this.emit('remove', ret, this.length);
    this.emit('change');
    return ret;
};

/**
 * Array 의 마지막에 값을 삽입하고 Array 의 길이를 반환한다. Push a value onto the end of the
 * array, returning the length of the array
 * 
 * @param {Mixed,
 *            ...} elements
 * @return {Number}
 * @api public
 */

StatefulArray.prototype.push = function () {
	var args = [].slice.call(arguments);
	for (var i = 0; i < args.length; i++) {
        args[i] = this._wrap(args[i]);
    }
    var ret = Array.prototype.push.apply(this, args);
    for (var i = 0, len = args.length; i < len; i++) this.emit('add', args[i], ret - len + i);
    this.emit('change');
    return ret;
};

/**
 * 첫번째 요소를 삭제하고 삭제된 요소를 반환한다. Removes the first element from an array and
 * returns that element.
 * 
 * @return {Mixed}
 * @api public
 */

StatefulArray.prototype.shift = function () {
    var ret = Array.prototype.shift.apply(this, arguments);
    this.emit('remove', ret, 0);
    this.emit('change');
    return ret;
};

/**
 * Array 에서 요소들을 추가 또는 삭제하고 삭제된 요소를 반환한다. Adds and/or removes elements from
 * an array.
 * 
 * @param {Number}
 *            index
 * @param {Number}
 *            howMany
 * @param {Mixed,
 *            ...} elements
 * @return {Array} removed elements
 * @api public
 */

StatefulArray.prototype.splice = function (index) {
    var ret = Array.prototype.splice.apply(this, arguments),
        added = [].slice.call(arguments, 2);
    for (var i = 0; i < added.length; i++) {
        added[i] = this._wrap(added[i]);
    }
    for (var i = 0, len = ret.length; i < len; i++) this.emit('remove', ret[i], index);
    for (i = 0, len = added.length; i < len; i++) this.emit('add', added[i], index + i);
    this.emit('change');
    return ret;
};

/**
 * 단수 또는 복수의 요소를 Array의 앞에 삽입하고 변경된 Array의 길이를 반환한다. Adds one or more
 * elements to the front of an array and returns the new length of the
 * array.
 * 
 * @param {Mixed,
 *            ...} elements
 * @return {Number} length
 * @api public
 */
StatefulArray.prototype.unshift = function () {
    var ret = Array.prototype.unshift.apply(this, arguments),
        args = [].slice.call(arguments);
    for (var i = 0; i < args.length; i++) {
        args[i] = this._wrap(args[i]);
    }
    for (var i = 0, len = args.length; i < len; i++) this.emit('add', args[i], i);
    this.emit('change');
    return ret;
};

/**
 * 프로퍼티의 값 대입에 대한 처리를 담당한다.
 * 
 * @param {Mixed}
 *            target 대입된 대상
 * @param {String}
 *            property 대입된 프로퍼티
 * @param {Object}
 *            value 대입된 값
 * @api private
 */
StatefulArray.prototype._proxySetter = function (target, property, value) {
    // TODO: 변경에 대한 처리
};

/**
 * 프로퍼티의 값에 대한 접근 처리를 담당한다.
 * 
 * @param {Mixed}
 *            target 접근된 대상
 * @param {String}
 *            property 접근된 프로퍼티
 * @api private
 */
StatefulArray.prototype._proxyGetter = function (me, target, id, property) {
    if (property == me._proxyStateProperty) {
    	return me._proxyStates[id];
    } else if (property == me._proxyIdProperty) {
        return id;
    } else if (property == me._proxyOwnerProperty) {
        return me;
    }
    return target[property];
};

/**
 * 전달된 요소가 Object 타입일 경우 Proxy 를 생성하여 대입/접근에 대한 처리가 수반하고 Proxy 또는 전달된 요소 그대로
 * 반환한다.
 * 
 * @param {Mixed}
 *            element 요소
 * @api private
 */
StatefulArray.prototype._wrap = function(element) {
    var me = this,
	setter = me._proxySetter,
    getter = me._proxyGetter,
    proxyIdProperty = me._proxyIdProperty,
    proxyStateProperty = me._proxyStateProperty,
    proxyOwnerProperty = me._proxyOwnerProperty,
    proxyProperties = me._proxyProperties;

// Object 타입이고 소유자가 내가 아니라면 Proxy 생성
if ((typeof element) == 'object' && element[this._proxyOwnerProperty] != this) {
    var id = me._generateId();
    proxyProperties.concat([proxyIdProperty, proxyOwnerProperty, proxyStateProperty]).forEach(function(property){
    	if(!element.hasOwnProperty(property)){
    		element[property] = undefined;
    	}
    });
    return new Proxy(element, {
        set(target, property, value) {
            setter(me, target, property, value);
            target[property] = value;
        },
        get(target, property) {
            return getter(me, target, id, property);
        },
    });
}
return element;
}



/**
 * Proxy 객체의 소유자를 반환한는 프로퍼티 이름
 * 
 * @api private
 */
StatefulArray.prototype._proxyOwnerProperty = "_owner_";


/**
 * Proxy 객체의 상태를 반환한는 프로퍼티 이름
 * 
 * @api private
 */
StatefulArray.prototype._proxyStateProperty = "_state_";

/**
 * Proxy 객체의 아이디를 반환한는 프로퍼티 이름
 * 
 * @api private
 */
StatefulArray.prototype._proxyIdProperty = "_id_";

/**
 * 요소에 대한 상태를 정의 한다. <code>_stateResolvers</code> 에 정의된 함수에 의해 상태가 결정 된다.
 * 
 * @param {Mixed}
 *            element 요소
 * @api private
 */
StatefulArray.prototype._reesolveState = function (target, added, removed, property, value) {
    var result;
    if (this._stateResolvers) {
        for (var i = 0; i < this._stateResolvers.length; i++) {
            result = this._stateResolvers[i].apply(this, [target, added, removed, property, value]);
            if (result) {
                this._proxyStates[target[this._proxyIdProperty]] = result;
                break;
            }
        }
    }
};

/**
 * 요소에 대한 상태를 정의하는 함수의 배열로 <code>_reesolveState</code> 호출시에 실행되며 순차적으로
 * 실행되어 return 값이 존재하면 해당 값으로 상태값이 지정된다.
 * 
 * 상태를 정의하는 함수는 아래와 같으 형태를 갖는다. function(target, added, removed, property,
 * value) { }
 * 
 * @type {Array<Function>} element 요소
 * @api private
 */
StatefulArray.prototype._stateResolvers = [];

/**
 * StatefulArray 인스턴스의 유일한 아이디이며 Proxy 에 부여되는 아이디 조합에 사용된다.
 * 
 * @type {String}
 * @api private
 */
StatefulArray.prototype._defaultId = null;

/**
 * Proxy 에 부여되는 아이디 조합에 <code>_defaultId</code> 속성과 연관되어 사용된다.
 * 
 * @type {Number}
 * @api private
 */
StatefulArray.prototype._sequence = 0;

/**
 * StatefulArray 인스턴스의 유일한 아이디를 생성하는 메소드 생성시 호출 된다.
 * 
 * @return {String} 유일한 아이디
 * @api private
 */
StatefulArray.prototype._generateDefaultId = function () {
    var now = Date.now();
    if (window.performance && typeof window.performance.now === "function") {
        now += performance.now();
    }
    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = (now + Math.random() * 16) % 16 | 0;
        now = Math.floor(now / 16);
        return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
    return uuid;
}

/**
 * StatefulArray 인스턴스의 유일한 아이디를 생성하는 메소드 생성시 호출 된다.
 * 
 * @return {String} 유일한 아이디
 * @api private
 */
StatefulArray.prototype._generateId = function () {
    var sequence = ++this._sequence;
    return this._defaultId + "-" + sequence;
}

/**
 * Proxy 객체 변경 부분을 저장
 * 
 * @type {Object<String,Object>}
 * @api private
 */
StatefulArray.prototype._proxyStates = null;

/**
 * Proxy 객체의 프로퍼티 목록을 지정한다.
 * 지정되지 않은 프로퍼티에 대입하면 오류가 발생된다.
 * 
 * @type {Array<String>}
 * @api private
 */
StatefulArray.prototype._proxyProperties = null;

/**
 * Proxy 객체 상태 및 데이트를 초기화한다.
 * 
 * @api public
 */
StatefulArray.prototype.clear = function () {

};

/**
 * 요소가 추가될때 발생되는 이벤트의 리스너
 * @api private
 */
StatefulArray.prototype._onAdd = function(element, index) {
	this._reesolveState(element, true, false);
}
/**
 * 요소가 삭제될때 발생되는 이벤트의 리스너
 * @api private
 */
StatefulArray.prototype._onRemove = function(element, index){
	this._reesolveState(element, false, true);
}

StatefulArray.propertyTypes = {
	'string' : {
		convert: function(v) {
	        return (v === undefined || v === null) ? v : String(v);
	    },
	    equals: function(v1, v2){
	    	return v1 == v2;
	    }
	},
	'non-null-string' : {
		convert: function(v) {
	        return (v === undefined || v === null) ? '' : String(v);
	    },
	    equals: function(v1, v2){
	    	return v1 == v2;
	    }
	},
	'int' : {
		convert: function(v) {
	        if (typeof v === 'number') {
	            return parseInt(v, 10);
	        }
	 
	        var empty = v === undefined || v === null || v === '',
	            out;
	 
	        if (empty) {
	            out = null;
	        }  else {
	            out = parseInt(String(v), 10);
	            if (isNaN(out)) {
	                out = null;
	            }
	        }
	        return out;
	    },
	    equals: function(v1, v2){
	    	return parseInt(v1, 10) == parseInt(v2, 10);
	    }
	},
	'non-null-int' : {
		convert: function(v) {
	        if (typeof v === 'number') {
	            return parseInt(v, 10);
	        }
	 
	        var empty = v === undefined || v === null || v === '',
	            out;
	 
	        if (empty) {
	            out = 0;
	        }  else {
	            out = parseInt(String(v), 10);
	            if (isNaN(out)) {
	                out = 0;
	            }
	        }
	        return out;
	    },
	    equals: function(v1, v2){
	    	return parseInt(v1, 10) == parseInt(v2, 10);
	    }
	},
	'number' : {
		convert: function(v) {
	        if (typeof v === 'number') {
	            return parseInt(v);
	        }
	 
	        var empty = v === undefined || v === null || v === '',
	            out;
	 
	        if (empty) {
	            out = null;
	        }  else {
	            out = parseFloat(String(v));
	            if (isNaN(out)) {
	                out = null;
	            }
	        }
	        return out;
	    },
	    equals: function(v1, v2){
	    	return parseFloat(v1, 10) == parseFloat(v2, 10);
	    }
	},
	'non-null-number' : {
		convert: function(v) {
	        if (typeof v === 'number') {
	            return parseFloat(v);
	        }
	 
	        var empty = v === undefined || v === null || v === '',
	            out;
	 
	        if (empty) {
	            out = 0;
	        }  else {
	            out = parseFloat(String(v));
	            if (isNaN(out)) {
	                out = 0;
	            }
	        }
	        return out;
	    },
	    equals: function(v1, v2){
	    	return parseFloat(v1) == parseFloat(v2);
	    }
	},
	
	'date' : {
		convert: function(v) {
			if (!v) {
	            return null;
	        }
	 
	        if (v instanceof Date) {
	            return v;
	        }
	 
	        var parsed = Date.parse(v);
	        return parsed ? new Date(parsed) : null;
	    },
	    equals: function(v1, v2){
	    	if(!v1 && !v2){
	    		return true;
	    	}
	    	if(!v1 || !v2){
	    		return false;
	    	}
	    	const gap = 1000 * 60 * 60 * 24;
	    	return Math.floor(v1.getTime() / gap) == Math.floor(v2.getTime() /gap)
	    }
	}
	
	Math.floor(a.getTime() / gap) == Math.floor(b.getTime() /gap)
}

export default StatefulArray;