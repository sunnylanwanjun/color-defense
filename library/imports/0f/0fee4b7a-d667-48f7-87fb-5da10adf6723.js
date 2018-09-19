"use strict";
cc._RF.push(module, '0fee4t61mdI94f7XaEK32cj', 'PoolMgr');
// scripts/PoolMgr.js

"use strict";

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

cc.Class({
    ctor: function ctor() {
        this.map_useList = {};
        this.map_poolList = {}; //[]
        this.map_useIdx = {}; //0
    },
    destroy: function destroy() {
        for (var type in this.map_poolList) {
            var poolList = this.map_poolList[type];
            if (!poolList) continue;
            for (var type in poolList) {
                var obj = poolList[type];
                if (obj && this._destroyFunc) {
                    this._destroyFunc(type, obj);
                }
            }
        }
        for (var type in this.map_useList) {
            var useList = this.map_useList[type];
            if (!useList) continue;
            for (var type in useList) {
                var obj = useList[type];
                if (obj && this._destroyFunc) {
                    this._destroyFunc(type, obj);
                }
            }
        }
        this.map_useList = {};
        this.map_poolList = {}; //[]
        this.map_useIdx = {}; //0
    },
    setDestroyFunc: function setDestroyFunc(destroyFunc) {
        this._destroyFunc = destroyFunc;
    },
    setBuildFunc: function setBuildFunc(buildFunc) {
        this._buildFunc = buildFunc;
    },
    setResetFunc: function setResetFunc(resetFunc) {
        this._resetFunc = resetFunc;
    },
    get: function get(type) {
        this.map_poolList[type] = this.map_poolList[type] || [];
        this.map_useList[type] = this.map_useList[type] || {};

        var poolList = this.map_poolList[type];
        var useList = this.map_useList[type];

        var obj = poolList.pop();
        if (!obj && this._buildFunc) {
            for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
                args[_key - 1] = arguments[_key];
            }

            obj = this._buildFunc.apply(this, [type].concat(_toConsumableArray(args)));
        }
        if (obj) {
            if (this.map_useIdx[type] == undefined) this.map_useIdx[type] = 1;
            obj.useFlag = this.map_useIdx[type];
            this.map_useIdx[type] = this.map_useIdx[type] + 1;
            useList[obj.useFlag] = obj;
        }
        return obj;
    },
    pushNoUseFlag: function pushNoUseFlag(type, obj) {
        this.map_poolList[type] = this.map_poolList[type] || [];
        var poolList = this.map_poolList[type];
        if (this._resetFunc) {
            for (var _len2 = arguments.length, args = Array(_len2 > 2 ? _len2 - 2 : 0), _key2 = 2; _key2 < _len2; _key2++) {
                args[_key2 - 2] = arguments[_key2];
            }

            this._resetFunc.apply(this, [type, obj].concat(_toConsumableArray(args)));
        }
        poolList.push(obj);
    },
    push: function push(type, obj) {
        this.map_poolList[type] = this.map_poolList[type] || [];
        this.map_useList[type] = this.map_useList[type] || {};

        var poolList = this.map_poolList[type];
        var useList = this.map_useList[type];

        var useFlag = obj.useFlag;
        if (!useFlag) {
            cc.error("PoolMgr:push same obj");
            return;
        }
        delete useList[useFlag];
        delete obj.useFlag;
        if (this._resetFunc) {
            for (var _len3 = arguments.length, args = Array(_len3 > 2 ? _len3 - 2 : 0), _key3 = 2; _key3 < _len3; _key3++) {
                args[_key3 - 2] = arguments[_key3];
            }

            this._resetFunc.apply(this, [type, obj].concat(_toConsumableArray(args)));
        }
        poolList.push(obj);
    },
    reset: function reset(type) {
        this.map_poolList[type] = this.map_poolList[type] || [];
        this.map_useList[type] = this.map_useList[type] || {};

        var poolList = this.map_poolList[type];
        var useList = this.map_useList[type];

        for (var _len4 = arguments.length, args = Array(_len4 > 1 ? _len4 - 1 : 0), _key4 = 1; _key4 < _len4; _key4++) {
            args[_key4 - 1] = arguments[_key4];
        }

        for (var objKey in useList) {
            var obj = useList[objKey];
            if (obj) {
                if (this._resetFunc) {
                    this._resetFunc.apply(this, [type, obj].concat(_toConsumableArray(args)));
                }
                poolList.push(obj);
            }
        }
        this.map_useList[type] = {};
    },
    getUse: function getUse(type) {
        var useList = this.map_useList[type];
        return useList;
    },
    resetAll: function resetAll() {
        for (var _len5 = arguments.length, args = Array(_len5), _key5 = 0; _key5 < _len5; _key5++) {
            args[_key5] = arguments[_key5];
        }

        for (var type in this.map_poolList) {
            this.reset.apply(this, [type].concat(_toConsumableArray(args)));
        }
    }
});

cc._RF.pop();