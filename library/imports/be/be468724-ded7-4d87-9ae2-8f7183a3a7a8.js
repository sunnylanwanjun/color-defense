"use strict";
cc._RF.push(module, 'be468ck3tdNh5rij3GDo6eo', 'GameLayerMgr');
// scripts/component/GameLayerMgr.js

"use strict";

cc.Class({
    extends: require("LayerMgr"),
    ctor: function ctor() {},
    unInitLayerMgr: function unInitLayerMgr() {
        cc.globalEvent.off("CurData:initGameData", this.initGameData, this);
        this.entityMgr.unInitEntityMgr();
        this.skinMgr.unInitSkinMgr();
        this.monsterMgr.unInitMonsterMgr();
    },
    initLayerMgr: function initLayerMgr(node) {
        this._super(node);

        cc.globalEvent.on("CurData:initGameData", this.initGameData, this);
        cc.configData.initAllTower_Level1_Info();

        this.curPassData = cc.passData.getCurPassData();
        this.entityMgr = cc.entityMgr;
        this.skinMgr = cc.skinMgr;

        var MonsterMgr = require("MonsterMgr");
        this.monsterMgr = new MonsterMgr();

        this.initGameData();
    },
    initGameData: function initGameData() {
        this.entityMgr.unInitEntityMgr();
        this.skinMgr.unInitSkinMgr();
        this.monsterMgr.unInitMonsterMgr();

        this.monsterMgr.initMonsterMgr();
        this.entityMgr.initEntityMgr(this.layerMap);
        this.skinMgr.initSkinMgr(this.layerMap);

        this.updateFloor();
        this.updateBorn();
        this.updateTarget();
        this.updateRoad();
    },
    logicUpdate: function logicUpdate(dt) {
        this.entityMgr.logicUpdate(dt);
        this.monsterMgr.logicUpdate(dt);
        this._updateFloor();
        this._updateBorn();
        this._updateTarget();
        this._updateRoad();
    }
});

cc._RF.pop();