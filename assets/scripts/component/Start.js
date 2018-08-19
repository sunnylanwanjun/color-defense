cc.Class({
    extends: cc.Component,

    properties: {
        progress:{
            default:undefined,
            type:cc.Label,
        }
    },

    // use this for initialization
    onLoad: function () {
        
        require("StringEx");

        cc.constVal = require("ConstVal");
        cc.resName = cc.constVal.ResName;
        cc.entityState = cc.constVal.EntityState;
        cc.handleColor = cc.constVal.HandleColor;

        cc.globalEvent = new cc.EventTarget();
        
        var MyTimer = require("MyTimer");
        cc.timer = new MyTimer();

        var Utils = require("Utils");
        cc.utils = new Utils();

        var ResMgr = require("ResMgr");
        cc.resMgr = new ResMgr();
        cc.resMgr.init(cc.constVal.ResName,
            cc.constVal.ResConfig,
            cc.constVal.CommonRes,
            cc.constVal.ScenePreloadRes);

        cc.resMgr.loadCommon(function(err){
            if(err){
                return;
            }
            cc.log("load common finished");
            this.initGameData();
        }.bind(this),function(err,loadedResName,loadedNum,totalNum){
            if(err){
                return;
            }
            cc.log("loadProgress",loadedResName,loadedNum,totalNum);
            this.progress.string = "loading("+loadedNum+"/"+totalNum+")";
        }.bind(this));
    },

    // called every frame
    update: function (dt) {

    },

    initGameData: function(){
        cc.gameConfig = cc.resMgr.getRes(cc.resName.gameConfig);
        cc.adConfig = cc.resMgr.getRes(cc.resName.adConfig);

        var UserData = require("UserData");
        cc.userData = new UserData();
        cc.userData.init(function(){
            this.initGame();
        }.bind(this));
    },

    initGame: function(){
        var PassData = require("PassData");
        cc.passData = new PassData();
        var GameDataClass = require("ColorData");
        cc.passData.init(GameDataClass);

        var ConfigData = require("ConfigData");
        cc.configData = new ConfigData();

        var EditData = require("EditData");
        cc.editData = new EditData();

        var GameCtrl = require("GameCtrl");
        cc.gameCtrl = new GameCtrl();

        var EntityMgr = require("EntityMgr");
        cc.entityMgr = new EntityMgr();

        var SkinMgr = require("SkinMgr");
        cc.skinMgr = new SkinMgr();

        cc.utils.loadScene("main");
    }
});
