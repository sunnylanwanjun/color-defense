"use strict";
cc._RF.push(module, 'd1ff1Ls9aRNy6Ak58xDbmDL', 'BulletGuidemissile');
// scripts/node/entity/bullet/BulletGuidemissile.js

"use strict";

cc.Class({
    extends: require("BulletBase"),
    ctor: function ctor() {
        this.initDir = cc.v2(1, 0);
        this.curPassIdx = cc.passData.getCurPassIdx();
    },
    initGameData: function initGameData() {
        this._super();
        this.gameData.curTarget = undefined;
        this.gameData.launchAng = undefined;
        this.gameData.nextDir = undefined;
        this.gameData.nextAng = undefined;
        this.gameData.goAdjustInterval = 0;
    },
    initEntity: function initEntity(idx, target, launchAng) {
        this._super(idx);
        this.gameData.curTarget = target;
        this.gameData.launchAng = launchAng;
        this.updateProperty();
    },
    unInitEntity: function unInitEntity() {
        this._super();
    },
    updateProperty: function updateProperty(property) {
        if (!this._super(property)) {
            return false;
        }
        return true;
    },
    adjustNextDir: function adjustNextDir(dt) {
        if (!this.gameData.curTarget) return;
        if (this.gameData.goAdjustInterval != undefined && this.gameData.goAdjustInterval < this.propValue.adjustInterval) {
            this.gameData.goAdjustInterval += dt;
            return;
        }
        this.gameData.goAdjustInterval = 0;
        var nextDir = cc.v2(this.gameData.curTarget.x - this.x, this.gameData.curTarget.y - this.y);
        nextDir.normalizeSelf();
        this.gameData.nextDir = nextDir;

        this.gameData.nextAng = nextDir.signAngle(this.initDir);
    },
    adjustDir: function adjustDir(dt) {
        if (!this.gameData.nextDir) return;

        var launchAng = cc.utils.wrapRad_0_2pi(this.gameData.launchAng);
        var nextAng = cc.utils.wrapRad_0_2pi(this.gameData.nextAng);

        var changeDir = 1;
        var ang = nextAng - launchAng;
        if (ang > cc.utils.pi) {
            ang -= cc.utils.pi2;
        } else if (ang < -cc.utils.pi) {
            ang += cc.utils.pi2;
        }

        var endAng = launchAng + ang;
        if (ang < 0) changeDir = -1;
        launchAng += changeDir * this.propValue.adjustAng * dt;
        if (changeDir > 0) {
            if (launchAng > endAng) launchAng = endAng;
        } else {
            if (launchAng < endAng) launchAng = endAng;
        }

        this.gameData.launchAng = cc.utils.wrapRad_fpi_zpi(launchAng);
    },
    logicUpdate: function logicUpdate(dt) {
        if (!this.gameData.curTarget || !this.gameData.curTarget.isAlive()) {
            this.gameData.curTarget = cc.entityMgr.getNearEntity(this, "EntityMonster");
        }
        if (this.moveHelp != undefined) return;

        this.adjustNextDir(dt);
        this.adjustDir(dt);

        var deltaDis = this.propValue.speed * dt;
        var deltaX = deltaDis * Math.cos(this.gameData.launchAng);
        var deltaY = deltaDis * Math.sin(this.gameData.launchAng);
        this.x += deltaX;
        this.y += deltaY;
        /*使用dir1.signAngle(dir2) 求出的角度，当dir2转向dir1时，为正，dir1转
        向dir2时为负，ps，这个signAngle有时算出的结果不一定在-pi～pi之间，所以在
        上面计算launchAng时，把角度限制在0～360之间，手动计算步进的正负值，然后再
        换算到-pi~pi之间，这里计算图形的角度之所以要-90-launchAng，是因为cocos的
        旋转角是逆时针为负，顺时针为正，和我们求出来的角度顺序刚好相反，所以要对
        lanuchAng求反，至于为什么这里算出来的lanuchAng为什么不把顺序为cocos搞成
        一至，因为这个角度要用来计算速度的偏移值的，而这个速度必须与笛卡启尔坐标求正
        余弦一至。
        */
        this.baseNode.rotation = -90 - cc.utils.rad2ang(this.gameData.launchAng);
        if (cc.configData.isOutMap(this.curPassIdx, this)) {
            cc.entityMgr.clearEntity(this);
        }
    },
    _onCollisionEnter: function _onCollisionEnter(other, self) {
        var monsterNode = other.node;
        monsterNode.onHitBullet(this);
        monsterNode.harm(this.propValue.harm);
        cc.entityMgr.clearEntity(this);
    }
});

cc._RF.pop();