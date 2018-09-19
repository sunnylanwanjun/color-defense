"use strict";
cc._RF.push(module, '195a2CyCOVMI5NtZWs10PK9', 'EntityPoint');
// scripts/node/entity/EntityPoint.js

"use strict";

cc.Class({
    extends: require("EntityBase"),
    ctor: function ctor() {
        this.curPassData = cc.passData.getCurPassData();
        var sp = this.addComponent(cc.Sprite);
        sp.spriteFrame = this.gameui.getSpriteFrame("ui-circle");
        var labelNode = new cc.Node();
        this.addChild(labelNode);
        this.label = labelNode.addComponent(cc.Label);
    },
    initGameData: function initGameData() {
        this._super();
    },
    initEntity: function initEntity(idx, roadIdx, pointIdx) {
        this._super();
        this.myType = "pass";
        this.myIdx = idx;

        this.roadIdx = roadIdx;
        this.pointIdx = pointIdx;

        this.myProperty = "roadMap@" + roadIdx + "@" + pointIdx;
        this.myPropertyArr = this.myProperty.split("@");
        this.updateProperty();
    },
    unInitEntity: function unInitEntity() {
        this._super();
    },
    updateProperty: function updateProperty(property) {
        this._super(property);
        if (property && (property.indexOf("@x") != -1 || property.indexOf("@y") != -1)) {
            cc.editData.modifyPoint(this.myIdx, this.roadIdx, this.pointIdx);
        } else {
            this.label.string = this.roadIdx + "|" + this.pointIdx;
        }
    },
    keyHandle: function keyHandle(keyCode) {
        switch (keyCode) {
            case cc.KEY.Delete:
                cc.editData.deletePoint(this.myIdx, this.roadIdx, this.pointIdx);
                break;
        }
    }
});

cc._RF.pop();