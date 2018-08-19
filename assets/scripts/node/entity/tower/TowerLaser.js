cc.Class({
    extends:require("TowerDirBase"),
    ctor(){
        
    },
    unInitEntity(){
        this._super();
        this.unLaunchBullet();
    },
    launchBullet(){
        if(this.laser)return;
        this.showMuzzle(true);
        this.laser = cc.entityMgr.createEntityNotInLayer("BulletLaser",this.myIdx);
        this.laser.zIndex = this.bulletZIndex;
        this.baseNode.addChild(this.laser);
    },
    unLaunchBullet(){
        if(!this.laser)return;
        this.showMuzzle(false);
        cc.entityMgr.clearEntity(this.laser);
        this.laser = undefined;
    }
});