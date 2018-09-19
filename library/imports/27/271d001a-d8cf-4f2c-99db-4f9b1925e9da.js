"use strict";
cc._RF.push(module, '271d0Aa2M9PLJnbT5sZJena', 'SelectMap');
// scripts/component/SelectMap.js

"use strict";

cc.Class({
    extends: cc.Component,

    properties: {
        tpl: {
            default: undefined,
            type: cc.Node
        },
        content: {
            default: undefined,
            type: cc.Node
        },
        reuseItem: {
            default: undefined,
            type: require("ReuseItem")
        }
    },

    onLoad: function onLoad() {
        var configListLen = cc.passData.getPassCount();
        if (cc.gameConfig.isEditorMode) {
            configListLen++;
        }
        this.reuseItem.setDataLen(configListLen);
        this.reuseItem.setUpdateItemFunc(function (item, idx) {
            var btn_pass = item.getChildByName("btn_pass");
            if (cc.gameConfig.isTestMode) {
                btn_pass.color = cc.color(255, 255, 255);
            } else {
                if (cc.userData.curPassIdx == idx) {
                    btn_pass.color = cc.color(0, 255, 0);
                } else if (cc.userData.curMaxPassIdx >= idx) {
                    btn_pass.color = cc.color(255, 255, 255);
                } else {
                    btn_pass.color = cc.color(75, 75, 75);
                }
            }
            btn_pass.itemIdx = idx;
            var label = btn_pass.getChildByName("Label").getComponent(cc.Label);
            label.string = idx;
        }.bind(this));
    },
    start: function start() {},


    // update (dt) {},

    clickPass: function clickPass(event) {
        var target = event.currentTarget;
        var itemIdx = target.itemIdx;

        if (!cc.gameConfig.isTestMode) {
            if (itemIdx > cc.userData.curMaxPassIdx) {
                cc.log("SelectMap:clickPass failure,itemIdx", itemIdx, "maxPassIdx", cc.userData.curMaxPassIdx);
                return;
            }
        }

        cc.gameCtrl.playPassAD(function () {
            cc.passData.changePass(itemIdx);
            cc.utils.loadScene("game");
        }.bind(this));
    }
});

cc._RF.pop();