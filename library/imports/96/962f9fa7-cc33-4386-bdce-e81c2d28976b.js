"use strict";
cc._RF.push(module, '962f9+nzDNDhr3O6BwtKJdr', 'Loading');
// scripts/component/Loading.js

"use strict";

cc.Class({
    extends: cc.Component,

    properties: {},

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start: function start() {
        this.curNum = 0;
        this.totalNum = 0;
    },
    onDestroy: function onDestroy() {},
    setProgress: function setProgress(curNum, totalNum) {
        this.curNum = curNum;
        this.totalNum = totalNum;
    },
    update: function update(dt) {}
});

cc._RF.pop();