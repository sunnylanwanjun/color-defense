cc.Class({
    ctor(){
        this.passAll = cc.resMgr.getRes(cc.resName.passAll);
        this.passTpl = cc.resMgr.getRes(cc.resName.passTpl);

        this.towerAll = cc.resMgr.getRes(cc.resName.towerAll);
        this.towerTpl = cc.resMgr.getRes(cc.resName.towerTpl);

        this.monsterAll = cc.resMgr.getRes(cc.resName.monsterAll);
        this.monsterTpl = cc.resMgr.getRes(cc.resName.monsterTpl);
    },
    isOutMap(passIdx,pos){
        var passRow = this.passAll.passArr[passIdx];
        var halfW = passRow.mapW*0.5;
        var halfH = passRow.mapH*0.5;
        if(pos.x<-halfW)return true;
        if(pos.x>halfW)return true;
        if(pos.y<-halfH)return true;
        if(pos.y>halfH)return true;
        return false;
    },
    getConfigRow(type,idx){
        var configList = this.getConfigList(type);
        if(!configList){
            return;
        }
        return configList[idx];
    },
    getPassRow(idx){
        return this.passAll.passArr[idx];
    },
    getConfigList(type){
        switch(type){
            case "pass":
            return this.passAll.passArr;
            break;
            case "tower":
            return this.towerAll.towerArr;
            break;
            case "monster":
            return this.monsterAll.monsterArr;
            break;
        }
        return undefined;
    },
    initAllTower_Level1_Info(){
        this.tower_level1_info_Map = {}
        var towerArr = this.towerAll.towerArr
        for(var key in towerArr){
            var towerInfo = towerArr[key];
            if(towerInfo.level == 1){
                this.tower_level1_info_Map[towerInfo.type] = towerInfo;
            }
        }
    },
    getTower_Level1_Info(type){
        return this.tower_level1_info_Map[type];
    }
});