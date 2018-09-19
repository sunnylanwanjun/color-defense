"use strict";
cc._RF.push(module, 'e669ftwgA1GvLG+WN49SpIt', 'Pool');
// scripts/Pool.js

"use strict";

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

cc.Class({
    ctor: function ctor() {
        this.useList = {};
        this.poolList = [];
        this.useIdx = 1;
    },
    destroy: function destroy() {
        for (var objKey in this.useList) {
            var obj = this.useList[objKey];
            if (obj && this._destroyFunc) {
                this._destroyFunc(obj);
            }
        }
        for (var objKey in this.poolList) {
            var obj = this.poolList[objKey];
            if (obj && this._destroyFunc) {
                this._destroyFunc(obj);
            }
        }
        this.useList = {};
        this.poolList = [];
        this.useIdx = 1;
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
    get: function get() {
        var obj = this.poolList.pop();
        if (!obj && this._buildFunc) {
            obj = this._buildFunc.apply(this, arguments);
        }
        if (obj) {
            obj.useFlag = this.useIdx;
            this.useIdx = this.useIdx + 1;
            this.useList[obj.useFlag] = obj;
        }
        return obj;
    },
    pushNoUseFlag: function pushNoUseFlag(obj) {
        if (this._resetFunc) {
            for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
                args[_key - 1] = arguments[_key];
            }

            this._resetFunc.apply(this, [obj].concat(_toConsumableArray(args)));
        }
        this.poolList.push(obj);
    },
    push: function push(obj) {
        var useFlag = obj.useFlag;
        if (!useFlag) {
            cc.error("Pool:push same obj");
            return;
        }
        delete this.useList[useFlag];
        delete obj.useFlag;
        if (this._resetFunc) {
            for (var _len2 = arguments.length, args = Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
                args[_key2 - 1] = arguments[_key2];
            }

            this._resetFunc.apply(this, [obj].concat(_toConsumableArray(args)));
        }
        this.poolList.push(obj);
    },
    reset: function reset() {
        for (var _len3 = arguments.length, args = Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
            args[_key3] = arguments[_key3];
        }

        for (var objKey in this.useList) {
            var obj = this.useList[objKey];
            if (obj) {
                if (this._resetFunc) {
                    this._resetFunc.apply(this, [obj].concat(_toConsumableArray(args)));
                }
                this.poolList.push(obj);
            }
        }
        this.useList = {};
    }
});

cc._RF.pop();