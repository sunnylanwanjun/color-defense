"use strict";
cc._RF.push(module, 'be2f6s0JApP6JwTdkM7qBen', 'EntityTarget');
// scripts/node/entity/EntityTarget.js

"use strict";

cc.Class({
    extends: require("EntityBase"),
    ctor: function ctor() {
        this.group = "target";

        this.baseNode = new cc.Node();
        this.baseNode.parent = this;

        var PoolMgr = require("PoolMgr");
        this.poolMgr = new PoolMgr();
        this.poolMgr.setBuildFunc(function (skinType, skinInfo) {
            var skinNode = cc.skinMgr.getSkin(skinInfo);
            skinNode.setCompleteCallback(function () {
                this.poolMgr.push(skinType, skinNode);
            }.bind(this));
            skinNode.parent = this.baseNode;
            return skinNode;
        }.bind(this));
        this.poolMgr.setResetFunc(function (skinType, skinNode) {
            skinNode.active = false;
        }.bind(this));

        var labelNode = new cc.Node();
        labelNode.color = cc.color(255.0, 0);
        this.addChild(labelNode);
        this.label = labelNode.addComponent(cc.Label);
    },
    initGameData: function initGameData() {
        this._super();
    },
    initEntity: function initEntity(idx, targetIdx) {
        this._super();
        this.curPassData = cc.passData.getCurPassData();

        cc.globalEvent.on("CurData:initGameData", this.updateHp, this);
        cc.globalEvent.on("CurData:changeCampHp", this.updateHp, this);
        this.myType = "pass";
        this.myIdx = idx;
        this.targetIdx = targetIdx;
        this.myProperty = "targetArr@" + targetIdx;
        this.myPropertyArr = this.myProperty.split("@");
        this.updateProperty();
    },
    unInitEntity: function unInitEntity() {
        this._super();
        cc.globalEvent.off("CurData:initGameData", this.updateHp, this);
        cc.globalEvent.off("CurData:changeCampHp", this.updateHp, this);
    },
    updateHp: function updateHp(event) {
        if (event && event.detail) {
            var detail = event.detail;
            if (detail.camp != undefined && detail.camp != this.propValue.camp) {
                return;
            }
        }
        var passGameData = this.curPassData.gameData;
        var campMap = passGameData.campMap;
        this.label.string = campMap[this.propValue.camp];
    },
    updateProperty: function updateProperty(property) {
        if (!this._super(property)) {
            return false;
        }

        this.poolMgr.resetAll();
        for (var key in this.rowValue.targetSkinArr) {
            var skinInfo = this.rowValue.targetSkinArr[key];
            var skinNode = this.poolMgr.get(skinInfo.name, skinInfo);
            skinNode.active = true;
            skinNode.updateInfo(skinInfo);
        }

        this.updateHp();
        return true;
    },
    keyHandle: function keyHandle(keyCode) {
        switch (keyCode) {
            case cc.KEY.Delete:
                cc.editData.deleteTarget(this.myIdx, this.targetIdx);
                break;
        }
    },
    _onCollisionEnter: function _onCollisionEnter(other, self) {
        var otherNode = other.node;
        if (otherNode.gameData.camp == this.propValue.camp) return;
        var otherHarmHp = otherNode.propValue.harm;
        this.curPassData.changeCampHp(this.propValue.camp, otherHarmHp);
        cc.entityMgr.clearEntity(otherNode);
    }
});

cc._RF.pop();