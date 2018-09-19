"use strict";
cc._RF.push(module, '42629DqgpFKb45LXpAgW5Kn', 'ColorData');
// scripts/data/ColorData.js

"use strict";

var CurData = require("CurData");
cc.Class({
    extends: CurData,
    ctor: function ctor() {},
    initGameData: function initGameData() {
        this._super();
        this.gameResult = undefined;
        this.gameData = {
            campMap: {},
            targetCamp: undefined,
            bornMap: {},
            gold: this.configData.initGold
        };
        var campArr = this.configData.campArr;
        for (var key in campArr) {
            var campData = campArr[key];
            this.gameData.campMap[campData.camp] = campData.hp;
        }

        //如果目标阵营多于一个，则认为无法确认目标阵营，可能为多玩家情况
        var targetArr = this.configData.targetArr;
        if (targetArr.length > 0) {
            this.gameData.targetCamp = targetArr[0].camp;
            for (var key in targetArr) {
                var targetInfo = targetArr[key];
                if (this.gameData.targetCamp != targetInfo.camp) {
                    this.gameData.targetCamp = undefined;
                }
            }
        }

        cc.globalEvent.emit("CurData:updateResult", this.gameResult);
        cc.globalEvent.emit("CurData:initGameData");
    },
    changeCampHp: function changeCampHp(camp, changeVal) {
        var campMap = this.gameData.campMap;
        campMap[camp] += changeVal;
        if (campMap[camp] < 0) {
            campMap[camp] = 0;
        }
        cc.globalEvent.emit("CurData:changeCampHp", { camp: camp,
            hp: campMap[camp] });
        if (this.gameData.targetCamp == camp && campMap[camp] == 0) {
            this.setGameResult("lost");
        }
    },
    setGameResult: function setGameResult(result) {
        if (this.gameResult) {
            return;
        }
        this.gameResult = result;
        cc.globalEvent.emit("CurData:updateResult", this.gameResult);
    },
    changeGold: function changeGold(val) {
        this.gameData.gold += val;
        cc.globalEvent.emit("CurData:changeGold", this.gameData.gold);
    }
});

cc._RF.pop();