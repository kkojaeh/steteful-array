import StatefulArray from "stateful-array";

class CrudArray extends StatefulArray{
	constructor(array = []){
		super(array);
		/**
         * Proxy 객체 변경 부분을 저장
         * @type {Object<String,Object>}
         * @api private
         */
		this._proxyChanged = {};
		let createResolver = function(){};
		let deleteResolver = function(){};
		let updateResolver = function(){};
		let readResolver = function(){};
	}
}

export default CrudArray;