"use strict";
cc._RF.push(module, '8adcfuZPDFNTb2az7ShDDVk', 'SkinMgr');
// scripts/node/SkinMgr.js

"use strict";

cc.Class({
    ctor: function ctor() {
        this.skinLayerMap = undefined;
    },
    initSkinMgr: function initSkinMgr(layerMap) {
        this.skinLayerMap = layerMap;
    },
    unInitSkinMgr: function unInitSkinMgr() {
        this.skinLayerMap = undefined;
    },
    getSkin: function getSkin(skinInfo, atlas) {
        var skinNode = undefined;
        if (skinInfo.type == "frame") {
            var AniFrameNode = require("AniFrameNode");
            skinNode = new AniFrameNode();
            if (atlas) {
                skinNode.updateAtlas(atlas);
            }
            skinNode.updateInfo(skinInfo);
        } else if (skinInfo.type == "partical") {
            var ParticalNode = require("ParticalNode");
            skinNode = new ParticalNode();
            if (atlas) {
                skinNode.updateAtlas(atlas);
            }
            skinNode.updateInfo(skinInfo);
        }
        return skinNode;
    },
    showSkin: function showSkin(posOrNode, skinInfo, atlas, layerName) {
        layerName = layerName || "effect";
        var layer = this.skinLayerMap[layerName];
        if (!layer) {
            cc.error("SkinMgr:showSkin layer is empty,layerName", layerName);
            return;
        }

        var pos = posOrNode;
        if (posOrNode instanceof cc.Node) {
            var worldPos = posOrNode.convertToWorldSpaceAR(cc.Vec2.ZERO);
            pos = layer.convertToNodeSpaceAR(worldPos);
        }

        var skin = this.getSkin(skinInfo, atlas);
        skin.x = pos.x;
        skin.y = pos.y;
        layer.addChild(skin);
    }
});

cc._RF.pop();