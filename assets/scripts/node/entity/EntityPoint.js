cc.Class({
    extends:require("EntityBase"),
    ctor(){
        this.curPassData = cc.passData.getCurPassData();
        var sp = this.addComponent(cc.Sprite);
        sp.spriteFrame = this.gameui.getSpriteFrame("ui-circle");
        var labelNode = new cc.Node();
        this.addChild(labelNode);
        this.label = labelNode.addComponent(cc.Label);
    },
    initGameData(){
        this._super();
    },
    initEntity(idx,roadIdx,pointIdx){
        this._super();
        this.myType = "pass";
        this.myIdx = idx;

        this.roadIdx = roadIdx;
        this.pointIdx = pointIdx;

        this.myProperty = "roadMap@"+roadIdx+"@"+pointIdx;
        this.myPropertyArr = this.myProperty.split("@");
        this.updateProperty();
    },
    unInitEntity(){
        this._super();
    },
    updateProperty(property){
        this._super(property);
        if(property&&(property.indexOf("@x")!=-1||property.indexOf("@y")!=-1)){
            cc.editData.modifyPoint(this.myIdx,this.roadIdx,this.pointIdx);
        }else{
            this.label.string = this.roadIdx+"|"+this.pointIdx;
        }
    },
    keyHandle(keyCode){
        switch(keyCode) {
            case cc.KEY.Delete:
                cc.editData.deletePoint(this.myIdx,this.roadIdx,this.pointIdx);
                break;
        }
    },
})