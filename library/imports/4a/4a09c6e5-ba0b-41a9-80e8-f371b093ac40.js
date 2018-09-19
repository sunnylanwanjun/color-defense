"use strict";
cc._RF.push(module, '4a09cblugtBqYDo83Gwk6xA', 'Alert');
// scripts/component/Alert.js

"use strict";

var nop = function nop() {};

cc.Class({
    extends: cc.Component,
    properties: {
        title: {
            default: undefined,
            type: cc.Label
        }
    },
    onLoad: function onLoad() {},
    init: function init(title, yesCallback, noCallback) {
        this.yesCallback = yesCallback || nop;
        this.noCallback = noCallback || nop;
        this.title.string = title;
    },
    clickYes: function clickYes() {
        this.yesCallback();
        this.node.destroy();
    },
    clickNo: function clickNo() {
        this.noCallback();
        this.node.destroy();
    }
});

cc._RF.pop();