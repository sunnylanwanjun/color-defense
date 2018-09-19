"use strict";
cc._RF.push(module, '388b6A4kDdJarfb29hCFBZc', 'TowerDirBase');
// scripts/node/entity/tower/TowerDirBase.js

"use strict";

cc.Class({
    extends: require("TowerBase"),
    ctor: function ctor() {
        this.group = "tower";
        this.initDir = cc.v2(0, -1);
        this.xDir = cc.v2(1, 0);
    },
    initEntity: function initEntity() {
        this._super.apply(this, arguments);
    },
    initGameData: function initGameData() {
        this._super();

        this.gameData.targetQueue = [];
        this.gameData.curTarget = undefined;
        this.gameData.pickingTarget = false;
        this.gameData.goTime = undefined;
        this.gameData.rotateTime = cc.configData.towerAll.rotateTime;
        this.gameData.bulletInfo = undefined;
        this.gameData.launchInfoDirty = true;
    },
    unWork: function unWork() {
        this._super();
        this.gameData.targetQueue = [];
        this.gameData.curTarget = undefined;
        this.gameData.pickingTarget = false;
        this.gameData.goTime = undefined;
        this.gameData.bulletInfo = undefined;
        this.gameData.launchInfoDirty = true;
        this.unLaunchBullet();
    },
    launchBullet: function launchBullet() {},
    unLaunchBullet: function unLaunchBullet() {},
    getLaunchInfo: function getLaunchInfo() {
        if (this.gameData.launchInfoDirty) {
            var worldPos = this.baseNode.convertToWorldSpaceAR(cc.v2(this.propValue.bullet.x, this.propValue.bullet.y));
            var bulletPos = this.parent.convertToNodeSpaceAR(worldPos);
            //武器的方向，就是子弹的方向，把武器的本地方向转换成世界方向，就可以给子弹使用
            var worldDirPos = this.baseNode.convertToWorldSpaceAR(this.initDir);
            var worldBasePos = this.baseNode.convertToWorldSpaceAR(cc.Vec2.ZERO);
            var worldDir = cc.v2(worldDirPos.x - worldBasePos.x, worldDirPos.y - worldBasePos.y);
            var bulletAng = worldDir.signAngle(this.xDir);
            this.gameData.bulletInfo = { pos: bulletPos, ang: bulletAng };
        }
        return this.gameData.bulletInfo;
    },
    _onCollisionEnter: function _onCollisionEnter(other, self) {
        this.gameData.targetQueue.push(other.node);
    },
    updateProperty: function updateProperty(property) {
        if (!this._super(property)) {
            return false;
        }

        this.gameData.rotateTime = cc.configData.towerAll.rotateTime;
        this.gameData.launchInfoDirty = true;

        return true;
    },
    changeTargetFinished: function changeTargetFinished() {},
    pickTarget: function pickTarget() {
        if (this.gameData.pickingTarget) {
            return;
        }
        if (this.gameData.targetQueue.length == 0) return;
        this.gameData.pickingTarget = true;
        var target = this.gameData.targetQueue[0];
        var nextDir = cc.v2(target.x - this.x, target.y - this.y);
        var angle = cc.utils.getDirAng(this.x, this.y, this.initDir, target.x, target.y);
        var action = cc.sequence(cc.rotateTo(this.gameData.rotateTime, angle), cc.callFunc(function () {
            this.gameData.pickingTarget = false;
            this.gameData.curTarget = target;
            this.gameData.goTime = undefined;
            this.gameData.launchInfoDirty = true;
            this.changeTargetFinished();
        }, this));
        this.baseNode.runAction(action);
    },
    followTarget: function followTarget(target) {
        var angle = cc.utils.getDirAng(this.x, this.y, this.initDir, target.x, target.y);
        if (Math.abs(this.baseNode.rotation - angle) <= 0.001) {
            return;
        }
        this.baseNode.rotation = angle;
        this.gameData.launchInfoDirty = true;
    },
    logicUpdate: function logicUpdate(dt) {
        if (!this._super(dt)) {
            return false;
        }
        if (this.gameData.curTarget && !this.gameData.curTarget.isAlive()) {
            this.removeTarget(this.gameData.curTarget);
            this.gameData.curTarget = undefined;
        }
        if (!this.gameData.curTarget) {
            this.unLaunchBullet();
            if (!this.gameData.pickingTarget) {
                this.pickTarget();
            }
            return;
        }
        this.followTarget(this.gameData.curTarget);
        if (this.propValue.launchInterval) {
            if (this.gameData.goTime != undefined && this.gameData.goTime < this.propValue.launchInterval) {
                this.gameData.goTime += dt;
                return;
            }
            this.gameData.goTime = 0;
            this.launchBullet();
        } else {
            this.launchBullet();
        }
    },
    removeTarget: function removeTarget(removeNode) {
        for (var idx = 0; idx < this.gameData.targetQueue.length; idx++) {
            var target = this.gameData.targetQueue[idx];
            if (target === removeNode) {
                this.gameData.targetQueue.splice(idx, 1);
                if (target == this.gameData.curTarget) {
                    this.gameData.curTarget = undefined;
                }
                break;
            }
        }
    },
    _onCollisionExit: function _onCollisionExit(other, self) {
        this.removeTarget(other.node);
        if (other.node === this.gameData.curTarget) {
            this.gameData.curTarget = undefined;
        }
    }
});

cc._RF.pop();