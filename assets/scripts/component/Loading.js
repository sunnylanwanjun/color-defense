cc.Class({
    extends: cc.Component,

    properties: {
        
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {
        this.curNum = 0;
        this.totalNum = 0;
    },

    onDestroy(){
        
    },

    setProgress(curNum,totalNum){
        this.curNum = curNum;
        this.totalNum = totalNum;
    },

    update (dt) {
        
    },
});
