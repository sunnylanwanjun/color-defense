"use strict";
cc._RF.push(module, 'a8195f+zi5Mmr0FXsQ8onLj', 'TowerSlowDown');
// scripts/node/entity/tower/TowerSlowDown.js

"use strict";

cc.Class({
    extends: require("TowerAreaBase"),
    ctor: function ctor() {},
    _onCollisionEnter: function _onCollisionEnter(other, self) {
        other.node.onHitBullet(this);
        other.node.slowDown(this.propValue.slowSpeed);
    },
    _onCollisionExit: function _onCollisionExit(other, self) {
        other.node.onUnHitBullet(this);
        other.node.recoverSpeed();
    }
});

cc._RF.pop();