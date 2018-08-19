cc.Class({
    extends:require("TowerAreaBase"),
    ctor(){
    
    },
    _onCollisionEnter(other,self){
        other.node.onHitBullet(this);
        other.node.slowDown(this.propValue.slowSpeed);
    },
    _onCollisionExit(other,self){
        other.node.onUnHitBullet(this);
        other.node.recoverSpeed();
    },
});