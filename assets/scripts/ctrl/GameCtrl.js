var nop = function(){
    
}

cc.Class({
    ctor(){
        this.playADTimes = 0;
    },
    playPassAD(callback){
        callback = callback || nop;

        if(this.playADTimes<cc.gameConfig.adPlayInterval){
            cc.log("GameCtrl:playPassAD",this.playADTimes,cc.gameConfig.adPlayInterval);
            this.playADTimes++;
            return;
        }
        this.playADTimes=0;

        if(window&&window.hasOwnProperty("FBInstant")){
            cc.utils.openLoading();
            var ad = null;
            var placement_id = cc.gameConfig.adPassCode_FB;
            cc.log("GameCtrl:playPassAD placement_id",placement_id);
            FBInstant.getInterstitialAdAsync(
                placement_id,
            ).then(function(interstitial) {
                ad = interstitial;
                return ad.loadAsync();
            }).then(function() {
                // Ad loaded
                return ad.showAsync();
            }).then(function() {
                // Ad watched
                cc.utils.closeLoading();
                cc.log("GameCtrl:playPassAD success");
                callback(true);
            }.bind(this)).catch(function(err){
                cc.utils.closeLoading();
                cc.log("GameCtrl:playPassAD failure",err.message);
                callback(false);
            });
            return;
        }
        cc.log("GameCtrl:playItemAD can not play pass ad");
        callback(false);
    },
    addItem(){
        var curPassData = cc.passData.getCurPassData();
        var itemArr = cc.adConfig.giftItemArr;
        for(var key in itemArr){
            var itemInfo = itemArr[key];
            curPassData.addItem(itemInfo.itemType,itemInfo.itemNum);
        }
    },
    playItemAD(callback){
        callback = callback || nop;
        if(window&&window.hasOwnProperty("FBInstant")){
            cc.utils.openLoading();
            var ad = null;
            var placement_id = cc.gameConfig.adItemCode_FB;
            cc.log("GameCtrl:playPassAD placement_id",placement_id);
            FBInstant.getRewardedVideoAsync(
                placement_id,
            ).then(function(rewardedVideo) {
                ad = rewardedVideo;
                return ad.loadAsync();
            }).then(function() {
                // Ad loaded
                return ad.showAsync();
            }).then(function() {
                // Ad watched
                this.addItem();
                cc.utils.closeLoading();
                cc.log("GameCtrl:playItemAD success");
                callback(true);
            }.bind(this)).catch(function(err){
                cc.utils.closeLoading();
                cc.log("GameCtrl:playItemAD failure",err.message);
                callback(false);
            });
            return;
        }
        cc.log("GameCtrl:playItemAD can not play ad to get items");
        callback(false);
    },
    invite(callback){
        callback = callback || nop;
        if(window&&window.hasOwnProperty("FBInstant")){
            cc.utils.openLoading();

            FBInstant.context
            .chooseAsync()
            .then(function() {
                cc.utils.closeLoading();
                cc.log("GameCtrl:invite success",FBInstant.context.getID());
                callback(true);
            }).catch(function(err){
                cc.utils.closeLoading();
                cc.log("GameCtrl:invite failure",err.message);
                callback(false);
            });
            return;
        }
        cc.log("GameCtrl:invite can not invite");
        callback(false)
    },
    share(callback){
        callback = callback || nop;
        if(window&&window.hasOwnProperty("FBInstant")){
            cc.utils.openLoading();
            FBInstant.shareAsync({
                intent: 'SHARE',
                image: cc.gameConfig.shareBase64Img,
                text: "come on guys,let's protect water melon together",
                //data: { myReplayData: '...' },
            }).then(function() {
                cc.utils.closeLoading();
                cc.log("GameCtrl:share success");
                callback(true);
            }).catch(function(err){
                cc.utils.closeLoading();
                cc.log("GameCtrl:share failure",err.message);
                callback(false);
            });
            return;
        }
        cc.log("GameCtrl:share can not share");
        callback(false)
    },
    needShowRecommend(){
        if(window&&window.hasOwnProperty("FBInstant")){
            return cc.gameConfig.recommendGame_FB.length>0;
        }
        return false;
    },
    requestRecommend(idx,callback){
        callback = callback || nop;
        if(window&&window.hasOwnProperty("FBInstant")){
            var recommendConfig = cc.gameConfig.recommendGame_FB[idx];
            if(!recommendConfig){
                callback(false);
                return;
            }

            cc.utils.openLoading();
            FBInstant.switchGameAsync(recommendConfig.code).catch(function (err) {
                cc.utils.closeLoading();
                cc.log("GameCtrl:share failure",err.message,recommendConfig);
                callback(false);
            });
            return;
        }
        cc.log("GameCtrl:requestRecommend can not recommend");
        callback(false);
    }
});