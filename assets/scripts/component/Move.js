cc.Class({
    extends:cc.Component,
    properties:{
        xNode:{
            default:undefined,
            type:cc.Node,
        },
        yNode:{
            default:undefined,
            type:cc.Node,
        },
        centerNode:{
            default:undefined,
            type:cc.Node,
        },
    },
    onDestroy(){

    },
    onLoad(){
        //关于事件系统的几点思考
        //事件有捕获capture，at_active，bubbling阶段
        /*
            A
            B
            C
        A为B的父节点，B为C的父节点，当C被点击时，捕获阶段发生的顺序为
        A->B->C,at_active阶段为C，冒泡阶段为C->B->A，如果event调用
        stopPropagation 则整个事件触发机制会中断，如果只是调用_propagationImmediateStopped，则只是不会调用C本身的冒泡回调，
        父节点捕获回调，父点节冒泡回调都不会受到影响，和API文档中描述的不一至
        */
        this.xNode.on('touchstart',function(event){
            this.xNodeDown = true;
            event.stopPropagation();
        }.bind(this));
        this.yNode.on('touchstart',function(event){
            this.yNodeDown = true;
            event.stopPropagation();
        }.bind(this));
        this.centerNode.on('touchstart',function(event){
            this.centerNodeDown = true;
            event.stopPropagation();
        }.bind(this));

        this.node.on('mousemove',function(event){
            if(event.getButton() != cc.Event.EventMouse.BUTTON_LEFT){
                this.xNodeDown = false;
                this.yNodeDown = false;
                this.centerNodeDown = false;
                return;
            }

            if(this.xNodeDown){
                this.xNodeHandle(event);
                return;
            }
            if(this.yNodeDown){
                this.yNodeHandle(event);
                return;
            }
            if(this.centerNodeDown){
                this.centerNodeHandle(event);
                return;
            }
        }.bind(this),this,true);
    },
    setMoveHandle(moveHandle){
        this.moveHandle = moveHandle;
    },
    xNodeHandle(event){
        var delta = event.getDelta();
        this.node.parent.x += delta.x;
        this.node.parent.x = Math.floor(this.node.parent.x);
        if(this.moveHandle){
            this.moveHandle();
        }
    },
    yNodeHandle(event){
        var delta = event.getDelta();
        this.node.parent.y += delta.y;
        this.node.parent.y = Math.floor(this.node.parent.y);
        if(this.moveHandle){
            this.moveHandle();
        }
    },
    centerNodeHandle(event){
        var delta = event.getDelta();
        this.node.parent.x += delta.x;
        this.node.parent.y += delta.y;
        this.node.parent.x = Math.floor(this.node.parent.x);
        this.node.parent.y = Math.floor(this.node.parent.y);
        if(this.moveHandle){
            this.moveHandle();
        }
    },
});