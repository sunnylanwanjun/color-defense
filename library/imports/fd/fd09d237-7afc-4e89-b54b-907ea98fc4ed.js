"use strict";
cc._RF.push(module, 'fd09dI3evxOibVLkH6pj8Tt', 'BulletBombEffect');
// scripts/node/entity/bullet/BulletBombEffect.js

"use strict";

cc.Class({
    extends: require("BulletBase"),
    ctor: function ctor() {
        this.xDir = cc.v2(1, 0);
    },
    initGameData: function initGameData() {
        this._super();
    },
    initEntity: function initEntity(idx) {
        this._super();
        this.myType = "tower";
        this.myIdx = idx;
        this.myProperty = "bombEffect";
        this.myPropertyArr = ["bombEffect"];
        this.updateProperty();
        var skinNode = this.baseNode.getChildByName("BulletBombEffect");
        skinNode.setCompleteCallback(function () {
            cc.entityMgr.clearEntity(this);
        }.bind(this));
    },
    _onCollisionEnter: function _onCollisionEnter(other, self) {
        var monsterNode = other.node;
        monsterNode.onHitBullet(this);
        monsterNode.harm(this.propValue.harm);
    }
});

cc._RF.pop();