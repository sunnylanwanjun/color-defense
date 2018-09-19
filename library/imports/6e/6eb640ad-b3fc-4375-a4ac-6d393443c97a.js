"use strict";
cc._RF.push(module, '6eb64Cts/xDdaSsbTk0Q8l6', 'Game');
// scripts/component/Game.js

"use strict";

cc.Class({
    extends: cc.Component,

    properties: {
        btnEditor: {
            default: undefined,
            type: cc.Node
        },
        passLabel: {
            default: undefined,
            type: cc.Label
        },
        createTowerNode: {
            default: undefined,
            type: cc.Node
        },
        opearteTowerNode: {
            default: undefined,
            type: cc.Node
        },
        layerNode: {
            default: undefined,
            type: cc.Node
        },
        goldLabel: {
            default: undefined,
            type: cc.Label
        }
    },
    onLoad: function onLoad() {
        var manager = cc.director.getCollisionManager();
        manager.enabled = true;
        manager.enabledDebugDraw = cc.gameConfig.enabledDebugDraw_game;
        manager.enabledDrawBoundingBox = cc.gameConfig.enabledDrawBoundingBox_game;

        this.btnEditor.active = cc.gameConfig.isEditorMode;

        cc.globalEvent.on("CurData:initGameData", this.initGameData, this);
        cc.globalEvent.on("CurData:changeGold", this.changeGold, this);
        this.initGameData();

        var LayerMgr = require("GameLayerMgr");
        this.layerMgr = new LayerMgr();
        this.layerMgr.initLayerMgr(this.layerNode);
    },
    initGameData: function initGameData() {
        this.curPassData = cc.passData.getCurPassData();
        this.passLabel.string = "pass:" + this.curPassData.passIdx;
        this.changeGold();
    },
    onDestroy: function onDestroy() {
        cc.globalEvent.off("CurData:initGameData", this.initGameData, this);
        cc.globalEvent.off("CurData:changeGold", this.changeGold, this);

        var manager = cc.director.getCollisionManager();
        manager.enabled = true;
        manager.enabledDebugDraw = false;
        manager.enabledDrawBoundingBox = false;

        this.layerMgr.unInitLayerMgr();
    },
    update: function update(dt) {
        this.layerMgr.logicUpdate(dt);
    },
    changeGold: function changeGold() {
        this.goldLabel.string = "gold:" + this.curPassData.gameData.gold;
    },
    toEditor: function toEditor() {
        cc.editData.editRow("pass", this.curPassData.passIdx);
        cc.utils.loadScene("editor");
    },
    toSelect: function toSelect() {
        cc.utils.loadScene("select");
    }
});

cc._RF.pop();