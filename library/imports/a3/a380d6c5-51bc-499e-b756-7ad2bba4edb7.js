"use strict";
cc._RF.push(module, 'a380dbFUbxJnrdWetK7pO23', 'TowerGuidemissile');
// scripts/node/entity/tower/TowerGuidemissile.js

"use strict";

cc.Class({
    extends: require("TowerDirBase"),
    ctor: function ctor() {},
    launchBullet: function launchBullet() {
        var launchInfo = this.getLaunchInfo();
        cc.entityMgr.createEntity("BulletGuidemissile", launchInfo.pos.x, launchInfo.pos.y, this.myIdx, this.gameData.curTarget, launchInfo.ang);
    }
});

cc._RF.pop();