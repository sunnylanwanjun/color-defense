"use strict";
cc._RF.push(module, 'fbb18z4R6tNWIOooTHThgxD', 'Touch');
// scripts/component/Touch.js

'use strict';

cc.Class({
    extends: cc.Component,
    properties: {
        allowMove: true
    },
    onLoad: function onLoad() {},
    onDestroy: function onDestroy() {},
    start: function start() {
        this.node.on('mousemove', this.__mouseMoveHandle, this);

        this.node.on('touchstart', this.__mouseDownHandle, this);
        this.node.on('touchmove', this.__mouseMoveHandle, this);
        this.node.on('touchend', this.__mouseUpHandle, this);
        this.node.on('touchcancel', this.__mouseLeaveHandle, this);
    },
    mouseLeaveHandle: function mouseLeaveHandle() {},
    __mouseLeaveHandle: function __mouseLeaveHandle(event) {
        this.isMouseDown = false;
        this.isMouseMove = false;
        var mousePos = event.getLocation();
        mousePos = this.node.convertToNodeSpaceAR(cc.v2(mousePos.x, mousePos.y));
        this.mouseLeaveHandle(mousePos, event);
    },
    mouseEnterHandle: function mouseEnterHandle() {},
    __mouseEnterHandle: function __mouseEnterHandle(event) {},
    mouseDownHandle: function mouseDownHandle() {},
    __mouseDownHandle: function __mouseDownHandle(event) {
        this.downMousePos = event.getLocation();
        this.isMouseDown = true;
        var mousePos = this.node.convertToNodeSpaceAR(cc.v2(this.downMousePos.x, this.downMousePos.y));
        this.mouseDownHandle(mousePos, event);
    },
    mouseHoverHandle: function mouseHoverHandle() {},
    __mouseMoveHandle: function __mouseMoveHandle(event) {
        var curMousePos = event.getLocation();
        var hoverPos = this.node.convertToNodeSpaceAR(cc.v2(curMousePos.x, curMousePos.y));
        this.mouseHoverHandle(hoverPos, event);

        if (!this.isMouseDown) {
            return;
        }

        if (Math.abs(this.downMousePos.x - curMousePos.x) < 4 && Math.abs(this.downMousePos.y - curMousePos.y) < 4) {
            return;
        }

        this.isMouseMove = true;

        if (this.allowMove) {
            var delta = event.getDelta();
            this.node.x += delta.x;
            this.node.y += delta.y;
        }

        this.mouseMoveHandle(hoverPos, event);
    },
    mouseEndHandle: function mouseEndHandle() {},
    mouseClickHandle: function mouseClickHandle() {},
    __mouseUpHandle: function __mouseUpHandle(event) {
        var curMousePos = event.getLocation();
        var upPos = this.node.convertToNodeSpaceAR(cc.v2(curMousePos.x, curMousePos.y));
        this.mouseEndHandle(upPos, event);
        this.isMouseDown = false;
        if (this.isMouseMove) {
            this.isMouseMove = false;
            return;
        }
        this.mouseClickHandle(upPos, event);
    }
});

cc._RF.pop();