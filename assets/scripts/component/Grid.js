cc.Class({
    extends:require("Touch"),
    properties:{
        rowCol:{
            default:undefined,
            type:cc.Label,
        },
    },
    onLoad(){
        this._super();
        this.editorui = cc.resMgr.getRes(cc.resName.editorui);
    },
    onDestroy(){
        this._super();
    },
    showGrid(){
        this.gridNode.active = !this.gridNode.active;
    },
    start(){
        this._super();
        var gridSpriteFrame = this.editorui.getSpriteFrame("editor-grid");
        this.gridSize = gridSpriteFrame.getOriginalSize();

        this.gridNode = new cc.Node();
        var sp = this.gridNode.addComponent(cc.Sprite);
        sp.spriteFrame = gridSpriteFrame;
        sp.type = cc.Sprite.Type.TILED;
        this.gridNode.parent = this.node;
        this.gridNode.scale = 1;
        this.gridNode.anchorX = 0;
        this.gridNode.anchorY = 0;

        this.gridHelp = new cc.Node();
        this.gridHelp.color = cc.color(255,0,0);
        var sp = this.gridHelp.addComponent(cc.Sprite);
        sp.spriteFrame = gridSpriteFrame;
        this.gridHelp.parent = this.node;

        this.updateGridSize();
    },
    mouseMoveHandle(){
        if(this.gridHelp){
            this.gridHelp.active = false;
        }
        if(this.rowCol){
            this.rowCol.string = "";
        }
        this.updateGridSize();
    },
    mouseHoverHandle(mousePos){
        var halfNodeW = this.node.width*0.5;
        var halfNodeH = this.node.height*0.5;

        if( mousePos.x<-halfNodeW||
            mousePos.y<-halfNodeH||
            mousePos.x>halfNodeW||
            mousePos.y>halfNodeH){
            if(this.gridHelp){
                this.gridHelp.active = false;
            }
            return false;
        }

        var gridInfo = this.getGridPos(mousePos.x,mousePos.y);
        if(this.gridHelp){
            this.gridHelp.x = gridInfo.x;
            this.gridHelp.y = gridInfo.y;
            this.gridHelp.active = true;
        }

        if(this.rowCol){
            this.rowCol.string = "r:"+gridInfo.row+" c:"+gridInfo.col;
        }
        return true;
    },
    changeGridScale(slider){
        this.gridNode.scale = slider.progress;
        if(this.gridHelp){
            this.gridHelp.scale = slider.progress;
            this.gridHelp.active = false;
        }
        if(this.rowCol){
            this.rowCol.string = "";
        }
        this.updateGridSize();
    },
    updateGridSize(){
        var halfNodeW = this.node.width*0.5;
        var halfNodeH = this.node.height*0.5;

        var begPos = this.node.convertToNodeSpaceAR(cc.v2(0, 0));
        if(begPos.x<-halfNodeW)begPos.x=-halfNodeW;
        if(begPos.y<-halfNodeH)begPos.y=-halfNodeH;

        var endPos = this.node.convertToNodeSpaceAR(cc.v2(cc.winSize.width, cc.winSize.height));

        if(endPos.x>halfNodeW)endPos.x=halfNodeW;
        if(endPos.y>halfNodeH)endPos.y=halfNodeH;

        begPos = this.getGridPos(begPos.x,begPos.y,true);
        endPos = this.getGridPos(endPos.x,endPos.y,true);

        if(endPos.x+this.gridSize.width<halfNodeW){
            endPos.x+=this.gridSize.width;
            endPos.y+=this.gridSize.height;
        }else{
            endPos.x=halfNodeW;
            endPos.y=halfNodeH;
        }

        var w = (endPos.x-begPos.x)/this.gridNode.scale;
        var h = (endPos.y-begPos.y)/this.gridNode.scale;

        this.gridNode.setContentSize(w,h);
        this.gridNode.x = begPos.x;
        this.gridNode.y = begPos.y;
    },
    getGridPos(x,y,isAnchorBL){
        var halfNodeW = this.node.width*0.5;
        var halfNodeH = this.node.height*0.5;
        x+=halfNodeW;
        y+=halfNodeH;

        var gridW = this.gridSize.width*this.gridNode.scale;
        var gridH = this.gridSize.height*this.gridNode.scale;
        var col = parseInt(x/gridW);
        var row = parseInt(y/gridH);

        x = col*gridW-halfNodeW;
        y = row*gridH-halfNodeH;
        if(!isAnchorBL){
            x+=gridW*0.5;
            y+=gridH*0.5;
        }
        
        return {x:x,y:y,col:col,row:row};
    },
})