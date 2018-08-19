cc.Class({
    extends:require("LayerMgr"),
    ctor(){
        
    },
    unInitLayerMgr(){
        cc.globalEvent.off("EditData:updateList",this.updateList,this);
        cc.systemEvent.off(cc.SystemEvent.EventType.KEY_UP,this._keyHandle,this);
        this.entityMgr.unInitEntityMgr();
        this.skinMgr.unInitSkinMgr();
    },
    keyHandle(keyObj){
        cc.globalEvent.emit(cc.SystemEvent.EventType.KEY_UP,keyObj);
    },
    initLayerMgr(node){
        this._super(node);

        cc.globalEvent.on("EditData:updateList",this.updateList,this);
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_UP,this.keyHandle,this);

        this.entityMgr = cc.entityMgr;
        this.skinMgr = cc.skinMgr;
        this.entityMgr.initEntityMgr(this.layerMap);
        this.skinMgr.initSkinMgr(this.layerMap);

        this.updatePoint();
        this.updateFloor();
        this.updateBorn();
        this.updateTarget();
        this.updateRoad();
    },
    logicUpdate(dt){
        this.entityMgr.logicUpdate(dt);
        this._updatePoint();
        this._updateFloor();
        this._updateBorn();
        this._updateTarget();
        this._updateRoad();
    },
    updateList(event){
        var detail = event.detail;
        if(detail.type != "pass"||!detail.property){
            return;
        }
        if(detail.property.indexOf("roadMap")!=-1||
           detail.property.indexOf("updateRoad")!=-1
        ){
            this.updateRoad();
        }
        if(detail.property == "roadMap"){
            this.updatePoint();
            return;
        }
        if(detail.property == "bornArr"){
            this.updateBorn();
            return;
        }
        if(detail.property == "floorArr"){
            this.updateFloor();
            return;
        }
        if(detail.property == "targetArr"){
            this.updateTarget();
            return;
        }
    },
})