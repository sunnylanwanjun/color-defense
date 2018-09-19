"use strict";
cc._RF.push(module, '66089V/7h9OH7pNyWsrdXRi', 'EntityMonster');
// scripts/node/entity/EntityMonster.js

"use strict";

cc.Class({
    extends: require("EntityBase"),
    ctor: function ctor() {
        this.group = "monster";

        this.curPassData = cc.passData.getCurPassData();

        this.baseNode = new cc.Node();
        this.baseNode.parent = this;

        var labelNode = new cc.Node();
        labelNode.color = cc.color(255, 0, 0);
        labelNode.y = 35;
        this.addChild(labelNode);
        this.hpLabel = labelNode.addComponent(cc.Label);
        this.hpLabel.string = "";
        labelNode.active = cc.resMgr.curSceneName == 'editor';

        var Unique = require("Unique");
        this.unique = new Unique();
        this.unique.setBuildFunc(function (skinName, skinInfo) {
            var skinNode = cc.skinMgr.getSkin(skinInfo);
            skinNode.parent = this.baseNode;
            return skinNode;
        }.bind(this));
        this.unique.setResetFunc(function (skinNode) {
            skinNode.destroy();
        }.bind(this));

        var PoolMgr = require("PoolMgr");
        this.poolMgr = new PoolMgr();
        this.poolMgr.setBuildFunc(function (skinType, skinInfo) {
            var skinNode = cc.skinMgr.getSkin(skinInfo);
            skinNode.setCompleteCallback(function () {
                this.poolMgr.push(skinType, skinNode);
            }.bind(this));
            skinNode.parent = this.baseNode;
            return skinNode;
        }.bind(this));
        this.poolMgr.setResetFunc(function (skinType, skinNode) {
            skinNode.active = false;
        }.bind(this));
    },
    _onPreDestroy: function _onPreDestroy() {
        this._super();
    },
    initGameData: function initGameData() {
        this._super();
        this.gameData.hp = 0;
        this.gameData.speed = 0;
        this.gameData.state = cc.entityState.alive;
        this.gameData.pointArr = undefined;
        this.gameData.pointIdx = undefined;
        this.gameData.camp = undefined;
    },
    initEntity: function initEntity(idx) {
        this._super();
        this.myType = "monster";
        this.myIdx = idx;
        this.updateProperty();
    },
    unInitEntity: function unInitEntity() {
        this._super();
    },
    updateProperty: function updateProperty(property) {
        if (!this._super(property)) {
            return false;
        }

        //-----------------update gameData----------------
        this.gameData.hp = this.propValue.hp;
        this.gameData.speed = this.propValue.speed;
        this.hpLabel.string = this.gameData.hp;
        //------------------------------------------------

        this.unique.reset();
        this.poolMgr.resetAll();
        for (var key in this.propValue.skinArr) {
            var skinInfo = this.propValue.skinArr[key];
            this.skinColorStr = skinInfo.color;
            this.skinColor = cc.utils.color(this.skinColorStr);
            var skinNode = this.poolMgr.get(skinInfo.name, skinInfo);
            skinNode.active = true;
            skinNode.updateInfo(skinInfo);
        }
        return true;
    },
    recoverSpeed: function recoverSpeed() {
        this.gameData.speed = this.propValue.speed;
    },
    slowDown: function slowDown(slowSpeed) {
        this.gameData.speed = this.propValue.speed + slowSpeed;
        if (this.gameData.speed < 0) this.gameData.speed = 0;
    },
    harm: function harm(harmHp) {
        if (!harmHp) return;
        if (this.state === cc.entityState.death) {
            return;
        }
        this.gameData.hp += harmHp;
        this.hpLabel.string = this.gameData.hp;
        if (this.gameData.hp <= 0) {
            this.setState(cc.entityState.death);
            cc.skinMgr.showSkin(this, {
                name: cc.resName.deathEff,
                type: "partical",
                autoDestroy: true,
                color: this.skinColorStr,
                scale: 5,
                playTime: 3,
                atlas: "bulletui"
            });
            this.curPassData.changeGold(this.propValue.dropGold);
            cc.entityMgr.clearEntity(this);
        }
    },
    onUnHitBullet: function onUnHitBullet(bulletNode) {
        if (!bulletNode.propValue.hitSkinArr) {
            return;
        }
        for (var key in bulletNode.propValue.hitSkinArr) {
            var skinInfo = bulletNode.propValue.hitSkinArr[key];
            if (!skinInfo.unique) {
                continue;
            }
            this.unique.sub(skinInfo.name);
        }
    },
    onHitBullet: function onHitBullet(bulletNode) {
        if (!bulletNode.propValue.hitSkinArr) {
            return;
        }
        for (var key in bulletNode.propValue.hitSkinArr) {
            var skinInfo = bulletNode.propValue.hitSkinArr[key];
            var skinNode = undefined;
            //针对循环播放的特效，在离开的时候，需要去停止,这里用特效的名字作为唯一索引
            if (skinInfo.unique) {
                skinNode = this.unique.add(skinInfo.name, skinInfo);
            } else {
                skinNode = this.poolMgr.get(skinInfo.name, skinInfo);
            }
            skinNode.active = true;
            skinNode.updateInfo(skinInfo);
        }
    },
    setCamp: function setCamp(camp) {
        this.gameData.camp = camp;
    },
    setRoad: function setRoad(pointArr) {
        this.gameData.pointArr = pointArr;
        this.gameData.pointIdx = 0;
    },
    logicUpdate: function logicUpdate(dt) {
        if (this.gameData.pointArr == undefined) {
            return;
        }
        var pointArr = this.gameData.pointArr;
        var pointIdx = this.gameData.pointIdx;
        if (pointIdx >= pointArr.length - 1) return;
        var pointData = pointArr[pointIdx];
        var nextData = pointArr[pointIdx + 1];

        var deltaDis = this.gameData.speed * dt;
        if (cc.utils.dis2(this, nextData) <= deltaDis * deltaDis) {
            this.x = nextData.x;
            this.y = nextData.y;
            this.gameData.pointIdx++;
            return;
        }
        var deltaX = deltaDis * Math.cos(pointData.angle);
        var deltaY = deltaDis * Math.sin(pointData.angle);
        this.x += deltaX;
        this.y += deltaY;
        this.baseNode.rotation = -90 - cc.utils.rad2ang(pointData.angle);
    }
});

cc._RF.pop();