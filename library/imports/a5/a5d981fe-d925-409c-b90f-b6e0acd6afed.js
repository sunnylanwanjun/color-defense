"use strict";
cc._RF.push(module, 'a5d98H+2SVAnLkPtuCs1q/t', 'TowerMachinegun');
// scripts/node/entity/tower/TowerMachinegun.js

"use strict";

cc.Class({
    extends: require("TowerDirBase"),
    ctor: function ctor() {},
    launchBullet: function launchBullet() {
        this.showMuzzle(true);
        if (this.gameData.curTarget) {
            var bullet = this.muzzleSkinNode.getChildByName("BulletMachinegun");
            if (bullet) {
                bullet.setColor(this.gameData.curTarget.skinColorStr);
            }
        }
        this.gameData.curTarget.harm(this.propValue.harm);
    },
    unLaunchBullet: function unLaunchBullet() {
        this.showMuzzle(false);
    }
});

cc._RF.pop();