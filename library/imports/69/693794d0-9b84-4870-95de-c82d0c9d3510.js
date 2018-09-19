"use strict";
cc._RF.push(module, '69379TQm4RIcJXeyC0MnTUQ', 'TowerBomb');
// scripts/node/entity/tower/TowerBomb.js

"use strict";

cc.Class({
    extends: require("TowerBase"),
    ctor: function ctor() {
        this.initDir = cc.v2(0, -1);
        this.xDir = cc.v2(1, 0);
    },
    initGameData: function initGameData() {
        this._super();
        this.gameData.buildBombTime = 0;
        this.gameData.curBombNum = 0;
        this.gameData.prepareToLaunch = false;
    },
    initEntity: function initEntity(idx, floorIdx) {
        this._super(idx, floorIdx);
        if (cc.resMgr.curSceneName != 'editor') {
            cc.globalEvent.on("GameTouch:touchend", this.touchendLayer, this);
            cc.globalEvent.on("GameTouch:touchleave", this.touchendLayer, this);
            cc.globalEvent.on("GameTouch:touchhover", this.touchhoverLayer, this);
        }
    },
    unInitEntity: function unInitEntity() {
        this._super();
        this.gameData.prepareToLaunch = false;
        if (cc.resMgr.curSceneName != 'editor') {
            cc.globalEvent.off("GameTouch:touchend", this.touchendLayer, this);
            cc.globalEvent.off("GameTouch:touchleave", this.touchendLayer, this);
            cc.globalEvent.off("GameTouch:touchhover", this.touchhoverLayer, this);
        }
    },
    logicUpdate: function logicUpdate(dt) {
        if (!this._super(dt)) {
            return false;
        }
        if (this.gameData.curBombNum < this.propValue.maxBombNum) {
            this.gameData.buildBombTime += dt;
            if (this.gameData.buildBombTime > this.propValue.buildBombTime) {
                this.gameData.buildBombTime = 0;
                this.gameData.curBombNum++;
            }
        } else {
            this.gameData.buildBombTime = 0;
        }
    },
    touchhoverLayer: function touchhoverLayer(event) {
        if (!this.gameData.prepareToLaunch) return;
        var touchInfo = event.detail;
        var touchPos = touchInfo.mousePos;
        var angle = cc.utils.getDirAng(this.x, this.y, this.initDir, touchPos.x, touchPos.y);
        this.baseNode.rotation = angle;
    },
    touchstartTower: function touchstartTower(event) {
        this._super(event);
        if (!this.canWork()) {
            return;
        }
        if (this.gameData.curBombNum == 0) {
            return;
        }
        this.gameData.prepareToLaunch = true;
        //当地图可拖拽时，点击炸弹塔，不让地图拖拽
        event.stopPropagation();
    },
    touchendLayer: function touchendLayer(event) {
        var touchInfo = event.detail;
        var touchPos = touchInfo.mousePos;
        var touchEvent = touchInfo.event;
        if (!this.gameData.prepareToLaunch) return;
        this.gameData.prepareToLaunch = false;
        var handleDis2 = cc.utils.dis2(touchPos, this);
        var handleRadius = this.propValue.handleRadius;
        if (handleDis2 > handleRadius * handleRadius) {
            cc.utils.tip("too far away from the bomb tower");
            return;
        }
        this.gameData.curBombNum--;

        var targetDir = cc.v2(touchPos.x - this.x, touchPos.y - this.y);
        var launchAng = targetDir.signAngle(this.xDir);
        var dis = cc.pDistance(this, touchPos);
        cc.entityMgr.createEntity("BulletBomb", this.x, this.y, this.myIdx, touchPos, launchAng, dis);
    }
});

cc._RF.pop();