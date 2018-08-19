cc.Class({
    extends:cc.Component,
    properties:{
        operateToggle:{
            default:undefined,
            type:cc.ToggleContainer,
        },
        gameRoot:{
            default:undefined,
            type:require("GameRoot"),
        }
    },
    ctor(){
        if(!CC_EDITOR){
            cc.globalEvent.on("Game:operateTower",this.operateTower,this);
            cc.globalEvent.on("CurData:updateResult",this.updateResult,this);
            this.curPassData = cc.passData.getCurPassData();
        }
    },
    onLoad(){
        
    },
    onDestroy(){
        cc.globalEvent.off("Game:operateTower",this.operateTower,this);cc.globalEvent.off("CurData:updateResult",this.updateResult,this);
    },
    updateResult(){
        this.node.active = (this.curPassData.gameResult == undefined);
    },
    operateTower(event){
        if(this.gameRoot.isMouseMove)return;
        this.node.active = true;
        var detail = event.detail;
        this.entityTower = detail;
    },
    onDisable(){
        this.entityTower = undefined;
    },
    yesOperate(){
        var toggle = cc.utils.getToggleCheckNode(this.operateToggle);
        if(toggle){
            switch(toggle.name){
                case "UpLevel":
                if(!this.entityTower.hasNextLevel()){
                    cc.utils.tip("the tower is top level");
                    return;
                }
                var cost = this.entityTower.propValue.uplevelCost;
                if( -cost > this.curPassData.gameData.gold ){
                    cc.utils.tip("gold is not enough");
                    return;
                }
                this.curPassData.changeGold(cost);
                this.entityTower.setState(cc.entityState.upleveling);
                break;
                case "DestroyTower":
                this.entityTower.setState(cc.entityState.destroying);
                break;
            }
        }else{
            cc.utils.tip("please select a tower type");
            return;
        }
        this.node.active = false;
    },
    noOperate(){
        this.node.active = false;
    },
})