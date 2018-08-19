cc.Class({
    extends:require("TowerDirBase"),
    ctor(){
        
    },
    launchBullet(){
        var launchInfo = this.getLaunchInfo();
        cc.entityMgr.createEntity("BulletGuidemissile",
        launchInfo.pos.x,
        launchInfo.pos.y,
        this.myIdx,
        this.gameData.curTarget,
        launchInfo.ang);
    },
});