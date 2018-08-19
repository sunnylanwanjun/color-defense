cc.Class({
    ctor(){
        this.__instanceId = cc.ClassManager.getNewInstanceId();
        this.timerHandle = {};
        this.timerIdx = 1;
        this.timerTypeRecord = {};
    },
    once(func,delay,timerType,...args){
        return this.loop(func,delay,1,timerType,...args);
    },
    loop(func,delay,times,timerType,...args){
        if(!func){
            cc.log("Timer:loop func is null");
            return;
        }

        var curTimerIdx = this.timerIdx++;
        var callTimes = 0;
        var callback = function(){
            callTimes++;
            if(callTimes >= times){
                this.removeByIdx(curTimerIdx,timerType);
            }
            func(...args);
        }

        if(timerType){
            this.timerTypeRecord[timerType] = this.timerTypeRecord[timerType] || {};
            this.timerTypeRecord[timerType][curTimerIdx] = true;
        }
        this.timerHandle[curTimerIdx] = {callback:callback};
        if(!times){
            times = cc.macro.REPEAT_FOREVER;
        }
        cc.director.getScheduler().schedule(callback, this, delay, times, delay, false);
        return curTimerIdx;
    },
    removeByIdx(timerIdx,timerType){
        if(timerType&&this.timerTypeRecord[timerType]){
            delete this.timerTypeRecord[timerType][timerIdx];
        }
        if(!timerIdx)return;
        var callbackInfo = this.timerHandle[timerIdx];
        if(!callbackInfo)return;
        cc.director.getScheduler().unschedule(callbackInfo.callback,this);
        delete this.timerHandle[timerIdx];
    },
    removeByType(timerType){
        var tmp = [];
        var timerTypeRecord = this.timerTypeRecord[timerType];
        for(var timerIdx in timerTypeRecord){
            if(timerTypeRecord[timerIdx]){
                tmp.push(timerIdx);
            }
        }
        for(var key in tmp){
            if(tmp[key]){
                this.removeByIdx(tmp[key],timerType);
            }
        }
        delete this.timerTypeRecord[timerType];
    }
})