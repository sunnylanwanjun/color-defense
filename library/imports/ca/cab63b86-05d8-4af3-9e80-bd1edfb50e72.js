"use strict";
cc._RF.push(module, 'cab63uGBdhK856AvR7ftQ5y', 'PassData');
// scripts/data/PassData.js

"use strict";

cc.Class({
    ctor: function ctor() {},
    init: function init(GameDataClass) {
        this.passAll = cc.resMgr.getRes(cc.resName.passAll);
        this.passTpl = cc.resMgr.getRes(cc.resName.passTpl);
        this.curPassData = new GameDataClass();
    },
    changePass: function changePass(passIdx) {
        cc.log("PassData:changePass", passIdx);
        if (this.passAll.passArr[passIdx]) {
            this.initCurPassData(passIdx);
        } else {
            var newPass = cc.utils.clone(this.passTpl.perPassTpl);
            newPass.idx = this.getPassCount();
            this.passAll.passArr.push(newPass);
            this.initCurPassData(passIdx);
        }
        cc.globalEvent.emit("PassData:changePass", passIdx);
    },
    initCurPassData: function initCurPassData(passIdx) {
        this.curPassData.initConfigData(passIdx);
        cc.userData.savePass(passIdx);
    },
    getPassCount: function getPassCount() {
        return this.passAll.passArr.length;
    },
    getCurPassData: function getCurPassData() {
        return this.curPassData;
    },
    getCurPassIdx: function getCurPassIdx() {
        return this.curPassData.passIdx;
    }
});

cc._RF.pop();