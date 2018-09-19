"use strict";
cc._RF.push(module, '44a562SQehC6opdm3oD5PGk', 'AniFrameNode');
// scripts/node/AniFrameNode.js

"use strict";

cc.Class({
    extends: require("SkinNode"),
    _onPreDestroy: function _onPreDestroy() {
        this._super();
    },
    ctor: function ctor() {
        this.sp = this.addComponent(cc.Sprite);
        this.skinInfoStr = undefined;
        this.atlas = undefined;
    },
    updateAtlas: function updateAtlas(atlas) {
        this.atlas = atlas;
    },
    setCompleteCallback: function setCompleteCallback(callback) {
        this.completeCallback = callback;
    },
    setColor: function setColor(colorStr) {
        this.color = cc.utils.color(colorStr);
    },
    resetSkinData: function resetSkinData() {
        this.name = "";
        this.x = 0;
        this.y = 0;
        this.anchorX = 0.5;
        this.anchorY = 0.5;
        this.rotation = 0;
        this.scale = 1;
        this.color = cc.color(255, 255, 255);
        this.autoDestroy = false;
        this.playCount = undefined;
        this.playTime = undefined;
        this.interval = 0.2;
        this.zIndex = 1;
    },
    resetAniData: function resetAniData() {
        this.curFrameIdx = 0;
        this.goTime = 0;
        this.playCountVar = 0;
        this.playTimeVar = 0;
    },
    updateInfo: function updateInfo(skinInfo) {
        var skinInfoStr = JSON.stringify(skinInfo);
        if (skinInfoStr == this.skinInfoStr) {
            return;
        }
        this.skinInfoStr = skinInfoStr;

        this.resetSkinData();
        this.resetAniData();

        this.name = skinInfo.findName || this.name;
        this.x = skinInfo.x || this.x;
        this.y = skinInfo.y || this.y;
        this.anchorX = skinInfo.anchorX || this.anchorX;
        this.anchorY = skinInfo.anchorY || this.anchorY;
        this.rotation = skinInfo.rotation || this.rotation;
        this.scale = skinInfo.scale || this.scale;
        this.color = cc.utils.color(skinInfo.color) || this.color;
        this.autoDestroy = skinInfo.autoDestroy || false;
        this.playCount = skinInfo.playCount;
        this.playTime = skinInfo.playTime;
        if (skinInfo.interval != undefined) {
            this.interval = skinInfo.interval;
        } else {
            this.interval = 0.2;
        }
        this.zIndex = skinInfo.zIndex || this.zIndex;
        if (skinInfo.atlas != undefined) {
            this.atlas = cc.resMgr.getRes(cc.resName[skinInfo.atlas]);
        }

        var skins = skinInfo.name;
        var skinsArr = skins.split("@");
        if (skinsArr.length < 2) {
            cc.error("AniFrame skinsArr length <2");
            return;
        }
        var skinsPrefix = skinsArr[0];
        var framesLen = parseInt(skinsArr[1]);
        this.frames = [];
        for (var i = 1; i <= framesLen; i++) {
            var spFrame = this.atlas.getSpriteFrame(skinsPrefix + "-" + i);
            if (spFrame) {
                this.frames.push(spFrame);
            }
        }

        if (this.frames.length > 0) {
            this.sp.spriteFrame = this.frames[0];
        }

        if (this.frames.length <= 1 && this.playCount === undefined && this.playTime === undefined) {
            this.sp.update = undefined;
        } else {
            this.sp.update = function (dt) {
                if (this.playCount !== undefined) {
                    if (this.playCountVar >= this.playCount) {
                        if (this.autoDestroy) {
                            this.destroy();
                            return;
                        }
                        this.resetAniData();
                        this.active = false;
                        this.completeCallback(this);
                        return;
                    }
                }
                if (this.playTime !== undefined) {
                    if (this.playTimeVar > this.playTime) {
                        if (this.autoDestroy) {
                            this.destroy();
                            return;
                        }
                        this.resetAniData();
                        this.active = false;
                        this.completeCallback(this);
                        return;
                    }
                }
                this.goTime += dt;
                if (this.goTime < this.interval) return;
                this.goTime = 0;
                this.playTimeVar += dt;
                this.sp.spriteFrame = this.frames[this.curFrameIdx];
                this.curFrameIdx++;
                if (this.curFrameIdx >= this.frames.length) {
                    this.curFrameIdx = 0;
                    this.playCountVar++;
                }
            }.bind(this);
        }
    }
});

cc._RF.pop();