"use strict";
cc._RF.push(module, 'ad1cfJZjfVNH6R/O7XH06K6', 'LayerRoot');
// scripts/component/LayerRoot.js

"use strict";

cc.Class({
    extends: cc.Component,
    properties: {
        nodePos: {
            default: undefined,
            type: cc.Label
        }
    },
    onLoad: function onLoad() {},
    onDestroy: function onDestroy() {
        cc.globalEvent.off("EditData:updateList", this.updateNodeSize, this);
    },
    start: function start() {
        cc.globalEvent.on("EditData:updateList", this.updateNodeSize, this);
        this.nodeX = parseInt(this.node.x);
        this.nodeY = parseInt(this.node.y);
        this.nodePos.string = "x:0 y:0";
        this.updateNodeSize();
    },
    backNodePos: function backNodePos() {
        var curPassIdx = cc.passData.getCurPassIdx();
        var passRow = cc.configData.getPassRow(curPassIdx);
        this.node.x = passRow.posx;
        this.node.y = passRow.posy;
    },
    update: function update() {
        var nodeX = parseInt(this.node.x);
        var nodeY = parseInt(this.node.y);
        if (this.nodeX != nodeX || this.nodeY != nodeY) {
            this.nodePos.string = "x:" + nodeX + " y:" + nodeY;
            this.nodeX = nodeX;
            this.nodeY = nodeY;
        }
    },
    updateNodeSize: function updateNodeSize() {
        var curPassIdx = cc.passData.getCurPassIdx();
        var passRow = cc.configData.getPassRow(curPassIdx);
        this.node.setContentSize(passRow.mapW, passRow.mapH);
        this.node.scale = passRow.scale;
    }
});

cc._RF.pop();