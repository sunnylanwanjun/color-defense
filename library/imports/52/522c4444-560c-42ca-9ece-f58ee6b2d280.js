"use strict";
cc._RF.push(module, '522c4REVgxCyp7O9Y7mstKA', 'Select');
// scripts/component/Select.js

"use strict";

cc.Class({
    extends: cc.Component,

    properties: {
        btnEditor: {
            default: undefined,
            type: cc.Node
        },
        btnPack: {
            default: undefined,
            type: cc.Node
        },
        headIcon: {
            default: undefined,
            type: cc.Node
        },
        userName: {
            default: undefined,
            type: cc.Label
        }
    },

    share: function share() {
        cc.gameCtrl.share();
    },


    // use this for initialization
    onLoad: function onLoad() {
        this.btnEditor.active = cc.gameConfig.isEditorMode;
        this.btnPack.active = cc.gameConfig.isEditorMode;
        cc.utils.loadNetImg(cc.userData.headIcon, this.headIcon, 80, 80);
        //var headUrl = "https://localhost/minigame/project4/resource/bullet/bullet/pistol-8-8.png";
        //cc.utils.loadNetImg(headUrl,this.headIcon,80,80);
        this.userName.string = cc.userData.userName;
    },

    // called every frame
    update: function update(dt) {},

    toMain: function toMain() {
        cc.utils.loadScene("main");
    },
    toEditor: function toEditor() {
        cc.log("select editor has not implement");
    },
    savePassAll: function savePassAll() {
        cc.passData.savePassAll();
    }
});

cc._RF.pop();