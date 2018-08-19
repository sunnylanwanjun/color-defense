cc.Class({
    extends:require("TowerDirBase"),
    ctor(){
        
    },
    launchBullet(){
        this.showMuzzle(true);
        if(this.gameData.curTarget){
            var bullet = this.muzzleSkinNode.getChildByName("BulletMachinegun");
            if(bullet){
                bullet.setColor(this.gameData.curTarget.skinColorStr);
            }
        }
        this.gameData.curTarget.harm(this.propValue.harm);
    },
    unLaunchBullet(){
        this.showMuzzle(false);
    }
});