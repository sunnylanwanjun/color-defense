"use strict";
cc._RF.push(module, '91b8858+/dAJK2DJLRnGuOE', 'EntityBorn');
// scripts/node/entity/EntityBorn.js

"use strict";

cc.Class({
    extends: require("EntityBase"),
    ctor: function ctor() {
        var PoolMgr = require("PoolMgr");
        this.poolMgr = new PoolMgr();
        this.poolMgr.setBuildFunc(function (skinType, skinInfo) {
            var skinNode = cc.skinMgr.getSkin(skinInfo);
            skinNode.setCompleteCallback(function () {
                this.poolMgr.push(skinType, skinNode);
            }.bind(this));
            skinNode.parent = this;
            return skinNode;
        }.bind(this));
        this.poolMgr.setResetFunc(function (skinType, skinNode) {
            skinNode.active = false;
        }.bind(this));
    },
    initGameData: function initGameData() {
        this._super();
    },
    updateProperty: function updateProperty(property) {
        if (!this._super(property)) {
            return false;
        }

        this.poolMgr.resetAll();
        for (var key in this.rowValue.bornSkinArr) {
            var skinInfo = this.rowValue.bornSkinArr[key];
            var skinNode = this.poolMgr.get(skinInfo.name, skinInfo);
            skinNode.active = true;
            skinNode.updateInfo(skinInfo);
        }
        return true;
    },
    initEntity: function initEntity(idx, bornIdx) {
        this._super();
        this.myType = "pass";
        this.myIdx = idx;
        this.bornIdx = bornIdx;
        this.myProperty = "bornArr@" + bornIdx;
        this.myPropertyArr = this.myProperty.split("@");
        this.updateProperty();
    },
    unInitEntity: function unInitEntity() {
        this._super();
    },
    keyHandle: function keyHandle(keyCode) {
        switch (keyCode) {
            case cc.KEY.Delete:
                cc.editData.deleteBorn(this.myIdx, this.bornIdx);
                break;
        }
    }
});

cc._RF.pop();