cc.Class({
    ctor(){
        this.map_useList = {};
        this.map_poolList = {};//[]
        this.map_useIdx = {};//0
    },
    destroy(){
        for(var type in this.map_poolList){
            var poolList = this.map_poolList[type];
            if(!poolList)continue;
            for(var type in poolList){
                var obj = poolList[type];
                if(obj&&this._destroyFunc){
                    this._destroyFunc(type,obj);
                }
            }
        }
        for(var type in this.map_useList){
            var useList = this.map_useList[type];
            if(!useList)continue;
            for(var type in useList){
                var obj = useList[type];
                if(obj&&this._destroyFunc){
                    this._destroyFunc(type,obj);
                }
            }
        }
        this.map_useList = {};
        this.map_poolList = {};//[]
        this.map_useIdx = {};//0
    },
    setDestroyFunc(destroyFunc){
        this._destroyFunc = destroyFunc;
    },
    setBuildFunc(buildFunc){
        this._buildFunc = buildFunc;
    },
    setResetFunc(resetFunc){
        this._resetFunc = resetFunc;
    },
    get(type,...args){
        this.map_poolList[type] = this.map_poolList[type] || [];
        this.map_useList[type] = this.map_useList[type] || {};

        var poolList = this.map_poolList[type];
        var useList = this.map_useList[type];

        var obj = poolList.pop();
        if(!obj&&this._buildFunc){
            obj = this._buildFunc(type,...args);
        }
        if(obj){
            if(this.map_useIdx[type] == undefined)this.map_useIdx[type]=1;
            obj.useFlag = this.map_useIdx[type];
            this.map_useIdx[type] = this.map_useIdx[type] + 1;
            useList[obj.useFlag] = obj;
        }
        return obj;
    },
    pushNoUseFlag(type,obj,...args){
        this.map_poolList[type] = this.map_poolList[type] || [];
        var poolList = this.map_poolList[type];
        if(this._resetFunc){
            this._resetFunc(type,obj,...args);
        }
        poolList.push(obj);
    },
    push(type,obj,...args){
        this.map_poolList[type] = this.map_poolList[type] || [];
        this.map_useList[type] = this.map_useList[type] || {};

        var poolList = this.map_poolList[type];
        var useList = this.map_useList[type];

        var useFlag = obj.useFlag;
        if(!useFlag){
            cc.error("PoolMgr:push same obj");
            return;
        }
        delete useList[useFlag];
        delete obj.useFlag;
        if(this._resetFunc){
            this._resetFunc(type,obj,...args);
        }
        poolList.push(obj);
    },
    reset(type,...args){
        this.map_poolList[type] = this.map_poolList[type] || [];
        this.map_useList[type] = this.map_useList[type] || {};

        var poolList = this.map_poolList[type];
        var useList = this.map_useList[type];

        for(var objKey in useList){
            var obj = useList[objKey];
            if(obj){
                if(this._resetFunc){
                    this._resetFunc(type,obj,...args);
                }
                poolList.push(obj);
            }
        }
        this.map_useList[type] = {};
    },
    getUse(type){
        var useList = this.map_useList[type];
        return useList;
    },
    resetAll(...args){
        for(var type in this.map_poolList){
            this.reset(type,...args);
        }
    }
})
