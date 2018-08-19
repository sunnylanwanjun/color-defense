cc.Class({
    extends:require("EntityBase"),
    ctor(){
        var sp = this.addComponent(cc.Sprite);
        sp.spriteFrame = this.gameui.getSpriteFrame("ui-circle");
    },
    clickFloor(){
        cc.globalEvent.emit("Game:createTower",this);
    },
    initGameData(){
        this._super();
    },
    initEntity(idx,floorIdx){
        this._super();

        if(cc.resMgr.curSceneName != 'editor'){
            this.on('touchend',this.clickFloor,this);
        }

        this.myType = "pass";
        this.myIdx = idx;  
        this.floorIdx = floorIdx;
        this.myProperty = "floorArr@"+floorIdx;
        this.myPropertyArr = this.myProperty.split("@");
        this.floorInfo = cc.configData.passAll.floorInfo;
        this.updateProperty();
    },
    unInitEntity(){
        this._super();
        
        if(cc.resMgr.curSceneName != 'editor'){
            this.off('touchend',this.clickFloor,this);
        }
    },
    judgeProperty(property){
        if(property&&this.myProperty){
            if(property.indexOf(this.myProperty)==-1&&
               this.myProperty.indexOf(property)==-1&&
               property.indexOf("floorInfo")==-1){
              return false;
            }
        }
        return true;
    },
    updateProperty(property){
        if(!this._super(property)){
            return false;
        }
        if(property&&property.indexOf("floorInfo")!=-1){
            this.setContentSize(this.floorInfo.w,
                this.floorInfo.h);
            return false;
        }
        return true;
    },
    keyHandle(keyCode){
        switch(keyCode) {
            case cc.KEY.Delete:
                cc.editData.deleteFloor(this.myIdx,this.floorIdx);
                break;
        }
    },
})