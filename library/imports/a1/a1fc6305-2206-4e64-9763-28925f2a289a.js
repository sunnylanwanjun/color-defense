"use strict";
cc._RF.push(module, 'a1fc6MFIgZOZJdjKJJfKiia', 'TowerLaser');
// scripts/node/entity/tower/TowerLaser.js

"use strict";

cc.Class({
    extends: require("TowerDirBase"),
    ctor: function ctor() {},
    unInitEntity: function unInitEntity() {
        this._super();
        this.unLaunchBullet();
    },
    launchBullet: function launchBullet() {
        if (this.laser) return;
        this.showMuzzle(true);
        this.laser = cc.entityMgr.createEntityNotInLayer("BulletLaser", this.myIdx);
        this.laser.zIndex = this.bulletZIndex;
        this.baseNode.addChild(this.laser);
    },
    unLaunchBullet: function unLaunchBullet() {
        if (!this.laser) return;
        this.showMuzzle(false);
        cc.entityMgr.clearEntity(this.laser);
        this.laser = undefined;
    }
});

cc._RF.pop();