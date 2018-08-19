cc.Class({
    ctor(){
        
    },
    //////////////////////////////////////////////////////////////
    //游戏配置
    initConfigData(passIdx){
        this.passIdx = passIdx;
        this.configData = cc.configData.getPassRow(passIdx);

        this.initGameData();
    },
    initGameData(){
        
    }
});