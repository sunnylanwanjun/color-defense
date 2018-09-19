"use strict";
cc._RF.push(module, '8f398C/intD1rqEg5URRMQw', 'EntityFloor');
// scripts/node/entity/EntityFloor.js

"use strict";

cc.Class({
    extends: require("EntityBase"),
    ctor: function ctor() {
        var sp = this.addComponent(cc.Sprite);
        sp.spriteFrame = this.gameui.getSpriteFrame("ui-circle");
    },
    clickFloor: function clickFloor() {
        cc.globalEvent.emit("Game:createTower", this);
    },
    initGameData: function initGameData() {
        this._super();
    },
    initEntity: function initEntity(idx, floorIdx) {
        this._super();

        if (cc.resMgr.curSceneName != 'editor') {
            this.on('touchend', this.clickFloor, this);
        }

        this.myType = "pass";
        this.myIdx = idx;
        this.floorIdx = floorIdx;
        this.myProperty = "floorArr@" + floorIdx;
        this.myPropertyArr = this.myProperty.split("@");
        this.floorInfo = cc.configData.passAll.floorInfo;
        this.updateProperty();
    },
    unInitEntity: function unInitEntity() {
        this._super();

        if (cc.resMgr.curSceneName != 'editor') {
            this.off('touchend', this.clickFloor, this);
        }
    },
    judgeProperty: function judgeProperty(property) {
        if (property && this.myProperty) {
            if (property.indexOf(this.myProperty) == -1 && this.myProperty.indexOf(property) == -1 && property.indexOf("floorInfo") == -1) {
                return false;
            }
        }
        return true;
    },
    updateProperty: function updateProperty(property) {
        if (!this._super(property)) {
            return false;
        }
        if (property && property.indexOf("floorInfo") != -1) {
            this.setContentSize(this.floorInfo.w, this.floorInfo.h);
            return false;
        }
        return true;
    },
    keyHandle: function keyHandle(keyCode) {
        switch (keyCode) {
            case cc.KEY.Delete:
                cc.editData.deleteFloor(this.myIdx, this.floorIdx);
                break;
        }
    }
});

cc._RF.pop();