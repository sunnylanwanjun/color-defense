cc.Class({
    extends:cc.Component,
    properties:{
        jsStr:{
            default:undefined,
            type:cc.EditBox,
        },
        grammarErr:{
            default:undefined,
            type:cc.Node,
        },
        grammarTip:{
            default:undefined,
            type:cc.Label,
        },
        changeField_Node:{
            default:undefined,
            type:cc.Node,
        },
        changeField_Name:{
            default:undefined,
            type:cc.EditBox,
        },
        changeField_Value:{
            default:undefined,
            type:cc.EditBox,
        },
        changeField_Type:{
            default:undefined,
            type:cc.ToggleContainer,
        },
    },
    onLoad(){
        
    },
    onDestroy(){
        cc.globalEvent.off("EditData:editRow",this.updateEdit,this);
        cc.globalEvent.off("EditData:updateList",this.updateEdit,this);
    },
    start(){
        cc.globalEvent.on("EditData:editRow",this.updateEdit,this);
        cc.globalEvent.on("EditData:updateList",this.updateEdit,this);
        this.updateEdit();
    },
    updateEdit(){
        var editInfo = cc.editData.getCurEditRow();
        var jsStr = JSON.stringify(editInfo,null,4);
        this.jsStr.string = jsStr;
    },
    paramEditBegin(){
        cc.log("param edit begin");
    },
    paramEditEnd(){
        cc.log("param edit end");
        try {
            //data有可能不是合法的JSON字符串，便会产生异常
            var obj = JSON.parse(this.jsStr.string);
            var curEditInfo = cc.editData.curEditInfo;
            cc.editData.updateRow(curEditInfo.type,curEditInfo.idx,obj);
        } catch (err) {
            console.log("ParamArea:paramEditEnd",err.message);
            this.grammarErr.active = true;
            this.grammarTip.string = "message:\n"+err.message+"\n"+"stack:\n"+err.stack;
        }
    },
    grammarErr_ICheck(){
        this.grammarErr.active = false;
        this.jsStr.setFocus();
    },
    grammarErr_Rollback(){
        var editInfo = cc.editData.getCurEditRow();
        var jsStr = JSON.stringify(editInfo,null,4);
        this.jsStr.string = jsStr;
        this.grammarErr.active = false;
    },
    paramEditReturn(){
        cc.log("param edit return");
    },
    clear(){
        var curEditInfo = cc.editData.curEditInfo;
        cc.utils.alert("clear "+curEditInfo.type+" idx:"+curEditInfo.idx,
        function(){
            cc.editData.clearRow(curEditInfo.type,curEditInfo.idx);    
        }.bind(this));
    },
    changeField(){
        var fieldName = this.changeField_Name.string;
        var fieldValue = this.changeField_Value.string;
        fieldName = fieldName.trimSpace(true);
        fieldValue = fieldValue.trimSpace(true);

        if(!fieldName){
            console.log("ParamArea:changeField fieldName is empty");
            return;
        }

        this.changeField_Node.active = false;

        if(fieldValue==""){
            console.log("ParamArea:changeField deleteAllField",fieldName);
            var curEditInfo = cc.editData.curEditInfo;
            cc.editData.deleteAllField(curEditInfo.type,fieldName);
            return;
        }

        var checkType = cc.utils.getToggleCheckLabel(this.changeField_Type);

        var transValue = undefined;
        switch(checkType){
            case 'int':
            transValue = parseInt(fieldValue);
            break;
            case 'str':
            transValue = fieldValue;
            break;
            case 'float':
            transValue = parseFloat(fieldValue);
            break;
            case 'json':
            transValue = JSON.parse(fieldValue);
            break;
        }
        var curEditInfo = cc.editData.curEditInfo;
        cc.editData.modifyAllField(curEditInfo.type,fieldName,transValue);
    },
})