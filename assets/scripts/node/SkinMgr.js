cc.Class({
    ctor(){
        this.skinLayerMap = undefined;
    },
    initSkinMgr(layerMap){
        this.skinLayerMap = layerMap;
    },
    unInitSkinMgr(){
        this.skinLayerMap = undefined;
    },
    getSkin(skinInfo,atlas){
        var skinNode = undefined;
        if(skinInfo.type == "frame"){
            var AniFrameNode = require("AniFrameNode");
            skinNode = new AniFrameNode();
            if(atlas){
                skinNode.updateAtlas(atlas);
            }
            skinNode.updateInfo(skinInfo);
        }else if(skinInfo.type == "partical"){
            var ParticalNode = require("ParticalNode");
            skinNode = new ParticalNode();
            if(atlas){
                skinNode.updateAtlas(atlas);
            }
            skinNode.updateInfo(skinInfo);
        }
        return skinNode;
    },
    showSkin(posOrNode,skinInfo,atlas,layerName){
        layerName = layerName || "effect";
        var layer = this.skinLayerMap[layerName];
        if(!layer){
            cc.error("SkinMgr:showSkin layer is empty,layerName",layerName);
            return;
        }

        var pos = posOrNode;
        if(posOrNode instanceof cc.Node){
            var worldPos = posOrNode.convertToWorldSpaceAR(cc.Vec2.ZERO);
            pos = layer.convertToNodeSpaceAR(worldPos);
        }

        var skin = this.getSkin(skinInfo,atlas);
        skin.x = pos.x;
        skin.y = pos.y;
        layer.addChild(skin);
    },
});