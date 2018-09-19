"use strict";
cc._RF.push(module, '1d158hDcShO7btMVzNRMpBy', 'TowerAreaBase');
// scripts/node/entity/tower/TowerAreaBase.js

"use strict";

cc.Class({
    extends: require("TowerBase"),
    ctor: function ctor() {
        this.group = "tower";
    },
    initGameData: function initGameData() {
        this._super();
    },
    _onCollisionEnter: function _onCollisionEnter(other, self) {},
    _onCollisionExit: function _onCollisionExit(other, self) {}
});

cc._RF.pop();