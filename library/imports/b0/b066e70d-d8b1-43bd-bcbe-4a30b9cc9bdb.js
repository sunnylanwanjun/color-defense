"use strict";
cc._RF.push(module, 'b066ecN2LFDvby+SjC5zJvb', 'Unique');
// scripts/Unique.js

"use strict";

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

cc.Class({
    ctor: function ctor() {
        this.recordMap = {};
    },
    setBuildFunc: function setBuildFunc(buildFunc) {
        this._buildFunc = buildFunc;
    },
    setResetFunc: function setResetFunc(resetFunc) {
        this._resetFunc = resetFunc;
    },
    reset: function reset() {
        for (var key in this.recordMap) {
            var record = this.recordMap[key];
            if (record && this._resetFunc) {
                this._resetFunc(record.obj);
            }
        }
        this.recordMap = {};
    },
    add: function add(type) {
        var record = this.recordMap[type];
        if (record) {
            record.count++;
            return record.obj;
        }

        for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
            args[_key - 1] = arguments[_key];
        }

        var obj = this._buildFunc.apply(this, [type].concat(_toConsumableArray(args)));
        this.recordMap[type] = { obj: obj, count: 1 };
        return obj;
    },
    sub: function sub(type) {
        var record = this.recordMap[type];
        if (!record) {
            return;
        }
        record.count--;
        if (record.count <= 0) {
            if (this._resetFunc) {
                for (var _len2 = arguments.length, args = Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
                    args[_key2 - 1] = arguments[_key2];
                }

                this._resetFunc.apply(this, [record.obj].concat(_toConsumableArray(args)));
            }
            delete this.recordMap[type];
        }
    }
});

cc._RF.pop();