(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD
        define(['stateful-array'], factory);
    } else if (typeof exports === 'object') {
        // Node, CommonJS-like
        module.exports = factory(require('stateful-array'));
    } else {
        // Browser globals (root is window)
        root.CrudArray = factory(root.StatefulArray);
    }
}(this, function(StatefulArray) {
    'use strict';
    /**
     * CrudArray 의 생성자
     * Initialize `CrudArray`
     *
     * @param {Array|Undefined} array
     * @return {StatefulArray}
     * @api public
     */

    function CrudArray(array) {
        StatefulArray.prototype.constructor.apply(this, Array.prototype.slice(arguments));
        this._proxyChanged = {};
    }

    CrudArray.prototype = new StatefulArray();

    /**
     * Proxy 객체 변경 부분을 저장
     * @type {Object<String,Object>}
     * @api private
     */
    CrudArray.prototype._proxyChanged = null;

    var createResolver = function(){};
    var deleteResolver = function(){};
    var updateResolver = function(){};
    var readResolver = function(){};

    StatefulArray.prototype.stateResolvers = []

    return CrudArray;

}));