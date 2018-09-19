"use strict";
cc._RF.push(module, '9c484areStMn7biICzw5nT7', 'EntityBase');
// scripts/node/entity/EntityBase.js

'use strict';

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var ColliderCallback = cc.Class({
    extends: cc.Component,

    onCollisionEnter: function onCollisionEnter(other, self) {
        this.node._onCollisionEnter(other, self);
    },

    onCollisionStay: function onCollisionStay(other, self) {
        this.node._onCollisionStay(other, self);
    },

    onCollisionExit: function onCollisionExit(other, self) {
        this.node._onCollisionExit(other, self);
    }
});

var EntityBase = cc.Class({
    extends: cc.Node,
    _onCollisionEnter: function _onCollisionEnter(other, self) {},
    _onCollisionStay: function _onCollisionStay(other, self) {},
    _onCollisionExit: function _onCollisionExit(other, self) {},
    ctor: function ctor() {
        this.gameui = cc.resMgr.getRes(cc.resName.gameui);
        this.editorui = cc.resMgr.getRes(cc.resName.editorui);
        this.commonui = cc.resMgr.getRes(cc.resName.commonui);
        this.bulletui = cc.resMgr.getRes(cc.resName.bulletui);
        this.addComponent(ColliderCallback);

        if (cc.resMgr.curSceneName == 'editor') {
            this.touchNode = new cc.Node();
            this.touchNode.setContentSize(70, 70);
            this.touchNode.parent = this;
        }

        this.myType = undefined;
        this.myIdx = undefined;
        this.myProperty = undefined;
        this.myPropertyArr = undefined;
        this.propValue = undefined;
        this.rowValue = undefined;
        this.colliderObjArr = [];
        this.colliderInfoStr = undefined;
    },
    isAlive: function isAlive() {
        return this.active;
    },
    _keyHandle: function _keyHandle(event) {
        if (!this.moveHelp) return;
        var keyObj = event.detail;
        this.keyHandle(keyObj.keyCode);
    },
    keyHandle: function keyHandle(keyCode) {
        switch (keyCode) {
            case cc.KEY.Delete:
                cc.entityMgr.clearEntity(this);
                break;
        }
    },
    initGameData: function initGameData() {
        this.gameData = {
            preState: cc.entityState.unknow,
            state: cc.entityState.unknow
        };
    },
    initEntity: function initEntity() {
        cc.globalEvent.on("EditData:updateList", this._updateProperty, this);
        cc.globalEvent.on(cc.SystemEvent.EventType.KEY_UP, this._keyHandle, this);
        if (cc.resMgr.curSceneName == 'editor') {
            this.touchNode.on('touchend', this.mouseUpHandle, this);
        }
        this.initGameData();
    },
    unInitEntity: function unInitEntity() {
        if (this.touchNode) {
            this.touchNode.off('touchend', this.mouseUpHandle, this);
        }
        cc.globalEvent.off("EditData:updateList", this._updateProperty, this);
        cc.globalEvent.off(cc.SystemEvent.EventType.KEY_UP, this._keyHandle, this);
        cc.globalEvent.off("Entity:unSelect", this.unSelect, this);
        this.unSelect();
    },
    _onPreDestroy: function _onPreDestroy() {
        this._super();
    },
    _updateProperty: function _updateProperty(event) {
        var detail = event.detail;
        if (detail.type && detail.type != this.myType) {
            return false;
        }
        if (detail.idx && detail.idx != this.myIdx) {
            return false;
        }
        if (!this.judgeProperty(detail.property)) {
            return false;
        }
        this.updateProperty(detail.property);
    },
    judgeProperty: function judgeProperty(property) {
        if (property && this.myProperty) {
            if (property.indexOf(this.myProperty) == -1 && this.myProperty.indexOf(property) == -1) return false;
        }
        return true;
    },
    enableCollider: function enableCollider(val) {
        for (var key in this.colliderObjArr) {
            var colliderObj = this.colliderObjArr[key];
            if (colliderObj) {
                colliderObj.enabled = val;
            }
        }
    },
    initColliderArr: function initColliderArr() {
        var colliderInfoStr = JSON.stringify(this.propValue.colliderArr);
        if (colliderInfoStr == this.colliderInfoStr) return;
        this.colliderInfoStr = colliderInfoStr;

        var isPreEnable = undefined;
        for (var key in this.colliderObjArr) {
            var colliderObj = this.colliderObjArr[key];
            if (!colliderObj) continue;
            isPreEnable = colliderObj.active;
            colliderObj.destroy();
        }
        this.colliderObjArr = [];

        for (var key in this.propValue.colliderArr) {
            var colliderInfo = this.propValue.colliderArr[key];
            if (!colliderInfo) continue;
            var colliderObj = cc.utils.newCCObj(colliderInfo, this);
            colliderObj.active = isPreEnable;
            this.colliderObjArr.push(colliderObj);
        }
    },
    updateProperty: function updateProperty(property) {
        if (!this.myType) return false;

        if (!property) {
            this.listValue = cc.configData.getConfigList(this.myType);
            this.rowValue = this.listValue[this.myIdx];
            if (!this.rowValue) return false;
            if (this.myPropertyArr) {
                var _cc$utils;

                this.propValue = (_cc$utils = cc.utils).getProperty.apply(_cc$utils, [this.rowValue].concat(_toConsumableArray(this.myPropertyArr)));
                if (!this.propValue) {
                    cc.error("EntityBase:updateProperty propValue is undefined", this.myType, this.myIdx, this.myProperty);
                    return false;
                }
            } else {
                this.propValue = this.rowValue;
            }
        }

        if (this.propValue.colliderArr) {
            this.initColliderArr();
        }

        this.x = this.propValue.x || this.x;
        this.y = this.propValue.y || this.y;

        //只更新xy坐标，其余操作没必要继续
        if (property && (property.indexOf("@x") != -1 || property.indexOf("@y") != -1)) {
            return false;
        }
        return true;
    },
    mouseUpHandle: function mouseUpHandle(event) {
        cc.globalEvent.off("Entity:unSelect", this.unSelect, this);
        this.select();
    },
    select: function select() {
        cc.globalEvent.emit("Entity:unSelect");
        this.moveHelp = cc.instantiate(cc.resMgr.getRes(cc.resName.moveHelp));
        this.moveHelp.parent = this;

        var moveComp = this.moveHelp.getComponent(require("Move"));
        moveComp.setMoveHandle(function () {
            if (!this.propValue || !this.propValue.hasOwnProperty("x")) {
                return;
            }
            this.propValue.x = this.x;
            this.propValue.y = this.y;
            cc.editData.modifyField(this.myType, this.myIdx, this.myProperty + "@x", this.x);
            cc.editData.modifyField(this.myType, this.myIdx, this.myProperty + "@y", this.y);
        }.bind(this));
        cc.editData.editRow(this.myType, this.myIdx);
        cc.globalEvent.on("Entity:unSelect", this.unSelect, this);
    },
    unSelect: function unSelect() {
        if (this.moveHelp) {
            this.moveHelp.destroy();
            this.moveHelp = undefined;
        }
    },
    setState: function setState(state) {
        this.gameData.preState = this.gameData.state;
        this.gameData.state = state;
    },
    getState: function getState() {
        return this.gameData.state;
    }
});

module.exports = EntityBase;

cc._RF.pop();