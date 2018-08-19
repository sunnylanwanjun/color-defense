var MyParticleSystem = cc.Class({
    extends:cc.ParticleSystem,
    onEnable(){
        this._super();
        this._sgNode.resetSystem();
    },
    applyContent: function (content,texture,textureRect) {
        var self = this;
        if (!self.isValid) {
            return;
        }
        var sgNode = self._sgNode;
        //sgNode.particleCount = 0;
        
        var active = sgNode.isActive();

        sgNode._plistFile = "";
        sgNode.initWithDictionary(content, '');
        if(texture){
            sgNode.setTextureWithRect(texture,textureRect);
        }

        // For custom data export
        if (content.emissionRate) {
            self.emissionRate = content.emissionRate;
        }

        // recover sgNode properties

        sgNode.setPosition(0, 0);

        if (!active) {
            sgNode.stopSystem();
        }

        if (!CC_EDITOR || cc.engine.isPlaying) {
            self._applyAutoRemove();
        }

        // if become custom after loading
        if (self._custom) {
            self._applyCustoms();
        }
            
    },
});

var ParticalNode = cc.Class({
    extends:require("SkinNode"),
    _onPreDestroy(){
        this._super();
    },
    ctor(){
        this.partical = this.addComponent(MyParticleSystem);
        this.skinInfoStr = undefined;
        this.skinInfo = undefined;
        this.atlas = undefined;
    },
    updateAtlas(atlas){
        this.atlas = atlas;
    },
    setCompleteCallback(callback){
        this.completeCallback = callback;
    },
    resetSkinData(){
        this.name = "";
        this.x = 0;
        this.y = 0;
        this.anchorX = 0.5;
        this.anchorY = 0.5;
        this.rotation = 0;
        this.scale = 1;
        this.autoDestroy = false;
        this.playTime = undefined;
        this.zIndex = 0;
    },
    resetAniData(){
        this.playTimeVar = 0;
    },
    setColor(colorStr){
        if(this.skinInfo.color === colorStr){
            return;
        }
        this.skinInfo.color = colorStr;
        this.updateInfo(this.skinInfo);
    },
    updateInfo(skinInfo){
        var skinInfoStr = JSON.stringify(skinInfo);
        if(skinInfoStr == this.skinInfoStr){
            return;
        }
        this.skinInfoStr = skinInfoStr;
        this.skinInfo = JSON.parse(skinInfoStr);

        this.resetSkinData();
        this.resetAniData();

        this.name = skinInfo.findName || this.name;
        this.x = skinInfo.x || this.x;
        this.y = skinInfo.y || this.y;
        this.anchorX = skinInfo.anchorX || this.anchorX;
        this.anchorY = skinInfo.anchorY || this.anchorY;
        this.rotation = skinInfo.rotation || this.rotation;
        this.scale = skinInfo.scale || this.scale;
        this.zIndex = skinInfo.zIndex || this.zIndex;
        this.autoDestroy = skinInfo.autoDestroy || false;
        this.playTime = skinInfo.playTime;
        if(skinInfo.atlas!=undefined){
            this.atlas = cc.resMgr.getRes(cc.resName[skinInfo.atlas]);
        }

        var originUpdate = cc.ParticleSystem.prototype.update;
        if(this.playTime !== undefined){
            this.partical.update = function(dt){
                if(originUpdate){
                    originUpdate.call(this.partical,dt);
                }
                this.playTimeVar += dt;
                if(this.playTime !== undefined){
                    if(this.playTimeVar>this.playTime){
                        if(this.autoDestroy){
                            this.destroy();
                            return;
                        }
                        this.resetAniData();
                        this.active = false;
                        this.completeCallback(this);
                        return;
                    }
                }
            }.bind(this);
        }else{
            this.partical.update = originUpdate;
        }

        cc.resMgr.loadTempRes(skinInfo.name,function(err,asset){
            if(err){
                return;
            }

            // if(this.partical){
            //     this.partical.destroy();
            //     this.partical = undefined;
            // }
            // this.partical = this.addComponent(cc.ParticleSystem);
            // this.partical.file = cc.url.raw("resources/"+skinInfo.name+".plist");

            var newAsset = cc.utils.clone(asset);
            var texture = undefined;
            var textureRect = undefined;
            if(this.atlas){
                var spriteFrameName = newAsset.textureFileName.replace(/.png/,"");
                spriteFrameName = "partical-"+spriteFrameName;
                var spriteFrame = this.atlas.getSpriteFrame(spriteFrameName);
                if(spriteFrame){
                    texture = spriteFrame.getTexture();
                    textureRect = spriteFrame.getRect();
                    cc.textureCache.cacheImage(spriteFrameName,texture);
                }
            }
            newAsset.textureFileName = cc.url.raw("resources/partical/"+newAsset.textureFileName);

            var color = cc.utils.color(skinInfo.color);
            if(color){
                newAsset.startColorGreen = color.g/255;
                newAsset.startColorBlue = color.b/255;
                newAsset.startColorRed = color.r/255;

                newAsset.finishColorBlue = newAsset.startColorGreen;
                newAsset.finishColorGreen = newAsset.startColorBlue;
                newAsset.finishColorRed = newAsset.startColorRed;
            }

            if(cc.isValid(this)){
                this.partical.applyContent(newAsset,texture,textureRect);
            }
        }.bind(this),cc.ParticleAsset);
    },
});
module.exports = ParticalNode;