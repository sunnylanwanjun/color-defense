"use strict";
cc._RF.push(module, '2644dsdwj1AvJxap8Gugdsy', 'OperateTower');
// scripts/component/OperateTower.js

"use strict";

cc.Class({
    extends: cc.Component,
    properties: {
        operateToggle: {
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
            cc.globalEvent.on("Game:operateTower", this.operateTower, this);
            cc.globalEvent.on("CurData:updateResult", this.updateResult, this);
            this.curPassData = cc.passData.getCurPassData();
        }
    },
    onLoad: function onLoad() {},
    onDestroy: function onDestroy() {
        cc.globalEvent.off("Game:operateTower", this.operateTower, this);cc.globalEvent.off("CurData:updateResult", this.updateResult, this);
    },
    updateResult: function updateResult() {
        this.node.active = this.curPassData.gameResult == undefined;
    },
    operateTower: function operateTower(event) {
        if (this.gameRoot.isMouseMove) return;
        this.node.active = true;
        var detail = event.detail;
        this.entityTower = detail;
    },
    onDisable: function onDisable() {
        this.entityTower = undefined;
    },
    yesOperate: function yesOperate() {
        var toggle = cc.utils.getToggleCheckNode(this.operateToggle);
        if (toggle) {
            switch (toggle.name) {
                case "UpLevel":
                    if (!this.entityTower.hasNextLevel()) {
                        cc.utils.tip("the tower is top level");
                        return;
                    }
                    var cost = this.entityTower.propValue.uplevelCost;
                    if (-cost > this.curPassData.gameData.gold) {
                        cc.utils.tip("gold is not enough");
                        return;
                    }
                    this.curPassData.changeGold(cost);
                    this.entityTower.setState(cc.entityState.upleveling);
                    break;
                case "DestroyTower":
                    this.entityTower.setState(cc.entityState.destroying);
                    break;
            }
        } else {
            cc.utils.tip("please select a tower type");
            return;
        }
        this.node.active = false;
    },
    noOperate: function noOperate() {
        this.node.active = false;
    }
});

cc._RF.pop();