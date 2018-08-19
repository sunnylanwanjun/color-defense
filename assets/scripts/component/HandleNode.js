cc.Class({
    extends:cc.Component,
    show(event,value){
        this.node.active = (value=='true');
    },
    switch(){
        this.node.active = !this.node.active;
    }
})