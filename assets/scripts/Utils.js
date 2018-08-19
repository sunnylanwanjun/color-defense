cc.Class({
    ctor(){
        this.pi = 3.1415926;
        this.pi2 = 6.2831852;
        this.pid2 = 1.5707963265;

        this.alertZIndex = 100;
        this.tipZIndex = 1000;

        var Pool = require("Pool");
        this.tipPool = new Pool();
        this.tipPool.setBuildFunc(function(){
            var tipNode = new cc.Node();
            tipNode.color = cc.color(255,0,0);
            var label = tipNode.addComponent(cc.Label);
            label.fontSize = 80;
            label.lineHeight = 100;
            return tipNode;
        }.bind(this));
        this.tipPool.setResetFunc(function(tipNode){
            tipNode.removeFromParent();
            tipNode.opacity = 255;
            this.center(tipNode);
        }.bind(this));
    },
    deletePropertyFromArr(arr,...args){
        for(var key in arr){
            var obj = arr[key];
            if(!obj)continue;
            this.deleteProperty(obj,...args);
        }
    },
    setPropertyFromArr(arr,...args){
        for(var key in arr){
            var obj = arr[key];
            if(!obj)continue;
            this.setProperty(obj,...args);
        }
    },
    deleteProperty(obj,...args){
        if(!obj)return undefined;
        var argsLen = arguments.length-1;
        for(var i=0;i<argsLen-1;i++){
            if(!obj[args[i]]){
               return false;
            }
            obj = obj[args[i]];
        }
        delete obj[args[argsLen-1]];
        return true;
    },
    getPropertyOrInit(obj,...args){
        if(!obj)return undefined;
        var argsLen = arguments.length-1;
        for(var i=0;i<argsLen;i++){
            if(!obj[args[i]]){
                obj[args[i]] = {}
            }
            obj = obj[args[i]];
        }
        return obj;
    },
    getProperty(obj,...args){
        if(!obj)return undefined;
        var argsLen = arguments.length-1;
        for(var i=0;i<argsLen;i++){
            if(!obj[args[i]]){
                return undefined;
            }
            obj = obj[args[i]];
        }
        return obj;
    },
    setIfUndef(obj,...args){
        if(!obj)return undefined;
        var argsLen = arguments.length-1;
        for(var i=0;i<argsLen-2;i++){
            if(!obj[args[i]]){
                obj[args[i]] = {}
            }
            obj = obj[args[i]];
        }
        if(obj[args[argsLen-2]]){
            return;
        }
        obj[args[argsLen-2]] = args[argsLen-1];
    },
    setProperty(obj,...args){
        if(!obj)return undefined;
        var argsLen = arguments.length-1;
        for(var i=0;i<argsLen-2;i++){
            if(!obj[args[i]]){
                obj[args[i]] = {}
            }
            obj = obj[args[i]];
        }
        obj[args[argsLen-2]] = args[argsLen-1];
    },
    alert(title,yesCallback,noCallback){
        var curScene = cc.director.getScene();
        var prefab = cc.resMgr.getRes(cc.resName.alert);
        var alert = cc.instantiate(prefab);
        this.center(alert);
        alert.parent = curScene;
        alert.zIndex = this.alertZIndex;
        alert.name = "__ALERT_WND__";
        var alertScript = alert.getComponent("Alert");
        alertScript.init(title,yesCallback,noCallback);
        return alert;
    },
    openLoading(){
        this.closeLoading();
        var curScene = cc.director.getScene();
        var prefab = cc.resMgr.getRes(cc.resName.loading);
        var loading = cc.instantiate(prefab);
        this.center(loading);
        loading.parent = curScene;
        loading.name = "__LOADING_WND__";
        return loading;
    },
    closeLoading(){
        var curScene = cc.director.getScene();
        var child = curScene.getChildByName("__LOADING_WND__");
        if(child){
            child.destroy();
        }
    },
    loadScene(sceneName,callback){
        var loading = this.openLoading();
        cc.resMgr.loadScene(sceneName,function(err){
            if(err){
                return;
            }
            var sceneAssets = cc.resMgr.getRes(sceneName);
            cc.director.runSceneImmediate(sceneAssets.scene);
            if(callback){
                callback();
            }
        },function(err,loadedResName,loadedNum,totalNum){
            if(err){
                return;
            }
            cc.log("Utils:loadScene",loadedResName,loadedNum,totalNum);
            if(cc.isValid(loading)){
                var loadingScript = loading.getComponent("Loading");
                loadingScript.setProgress(loadedNum,totalNum);
            }
        });
    },
    clone(obj){
        if(!obj){
            cc.log("Utils:clone obj is undefined");
            return undefined;
        }
        var jsonStr = JSON.stringify(obj);
        return JSON.parse(jsonStr);
    },
    getMapCount(map){
        var count = 0;
        for(var key in map){
            if(map[key]){
                count++;
            }
        }
        return count;
    },
    delByObj(srcObj,delObj){
        for(var key in srcObj){
            var srcVal = srcObj[key];
            if(!srcVal)continue;
            var hasFind = true;
            for(var delKey in delObj){
                if(srcVal[delKey] != delObj[delKey]){
                    hasFind = false;
                    break;
                }
            }
            if(hasFind){
                delete srcObj[key];
                break;
            }
        }
    },
    loadNetImg(remoteUrl,node,width,height){
        if(!remoteUrl||!node)return;
        cc.resMgr.loadTempRes(remoteUrl,function (err, texture) {
            // Use texture to create sprite frame
            if(err){
                cc.log("Utils:loadNetImg failure",remoteUrl);
                return;
            }
            if(cc.isValid(node)){
                var sp = node.getComponent(cc.Sprite);
                sp.spriteFrame = new cc.SpriteFrame(texture);
                node.setContentSize(width,height);
            }
        },true);
    },
    center(node){
        node.x = cc.winSize.width*0.5;
        node.y = cc.winSize.height*0.5;
    },
    random(min,max){
        return Math.floor(Math.random()*(max-min+1)+min);
    },
    getToggleCheckNode(toggleContainer){
        var labelName = labelName || "New Label"
        var toggleItems = toggleContainer.toggleItems;
        for(var key in toggleItems){
            var toggle = toggleItems[key];
            if(toggle&&toggle.isChecked){
                return toggle.node;
            }
        }
    },
    getToggleCheckLabel(toggleContainer,labelName){
        var labelName = labelName || "New Label"
        var toggleItems = toggleContainer.toggleItems;
        var checkType = undefined;
        for(var key in toggleItems){
            var toggle = toggleItems[key];
            if(toggle&&toggle.isChecked){
                var labelNode = toggle.node.getChildByName(labelName);
                var labelComp = labelNode.getComponent(cc.Label);
                checkType = labelComp.string;
                break;
            }
        }
        return checkType
    },
    unToggleCheck(toggleContainer){
        var toggleItems = toggleContainer.toggleItems;
        for(var key in toggleItems){
            var toggle = toggleItems[key];
            if(toggle&&toggle.isChecked){
                toggle.uncheck();
            }
        }
    },
    color(colorStr){
        if(!colorStr){
            return undefined;
        }
        var colorVal = colorStr.split("@");
        var red = 255;
        var green = 255;
        var blue = 255;
        var alpha = 255;
        if(colorVal.length>0)red=parseInt(colorVal[0]);
        if(colorVal.length>1)green=parseInt(colorVal[1]);
        if(colorVal.length>2)blue=parseInt(colorVal[2]);
        if(colorVal.length>3)alpha=parseInt(colorVal[3]);

        return cc.color(
            red,
            green,
            blue,
            alpha
        );
    },
    newCCObj(info,node){
        if(!info||!info.type){
            cc.error("Utils:newCCObj info or info.type is undefined");
            return;
        }
        var objClass = cc[info.type];
        if(!objClass){
            cc.error("Utils:newCCObj objClass undefined type",info.type);
            return;
        }
        var obj = undefined;
        if(cc.isChildClassOf(objClass,cc.Component)){
            if(node){
                obj = node.addComponent(objClass);
            }
        }else{
            obj = new objClass();
        }
        if(!obj){
            cc.error("Utils:newCCObj obj create failure");
            return;
        }
        if(!info.param)return obj;

        var parseVal = function(value){
            if(typeof value !== "object"){
                return value;
            }
            if(value instanceof Array){
                if(value.length==0){
                    return value;
                }
                var newArr = [];
                for(var key in value){
                    newArr.push(parseVal(value[key]));
                }
                return newArr;
            }else if(typeof value.type === "string"){
                return this.newCCObj(value);
            }else{
                return value;
            }
        }.bind(this);

        for(var key in info.param){
            var value = info.param[key];
            obj[key] = parseVal(value);
        }
        return obj;
    },
    rad2ang(rad){
        return rad*57.296;
    },
    ang2rad(ang){
        return ang*0.0175;
    },
    /*
    srcPoint   ------>     targetPoint
        |
        |
       \ /
       srcDir
    */
    getDirAng(srcX,srcY,srcDir,targetX,targetY){  
        var nextDir = cc.v2(targetX-srcX,targetY-srcY);
        //signAngle 表 srcDir 挪向 nextDir，逆时针为负，顺时针为正
        var angle = srcDir.signAngle(nextDir);
        angle = this.rad2ang(angle);
        return angle;
    },
    isOutScreen(node){
        var worldPos = node.convertToWorldSpace(cc.Vec2.ZERO);
        if(worldPos.x>cc.winSize.width||
           worldPos.y>cc.winSize.height||
           worldPos.x<0||
           worldPos.y<0){
            return true;
        }
        return false;
    },
    dis2(pos0,pos1){
        return (pos0.x-pos1.x)*(pos0.x-pos1.x) + (pos0.y-pos1.y)*(pos0.y-pos1.y);
    },
    wrapRad_0_2pi(rad){
        if(rad>=0&&rad<=this.pi2)return rad;
        if(rad<0){
            while(rad<0)rad+=this.pi2;
            return rad;
        }else if(rad>this.pi2){
            while(rad>this.pi2)rad-=this.pi2;
            return rad;
        }
    },
    wrapRad_fpi_zpi(rad){
        if(rad>=-this.pi&&rad<=this.pi)return rad;
        if(rad<-this.pi){
            while(rad<-this.pi)rad+=this.pi2;
            return rad;
        }else if(rad>this.pi){
            while(rad>this.pi)rad-=this.pi2;
            return rad;
        }
    },
    tip(word){
        var tipNode = this.tipPool.get();
        var curScene = cc.director.getScene();
        tipNode.zIndex = this.tipZIndex;
        tipNode.parent = curScene;
        this.center(tipNode);
        tipNode.getComponent(cc.Label).string = word;

        tipNode.runAction(cc.sequence(
            cc.delayTime(2),
            cc.spawn(
                cc.moveTo(0.5,cc.p(tipNode.x,tipNode.y+200)),
                cc.fadeTo(0.5,0),
            ),
            cc.callFunc(function(){
                this.tipPool.push(tipNode);
            },this)
        ));
    },
    //v0 to v1
    lerp(v0,v1,ratio){
        if(ratio<0)ratio=0;
        if(ratio>1)ratio=1;
        return v0+(v1-v0)*ratio;        
    }
})