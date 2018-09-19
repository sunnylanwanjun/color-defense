"use strict";
cc._RF.push(module, '033c8HLwuNAsLgqb7hZ4puu', 'ResMgr');
// scripts/ResMgr.js

"use strict";

function nohandle() {}

cc.Class({
    ctor: function ctor() {
        /*
        设计思想：
        进游戏时，先加载CommonRes，公共资源，该资源永远不会释放，资源引用计数永远大于0
        加载场景的时候，先预加载必须资源，如果必须资源与公共资源的某个SpritFrame相同，那么
        该SpriteFrame和该SpriteFrame所在的Texture的引用计数都会加1，有两张表，一个是resCache
        一个是res_UUID_To_RefCount_Map，resCache是用来记录由外部使用的资源对象的引用计数，
        当场景切换完毕后，旧场景所引用的资源引用计数都会减1，当然由于是场景切换完毕后，所以新场景
        如果引用了旧场景的资源，那么被引用的资源引用计数会先加1，所以后来的减1不会使用该资源的引用计数
        变成0，那么res_UUID_To_RefCount_Map的作用是什么呢，有了resCache为什么还要有res_UUID_To_RefCount_Map，因为一个由resCache标记为可删除的资源，是不是就可以完全从缓存
        中删除了，不是的，因为两个看似完全不相关的资源，有可能A中引用了B中的所依赖的一张小图，特别是
        做游戏特效的时候，就会出现这种问题，这时就必须从更细的粒度去解决这个问题，把resCache中标记为
        可删除的资源的所有依赖资源都取出来，然后挨个判断他们的引用计数是否也为0，如果为0，那么表示该“”“子资源”是可以删除的，否则就不能删除。
        所以使用的时候，就是一个场景如果要使用某个资源，要么预加载，然后使用getRes进行获取，
        要么临时加载，使用loadTempRes进行获取，同个场景，多个地方引用同个资源，引用计数不用加1，
        因为我们是以切换场景，来启动资源删除的。如果同个场景不同地方引用同个资源也将引用计数加1，
        那么释放的时候，就要手动调用unloadRes了，这样做很麻烦，而且一旦忘记添加，该资源就永远不会
        删除了，因为该资源的引用计数永远都大于0了。
        对于持久化的资源，就不要使用loadTempRes了，既然要持久化，那不能切换场景的时候，进行资源删除，
        所以不能让sceneRes记录该资源，那么方法就是直接使用loadRes进行资源加载，使用unloadRes卸载资源，绕过sceneRes的记录。
        */
    },
    init: function init(resName, resConfig, commonRes, scenePreloadRes) {
        this.resName = resName;
        this.resConfig = resConfig;
        this.commonRes = commonRes;
        //场景预加载资源
        this.scenePreloadRes = scenePreloadRes;

        //场景已加载资源记录，切换场景时释放资源
        this.sceneRes = {};
        //这个缓存是提供给游戏应用层使用的资源对象
        this.resCache = {}
        //[this.resName.xx]:{resObj:xxobj,refCount:0},

        //这个是用来作依赖删除记录的
        ;this.res_UUID_To_RefCount_Map = {
            //[uuid]:0, 其中0是资源对应引用计数
        };
        this.curSceneName = undefined;
    },
    unloadSceneRes: function unloadSceneRes(sceneName) {
        if (!sceneName) {
            return;
        }
        var sceneResMap = this.sceneRes[sceneName];
        if (!sceneResMap) {
            cc.log(sceneName, "has not load any res");
            return;
        }
        for (var resNameVal in sceneResMap) {
            if (resNameVal) {
                this.unloadRes(resNameVal);
            }
        }
        delete this.sceneRes[sceneName];
    },

    //用来加载特效，图标，等，切换场景后立即释放的资源 
    loadTempRes: function loadTempRes(resNameVal, onFinished, resTypeOrIsRawUrl) {

        onFinished = onFinished || nohandle;

        //确保该场景只加载过一次该资源，让临时资源的引用计数不会超过1
        if (this.sceneRes[this.curSceneName][resNameVal]) {
            var resData = this.resCache[resNameVal];
            onFinished(undefined, resData.resObj);
            return;
        }
        var loadedCallback = function (err, assets, resNameVal) {
            if (!err) {
                this.sceneRes[this.curSceneName][resNameVal] = true;
            }
            onFinished(err, assets);
        }.bind(this);
        this.loadRes(resNameVal, loadedCallback, resTypeOrIsRawUrl);
    },

    //立即释放资源，一般情况下，由切换场景时，自动调用
    //如果资源是持久资源，不由切换场景控制，那么可由外部调用，自行控制资源生命周期
    unloadRes: function unloadRes(resNameVal) {
        var resData = this.resCache[resNameVal];
        if (!resData) {
            cc.error("ResMgr:unloadRes", resNameVal, "not exits");
            return;
        }
        resData.refCount--;
        cc.assert(resData.refCount >= 0, "ResMgr:unloadRes", resNameVal, "refCount < 0");
        if (resData.refCount <= 0) {
            var resDeps = resData.resDeps;
            if (resDeps) {
                cc.log("ResMgr:unloadRes begin", resNameVal, "------------");
                for (var key in resDeps) {
                    var resUUID = resDeps[key];
                    this.res_UUID_To_RefCount_Map[resUUID]--;
                    cc.assert(resData.refCount >= 0, "ResMgr:unloadRes", resUUID, "uuid refCount < 0");
                    if (this.res_UUID_To_RefCount_Map[resUUID] <= 0) {
                        //cc.log("ResMgr:unloadRes deps",resUUID);
                        cc.loader.release(resUUID);
                        delete this.res_UUID_To_RefCount_Map[resUUID];
                    }
                }
                //cc.log("ResMgr:unloadRes end",resNameVal,"------------");
            } else {
                //cc.log("ResMgr:unloadRes release by releaseKey",resNameVal,"");
                cc.loader.release(resData.releaseKey);
            }
            delete this.resCache[resNameVal];
        }
        //cc.log("-------------------------------");
        //cc.log("resCache is",this.resCache);
        //cc.log("res_UUID_To_RefCount_Map is",this.res_UUID_To_RefCount_Map);
        //cc.log("-------------------------------");
    },
    updateDepsUUIDCount: function updateDepsUUIDCount(resDeps) {
        for (var key in resDeps) {
            var resUUID = resDeps[key];
            this.res_UUID_To_RefCount_Map[resUUID] = this.res_UUID_To_RefCount_Map[resUUID] || 0;
            this.res_UUID_To_RefCount_Map[resUUID]++;
        }
    },

    //加载资源，如果缓存有，只接从缓存中取，但引用计数会加1
    //因为不同的场景有可能共享资源，我们会等到新的场景加载完后，再去释放旧场景
    //的资源，那么此时只释放引用计数为0的资源，就可以达到目的了
    loadRes: function loadRes(resNameVal, onFinished, resTypeOrIsRawUrl) {

        onFinished = onFinished || nohandle;

        var resData = this.resCache[resNameVal];
        if (resData) {
            resData.refCount++;
            cc.log("ResMgr:loadRes from cache", resNameVal, "count", resData.refCount);
            onFinished(undefined, resData.resObj, resNameVal);
            return;
        }

        var resConfigVal = this.resConfig[resNameVal];
        var resType = undefined;
        var isRawUrl = false;
        if (typeof resTypeOrIsRawUrl === "boolean") {
            isRawUrl = resTypeOrIsRawUrl;
        } else if (resTypeOrIsRawUrl) {
            resType = resTypeOrIsRawUrl;
        }

        if (resConfigVal) {
            if (resConfigVal.resType !== undefined) {
                resType = resConfigVal.resType;
            }
            if (resConfigVal.isRawUrl !== undefined) {
                isRawUrl = resConfigVal.isRawUrl;
            }
        }

        var loadedCallback = function (err, assets) {
            if (err) {
                cc.warn("ResMgr:loadRes", resNameVal, "failure", err);
                onFinished(err, undefined, resNameVal);
                return;
            }

            cc.log("ResMgr:loadRes succeess", resNameVal);

            //记录引用计数
            var resDeps = undefined;
            //如果不是RawAsset对象，则该资源不存在依赖资源，删除的时候
            //直接把自己删了就可以了，而且别的资源也不可能引用到该资源。
            var releaseKey = undefined;
            if (assets instanceof cc.RawAsset && assets._uuid) {
                resDeps = cc.loader.getDependsRecursively(assets);
                this.updateDepsUUIDCount(resDeps);
            }

            if (!resDeps) {
                if (isRawUrl) {
                    releaseKey = resNameVal;
                } else {
                    releaseKey = cc.loader._getResUuid(resNameVal, resType);
                }
            }

            //存储资源对象
            this.resCache[resNameVal] = { resObj: assets, refCount: 1, resDeps: resDeps, releaseKey: releaseKey };
            onFinished(undefined, assets, resNameVal);
        }.bind(this);

        cc.log("ResMgr:loadRes,url:", resNameVal);
        if (resType) {
            cc.loader.loadRes(resNameVal, resType, loadedCallback);
        } else {
            if (isRawUrl) {
                cc.loader.load(resNameVal, loadedCallback);
            } else {
                cc.loader.loadRes(resNameVal, loadedCallback);
            }
        }
    },
    loadCommon: function loadCommon(onFinished, onProgress) {

        onFinished = onFinished || nohandle;
        onProgress = onProgress || nohandle;

        var loadedNum = 0;
        var totalNum = this.commonRes.length;
        var loadedResItem = function (err, assets, loadedResName) {
            if (err) {
                cc.log("ResMgr:loadCommon", loadedResName, "failure");
                onProgress(err, loadedResName);
                return;
            }
            cc.log("ResMgr:loadCommon", loadedResName, "finished");
            loadedNum++;
            onProgress(undefined, loadedResName, loadedNum, totalNum);
            if (loadedNum == totalNum) {
                onFinished();
            }
        }.bind(this);

        for (var resKey in this.commonRes) {
            this.loadRes(this.commonRes[resKey], loadedResItem);
        }
    },
    loadScene: function loadScene(sceneName, onFinished, onProgress) {

        onFinished = onFinished || nohandle;
        onProgress = onProgress || nohandle;
        this.sceneRes[sceneName] = this.sceneRes[sceneName] || {};

        var preloadResList = this.scenePreloadRes[sceneName] || [];
        var loadedNum = 0;
        var totalNum = preloadResList.length + 1;
        var loadedResItem = function (err, assets, loadedResName) {
            if (err) {
                cc.log("ResMgr:loadScene", loadedResName, "failure");
                onProgress(err, loadedResName);
                return;
            }
            cc.log("ResMgr:loadScene", loadedResName, "finished");
            loadedNum++;
            onProgress(undefined, loadedResName, loadedNum, totalNum);
            this.sceneRes[sceneName][loadedResName] = true;
            if (loadedNum == totalNum) {
                var preSceneName = this.curSceneName;
                this.curSceneName = sceneName;
                onFinished();
                this.unloadSceneRes(preSceneName);
            }
        }.bind(this);

        for (var resKey in preloadResList) {
            this.loadRes(preloadResList[resKey], loadedResItem);
        }

        cc.director.preloadScene(sceneName, function (err, sceneAssets) {
            if (!err) {
                var info = cc.director._getSceneUuid(sceneName);
                var dependAssets = cc.loader.getDependsRecursively(info.uuid);

                //存储资源对象
                this.updateDepsUUIDCount(dependAssets);
                this.resCache[sceneName] = { resObj: sceneAssets,
                    refCount: 1,
                    resDeps: dependAssets };
            }
            loadedResItem(err, sceneAssets, sceneName);
        }.bind(this));
    },
    getRes: function getRes(resName) {
        var resData = this.resCache[resName];
        if (!resData) return undefined;
        return resData.resObj;
    },
    writeEditorRes: function writeEditorRes(url, content) {
        if (cc.sys.isNative && (cc.sys.platform == cc.sys.WIN32 || cc.sys.platform == cc.sys.MACOS)) {
            this.editorConfig = this.editorConfig || cc.resMgr.getRes(cc.resName.editorConfig);
            jsb.fileUtils.writeStringToFile(content, this.editorConfig.workPath + url);
            cc.utils.tip("write " + url + " success");
        } else {
            cc.warn("ResMgr:writeEditorRes failure,platform id:", cc.sys.platform);
        }
        cc.log("---------------------------");
        cc.log("ResMgr:writeEditorRes path", url);
        cc.log("ResMgr:writeEditorRes json", content);
        cc.log("---------------------------");
    }
});

cc._RF.pop();