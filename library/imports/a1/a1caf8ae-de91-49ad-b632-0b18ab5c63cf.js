"use strict";
cc._RF.push(module, 'a1cafiu3pFJrbYyCxirXGPP', 'HandleNode');
// scripts/component/HandleNode.js

'use strict';

cc.Class({
    extends: cc.Component,
    show: function show(event, value) {
        this.node.active = value == 'true';
    },
    switch: function _switch() {
        this.node.active = !this.node.active;
    }
});

cc._RF.pop();