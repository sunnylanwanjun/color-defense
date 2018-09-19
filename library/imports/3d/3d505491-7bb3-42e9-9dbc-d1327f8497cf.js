"use strict";
cc._RF.push(module, '3d505SRe7NC6Z280TJ/hJfP', 'MonsterMgr');
// scripts/node/entity/MonsterMgr.js

"use strict";

cc.Class({
    ctor: function ctor() {
        this._initMgr = false;
    },
    initMonsterMgr: function initMonsterMgr() {
        this._initMgr = true;
        this.curPassData = cc.passData.getCurPassData();
        this.bornArr = this.curPassData.configData.bornArr;
        this.roadMap = this.curPassData.configData.roadMap;
        this.bornDataArr = [];
        for (var i = this.bornArr.length - 1; i >= 0; i--) {
            this.bornDataArr[i] = {
                waveIdx: 0,
                monsterNum: 0,
                goTime: 0,
                routeOrder: 0,
                state: "waiting"
            };
        }
    },
    unInitMonsterMgr: function unInitMonsterMgr() {
        this._initMgr = false;
    },
    logicUpdate: function logicUpdate(dt) {
        if (!this._initMgr) return;
        for (var i = this.bornDataArr.length - 1; i >= 0; i--) {
            var bornData = this.bornDataArr[i];
            var bornConfig = this.bornArr[i];

            var allWaveMonsterArr = bornConfig.allWaveMonsterArr;
            var waveMonster = allWaveMonsterArr[bornData.waveIdx];
            var isTimeEnough = false;

            bornData.goTime += dt;
            if (bornData.state == "waiting") {
                if (bornData.goTime > waveMonster.waitTime) {
                    isTimeEnough = true;
                }
            } else {
                if (bornData.goTime > waveMonster.refreshTime) {
                    isTimeEnough = true;
                }
            }

            if (isTimeEnough) {
                var entity = cc.entityMgr.createEntity("EntityMonster", bornConfig.x, bornConfig.y, waveMonster.monsterIdx);
                entity.setCamp(bornConfig.camp);
                var roadIdx = bornConfig.allRoadArr[bornData.routeOrder];
                entity.setRoad(this.roadMap[roadIdx]);

                bornData.monsterNum++;
                bornData.state = "refreshing";
                bornData.goTime = 0;
                bornData.routeOrder++;

                if (bornData.routeOrder >= bornConfig.allRoadArr.length) {
                    bornData.routeOrder = 0;
                }
                if (bornData.monsterNum >= waveMonster.monsterNum) {
                    bornData.monsterNum = 0;
                    bornData.state = "waiting";
                    bornData.waveIdx++;
                }
                if (bornData.waveIdx >= allWaveMonsterArr.length) {
                    this.bornDataArr.splice(i, 1);
                }
            }
        }

        if (this.bornDataArr.length == 0) {
            var monsterNum = cc.entityMgr.getMonsterNum();
            if (monsterNum == 0) {
                this.curPassData.setGameResult("win");
            }
        }
    }
});

cc._RF.pop();