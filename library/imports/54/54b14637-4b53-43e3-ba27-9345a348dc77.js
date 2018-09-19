"use strict";
cc._RF.push(module, '54b14Y3S1ND47onk0WjSNx3', 'CurData');
// scripts/data/CurData.js

"use strict";

cc.Class({
    ctor: function ctor() {},

    //////////////////////////////////////////////////////////////
    //游戏配置
    initConfigData: function initConfigData(passIdx) {
        this.passIdx = passIdx;
        this.configData = cc.configData.getPassRow(passIdx);

        this.initGameData();
    },
    initGameData: function initGameData() {}
});

cc._RF.pop();