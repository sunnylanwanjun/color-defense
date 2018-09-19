"use strict";
cc._RF.push(module, '2818dEn7WFM+K0KiHbGlec8', 'CreateTower');
// scripts/component/CreateTower.js

"use strict";

cc.Class({
    extends: cc.Component,
    properties: {
        newTowerToggle: {
            default: undefined,
            type: cc.ToggleContainer
        },
        gameRoot: {
            default: undefined,
            type: require("GameRoot")
        }
    },
    ctor: function ctor() {
        if (!CC_EDITOR) {
            cc.globalEvent.on("Game:createTower", this.createTower, this);
            cc.globalEvent.on("CurData:updateResult", this.updateResult, this);
            this.curPassData = cc.passData.getCurPassData();
        }
    },
    onLoad: function onLoad() {},
    onDestroy: function onDestroy() {
        cc.globalEvent.off("Game:createTower", this.createTower, this);
        cc.globalEvent.off("CurData:updateResult", this.updateResult, this);
    },
    updateResult: function updateResult() {
        this.node.active = this.curPassData.gameResult == undefined;
    },
    createTower: function createTower(event) {
        if (this.gameRoot.isMouseMove) return;
        this.node.active = true;
        var detail = event.detail;
        this.entityFloor = detail;
    },
    onDisable: function onDisable() {
        this.entityFloor = undefined;
    },
    yesCreate: function yesCreate() {
        var towerToggle = cc.utils.getToggleCheckNode(this.newTowerToggle);
        if (towerToggle) {
            var towerInfo = cc.configData.getTower_Level1_Info(towerToggle.name);
            if (!towerInfo) {
                cc.utils.tip("tower is not exist");
                return;
            }
            if (-towerInfo.buildCost > this.curPassData.gameData.gold) {
                cc.utils.tip("gold is not enough");
                return;
            }
            this.curPassData.changeGold(towerInfo.buildCost);
            cc.entityMgr.createEntity(towerToggle.name, this.entityFloor.x, this.entityFloor.y, towerInfo.idx);
            cc.entityMgr.clearEntity(this.entityFloor);
        } else {
            cc.utils.tip("please select a tower type");
            return;
        }
        this.node.active = false;
    },
    noCreate: function noCreate() {
        this.node.active = false;
    }
});

cc._RF.pop();