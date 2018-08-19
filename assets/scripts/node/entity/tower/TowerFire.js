cc.Class({
    extends:require("TowerDirBase"),
    ctor(){
        
    },
    unInitEntity(){
        this._super();
        this.unLaunchBullet();
    },
    launchBullet(){
        if(this.fire)return;
        this.showMuzzle(true);
        this.fire = cc.entityMgr.createEntityNotInLayer("BulletFire",this.myIdx);
        this.fire.zIndex = this.bulletZIndex;
        this.baseNode.addChild(this.fire);
    },
    unLaunchBullet(){
        if(!this.fire)return;
        this.showMuzzle(false);
        cc.entityMgr.clearEntity(this.fire);
        this.fire = undefined;
    }
});