cc.Class({
    extends:cc.Component,
    properties:{
        lostWnd:{
            default:undefined,
            type:cc.Node,
        },
        winWnd:{
            default:undefined,
            type:cc.Node,
        },
        lastWnd:{
            default:undefined,
            type:cc.Node,
        },
        recommendWnd:{
            default:undefined,
            type:cc.Node,
        },
        tpl:{
            default:undefined,
            type:cc.Node,
        },
        content:{
            default:undefined,
            type:cc.Node,
        }
    },
    ctor(){
        if(!CC_EDITOR){
            cc.globalEvent.on("CurData:updateResult",this.updateResult,this);
        }
    },
    onLoad(){
        this.recommendWnd.active = cc.gameCtrl.needShowRecommend();
        this.atlas = cc.resMgr.getRes(cc.resName.commonui);
        if(this.recommendWnd.active){
            var list = cc.gameConfig.recommendGame_FB;
            for(var i=0;i<list.length;i++){
                var newItem = this.tpl;
                if(i>0){
                    newItem = cc.instantiate(this.tpl);
                    newItem.parent = this.tpl.parent;
                }
                newItem.itemIdx = i;
                var frame = this.atlas.getSpriteFrame(list[i].icon);
                var sp = newItem.getComponent(cc.Sprite);
                sp.spriteFrame = frame;
            }

            var layout = this.content.getComponent(cc.Layout);
            var contentW = layout.paddingLeft + list.length*layout.spacingX + layout.paddingRight+list.length*this.tpl.width;
            if(this.content.width<contentW){
                this.content.width = contentW;
            }
        }
        this._isloaded_ = true;
        this.updateResult();
    },
    onDestroy(){
        cc.globalEvent.off("CurData:updateResult",this.updateResult,this);
    },
    updateResult(){
        if(!this._isloaded_)return;
        var curPassData = cc.passData.getCurPassData();
        var curPassIdx = cc.passData.getCurPassIdx();
        var passCount = cc.passData.getPassCount();
        if(curPassData.gameResult){
            this.node.active = true;
            if(curPassIdx<passCount-1){
                if(curPassData.gameResult=="win"){
                    this.winWnd.active = true;
                    this.lostWnd.active = false;
                }else{
                    this.winWnd.active = false;
                    this.lostWnd.active = true;
                }
                this.lastWnd.active = false;
            }else{
                if(curPassData.gameResult=="win"){
                    this.lostWnd.active = false;
                    this.winWnd.active = false;
                    this.lastWnd.active = true;
                }else{
                    this.lastWnd.active = false;
                    this.winWnd.active = false;
                    this.lostWnd.active = true;
                }
            }
        }else{
            this.node.active = false;
        }
    },
    share(){
        cc.gameCtrl.invite();
    },
    replay(){
        var curPassData = cc.passData.getCurPassData();
        curPassData.initGameData();    
    },
    next(){
        cc.gameCtrl.playPassAD(function(){
            var curPassIdx = cc.passData.getCurPassIdx();
            curPassIdx++;
            cc.passData.changePass(curPassIdx);
        }.bind(this));
    },
    main(){
        cc.utils.loadScene("select");
    },
    clickRecommend(event){
        var target = event.currentTarget;
        var itemIdx = target.itemIdx;
        cc.gameCtrl.requestRecommend(itemIdx);
    }
})