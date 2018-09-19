"use strict";
cc._RF.push(module, 'faa19i71thFoaD0pEhMZ949', 'Utils');
// scripts/Utils.js

"use strict";

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

cc.Class({
    ctor: function ctor() {
        this.pi = 3.1415926;
        this.pi2 = 6.2831852;
        this.pid2 = 1.5707963265;

        this.alertZIndex = 100;
        this.tipZIndex = 1000;

        var Pool = require("Pool");
        this.tipPool = new Pool();
        this.tipPool.setBuildFunc(function () {
            var tipNode = new cc.Node();
            tipNode.color = cc.color(255, 0, 0);
            var label = tipNode.addComponent(cc.Label);
            label.fontSize = 80;
            label.lineHeight = 100;
            return tipNode;
        }.bind(this));
        this.tipPool.setResetFunc(function (tipNode) {
            tipNode.removeFromParent();
            tipNode.opacity = 255;
            this.center(tipNode);
        }.bind(this));
    },
    deletePropertyFromArr: function deletePropertyFromArr(arr) {
        for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
            args[_key - 1] = arguments[_key];
        }

        for (var key in arr) {
            var obj = arr[key];
            if (!obj) continue;
            this.deleteProperty.apply(this, [obj].concat(_toConsumableArray(args)));
        }
    },
    setPropertyFromArr: function setPropertyFromArr(arr) {
        for (var _len2 = arguments.length, args = Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
            args[_key2 - 1] = arguments[_key2];
        }

        for (var key in arr) {
            var obj = arr[key];
            if (!obj) continue;
            this.setProperty.apply(this, [obj].concat(_toConsumableArray(args)));
        }
    },
    deleteProperty: function deleteProperty(obj) {
        for (var _len3 = arguments.length, args = Array(_len3 > 1 ? _len3 - 1 : 0), _key3 = 1; _key3 < _len3; _key3++) {
            args[_key3 - 1] = arguments[_key3];
        }

        if (!obj) return undefined;
        var argsLen = arguments.length - 1;
        for (var i = 0; i < argsLen - 1; i++) {
            if (!obj[args[i]]) {
                return false;
            }
            obj = obj[args[i]];
        }
        delete obj[args[argsLen - 1]];
        return true;
    },
    getPropertyOrInit: function getPropertyOrInit(obj) {
        for (var _len4 = arguments.length, args = Array(_len4 > 1 ? _len4 - 1 : 0), _key4 = 1; _key4 < _len4; _key4++) {
            args[_key4 - 1] = arguments[_key4];
        }

        if (!obj) return undefined;
        var argsLen = arguments.length - 1;
        for (var i = 0; i < argsLen; i++) {
            if (!obj[args[i]]) {
                obj[args[i]] = {};
            }
            obj = obj[args[i]];
        }
        return obj;
    },
    getProperty: function getProperty(obj) {
        for (var _len5 = arguments.length, args = Array(_len5 > 1 ? _len5 - 1 : 0), _key5 = 1; _key5 < _len5; _key5++) {
            args[_key5 - 1] = arguments[_key5];
        }

        if (!obj) return undefined;
        var argsLen = arguments.length - 1;
        for (var i = 0; i < argsLen; i++) {
            if (!obj[args[i]]) {
                return undefined;
            }
            obj = obj[args[i]];
        }
        return obj;
    },
    setIfUndef: function setIfUndef(obj) {
        for (var _len6 = arguments.length, args = Array(_len6 > 1 ? _len6 - 1 : 0), _key6 = 1; _key6 < _len6; _key6++) {
            args[_key6 - 1] = arguments[_key6];
        }

        if (!obj) return undefined;
        var argsLen = arguments.length - 1;
        for (var i = 0; i < argsLen - 2; i++) {
            if (!obj[args[i]]) {
                obj[args[i]] = {};
            }
            obj = obj[args[i]];
        }
        if (obj[args[argsLen - 2]]) {
            return;
        }
        obj[args[argsLen - 2]] = args[argsLen - 1];
    },
    setProperty: function setProperty(obj) {
        for (var _len7 = arguments.length, args = Array(_len7 > 1 ? _len7 - 1 : 0), _key7 = 1; _key7 < _len7; _key7++) {
            args[_key7 - 1] = arguments[_key7];
        }

        if (!obj) return undefined;
        var argsLen = arguments.length - 1;
        for (var i = 0; i < argsLen - 2; i++) {
            if (!obj[args[i]]) {
                obj[args[i]] = {};
            }
            obj = obj[args[i]];
        }
        obj[args[argsLen - 2]] = args[argsLen - 1];
    },
    alert: function alert(title, yesCallback, noCallback) {
        var curScene = cc.director.getScene();
        var prefab = cc.resMgr.getRes(cc.resName.alert);
        var alert = cc.instantiate(prefab);
        this.center(alert);
        alert.parent = curScene;
        alert.zIndex = this.alertZIndex;
        alert.name = "__ALERT_WND__";
        var alertScript = alert.getComponent("Alert");
        alertScript.init(title, yesCallback, noCallback);
        return alert;
    },
    openLoading: function openLoading() {
        this.closeLoading();
        var curScene = cc.director.getScene();
        var prefab = cc.resMgr.getRes(cc.resName.loading);
        var loading = cc.instantiate(prefab);
        this.center(loading);
        loading.parent = curScene;
        loading.name = "__LOADING_WND__";
        return loading;
    },
    closeLoading: function closeLoading() {
        var curScene = cc.director.getScene();
        var child = curScene.getChildByName("__LOADING_WND__");
        if (child) {
            child.destroy();
        }
    },
    loadScene: function loadScene(sceneName, callback) {
        var loading = this.openLoading();
        cc.resMgr.loadScene(sceneName, function (err) {
            if (err) {
                return;
            }
            var sceneAssets = cc.resMgr.getRes(sceneName);
            cc.director.runSceneImmediate(sceneAssets.scene);
            if (callback) {
                callback();
            }
        }, function (err, loadedResName, loadedNum, totalNum) {
            if (err) {
                return;
            }
            cc.log("Utils:loadScene", loadedResName, loadedNum, totalNum);
            if (cc.isValid(loading)) {
                var loadingScript = loading.getComponent("Loading");
                loadingScript.setProgress(loadedNum, totalNum);
            }
        });
    },
    clone: function clone(obj) {
        if (!obj) {
            cc.log("Utils:clone obj is undefined");
            return undefined;
        }
        var jsonStr = JSON.stringify(obj);
        return JSON.parse(jsonStr);
    },
    getMapCount: function getMapCount(map) {
        var count = 0;
        for (var key in map) {
            if (map[key]) {
                count++;
            }
        }
        return count;
    },
    delByObj: function delByObj(srcObj, delObj) {
        for (var key in srcObj) {
            var srcVal = srcObj[key];
            if (!srcVal) continue;
            var hasFind = true;
            for (var delKey in delObj) {
                if (srcVal[delKey] != delObj[delKey]) {
                    hasFind = false;
                    break;
                }
            }
            if (hasFind) {
                delete srcObj[key];
                break;
            }
        }
    },
    loadNetImg: function loadNetImg(remoteUrl, node, width, height) {
        if (!remoteUrl || !node) return;
        cc.resMgr.loadTempRes(remoteUrl, function (err, texture) {
            // Use texture to create sprite frame
            if (err) {
                cc.log("Utils:loadNetImg failure", remoteUrl);
                return;
            }
            if (cc.isValid(node)) {
                var sp = node.getComponent(cc.Sprite);
                sp.spriteFrame = new cc.SpriteFrame(texture);
                node.setContentSize(width, height);
            }
        }, true);
    },
    center: function center(node) {
        node.x = cc.winSize.width * 0.5;
        node.y = cc.winSize.height * 0.5;
    },
    random: function random(min, max) {
        return Math.floor(Math.random() * (max - min + 1) + min);
    },
    getToggleCheckNode: function getToggleCheckNode(toggleContainer) {
        var labelName = labelName || "New Label";
        var toggleItems = toggleContainer.toggleItems;
        for (var key in toggleItems) {
            var toggle = toggleItems[key];
            if (toggle && toggle.isChecked) {
                return toggle.node;
            }
        }
    },
    getToggleCheckLabel: function getToggleCheckLabel(toggleContainer, labelName) {
        var labelName = labelName || "New Label";
        var toggleItems = toggleContainer.toggleItems;
        var checkType = undefined;
        for (var key in toggleItems) {
            var toggle = toggleItems[key];
            if (toggle && toggle.isChecked) {
                var labelNode = toggle.node.getChildByName(labelName);
                var labelComp = labelNode.getComponent(cc.Label);
                checkType = labelComp.string;
                break;
            }
        }
        return checkType;
    },
    unToggleCheck: function unToggleCheck(toggleContainer) {
        var toggleItems = toggleContainer.toggleItems;
        for (var key in toggleItems) {
            var toggle = toggleItems[key];
            if (toggle && toggle.isChecked) {
                toggle.uncheck();
            }
        }
    },
    color: function color(colorStr) {
        if (!colorStr) {
            return undefined;
        }
        var colorVal = colorStr.split("@");
        var red = 255;
        var green = 255;
        var blue = 255;
        var alpha = 255;
        if (colorVal.length > 0) red = parseInt(colorVal[0]);
        if (colorVal.length > 1) green = parseInt(colorVal[1]);
        if (colorVal.length > 2) blue = parseInt(colorVal[2]);
        if (colorVal.length > 3) alpha = parseInt(colorVal[3]);

        return cc.color(red, green, blue, alpha);
    },
    newCCObj: function newCCObj(info, node) {
        if (!info || !info.type) {
            cc.error("Utils:newCCObj info or info.type is undefined");
            return;
        }
        var objClass = cc[info.type];
        if (!objClass) {
            cc.error("Utils:newCCObj objClass undefined type", info.type);
            return;
        }
        var obj = undefined;
        if (cc.isChildClassOf(objClass, cc.Component)) {
            if (node) {
                obj = node.addComponent(objClass);
            }
        } else {
            obj = new objClass();
        }
        if (!obj) {
            cc.error("Utils:newCCObj obj create failure");
            return;
        }
        if (!info.param) return obj;

        var parseVal = function (value) {
            if ((typeof value === "undefined" ? "undefined" : _typeof(value)) !== "object") {
                return value;
            }
            if (value instanceof Array) {
                if (value.length == 0) {
                    return value;
                }
                var newArr = [];
                for (var key in value) {
                    newArr.push(parseVal(value[key]));
                }
                return newArr;
            } else if (typeof value.type === "string") {
                return this.newCCObj(value);
            } else {
                return value;
            }
        }.bind(this);

        for (var key in info.param) {
            var value = info.param[key];
            obj[key] = parseVal(value);
        }
        return obj;
    },
    rad2ang: function rad2ang(rad) {
        return rad * 57.296;
    },
    ang2rad: function ang2rad(ang) {
        return ang * 0.0175;
    },

    /*
    srcPoint   ------>     targetPoint
        |
        |
       \ /
       srcDir
    */
    getDirAng: function getDirAng(srcX, srcY, srcDir, targetX, targetY) {
        var nextDir = cc.v2(targetX - srcX, targetY - srcY);
        //signAngle 表 srcDir 挪向 nextDir，逆时针为负，顺时针为正
        var angle = srcDir.signAngle(nextDir);
        angle = this.rad2ang(angle);
        return angle;
    },
    isOutScreen: function isOutScreen(node) {
        var worldPos = node.convertToWorldSpace(cc.Vec2.ZERO);
        if (worldPos.x > cc.winSize.width || worldPos.y > cc.winSize.height || worldPos.x < 0 || worldPos.y < 0) {
            return true;
        }
        return false;
    },
    dis2: function dis2(pos0, pos1) {
        return (pos0.x - pos1.x) * (pos0.x - pos1.x) + (pos0.y - pos1.y) * (pos0.y - pos1.y);
    },
    wrapRad_0_2pi: function wrapRad_0_2pi(rad) {
        if (rad >= 0 && rad <= this.pi2) return rad;
        if (rad < 0) {
            while (rad < 0) {
                rad += this.pi2;
            }return rad;
        } else if (rad > this.pi2) {
            while (rad > this.pi2) {
                rad -= this.pi2;
            }return rad;
        }
    },
    wrapRad_fpi_zpi: function wrapRad_fpi_zpi(rad) {
        if (rad >= -this.pi && rad <= this.pi) return rad;
        if (rad < -this.pi) {
            while (rad < -this.pi) {
                rad += this.pi2;
            }return rad;
        } else if (rad > this.pi) {
            while (rad > this.pi) {
                rad -= this.pi2;
            }return rad;
        }
    },
    tip: function tip(word) {
        var tipNode = this.tipPool.get();
        var curScene = cc.director.getScene();
        tipNode.zIndex = this.tipZIndex;
        tipNode.parent = curScene;
        this.center(tipNode);
        tipNode.getComponent(cc.Label).string = word;

        tipNode.runAction(cc.sequence(cc.delayTime(2), cc.spawn(cc.moveTo(0.5, cc.p(tipNode.x, tipNode.y + 200)), cc.fadeTo(0.5, 0)), cc.callFunc(function () {
            this.tipPool.push(tipNode);
        }, this)));
    },

    //v0 to v1
    lerp: function lerp(v0, v1, ratio) {
        if (ratio < 0) ratio = 0;
        if (ratio > 1) ratio = 1;
        return v0 + (v1 - v0) * ratio;
    }
});

cc._RF.pop();