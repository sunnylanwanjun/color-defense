"use strict";
cc._RF.push(module, '841eeigjJpI+aJXqYWTN/Bk', 'ReuseItem');
// scripts/component/ReuseItem.js

"use strict";

cc.Class({
    extends: cc.Component,
    properties: {
        //item模板
        tpl: {
            default: undefined,
            type: cc.Node
        },
        //允许最大列数，0为不限制
        maxColNum: {
            default: 1,
            type: cc.Integer
        },
        //允许最大行数，0为不限制
        maxRowNum: {
            default: 0,
            type: cc.Integer
        },
        //列间隔
        intervalCol: {
            default: 0,
            type: cc.Integer
        },
        //行间隔
        intervalRow: {
            default: 0,
            type: cc.Integer
        },
        //遮罩节点，根据这个节点计算item的删除与显示
        referenceNode: {
            default: undefined,
            type: cc.Node
        },
        //item的父容器
        content: {
            default: undefined,
            type: cc.Node
        }
    },
    onLoad: function onLoad() {
        this.tpl.anchorX = 0.5;
        this.tpl.anchorY = 0.5;
        this.content.anchorX = 0;
        this.content.anchorY = 1;
        this.referenceNode.anchorX = 0;
        this.referenceNode.anchorY = 1;
        this.content.x = 0;
        this.content.y = 0;

        var Pool = require("Pool");
        this.itemPool = new Pool();
        this.itemPool.setBuildFunc(function (parent) {
            var itemNode = cc.instantiate(this.tpl);
            itemNode.parent = this.tpl.parent;
            return itemNode;
        }.bind(this));
        this.itemPool.setResetFunc(function (itemNode) {
            itemNode.x = -10000;
            itemNode.y = -10000;
            itemNode.row = undefined;
            itemNode.col = undefined;
        }.bind(this));
        this.itemPool.pushNoUseFlag(this.tpl);
        this.scrollView = this.node.getComponent(cc.ScrollView);

        this.showMap = {};

        /*
        0 1 
        3 2
        */
        var w = this.referenceNode.width;
        var h = this.referenceNode.height;
        //AR表示传入的点以node的anchor point为参考系，不带AR，以左下角0，0的位置，也就是opengl
        //的原点为参考系，返回的如果是世界坐标，那么总是opengl坐标系
        //this.worldTlPos = this.referenceNode.convertToWorldSpace(cc.v2(0,0));
        //this.worldBrPos = this.referenceNode.convertToWorldSpace(cc.v2(w,-h));
        this.worldTlPos = this.referenceNode.convertToWorldSpaceAR(cc.v2(0, 0));
        this.worldBrPos = this.referenceNode.convertToWorldSpaceAR(cc.v2(w, -h));

        //<=0表不限制数量
        if (this.maxColNum == 0 && this.maxRowNum == 0 || this.maxColNum > 0 && this.maxRowNum > 0) {
            cc.error("ReuseItem colNum or RowNum is unlegal", this.maxColNum, this.maxRowNum);
            cc.error("ReuseItem colNum or RowNum must has one but only has one ==0");
            return;
        }

        if (this.dataLen == undefined) {
            this.setDataLen(0);
        }
    },

    //初始时调用，设置item更新回调
    setUpdateItemFunc: function setUpdateItemFunc(updateItemFunc) {
        this.updateItemFunc = updateItemFunc;
    },

    //由外部调用，当某个item更新的时候
    updateItem: function updateItem(idx) {
        var item = this.showMap[idx];
        if (item) {
            this.updateItemFunc(item, idx);
        }
    },
    update: function update() {
        if (!this.itemsChange && !this.scrollView.isScrolling() && !this.scrollView.isAutoScrolling()) {
            return;
        }

        if (this.totalRow == 0 && this.totalCol == 0) {
            this.itemPool.reset();
            this.showMap = {};
            this.itemsChange = false;
            return;
        }

        if (this.itemsChange) {
            this.itemPool.reset();
            this.showMap = {};
        }

        var tlPos = this.content.convertToNodeSpaceAR(this.worldTlPos);
        var brPos = this.content.convertToNodeSpaceAR(this.worldBrPos);
        var deleteArr = [];
        for (var key in this.showMap) {
            var item = this.showMap[key];
            if (!item) continue;

            if (item.x < tlPos.x || item.x > brPos.x || item.y > tlPos.y || item.y < brPos.y) {
                deleteArr.push(key);
                this.itemPool.push(item);
            }
        }
        for (var key in deleteArr) {
            delete this.showMap[deleteArr[key]];
        }

        this.checkNeedShow(tlPos, brPos);
        this.itemsChange = false;
    },


    //////////////////////////////////////////////////////////////////
    // 以下方法在item位置，尺寸，不规则时，需要重写
    //////////////////////////////////////////////////////////////////
    //如果每个item的大小不规则，那么由外部传入每个item的大小，在setDataLen的时候
    //就计算好每个item的位置，供后续查询使用，现在这里只支持固定item大小
    setDataLen: function setDataLen(dataLen) {
        if (this.dataLen == dataLen) {
            this.itemsChange = true;
            return;
        }
        this.dataLen = dataLen;

        if (this.dataLen > 0) {
            //列数不限制的时候，默认只有一行，不考虑多行，但列数无限的情况
            if (this.maxColNum == 0) {
                this.totalRow = 1;
                this.totalCol = this.dataLen;
            } else if (this.maxRowNum == 0) {
                if (this.dataLen <= this.maxColNum) {
                    this.totalCol = this.dataLen;
                    this.totalRow = 1;
                } else {
                    this.totalRow = Math.floor((this.dataLen - 1) / this.maxColNum) + 1;
                    this.totalCol = this.maxColNum;
                }
            }
        } else {
            this.totalRow = 0;
            this.totalCol = 0;
        }

        this.content.width = (this.tpl.width + this.intervalCol) * this.totalCol;
        this.content.height = (this.tpl.height + this.intervalRow) * this.totalRow;
        this.itemsChange = true;
    },

    //如果不规则item大小，这里则通过查表方式获得每个item的位置，不是实时计算
    getPos: function getPos(idx) {
        var row = Math.floor(idx / this.totalCol);
        var col = idx % this.totalCol;
        var x = (this.tpl.width + this.intervalCol) * col + this.tpl.width * 0.5;
        var y = (this.tpl.height + this.intervalRow) * row + this.tpl.height * 0.5;
        return { x: x, y: -y };
    },

    //根据content中某个点的位置，换算行列，这个方法用来换算左上角，和右下角所处的行列
    //checkNeedShow中调用此方法，检测哪些item需要重新显示出来，如果item位置不规则
    //就不能使用这种方法来检测哪些item需要显示，必须使用item是否在可视区域内来检测
    getRowCol: function getRowCol(posX, posY) {
        var col = Math.floor(posX / (this.tpl.width + this.intervalCol));
        var row = Math.floor(-posY / (this.tpl.height + this.intervalRow));
        if (col >= this.totalCol) {
            col = this.totalCol - 1;
        }
        if (col < 0) {
            col = 0;
        }
        if (row >= this.totalRow) {
            row = this.totalRow - 1;
        }
        if (row < 0) {
            row = 0;
        }
        return { row: row, col: col };
    },
    checkNeedShow: function checkNeedShow(tlPos, brPos) {
        var tlGrid = this.getRowCol(tlPos.x, tlPos.y);
        var brGrid = this.getRowCol(brPos.x, brPos.y);
        for (var row = tlGrid.row; row <= brGrid.row; row++) {
            for (var col = tlGrid.col; col <= brGrid.col; col++) {
                var idx = col + row * this.totalCol;
                if (idx >= this.dataLen) continue;
                if (!this.showMap[idx]) {
                    var item = this.itemPool.get();
                    item.idx = idx;
                    var pos = this.getPos(idx);
                    item.x = pos.x;
                    item.y = pos.y;
                    if (this.updateItemFunc) {
                        this.updateItemFunc(item, idx);
                    }
                    this.showMap[idx] = item;
                }
            }
        }
    }
});

cc._RF.pop();