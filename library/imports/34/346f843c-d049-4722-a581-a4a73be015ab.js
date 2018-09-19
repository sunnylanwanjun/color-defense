"use strict";
cc._RF.push(module, '346f8Q80ElHIqWBpKc74BWr', 'MyTimer');
// scripts/MyTimer.js

"use strict";

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

cc.Class({
    ctor: function ctor() {
        this.__instanceId = cc.ClassManager.getNewInstanceId();
        this.timerHandle = {};
        this.timerIdx = 1;
        this.timerTypeRecord = {};
    },
    once: function once(func, delay, timerType) {
        for (var _len = arguments.length, args = Array(_len > 3 ? _len - 3 : 0), _key = 3; _key < _len; _key++) {
            args[_key - 3] = arguments[_key];
        }

        return this.loop.apply(this, [func, delay, 1, timerType].concat(_toConsumableArray(args)));
    },
    loop: function loop(func, delay, times, timerType) {
        for (var _len2 = arguments.length, args = Array(_len2 > 4 ? _len2 - 4 : 0), _key2 = 4; _key2 < _len2; _key2++) {
            args[_key2 - 4] = arguments[_key2];
        }

        if (!func) {
            cc.log("Timer:loop func is null");
            return;
        }

        var curTimerIdx = this.timerIdx++;
        var callTimes = 0;
        var callback = function callback() {
            callTimes++;
            if (callTimes >= times) {
                this.removeByIdx(curTimerIdx, timerType);
            }
            func.apply(undefined, _toConsumableArray(args));
        };

        if (timerType) {
            this.timerTypeRecord[timerType] = this.timerTypeRecord[timerType] || {};
            this.timerTypeRecord[timerType][curTimerIdx] = true;
        }
        this.timerHandle[curTimerIdx] = { callback: callback };
        if (!times) {
            times = cc.macro.REPEAT_FOREVER;
        }
        cc.director.getScheduler().schedule(callback, this, delay, times, delay, false);
        return curTimerIdx;
    },
    removeByIdx: function removeByIdx(timerIdx, timerType) {
        if (timerType && this.timerTypeRecord[timerType]) {
            delete this.timerTypeRecord[timerType][timerIdx];
        }
        if (!timerIdx) return;
        var callbackInfo = this.timerHandle[timerIdx];
        if (!callbackInfo) return;
        cc.director.getScheduler().unschedule(callbackInfo.callback, this);
        delete this.timerHandle[timerIdx];
    },
    removeByType: function removeByType(timerType) {
        var tmp = [];
        var timerTypeRecord = this.timerTypeRecord[timerType];
        for (var timerIdx in timerTypeRecord) {
            if (timerTypeRecord[timerIdx]) {
                tmp.push(timerIdx);
            }
        }
        for (var key in tmp) {
            if (tmp[key]) {
                this.removeByIdx(tmp[key], timerType);
            }
        }
        delete this.timerTypeRecord[timerType];
    }
});

cc._RF.pop();