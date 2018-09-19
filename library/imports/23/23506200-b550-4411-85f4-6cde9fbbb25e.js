"use strict";
cc._RF.push(module, '23506IAtVBEEYX0bN6fu7Je', 'BulletFire');
// scripts/node/entity/bullet/BulletFire.js

"use strict";

cc.Class({
    extends: require("BulletBase"),
    ctor: function ctor() {},
    initGameData: function initGameData() {
        this._super();
        this.gameData.targetArr = [];
        this.gameData.goTime = undefined;
    },
    initEntity: function initEntity() {
        this._super.apply(this, arguments);
    },
    updateProperty: function updateProperty(property) {
        if (!this._super(property)) {
            return false;
        }
        return true;
    },
    _onCollisionEnter: function _onCollisionEnter(other, self) {
        other.node.onHitBullet(this);
        this.gameData.targetArr.push(other.node);
    },
    logicUpdate: function logicUpdate(dt) {
        if (this.gameData.goTime != undefined && this.gameData.goTime < this.propValue.harmInterval) {
            this.gameData.goTime += dt;
            return;
        }
        this.gameData.goTime = 0;

        for (var i = this.gameData.targetArr.length - 1; i >= 0; i--) {
            var target = this.gameData.targetArr[i];
            if (!target || !target.isAlive()) {
                this.gameData.targetArr.splice(i, 1);
                continue;
            }
            target.harm(this.propValue.harm);
        }
    },
    _onCollisionExit: function _onCollisionExit(other, self) {
        for (var i = this.gameData.targetArr.length - 1; i >= 0; i--) {
            var target = this.gameData.targetArr[i];
            if (other.node === target) {
                this.gameData.targetArr.splice(i, 1);
                target.onUnHitBullet(this);
                break;
            }
        }
    }
});

cc._RF.pop();