cc.Class({
    ctor(){
        this.useList = {};
        this.poolList = [];
        this.useIdx = 1;
    },
    destroy(){
        for(var objKey in this.useList){
            var obj = this.useList[objKey];
            if(obj&&this._destroyFunc){
                this._destroyFunc(obj);
            }
        }
        for(var objKey in this.poolList){
            var obj = this.poolList[objKey];
            if(obj&&this._destroyFunc){
                this._destroyFunc(obj);
            }
        }
        this.useList = {};
        this.poolList = [];
        this.useIdx = 1;
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
    get(...args){
        var obj = this.poolList.pop();
        if(!obj&&this._buildFunc){
            obj = this._buildFunc(...args);
        }
        if(obj){
            obj.useFlag = this.useIdx;
            this.useIdx = this.useIdx + 1;
            this.useList[obj.useFlag] = obj;
        }
        return obj;
    },
    pushNoUseFlag(obj,...args){
        if(this._resetFunc){
            this._resetFunc(obj,...args);
        }
        this.poolList.push(obj);
    },
    push(obj,...args){
        var useFlag = obj.useFlag;
        if(!useFlag){
            cc.error("Pool:push same obj");
            return;
        }
        delete this.useList[useFlag];
        delete obj.useFlag;
        if(this._resetFunc){
            this._resetFunc(obj,...args);
        }
        this.poolList.push(obj);
    },
    reset(...args){
        for(var objKey in this.useList){
            var obj = this.useList[objKey];
            if(obj){
                if(this._resetFunc){
                    this._resetFunc(obj,...args);
                }
                this.poolList.push(obj);
            }
        }
        this.useList = {};
    }
})