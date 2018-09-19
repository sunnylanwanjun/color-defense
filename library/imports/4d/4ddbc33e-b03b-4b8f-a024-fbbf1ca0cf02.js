"use strict";
cc._RF.push(module, '4ddbcM+sDtLj6Ak+78coM8C', 'GameRoot');
// scripts/component/GameRoot.js

"use strict";

cc.Class({
    extends: require("Touch"),
    onLoad: function onLoad() {
        this._super();
        this.towerClass = require("TowerBase");
        this.curPassData = cc.passData.getCurPassData();
        this.configData = this.curPassData.configData;
        cc.globalEvent.on("CurData:initGameData", this.initGameData, this);
        this.initGameData();
    },
    onDestroy: function onDestroy() {
        this._super();
        cc.globalEvent.off("CurData:initGameData", this.initGameData, this);
    },
    mouseEndHandle: function mouseEndHandle(mousePos, event) {
        cc.globalEvent.emit("GameTouch:touchend", { mousePos: mousePos, event: event });
    },
    mouseClickHandle: function mouseClickHandle(mousePos, event) {
        cc.globalEvent.emit("GameTouch:touchclick", { mousePos: mousePos, event: event });
    },
    mouseHoverHandle: function mouseHoverHandle(mousePos, event) {
        cc.globalEvent.emit("GameTouch:touchhover", { mousePos: mousePos, event: event });
    },
    mouseDownHandle: function mouseDownHandle(mousePos, event) {
        cc.globalEvent.emit("GameTouch:touchstart", { mousePos: mousePos, event: event });
    },
    mouseLeaveHandle: function mouseLeaveHandle(mousePos, event) {
        cc.globalEvent.emit("GameTouch:touchleave", { mousePos: mousePos, event: event });
    },
    mouseMoveHandle: function mouseMoveHandle(mousePos, event) {
        cc.globalEvent.emit("GameTouch:touchmove", { mousePos: mousePos, event: event });
    },
    initGameData: function initGameData() {
        this.allowMove = this.configData.isDrag;
        this.node.setContentSize(this.configData.mapW, this.configData.mapH);
        this.node.scale = this.configData.scale;
        this.node.x = this.configData.posx;
        this.node.y = this.configData.posy;
    }
});

cc._RF.pop();