cc.Class({
    ctor(){
        this.playerID = 0;
        this.userName = "guest";
        this.curPassIdx = 0;
        this.curMaxPassIdx = 0;
        this.headIcon = "";
    },
    init(callback){
        if(window&&window.hasOwnProperty("FBInstant")){
            cc.log("begin init fbinstant data");

            var sdkVersion = FBInstant.getSDKVersion();
            cc.log("!!!!!!!!!!!!!!!!!!!!!!FBInstant sdkVersion",sdkVersion);

            this.playerID = FBInstant.player.getID();
            this.userName = FBInstant.player.getName();
            this.headIcon = FBInstant.player.getPhoto();

            //获取玩家数据
            FBInstant.player
            .getDataAsync(['curPassIdx', 'curMaxPassIdx'])
            .then(function(data) {
                this.curPassIdx = parseInt(data['curPassIdx']||0);
                this.curMaxPassIdx = parseInt(data['curMaxPassIdx']||0);
                cc.log("finished init fbinstant data");
                callback();
            }.bind(this));

            return;
        }

        cc.gameConfig.isTestMode = true;
        callback();
    },
    saveMaxPass(passIdx){
        if(passIdx<=this.curMaxPassIdx){
            return;
        }

        this.curMaxPassIdx = passIdx;
        if(window&&window.hasOwnProperty("FBInstant")){
            //存储玩家数据
            FBInstant.player
            .setDataAsync({
                curMaxPassIdx: this.curMaxPassIdx,
            })
            .then(function() {
                console.log('UserData:saveMaxPass setDataAsync',this.curMaxPassIdx);
            }.bind(this));

            //设置玩家统计数据
            FBInstant.player
            .setStatsAsync({
                curMaxPassIdx: this.curMaxPassIdx,
            })
            .then(function() {
                console.log('UserData:saveMaxPass setStatsAsync',this.curMaxPassIdx);
            }.bind(this));
            return;
        }
    },
    savePass(passIdx){
        this.curPassIdx = passIdx;
        if(window&&window.hasOwnProperty("FBInstant")){
            //存储玩家数据
            FBInstant.player
            .setDataAsync({
                curPassIdx: this.curPassIdx,
            })
            .then(function() {
                console.log('UserData:savePass setDataAsync',this.curPassIdx);
            }.bind(this));

            //设置玩家统计数据
            FBInstant.player
            .setStatsAsync({
                curPassIdx: this.curPassIdx,
            })
            .then(function() {
                console.log('UserData:savePass setStatsAsync',this.curPassIdx);
            }.bind(this));

            return;
        }
    },
})