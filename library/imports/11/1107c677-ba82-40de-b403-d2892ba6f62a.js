"use strict";
cc._RF.push(module, '1107cZ3uoJA3rQD0okrpvYq', 'TowerFire');
// scripts/node/entity/tower/TowerFire.js

"use strict";

cc.Class({
    extends: require("TowerDirBase"),
    ctor: function ctor() {},
    unInitEntity: function unInitEntity() {
        this._super();
        this.unLaunchBullet();
    },
    launchBullet: function launchBullet() {
        if (this.fire) return;
        this.showMuzzle(true);
        this.fire = cc.entityMgr.createEntityNotInLayer("BulletFire", this.myIdx);
        this.fire.zIndex = this.bulletZIndex;
        this.baseNode.addChild(this.fire);
    },
    unLaunchBullet: function unLaunchBullet() {
        if (!this.fire) return;
        this.showMuzzle(false);
        cc.entityMgr.clearEntity(this.fire);
        this.fire = undefined;
    }
});

cc._RF.pop();