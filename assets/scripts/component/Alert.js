var nop = function(){

}

cc.Class({
    extends:cc.Component,
    properties:{
        title:{
            default:undefined,
            type:cc.Label,
        }
    },
    onLoad(){

    },
    init(title,yesCallback,noCallback){
        this.yesCallback = yesCallback || nop;
        this.noCallback = noCallback || nop;
        this.title.string = title;
    },
    clickYes(){
        this.yesCallback();
        this.node.destroy();
    },
    clickNo(){
        this.noCallback();
        this.node.destroy();
    }
})