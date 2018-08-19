cc.Class({
    extends:require("EntityBase"),
    ctor(){
        this.group = "bullet";
        this.baseNode = new cc.Node();
        this.baseNode.parent = this;

        var PoolMgr = require("PoolMgr");
        this.poolMgr = new PoolMgr;
        this.poolMgr.setBuildFunc(function(type,skinInfo){
            var skinNode = cc.skinMgr.getSkin(skinInfo);
            skinNode.parent = this.baseNode;
            return skinNode;
        }.bind(this));
        this.poolMgr.setResetFunc(function(type,skinNode){
            skinNode.active = false;
        }.bind(this));
    },
    initEntity(idx){
        this._super();
        this.myType = "tower";
        this.myIdx = idx;
        this.myProperty = "bullet";
        this.myPropertyArr = ["bullet"];
        this.updateProperty();
    },
    unInitEntity(){
        this._super();
    },
    updateProperty(property){
        if(!this._super(property)){
            return false;
        }
        this.poolMgr.resetAll();
        for(var key in this.propValue.skinArr){
            var skinInfo = this.propValue.skinArr[key];
            var skinNode = this.poolMgr.get(skinInfo.name,skinInfo);
            skinNode.active = true;
            skinNode.updateInfo(skinInfo);
        }
        return true;
    },
})