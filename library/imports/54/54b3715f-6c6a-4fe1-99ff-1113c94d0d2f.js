"use strict";
cc._RF.push(module, '54b37FfbGpP4Zn/ERPJTQ0v', 'LayerMgr');
// scripts/component/LayerMgr.js

"use strict";

cc.Class({
    ctor: function ctor() {},
    unInitLayerMgr: function unInitLayerMgr() {},
    initLayerMgr: function initLayerMgr(node) {
        this.rootNode = node;

        this.gameui = cc.resMgr.getRes(cc.resName.gameui);
        this.editorui = cc.resMgr.getRes(cc.resName.editorui);
        this.commonui = cc.resMgr.getRes(cc.resName.commonui);
        this.roadSpriteFrame = this.gameui.getSpriteFrame('ui-road');

        this.layerArr = ["road", "point", "floor", "monster", "tower", "fire", "laser", "born", "target", "effect"];
        this.layerMap = {};
        for (var i = 0; i < this.layerArr.length; i++) {
            var node = new cc.Node();
            node.parent = this.rootNode;
            node.zIndex = i;
            this.layerMap[this.layerArr[i]] = node;
        }

        this.roadInitDir = cc.v2(1, 0);
        var Pool = require("Pool");
        this.roadPool = new Pool();
        this.roadPool.setBuildFunc(function () {
            var road = new cc.Node();
            road.parent = this.layerMap.road;

            var sp = road.addComponent(cc.Sprite);
            sp.spriteFrame = this.roadSpriteFrame;
            sp.type = cc.Sprite.Type.SLICED;
            sp.setInsetLeft(28);
            sp.setInsetRight(28);

            return road;
        }.bind(this));
        this.roadPool.setResetFunc(function (road) {
            road.active = false;
        }.bind(this));

        this._updatePointDirty = true;
        this._updateFloorDirty = true;
        this._updateBornDirty = true;
        this._updateTargetDirty = true;
        this._updateRoadDirty = true;
    },
    logicUpdate: function logicUpdate(dt) {},
    _updatePoint: function _updatePoint() {
        if (!this._updatePointDirty) return;
        var curPassIdx = cc.passData.getCurPassIdx();
        var passRow = cc.configData.getConfigRow("pass", curPassIdx);
        for (var i in passRow.roadMap) {
            var pointArr = passRow.roadMap[i];
            for (var j = 0; j < pointArr.length; j++) {
                var pointInfo = pointArr[j];
                this.entityMgr.createEntity("EntityPoint", pointInfo.x, pointInfo.y, curPassIdx, i, j);
            }
        }
        this._updatePointDirty = false;
    },
    updatePoint: function updatePoint() {
        this.entityMgr.clearEntityByType("EntityPoint");
        this._updatePointDirty = true;
    },
    _updateFloor: function _updateFloor() {
        if (!this._updateFloorDirty) return;
        var curPassIdx = cc.passData.getCurPassIdx();
        var passRow = cc.configData.getConfigRow("pass", curPassIdx);
        for (var key in passRow.floorArr) {
            var floorInfo = passRow.floorArr[key];
            this.entityMgr.createEntity("EntityFloor", floorInfo.x, floorInfo.y, curPassIdx, key);
        }
        this._updateFloorDirty = false;
    },
    updateFloor: function updateFloor() {
        this.entityMgr.clearEntityByType("EntityFloor");
        this._updateFloorDirty = true;
    },
    _updateBorn: function _updateBorn() {
        if (!this._updateBornDirty) return;
        var curPassIdx = cc.passData.getCurPassIdx();
        var passRow = cc.configData.getConfigRow("pass", curPassIdx);
        for (var key in passRow.bornArr) {
            var bornInfo = passRow.bornArr[key];
            this.entityMgr.createEntity("EntityBorn", bornInfo.x, bornInfo.y, curPassIdx, key);
        }
        this._updateBornDirty = false;
    },
    updateBorn: function updateBorn() {
        this.entityMgr.clearEntityByType("EntityBorn");
        this._updateBornDirty = true;
    },
    _updateTarget: function _updateTarget() {
        if (!this._updateTargetDirty) return;
        var curPassIdx = cc.passData.getCurPassIdx();
        var passRow = cc.configData.getConfigRow("pass", curPassIdx);
        for (var key in passRow.targetArr) {
            var targetInfo = passRow.targetArr[key];
            this.entityMgr.createEntity("EntityTarget", targetInfo.x, targetInfo.y, curPassIdx, key);
        }
        this._updateTargetDirty = false;
    },
    updateTarget: function updateTarget() {
        this.entityMgr.clearEntityByType("EntityTarget");
        this._updateTargetDirty = true;
    },
    _updateRoad: function _updateRoad() {
        if (!this._updateRoadDirty) return;
        this.roadPool.reset();
        var curPassIdx = cc.passData.getCurPassIdx();
        var passRow = cc.configData.getConfigRow("pass", curPassIdx);
        for (var i in passRow.roadMap) {
            var pointArr = passRow.roadMap[i];
            for (var j = 0; j < pointArr.length - 1; j++) {
                var pointInfo = pointArr[j];
                if (pointInfo.drawRoad) {
                    var roadNode = this.roadPool.get();
                    roadNode.active = true;
                    var width = pointInfo.dis + 36;
                    roadNode.anchorX = 18 / width;
                    roadNode.setContentSize(cc.size(width, 45));
                    roadNode.x = pointInfo.x;
                    roadNode.y = pointInfo.y;
                    roadNode.rotation = -cc.utils.rad2ang(pointInfo.angle);
                }
            }
        }
        this._updateRoadDirty = false;
    },
    updateRoad: function updateRoad() {
        this._updateRoadDirty = true;
    },
    showLayer: function showLayer(layerName) {
        var active = this.layerMap[layerName].active;
        this.layerMap[layerName].active = !active;
    }
});

cc._RF.pop();