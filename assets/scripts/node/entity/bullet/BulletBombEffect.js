cc.Class({
    extends:require("BulletBase"),
    ctor(){
        this.xDir = cc.v2(1,0);
    },
    initGameData(){
        this._super();
    },
    initEntity(idx){
        this._super();
        this.myType = "tower";
        this.myIdx = idx;
        this.myProperty = "bombEffect";
        this.myPropertyArr = ["bombEffect"];
        this.updateProperty();
        var skinNode = this.baseNode.getChildByName("BulletBombEffect");
        skinNode.setCompleteCallback(function(){
            cc.entityMgr.clearEntity(this);
        }.bind(this));
    },
    _onCollisionEnter(other,self){
        var monsterNode = other.node;
        monsterNode.onHitBullet(this);
        monsterNode.harm(this.propValue.harm);
    },
})