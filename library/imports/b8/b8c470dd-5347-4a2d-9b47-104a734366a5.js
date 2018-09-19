"use strict";
cc._RF.push(module, 'b8c47DdU0dKLZtHEEpzQ2al', 'EditData');
// scripts/data/EditData.js

"use strict";

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

cc.Class({
    extends: require("ConfigData"),
    ctor: function ctor() {
        this.passAll = cc.resMgr.getRes(cc.resName.passAll);
        this.passTpl = cc.resMgr.getRes(cc.resName.passTpl);

        this.towerAll = cc.resMgr.getRes(cc.resName.towerAll);
        this.towerTpl = cc.resMgr.getRes(cc.resName.towerTpl);

        this.monsterAll = cc.resMgr.getRes(cc.resName.monsterAll);
        this.monsterTpl = cc.resMgr.getRes(cc.resName.monsterTpl);

        this.curEditPassIdx = undefined;
        this.curEditInfo = {
            idx: undefined,
            type: undefined
        };
        this.wantPlaceEntity = {
            entityType: undefined,
            configIdx: undefined
        };
        this.saveDelay = 10;
        this.xDir = cc.v2(1, 0);
    },
    modifyPoint: function modifyPoint(idx, roadIdx, pointIdx) {
        var rowInfo = this.getConfigRow("pass", idx);
        var pointArr = rowInfo.roadMap[roadIdx];
        var pointInfo = pointArr[pointIdx];

        if (pointIdx + 1 < pointArr.length) {
            var nextPoint = pointArr[pointIdx + 1];
            var dir = cc.v2(nextPoint.x - pointInfo.x, nextPoint.y - pointInfo.y);
            var angle = dir.signAngle(this.xDir);
            pointInfo.angle = angle.toFixed(3);
            pointInfo.dis = Math.floor(cc.pDistance(pointInfo, nextPoint));
        }

        if (pointIdx - 1 >= 0) {
            var prePoint = pointArr[pointIdx - 1];
            var dir = cc.v2(pointInfo.x - prePoint.x, pointInfo.y - prePoint.y);
            var angle = dir.signAngle(this.xDir);
            prePoint.angle = angle.toFixed(3);
            prePoint.dis = Math.floor(cc.pDistance(pointInfo, prePoint));
        }

        this.saveList("pass");

        this.emitEvent("EditData:updateList", { type: "pass",
            idx: idx, property: "updateRoad" });
    },
    deletePoint: function deletePoint(idx, roadIdx, pointIdx) {
        var rowInfo = this.getConfigRow("pass", idx);
        var pointArr = rowInfo.roadMap[roadIdx];
        pointArr.splice(pointIdx, 1);
        if (pointArr.length == 0) {
            delete rowInfo.roadMap[roadIdx];
        }

        if (pointArr.length > 1) {
            if (pointIdx == pointArr.length) {
                var prePoint = pointArr[pointIdx - 1];
                prePoint.dis = 0;
                prePoint.angle = 0;
            } else if (pointIdx > 0) {
                var prePoint = pointArr[pointIdx - 1];
                var nextPoint = pointArr[pointIdx];
                var dir = cc.v2(nextPoint.x - prePoint.x, nextPoint.y - prePoint.y);
                var angle = dir.signAngle(this.xDir);
                prePoint.angle = angle.toFixed(3);
                prePoint.dis = Math.floor(cc.pDistance(prePoint, nextPoint));
            }
        }

        this.saveList("pass");

        this.emitEvent("EditData:updateList", { type: "pass",
            idx: idx, property: "roadMap" });
    },
    newPoint: function newPoint(idx, x, y, roadIdx) {
        var rowInfo = this.getConfigRow("pass", idx);

        rowInfo.roadMap[roadIdx] = rowInfo.roadMap[roadIdx] || [];
        var pointArr = rowInfo.roadMap[roadIdx];

        var pointInfo = cc.utils.clone(this.passTpl.perPointTpl);
        pointInfo.x = x;
        pointInfo.y = y;
        pointArr.push(pointInfo);

        if (pointArr.length > 1) {
            var prePoint = pointArr[pointArr.length - 2];
            var dir = cc.v2(pointInfo.x - prePoint.x, pointInfo.y - prePoint.y);
            var angle = dir.signAngle(this.xDir);
            prePoint.angle = angle.toFixed(3);
            prePoint.dis = Math.floor(cc.pDistance(prePoint, pointInfo));
        }

        this.saveList("pass");

        this.emitEvent("EditData:updateList", { type: "pass",
            idx: idx, property: "roadMap" });
    },
    deleteBorn: function deleteBorn(idx, bornIdx) {
        var rowInfo = this.getConfigRow("pass", idx);
        rowInfo.bornArr.splice(bornIdx, 1);
        this.saveList("pass");

        this.emitEvent("EditData:updateList", { type: "pass",
            idx: idx, property: "bornArr" });
    },
    newBorn: function newBorn(idx, x, y) {
        var rowInfo = this.getConfigRow("pass", idx);
        var bornInfo = cc.utils.clone(this.passTpl.perBornTpl);
        bornInfo.x = x;
        bornInfo.y = y;
        rowInfo.bornArr.push(bornInfo);
        this.saveList("pass");

        this.emitEvent("EditData:updateList", { type: "pass",
            idx: idx, property: "bornArr" });
    },
    deleteTarget: function deleteTarget(idx, targetIdx) {
        var rowInfo = this.getConfigRow("pass", idx);
        rowInfo.targetArr.splice(targetIdx, 1);
        this.saveList("pass");

        this.emitEvent("EditData:updateList", { type: "pass",
            idx: idx, property: "targetArr" });
    },
    newTarget: function newTarget(idx, x, y) {
        var rowInfo = this.getConfigRow("pass", idx);
        var targetInfo = cc.utils.clone(this.passTpl.perTargetTpl);
        targetInfo.x = x;
        targetInfo.y = y;
        rowInfo.targetArr.push(targetInfo);
        this.saveList("pass");

        this.emitEvent("EditData:updateList", { type: "pass",
            idx: idx, property: "targetArr" });
    },
    deleteFloor: function deleteFloor(idx, floorIdx) {
        var rowInfo = this.getConfigRow("pass", idx);
        rowInfo.floorArr.splice(floorIdx, 1);
        this.saveList("pass");

        this.emitEvent("EditData:updateList", { type: "pass",
            idx: idx, property: "floorArr" });
    },
    newFloor: function newFloor(idx, x, y) {
        var rowInfo = this.getConfigRow("pass", idx);
        var floorInfo = cc.utils.clone(this.passTpl.perFloorTpl);
        floorInfo.x = x;
        floorInfo.y = y;
        rowInfo.floorArr.push(floorInfo);
        this.saveList("pass");

        this.emitEvent("EditData:updateList", { type: "pass",
            idx: idx, property: "floorArr" });
    },
    setWantPlaceEntity: function setWantPlaceEntity(entityType, configIdx) {
        this.wantPlaceEntity.entityType = entityType;
        this.wantPlaceEntity.configIdx = configIdx;
    },
    clearWantPlaceEntity: function clearWantPlaceEntity() {
        this.wantPlaceEntity = {};
        this.emitEvent("EditData:clearWantPlaceEntity");
    },
    getCurEditRow: function getCurEditRow() {
        var curEditList = this.getConfigList(this.curEditInfo.type);
        if (!curEditList) {
            return;
        }
        return curEditList[this.curEditInfo.idx];
    },
    deleteAllField: function deleteAllField(type, property) {
        var _cc$utils;

        var curEditList = this.getConfigList(type);
        if (!curEditList) {
            cc.log("EditData:delete failure curEditList is undefined,type is", type);
            return;
        }
        var propertyArr = property.split("@");
        (_cc$utils = cc.utils).deletePropertyFromArr.apply(_cc$utils, [curEditList].concat(_toConsumableArray(propertyArr)));
        this.emitEvent("EditData:updateList", { type: type, idx: undefined, property: property });
        this.saveList(type);
    },
    modifyAllField: function modifyAllField(type, property, value) {
        var _cc$utils2;

        var curEditList = this.getConfigList(type);
        if (!curEditList) {
            cc.log("EditData:delete failure curEditList is undefined,type is", type);
            return;
        }
        var propertyArr = property.split("@");
        propertyArr.push(value);
        (_cc$utils2 = cc.utils).setPropertyFromArr.apply(_cc$utils2, [curEditList].concat(_toConsumableArray(propertyArr)));
        this.emitEvent("EditData:updateList", { type: type, idx: undefined, property: property });
        this.saveList(type);
    },
    clearRow: function clearRow(type, idx) {
        switch (type) {
            case "pass":
                this.clearPassRow(idx);
                break;
            case "tower":
                this.clearTowerRow(idx);
                break;
            case "monster":
                this.clearMonsterRow(idx);
                break;
        }
    },
    editRow: function editRow(type, idx) {
        if (type == "pass") {
            this.curEditPassIdx = idx;
        }
        this.curEditInfo.idx = idx;
        this.curEditInfo.type = type;
        this.emitEvent("EditData:editRow", { type: type, idx: idx });
    },
    saveList: function saveList(type) {
        switch (type) {
            case "pass":
                this.savePassList();
                break;
            case "tower":
                this.saveTowerList();
                break;
            case "monster":
                this.saveMonsterList();
                break;
        }
    },
    modifyField: function modifyField(type, idx, property, value) {
        var _cc$utils3;

        var curEditList = this.getConfigList(type);
        if (!curEditList) {
            cc.log("EditData:update failure curEditList is undefined,type is", this.curEditInfo.type);
            return;
        }
        var obj = curEditList[idx];
        var propertyArr = property.split("@");
        propertyArr.push(value);
        (_cc$utils3 = cc.utils).setProperty.apply(_cc$utils3, [obj].concat(_toConsumableArray(propertyArr)));
        this.emitEvent("EditData:updateList", { type: type, idx: idx, property: property });
        this.saveList(type);
    },
    updateRow: function updateRow(type, idx, obj) {
        var curEditList = this.getConfigList(type);
        if (!curEditList) {
            cc.log("EditData:update failure curEditList is undefined,type is", this.curEditInfo.type);
            return;
        }
        curEditList[idx] = obj;
        this.emitEvent("EditData:updateList", { type: type, idx: idx });
        this.saveList(type);
    },


    /////////////////////////////////////////////////////////////
    //pass 相关
    editFloorSize: function editFloorSize(w) {
        this.passAll.floorInfo.w = w || this.passAll.floorInfo.w;
        this.passAll.floorInfo.h = w || this.passAll.floorInfo.h;
        cc.log("EditData:editFloorSize", this.passAll.floorInfo.w, this.passAll.floorInfo.h);
        this.emitEvent("EditData:updateList", { type: "pass", idx: undefined, property: "floorInfo" });
        this.savePassList();
    },
    clearPassRow: function clearPassRow(idx) {
        cc.log("EditData:clearPassRow", idx);
        var newPass = cc.utils.clone(this.passTpl.perPassTpl);
        newPass.idx = idx;
        this.passAll.passArr[idx] = newPass;
        this.emitEvent("EditData:updateList", { type: "pass", idx: idx });
        this.savePassList();
    },
    newPassRow: function newPassRow() {
        cc.log("EditData:newPass");
        var newPass = cc.utils.clone(this.passTpl.perPassTpl);
        newPass.idx = this.passAll.passArr.length;
        this.passAll.passArr[newPass.idx] = newPass;
        this.savePassList();
    },
    savePassList: function savePassList() {
        cc.timer.removeByType("EditData:Pass");
        cc.timer.once(function () {
            cc.resMgr.writeEditorRes("/config/passAll.json", JSON.stringify(this.passAll));
        }.bind(this), this.saveDelay, "EditData:Pass");
    },


    /////////////////////////////////////////////////////////////
    //tower 相关
    newTowerRow: function newTowerRow(towerType) {
        cc.log("EditData:newTower", towerType);
        var newTower = cc.utils.clone(this.towerTpl[towerType]);
        newTower.idx = this.towerAll.towerArr.length;
        this.towerAll.towerArr[newTower.idx] = newTower;
        this.emitEvent("EditData:updateList", { type: "tower" });
        this.saveTowerList();
    },
    clearTowerRow: function clearTowerRow(idx) {
        cc.log("EditData:clearTowerRow", idx);
        var oldTower = this.getTowerRow(idx);
        var oldTowerType = oldTower.type;
        var newTower = cc.utils.clone(this.towerTpl[oldTowerType]);
        newTower.idx = idx;
        this.towerAll.towerArr[idx] = newTower;
        this.emitEvent("EditData:updateList", { type: "tower", idx: idx });
        this.saveTowerList();
    },
    getTowerRow: function getTowerRow(idx) {
        return this.towerAll.towerArr[idx];
    },
    saveTowerList: function saveTowerList() {
        cc.timer.removeByType("EditData:Tower");
        cc.timer.once(function () {
            cc.resMgr.writeEditorRes("/config/towerAll.json", JSON.stringify(this.towerAll));
        }.bind(this), this.saveDelay, "EditData:Tower");
    },


    /////////////////////////////////////////////////////////////
    //monster 相关
    newMonsterRow: function newMonsterRow() {
        cc.log("EditData:newMonster");
        var newMonster = cc.utils.clone(this.monsterTpl.monsterTpl);
        newMonster.idx = this.monsterAll.monsterArr.length;
        this.monsterAll.monsterArr[newMonster.idx] = newMonster;
        this.emitEvent("EditData:updateList", { type: "monster" });
        this.saveMonsterList();
    },
    clearMonsterRow: function clearMonsterRow(idx) {
        cc.log("EditData:clearMonsterRow", idx);
        var newMonster = cc.utils.clone(this.monsterTpl.monsterTpl);
        newMonster.idx = idx;
        this.monsterAll.monsterArr[idx] = newMonster;
        this.emitEvent("EditData:updateList", { type: "monster", idx: idx });
        this.saveMonsterList();
    },
    getMonsterRow: function getMonsterRow(idx) {
        return this.monsterAll.monsterArr[idx];
    },
    saveMonsterList: function saveMonsterList() {
        cc.timer.removeByType("EditData:Monster");
        cc.timer.once(function () {
            cc.resMgr.writeEditorRes("/config/monsterAll.json", JSON.stringify(this.monsterAll));
        }.bind(this), this.saveDelay, "EditData:Monster");
    },
    emitEvent: function emitEvent(name, details) {
        if (cc.resMgr.curSceneName == 'editor') {
            cc.globalEvent.emit(name, details);
        }
    }
});

cc._RF.pop();