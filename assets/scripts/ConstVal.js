var ResName = {
    //公用资源
    commonui:       "texture/ui",
    gameConfig:     "config/gameConfig",
    editorConfig:   "config/editorConfig",
    adConfig:       "config/advConfig",
    loading:        "prefab/loadingWnd",
    alert:          "prefab/alert",
    passAll:        "config/passAll",
    passTpl:        "config/passTpl",
    monsterTpl:     "config/monsterTpl",
    monsterAll:     "config/monsterAll",
    towerTpl:       "config/towerTpl",
    towerAll:       "config/towerAll",

    //游戏场景资源
    gameui:         "texture/game",
    bulletui:       "texture/bullet",

    //编辑器资源
    editorui:       "texture/editor",
    moveHelp:       "prefab/moveHelp",

    //实时加载资源
    bornEff:        "partical/rectorhitcircleeffect",
    targetEff:      "partical/labbackground",
    winEff1:        "partical/dust2",
    winEff2:        "partical/dust",
    placeEff:       "partical/buildcloud",
    deathEff:       "partical/explosionparticel2",
};

var ConstVal = {
    ResName:ResName,
    ResConfig:{
        [ResName.commonui]:{resType:cc.SpriteAtlas,isRawUrl:undefined},
        [ResName.editorui]:{resType:cc.SpriteAtlas,isRawUrl:undefined},
        [ResName.gameui]:{resType:cc.SpriteAtlas,isRawUrl:undefined},
        [ResName.loading]:{resType:cc.Prefab,isRawUrl:undefined},
        [ResName.alert]:{resType:cc.Prefab,isRawUrl:undefined},
        [ResName.moveHelp]:{resType:cc.Prefab,isRawUrl:undefined},
        [ResName.bulletui]:{resType:cc.SpriteAtlas,isRawUrl:undefined},
    },

    CommonRes:[
        ResName.commonui,
        ResName.gameConfig,
        ResName.editorConfig,
        ResName.adConfig,
        ResName.loading,
        ResName.alert,
        ResName.passAll,
        ResName.passTpl,
        ResName.monsterTpl,
        ResName.monsterAll,
        ResName.towerTpl,
        ResName.towerAll
    ],
    //场景预加载资源
    ScenePreloadRes:{
        editor:[
            ResName.gameui,
            ResName.bulletui,
            ResName.editorui,
            ResName.moveHelp,
        ],
        // main:[

        // ],
        // select:[

        // ],
        game:[
            ResName.gameui,
            ResName.bulletui,
        ],
    },
    EntityState:{
        unknow:"unknow",
        alive:"alive",
        death:"death",
        building:"building",
        destroying:"destroying",
        working:"working",
        upleveling:"upleveling",
    }
};

module.exports = ConstVal;