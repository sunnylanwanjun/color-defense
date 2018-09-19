"use strict";
cc._RF.push(module, '65f41lh85JNLJ9+VTeqeba0', 'TowerPistol');
// scripts/node/entity/tower/TowerPistol.js

"use strict";

cc.Class({
    extends: require("TowerDirBase"),
    ctor: function ctor() {},
    launchBullet: function launchBullet() {
        this.showMuzzle(true);
        var launchInfo = this.getLaunchInfo();
        cc.entityMgr.createEntity("BulletPistol", launchInfo.pos.x, launchInfo.pos.y, this.myIdx, launchInfo.ang);
    },
    unLaunchBullet: function unLaunchBullet() {
        this.showMuzzle(false);
    }
});

cc._RF.pop();