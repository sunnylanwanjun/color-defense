"use strict";
cc._RF.push(module, '971eccUJVhHRYWrou0ESfDQ', 'HandleArea');
// scripts/component/HandleArea.js

"use strict";

cc.Class({
    extends: cc.Component,
    properties: {
        wantPlaceEntityToggle: {
            default: undefined,
            type: cc.ToggleContainer
        },
        reuseItem: {
            default: undefined,
            type: require("ReuseItem")
        },
        newConfigWnd: {
            default: undefined,
            type: cc.Node
        },
        newTowerNode: {
            default: undefined,
            type: cc.Node
        },
        newTowerToggle: {
            default: undefined,
            type: cc.ToggleContainer
        }
    },
    updatePlaceType: function updatePlaceType() {
        var toggleNode = cc.utils.getToggleCheckNode(this.wantPlaceEntityToggle);
        if (toggleNode) this.checkType = toggleNode.name;else this.checkType = undefined;

        var curPassIdx = cc.passData.getCurPassIdx();
        switch (this.checkType) {
            case "EntityPoint":
            case "EntityFloor":
            case "EntityBorn":
            case "EntityTarget":
                cc.editData.setWantPlaceEntity(this.checkType, curPassIdx);
                break;
            default:
                cc.editData.clearWantPlaceEntity();
                break;
        }
        this.updateList();
    },
    updateTowerItem: function updateTowerItem(item, idx) {
        var labelNode = item.getChildByName("Label");
        var label = labelNode.getComponent(cc.Label);
        var data = cc.configData.getConfigRow("tower", idx);
        var str = "idx:{0} type:{1}\nlevel:{2} price:{3}";
        str = str.format(data.idx, data.type, data.level, data.price);
        label.string = str;
    },
    updateMonsterItem: function updateMonsterItem(item, idx) {
        var labelNode = item.getChildByName("Label");
        var label = labelNode.getComponent(cc.Label);
        var data = cc.configData.getConfigRow("monster", idx);
        var str = "idx:{0} level:{2}\ndropGold:{3} hp:{4}\nspeed:{4}";
        str = str.format(data.idx, data.type, data.dropGold, data.hp, data.speed);
        label.string = str;
    },
    updateList: function updateList() {
        var configType = undefined;
        switch (this.checkType) {
            case "towerList":
                configType = "tower";
                break;
            case "monsterList":
                configType = "monster";
                break;
        }

        if (configType) {
            var editList = cc.configData.getConfigList(configType);
            this.reuseItem.setDataLen(editList.length);
        } else {
            this.reuseItem.setDataLen(0);
        }
    },
    onLoad: function onLoad() {
        cc.globalEvent.on("EditData:clearWantPlaceEntity", this.clearWantPlaceEntityToggle, this);
        cc.globalEvent.on("EditData:editRow", this.updateList, this);
        cc.globalEvent.on("EditData:updateList", this.updateList, this);

        this.reuseItem.setUpdateItemFunc(function (item, idx) {

            var configType = undefined;
            switch (this.checkType) {
                case "towerList":
                    configType = "tower";
                    break;
                case "monsterList":
                    configType = "monster";
                    break;
            }
            if (!configType) return;

            var rowInfo = cc.configData.getConfigRow(configType, idx);
            var btnEdit = item.getChildByName("BtnEdit");
            btnEdit.entityType = rowInfo.type;
            btnEdit.configIdx = idx;

            var editType = cc.editData.curEditInfo.type;
            var editIdx = cc.editData.curEditInfo.idx;
            if (editType == configType && editIdx == idx) {
                item.color = cc.color(0, 255, 0);
            } else {
                item.color = cc.color(255, 255, 255);
            }

            switch (this.checkType) {
                case "towerList":
                    this.updateTowerItem(item, idx);
                    break;
                case "monsterList":
                    this.updateMonsterItem(item, idx);
                    break;
            }
        }.bind(this));
        this.updatePlaceType();
        this.updateList();
    },
    toNewConfig: function toNewConfig() {
        switch (this.checkType) {
            case "towerList":
                this.newConfigWnd.active = true;
                this.newTowerNode.active = true;
                break;
            case "monsterList":
                this.newConfigWnd.active = true;
                this.newTowerNode.active = false;
                break;
            default:
                this.newConfigWnd.active = false;
                break;
        }
    },
    yesNewConfig: function yesNewConfig() {
        switch (this.checkType) {
            case "towerList":
                var towerToggle = cc.utils.getToggleCheckNode(this.newTowerToggle);
                if (towerToggle) {
                    cc.editData.newTowerRow(towerToggle.name);
                } else {
                    cc.log("please select a tower type");
                    return;
                }
                break;
            case "monsterList":
                cc.editData.newMonsterRow();
                break;
        }
        this.newConfigWnd.active = false;
    },
    noNewConfig: function noNewConfig() {
        this.newConfigWnd.active = false;
    },
    wantPlaceEntity: function wantPlaceEntity(event) {
        cc.editData.setWantPlaceEntity(event.target.entityType, event.target.configIdx);
    },
    clearWantPlaceEntity: function clearWantPlaceEntity() {
        this.clearWantPlaceEntityToggle();
        cc.editData.clearWantPlaceEntity();
    },
    clearWantPlaceEntityToggle: function clearWantPlaceEntityToggle() {
        if (this.checkType == "EntityPoint" || this.checkType == "EntityFloor" || this.checkType == "EntityBorn" || this.checkType == "EntityTarget") {
            cc.utils.unToggleCheck(this.wantPlaceEntityToggle);
            this.updatePlaceType();
        }
    },
    onDestroy: function onDestroy() {
        cc.globalEvent.off("EditData:clearWantPlaceEntity", this.clearWantPlaceEntityToggle, this);
        cc.globalEvent.off("EditData:editRow", this.updateList, this);
        cc.globalEvent.off("EditData:updateList", this.updateList, this);
    },
    start: function start() {}
});

cc._RF.pop();