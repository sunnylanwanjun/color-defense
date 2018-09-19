"use strict";
cc._RF.push(module, '7eb9da7I1tFr4qeMB372aU2', 'TowerBase');
// scripts/node/entity/tower/TowerBase.js

"use strict";

cc.Class({
    extends: require("EntityBase"),
    ctor: function ctor() {
        this.skinZIndex = 1;
        this.muzzleZIndex = 10;
        this.bulletZIndex = 20;
        this.stateZIndex = 30;

        var PoolMgr = require("PoolMgr");
        this.baseNode = new cc.Node();
        this.baseNode.parent = this;
        this.baseNode.setContentSize(cc.size(100, 100));

        this.poolMgr = new PoolMgr();
        this.poolMgr.setBuildFunc(function (type, skinInfo) {
            var skinNode = cc.skinMgr.getSkin(skinInfo);
            skinNode.parent = this.baseNode;
            skinNode.zIndex = this.skinZIndex;
            return skinNode;
        }.bind(this));
        this.poolMgr.setResetFunc(function (type, skinNode) {
            skinNode.active = false;
        }.bind(this));

        this.muzzleSkinNode = new cc.Node();
        this.muzzleSkinNode.parent = this.baseNode;
        this.muzzleSkinNode.zIndex = this.muzzleZIndex;
        this.muzzleSkinNode.active = false;

        this.muzzlePoolMgr = new PoolMgr();
        this.muzzlePoolMgr.setBuildFunc(function (type, skinInfo) {
            var skinNode = cc.skinMgr.getSkin(skinInfo);
            skinNode.parent = this.muzzleSkinNode;
            return skinNode;
        }.bind(this));
        this.muzzlePoolMgr.setResetFunc(function (type, skinNode) {
            skinNode.active = false;
        }.bind(this));

        this.stateNode = new cc.Node();
        this.stateLabel = this.stateNode.addComponent(cc.Label);
        this.stateLabel.string = "";
        this.stateNode.parent = this;
        this.stateNode.zIndex = this.stateZIndex;
    },
    touchendTower: function touchendTower(event) {
        cc.globalEvent.emit("Game:operateTower", this);
    },
    touchstartTower: function touchstartTower(event) {},
    initGameData: function initGameData() {
        this._super();
        this.gameData.operateTime = 0;
        this.gameData.operateTotalTime = 0;
    },
    showMuzzle: function showMuzzle(value) {
        this.muzzleSkinNode.active = value;
    },
    canWork: function canWork() {
        return this.gameData.state == cc.entityState.working;
    },
    toWork: function toWork() {
        this.enableCollider(true);
        this.stateNode.active = false;
        this.stateLabel.string = "";
        this.gameData.operateTime = 0;
        this.gameData.operateTotalTime = 0;
    },
    unWork: function unWork() {
        this.enableCollider(false);
    },
    logicUpdate: function logicUpdate(dt) {
        if (!this.canWork()) {
            if (this.gameData.operateTotalTime > 0) {
                this.stateNode.active = true;
                this.gameData.operateTime += dt;
                var txt = this.gameData.state + Math.floor(this.gameData.operateTime);
                if (txt != this.stateLabel.string) {
                    this.stateLabel.string = txt;
                }
            }

            if (this.gameData.operateTime >= this.gameData.operateTotalTime) {
                switch (this.gameData.state) {
                    case cc.entityState.building:
                        this.setState(cc.entityState.working);
                        break;
                    case cc.entityState.destroying:
                        cc.entityMgr.clearEntity(this);
                        cc.entityMgr.createEntity("EntityFloor", this.x, this.y, this.placeFloorIdx);
                        break;
                    case cc.entityState.upleveling:
                        cc.entityMgr.clearEntity(this);
                        cc.entityMgr.createEntity(this.entityType, this.x, this.y, this.propValue.nextLevelIdx, this.placeFloorIdx);
                        break;
                }
            }
            return false;
        }
        return true;
    },
    hasNextLevel: function hasNextLevel() {
        if (this.propValue.nextLevelIdx == -1 || this.propValue.nextLevelIdx == undefined) {
            return false;
        }
        return true;
    },
    setState: function setState(state) {
        this._super(state);
        if (this.gameData.state != cc.entityState.working) {

            switch (this.gameData.state) {
                case cc.entityState.building:
                    this.unWork();
                    this.gameData.operateTotalTime = this.propValue.buildTime;
                    break;
                case cc.entityState.destroying:
                    this.unWork();
                    this.gameData.operateTotalTime = this.propValue.destroyTime;
                    break;
                case cc.entityState.upleveling:
                    if (!this.hasNextLevel()) {
                        cc.utils.tip("can not uplevel the tower,now is top level");
                        this.setState(cc.entityState.working);
                        break;
                    }
                    this.unWork();
                    this.gameData.operateTotalTime = this.propValue.uplevelTime;
                    break;
            }
        } else if (this.gameData.preState != cc.entityState.working) {
            this.toWork();
        }
    },
    initEntity: function initEntity(idx, floorIdx) {
        this._super();

        if (cc.resMgr.curSceneName != 'editor') {
            this.baseNode.on('touchend', this.touchendTower, this);
            this.baseNode.on('touchstart', this.touchstartTower, this);
        }

        this.myType = "tower";
        this.myIdx = idx;
        this.placeFloorIdx = floorIdx;
        this.updateProperty();

        if (cc.resMgr.curSceneName == 'editor') {
            this.setState(cc.entityState.working);
        } else {
            if (this.propValue.level == 1) {
                this.setState(cc.entityState.building);
            } else {
                this.setState(cc.entityState.working);
            }
        }
    },
    unInitEntity: function unInitEntity() {
        this._super();
        if (cc.resMgr.curSceneName != 'editor') {
            this.baseNode.off('touchend', this.touchendTower, this);
            this.baseNode.off('touchstart', this.touchstartTower, this);
        }
    },
    _onPreDestroy: function _onPreDestroy() {
        this._super();
    },
    updateProperty: function updateProperty(property) {
        if (!this._super(property)) {
            return false;
        }

        //--------------------------------
        //reset all
        //--------------------------------
        this.muzzleSkinNode.active = false;

        this.poolMgr.resetAll();
        this.muzzlePoolMgr.resetAll();
        for (var key in this.propValue.skinArr) {
            var skinInfo = this.propValue.skinArr[key];
            var skinNode = this.poolMgr.get(skinInfo.name, skinInfo);
            skinNode.active = true;
            skinNode.updateInfo(skinInfo);
        }
        for (var key in this.propValue.muzzleSkinArr) {
            var skinInfo = this.propValue.muzzleSkinArr[key];
            var skinNode = this.muzzlePoolMgr.get(skinInfo.name, skinInfo);
            skinNode.active = true;
            skinNode.updateInfo(skinInfo);
        }
        return true;
    }
});

cc._RF.pop();