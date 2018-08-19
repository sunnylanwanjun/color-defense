cc.Class({
    extends:require("BulletBase"),
    ctor(){
        this.curPassIdx = cc.passData.getCurPassIdx();
    },  
    initGameData(){
        this._super();
        this.gameData.launchAng = undefined;
    },
    initEntity(idx,launchAng){
        this._super(idx);
        this.gameData.launchAng = launchAng;
        this.updateProperty();
    },
    unInitEntity(){
        this._super();
    },
    updateProperty(property){
        if(!this._super(property)){
            return false;
        }
        return true;
    },
    logicUpdate(dt){
        var deltaDis = this.propValue.speed*dt;
        var deltaX = deltaDis*Math.cos(this.gameData.launchAng);
        var deltaY = deltaDis*Math.sin(this.gameData.launchAng);
        this.x+=deltaX;
        this.y+=deltaY;

        if(cc.configData.isOutMap(this.curPassIdx,this)){
            cc.entityMgr.clearEntity(this);
        }
    },
    _onCollisionEnter(other,self){
        var monsterNode = other.node;
        monsterNode.onHitBullet(this);
        monsterNode.harm(this.propValue.harm);
        cc.entityMgr.clearEntity(this);
    },
})