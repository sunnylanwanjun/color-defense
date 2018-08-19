cc.Class({
    extends:cc.Component,
    properties:{
        passLabel:{
            default:undefined,
            type:cc.Label,
        },
        floorSize:{
            default:undefined,
            type:cc.EditBox,
        },
        layerNode:{
            default:undefined,
            type:cc.Node,
        }
    },
    onDestroy(){
        var manager = cc.director.getCollisionManager();
        manager.enabled = true;
        manager.enabledDebugDraw = false;
        manager.enabledDrawBoundingBox = false;
        this.layerMgr.unInitLayerMgr();
    },
    onLoad(){
        var manager = cc.director.getCollisionManager();
        manager.enabled = true;
        manager.enabledDebugDraw = cc.gameConfig.enabledDebugDraw_edit;
        manager.enabledDrawBoundingBox = cc.gameConfig.enabledDrawBoundingBox_edit;

        var LayerMgr = require("EditorLayerMgr");
        this.layerMgr = new LayerMgr();
        this.layerMgr.initLayerMgr(this.layerNode);
    },
    update(dt){
        this.layerMgr.logicUpdate(dt);
    },
    changeFloorSize(){
        cc.editData.editFloorSize(parseInt(this.floorSize.string));
    },
    eidtPass(){
        var curPassIdx = cc.passData.getCurPassIdx();
        this.passLabel.string = "pass:"+curPassIdx;
    },
    toGame(){
        var curPassIdx = cc.passData.getCurPassIdx();
        cc.passData.changePass(curPassIdx);
        cc.utils.loadScene("game");
    },
    toSelect(){
        cc.utils.loadScene("select");
    },
    showLayer(event,layerName){
        this.layerMgr.showLayer(layerName);
    }
})