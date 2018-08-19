cc.Class({
    extends:require("TowerDirBase"),
    ctor(){
        
    },
    launchBullet(){
        this.showMuzzle(true);
        var launchInfo = this.getLaunchInfo();
        cc.entityMgr.createEntity("BulletPistol",
        launchInfo.pos.x,
        launchInfo.pos.y,
        this.myIdx,
        launchInfo.ang);
    },
    unLaunchBullet(){
        this.showMuzzle(false);
    }
});