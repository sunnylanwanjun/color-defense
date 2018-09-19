"use strict";
cc._RF.push(module, '28d100CMudHPa2QYiYrISbi', 'BulletBomb');
// scripts/node/entity/bullet/BulletBomb.js

"use strict";

cc.Class({
    extends: require("BulletBase"),
    ctor: function ctor() {
        this.xDir = cc.v2(1, 0);
        this.curPassIdx = cc.passData.getCurPassIdx();
    },
    initGameData: function initGameData() {
        this._super();
        this.gameData.launchAng = undefined;
        this.gameData.halfTime = undefined;
        this.gameData.goTime = 0;
        this.gameData.uping = true;
        this.gameData.targetPos = undefined;
    },
    initEntity: function initEntity(idx, targetPos, launchAng, dis) {
        this._super(idx);
        this.updateProperty();
        this.gameData.launchAng = launchAng;
        this.gameData.targetPos = targetPos;
        this.gameData.halfTime = dis / this.propValue.speed * 0.5;
    },
    logicUpdate: function logicUpdate(dt) {
        this.gameData.goTime += dt;
        if (this.gameData.uping && this.gameData.goTime < this.gameData.halfTime) {
            this.baseNode.scale = cc.utils.lerp(this.propValue.minScale, this.propValue.maxScale, this.gameData.goTime / this.gameData.halfTime);
        } else {
            if (this.gameData.uping) {
                this.gameData.goTime -= this.gameData.halfTime;
                this.gameData.uping = false;
            }
            this.baseNode.scale = cc.utils.lerp(this.propValue.maxScale, this.propValue.minScale, this.gameData.goTime / this.gameData.halfTime);
        }

        var deltaDis = this.propValue.speed * dt;
        var dis = cc.pDistance(this, this.gameData.targetPos);
        if (dis < deltaDis) {
            cc.entityMgr.createEntity("BulletBombEffect", this.x, this.y, this.myIdx);
            cc.entityMgr.clearEntity(this);
            return;
        }

        var deltaX = deltaDis * Math.cos(this.gameData.launchAng);
        var deltaY = deltaDis * Math.sin(this.gameData.launchAng);
        this.x += deltaX;
        this.y += deltaY;

        if (cc.configData.isOutMap(this.curPassIdx, this)) {
            cc.entityMgr.clearEntity(this);
        }
    }
});

cc._RF.pop();