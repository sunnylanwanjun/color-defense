var ColliderCallback = cc.Class({
    extends:cc.Component,

    onCollisionEnter: function (other, self) {
        this.node._onCollisionEnter(other,self);
    },
      
    onCollisionStay: function (other, self) {
        this.node._onCollisionStay(other,self);
    },
    
    onCollisionExit: function (other, self) {
        this.node._onCollisionExit(other,self);
    }
});

var EntityBase = cc.Class({
    extends:cc.Node,
    _onCollisionEnter(other,self){},
    _onCollisionStay(other,self){},
    _onCollisionExit(other,self){},
    ctor(){
        this.gameui = cc.resMgr.getRes(cc.resName.gameui);
        this.editorui = cc.resMgr.getRes(cc.resName.editorui);
        this.commonui = cc.resMgr.getRes(cc.resName.commonui);
        this.bulletui = cc.resMgr.getRes(cc.resName.bulletui);
        this.addComponent(ColliderCallback);

        if(cc.resMgr.curSceneName == 'editor'){
            this.touchNode = new cc.Node();
            this.touchNode.setContentSize(70,70);
            this.touchNode.parent = this;
        }

        this.myType = undefined;
        this.myIdx = undefined;
        this.myProperty = undefined;
        this.myPropertyArr = undefined;
        this.propValue = undefined;
        this.rowValue = undefined;
        this.colliderObjArr = [];
        this.colliderInfoStr = undefined;
        
    },
    isAlive(){
        return this.active;
    },
    _keyHandle(event){
        if(!this.moveHelp)return;
        var keyObj = event.detail;
        this.keyHandle(keyObj.keyCode);
    },
    keyHandle(keyCode){
        switch(keyCode) {
            case cc.KEY.Delete:
                cc.entityMgr.clearEntity(this);
                break;
        }
    },
    initGameData(){
        this.gameData = {
            preState : cc.entityState.unknow,
            state : cc.entityState.unknow
        };
    },
    initEntity(...args){
        cc.globalEvent.on("EditData:updateList",this._updateProperty,this);
        cc.globalEvent.on(cc.SystemEvent.EventType.KEY_UP,this._keyHandle,this);
        if(cc.resMgr.curSceneName == 'editor'){
            this.touchNode.on('touchend',this.mouseUpHandle,this);
        }
        this.initGameData();
    },
    unInitEntity(){
        if(this.touchNode){
            this.touchNode.off('touchend',this.mouseUpHandle,this);
        }
        cc.globalEvent.off("EditData:updateList",this._updateProperty,this);
        cc.globalEvent.off(cc.SystemEvent.EventType.KEY_UP,this._keyHandle,this);
        cc.globalEvent.off("Entity:unSelect",this.unSelect,this);
        this.unSelect();
    },
    _onPreDestroy(){
        this._super();
    },
    _updateProperty(event){
        var detail = event.detail;
        if(detail.type && detail.type != this.myType){
            return false;
        }
        if(detail.idx && detail.idx != this.myIdx){
            return false;
        }
        if(!this.judgeProperty(detail.property)){
            return false;
        }
        this.updateProperty(detail.property);
    },
    judgeProperty(property){
        if(property&&this.myProperty){
            if(property.indexOf(this.myProperty)==-1&&
              this.myProperty.indexOf(property)==-1)return false;
        }
        return true;
    },
    enableCollider(val){
        for(var key in this.colliderObjArr){
            var colliderObj = this.colliderObjArr[key];
            if(colliderObj){
                colliderObj.enabled = val;
            }
        }
    },
    initColliderArr(){
        var colliderInfoStr = JSON.stringify(this.propValue.colliderArr);
        if(colliderInfoStr == this.colliderInfoStr)return;
        this.colliderInfoStr = colliderInfoStr;

        var isPreEnable = undefined;
        for(var key in this.colliderObjArr){
            var colliderObj = this.colliderObjArr[key];
            if(!colliderObj)continue;
            isPreEnable = colliderObj.active;
            colliderObj.destroy();
        }
        this.colliderObjArr = [];

        for(var key in this.propValue.colliderArr){
            var colliderInfo = this.propValue.colliderArr[key];
            if(!colliderInfo)continue;
            var colliderObj = cc.utils.newCCObj(colliderInfo,this);
            colliderObj.active = isPreEnable;
            this.colliderObjArr.push(colliderObj);
        }
    },
    updateProperty(property){
        if(!this.myType)return false;

        if(!property){
            this.listValue = cc.configData.getConfigList(this.myType);
            this.rowValue = this.listValue[this.myIdx];
            if(!this.rowValue)return false;
            if(this.myPropertyArr){
                this.propValue = cc.utils.getProperty(this.rowValue,...this.myPropertyArr);
                if(!this.propValue){
                    cc.error("EntityBase:updateProperty propValue is undefined",this.myType,
                    this.myIdx,this.myProperty);
                    return false;
                }
            }else{
                this.propValue = this.rowValue;
            }
        }

        if(this.propValue.colliderArr){
            this.initColliderArr();
        }

        this.x = this.propValue.x || this.x;
        this.y = this.propValue.y || this.y;

        //只更新xy坐标，其余操作没必要继续
        if(property&&(property.indexOf("@x")!=-1||property.indexOf("@y")!=-1)){
            return false;
        }
        return true;
    },
    mouseUpHandle(event){
        cc.globalEvent.off("Entity:unSelect",this.unSelect,this);
        this.select();
    },
    select(){
        cc.globalEvent.emit("Entity:unSelect");
        this.moveHelp = cc.instantiate(cc.resMgr.getRes(cc.resName.moveHelp));
        this.moveHelp.parent = this;

        var moveComp = this.moveHelp.getComponent(require("Move"));
        moveComp.setMoveHandle(function(){
            if(!this.propValue||!this.propValue.hasOwnProperty("x")){
                return;
            }
            this.propValue.x = this.x;
            this.propValue.y = this.y;
            cc.editData.modifyField(this.myType,this.myIdx,this.myProperty+"@x",this.x);
            cc.editData.modifyField(this.myType,this.myIdx,this.myProperty+"@y",this.y);
        }.bind(this));
        cc.editData.editRow(this.myType,this.myIdx);
        cc.globalEvent.on("Entity:unSelect",this.unSelect,this);
    },
    unSelect(){
        if(this.moveHelp){
            this.moveHelp.destroy();
            this.moveHelp = undefined;
        }
    },
    setState(state){
        this.gameData.preState = this.gameData.state;
        this.gameData.state = state;
    },
    getState(){
        return this.gameData.state;
    },
});

module.exports = EntityBase;