cc.Class({
    ctor(){
        this.recordMap = {}
    },
    setBuildFunc(buildFunc){
        this._buildFunc = buildFunc;
    },
    setResetFunc(resetFunc){
        this._resetFunc = resetFunc;
    },
    reset(){
        for(var key in this.recordMap){
            var record = this.recordMap[key];
            if(record&&this._resetFunc){
                this._resetFunc(record.obj);
            }
        }
        this.recordMap = {};
    },
    add(type,...args){
        var record = this.recordMap[type];
        if(record){
            record.count++;
            return record.obj;
        }
        var obj = this._buildFunc(type,...args);
        this.recordMap[type]={obj:obj,count:1};
        return obj;
    },
    sub(type,...args){
        var record = this.recordMap[type];
        if(!record){
            return;
        }
        record.count--;
        if(record.count<=0){
            if(this._resetFunc){
                this._resetFunc(record.obj,...args);
            }
            delete this.recordMap[type];
        }
    }
});