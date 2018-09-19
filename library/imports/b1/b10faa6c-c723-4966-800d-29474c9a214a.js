"use strict";
cc._RF.push(module, 'b10fapsxyNJZoANKUdMmiFK', 'Editor');
// scripts/component/Editor.js

"use strict";

cc.Class({
    extends: cc.Component,
    properties: {
        passLabel: {
            default: undefined,
            type: cc.Label
        },
        floorSize: {
            default: undefined,
            type: cc.EditBox
        },
        layerNode: {
            default: undefined,
            type: cc.Node
        }
    },
    onDestroy: function onDestroy() {
        var manager = cc.director.getCollisionManager();
        manager.enabled = true;
        manager.enabledDebugDraw = false;
        manager.enabledDrawBoundingBox = false;
        this.layerMgr.unInitLayerMgr();
    },
    onLoad: function onLoad() {
        var manager = cc.director.getCollisionManager();
        manager.enabled = true;
        manager.enabledDebugDraw = cc.gameConfig.enabledDebugDraw_edit;
        manager.enabledDrawBoundingBox = cc.gameConfig.enabledDrawBoundingBox_edit;

        var LayerMgr = require("EditorLayerMgr");
        this.layerMgr = new LayerMgr();
        this.layerMgr.initLayerMgr(this.layerNode);
    },
    update: function update(dt) {
        this.layerMgr.logicUpdate(dt);
    },
    changeFloorSize: function changeFloorSize() {
        cc.editData.editFloorSize(parseInt(this.floorSize.string));
    },
    eidtPass: function eidtPass() {
        var curPassIdx = cc.passData.getCurPassIdx();
        this.passLabel.string = "pass:" + curPassIdx;
    },
    toGame: function toGame() {
        var curPassIdx = cc.passData.getCurPassIdx();
        cc.passData.changePass(curPassIdx);
        cc.utils.loadScene("game");
    },
    toSelect: function toSelect() {
        cc.utils.loadScene("select");
    },
    showLayer: function showLayer(event, layerName) {
        this.layerMgr.showLayer(layerName);
    }
});

cc._RF.pop();