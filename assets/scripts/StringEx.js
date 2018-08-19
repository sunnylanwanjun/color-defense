String.prototype.trimSpace = function(is_global){
    var result = this.replace(/(^\s+)|(\s+$)/g,"");
    if(is_global){
        result = result.replace(/\s/g,"");
    }
    return result;
}

String.prototype.format = function(args){
    if(arguments.length<=0){
        return this;
    }
    var res = this;
    if(arguments.length==1&&typeof(args)=="object"){
        for(var key in args){
            if(args[key]!=undefined){
                var reg = new RegExp("\\{"+key+"\\}","g");
                res = res.replace(reg,args[key]);
            }
        }
    }else{
        for(var i=0;i<arguments.length;i++){
            var reg = new RegExp("\\{"+i+"\\}","g");
            res = res.replace(reg,arguments[i]);
        }
    }
    return res;
}