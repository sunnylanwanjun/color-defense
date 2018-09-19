"use strict";
cc._RF.push(module, 'bbf74wzBvFMD63hHv3aCnBJ', 'BulletPistol');
// scripts/node/entity/bullet/BulletPistol.js

"use strict";

cc.Class({
    extends: require("BulletBase"),
    ctor: function ctor() {
        this.curPassIdx = cc.passData.getCurPassIdx();
    },
    initGameData: function initGameData() {
        this._super();
        this.gameData.launchAng = undefined;
    },
    initEntity: function initEntity(idx, launchAng) {
        this._super(idx);
        this.gameData.launchAng = launchAng;
        this.updateProperty();
    },
    unInitEntity: function unInitEntity() {
        this._super();
    },
    updateProperty: function updateProperty(property) {
        if (!this._super(property)) {
            return false;
        }
        return true;
    },
    logicUpdate: function logicUpdate(dt) {
        var deltaDis = this.propValue.speed * dt;
        var deltaX = deltaDis * Math.cos(this.gameData.launchAng);
        var deltaY = deltaDis * Math.sin(this.gameData.launchAng);
        this.x += deltaX;
        this.y += deltaY;

        if (cc.configData.isOutMap(this.curPassIdx, this)) {
            cc.entityMgr.clearEntity(this);
        }
    },
    _onCollisionEnter: function _onCollisionEnter(other, self) {
        var monsterNode = other.node;
        monsterNode.onHitBullet(this);
        monsterNode.harm(this.propValue.harm);
        cc.entityMgr.clearEntity(this);
    }
});

cc._RF.pop();