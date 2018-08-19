cc.Class({
    extends:require("Grid"),
    properties:{
        roadNumber:{
            default:undefined,
            type:cc.EditBox
        }
    },
    start(){
        this._super();
        this.gridHelp.destroy();
        this.gridHelp = undefined;
        this.curPassData = cc.passData.getCurPassData();

        this.gameui = cc.resMgr.getRes(cc.resName.gameui);
        var node = new cc.Node();
        node.color = cc.color(255,0,0);
        var sp = node.addComponent(cc.Sprite);
        sp.spriteFrame = this.gameui.getSpriteFrame("ui-circle");
        node.parent = this.node;
        node.active = false;
        this.hoverEntity = node;

        cc.globalEvent.on("EditData:clearWantPlaceEntity",
        this.clearWantPlaceEntityHandle,this);
    },
    onDestroy(){
        this._super();
        cc.globalEvent.off("EditData:clearWantPlaceEntity",
        this.clearWantPlaceEntityHandle,this);
    },
    clearWantPlaceEntityHandle(event){
        this.hoverEntity.active = false;
    },
    mouseHoverHandle(mousePos){
        if(!this._super(mousePos)){
            return;
        }

        var wantPlaceEntity = cc.editData.wantPlaceEntity;
        if(!wantPlaceEntity.entityType){
            this.hoverEntity.active = false;
        }else{
            this.hoverEntity.active = true;
        }

        var gridInfo = this.getGridPos(mousePos.x,mousePos.y);
        this.hoverEntity.x = gridInfo.x;
        this.hoverEntity.y = gridInfo.y;
    },
    mouseDownHandle(mousePos){
        var placeInfo = cc.editData.wantPlaceEntity;
        var entityType = placeInfo.entityType;
        var configIdx = placeInfo.configIdx;
        if(!placeInfo.entityType){
            return;
        }
        
        var gridInfo = this.getGridPos(mousePos.x,mousePos.y);
        var x = gridInfo.x;
        var y = gridInfo.y;

        switch(entityType){
            case "EntityPoint":
                var roadNumber = parseInt(this.roadNumber.string);
                cc.editData.newPoint(configIdx,x,y,roadNumber);
                return;
            break;
            case "EntityBorn":
                cc.editData.newBorn(configIdx,x,y);
            break;
            case "EntityTarget":
                cc.editData.newTarget(configIdx,x,y);
            break;
            case "EntityFloor":
                cc.editData.newFloor(configIdx,x,y);
                return;
            break;
            default:
                cc.entityMgr.createEntity(entityType,x,y,configIdx);
            break;
        }

        cc.editData.clearWantPlaceEntity();
        this.hoverEntity.active = false;
    },
});