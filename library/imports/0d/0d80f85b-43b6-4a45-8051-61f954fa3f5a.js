"use strict";
cc._RF.push(module, '0d80fhbQ7ZKRYBRYflU+j9a', 'ConstVal');
// scripts/ConstVal.js

"use strict";

var _ResConfig;

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var ResName = {
    //公用资源
    commonui: "texture/ui",
    gameConfig: "config/gameConfig",
    editorConfig: "config/editorConfig",
    adConfig: "config/advConfig",
    loading: "prefab/loadingWnd",
    alert: "prefab/alert",
    passAll: "config/passAll",
    passTpl: "config/passTpl",
    monsterTpl: "config/monsterTpl",
    monsterAll: "config/monsterAll",
    towerTpl: "config/towerTpl",
    towerAll: "config/towerAll",

    //游戏场景资源
    gameui: "texture/game",
    bulletui: "texture/bullet",

    //编辑器资源
    editorui: "texture/editor",
    moveHelp: "prefab/moveHelp",

    //实时加载资源
    bornEff: "partical/rectorhitcircleeffect",
    targetEff: "partical/labbackground",
    winEff1: "partical/dust2",
    winEff2: "partical/dust",
    placeEff: "partical/buildcloud",
    deathEff: "partical/explosionparticel2"
};

var ConstVal = {
    ResName: ResName,
    ResConfig: (_ResConfig = {}, _defineProperty(_ResConfig, ResName.commonui, { resType: cc.SpriteAtlas, isRawUrl: undefined }), _defineProperty(_ResConfig, ResName.editorui, { resType: cc.SpriteAtlas, isRawUrl: undefined }), _defineProperty(_ResConfig, ResName.gameui, { resType: cc.SpriteAtlas, isRawUrl: undefined }), _defineProperty(_ResConfig, ResName.loading, { resType: cc.Prefab, isRawUrl: undefined }), _defineProperty(_ResConfig, ResName.alert, { resType: cc.Prefab, isRawUrl: undefined }), _defineProperty(_ResConfig, ResName.moveHelp, { resType: cc.Prefab, isRawUrl: undefined }), _defineProperty(_ResConfig, ResName.bulletui, { resType: cc.SpriteAtlas, isRawUrl: undefined }), _ResConfig),

    CommonRes: [ResName.commonui, ResName.gameConfig, ResName.editorConfig, ResName.adConfig, ResName.loading, ResName.alert, ResName.passAll, ResName.passTpl, ResName.monsterTpl, ResName.monsterAll, ResName.towerTpl, ResName.towerAll],
    //场景预加载资源
    ScenePreloadRes: {
        editor: [ResName.gameui, ResName.bulletui, ResName.editorui, ResName.moveHelp],
        // main:[

        // ],
        // select:[

        // ],
        game: [ResName.gameui, ResName.bulletui]
    },
    EntityState: {
        unknow: "unknow",
        alive: "alive",
        death: "death",
        building: "building",
        destroying: "destroying",
        working: "working",
        upleveling: "upleveling"
    }
};

module.exports = ConstVal;

cc._RF.pop();