cc.Class({
    ctor(){
        
    },
    init(GameDataClass){
        this.passAll = cc.resMgr.getRes(cc.resName.passAll);
        this.passTpl = cc.resMgr.getRes(cc.resName.passTpl);
        this.curPassData = new GameDataClass();
    },
    changePass(passIdx){
        cc.log("PassData:changePass",passIdx);
        if(this.passAll.passArr[passIdx]){
            this.initCurPassData(passIdx);
        }else{
            var newPass = cc.utils.clone(this.passTpl.perPassTpl);
            newPass.idx = this.getPassCount();
            this.passAll.passArr.push(newPass);
            this.initCurPassData(passIdx);
        }
        cc.globalEvent.emit("PassData:changePass",passIdx);
    },
    initCurPassData(passIdx){
        this.curPassData.initConfigData(passIdx);
        cc.userData.savePass(passIdx);
    },
    getPassCount(){
        return this.passAll.passArr.length;
    },
    getCurPassData(){
        return this.curPassData;
    },
    getCurPassIdx(){
        return this.curPassData.passIdx;
    },
});