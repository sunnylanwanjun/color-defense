"use strict";
cc._RF.push(module, '9a614ffukdCT6cPV4O6OEmT', 'StringEx');
// scripts/StringEx.js

"use strict";

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

String.prototype.trimSpace = function (is_global) {
    var result = this.replace(/(^\s+)|(\s+$)/g, "");
    if (is_global) {
        result = result.replace(/\s/g, "");
    }
    return result;
};

String.prototype.format = function (args) {
    if (arguments.length <= 0) {
        return this;
    }
    var res = this;
    if (arguments.length == 1 && (typeof args === "undefined" ? "undefined" : _typeof(args)) == "object") {
        for (var key in args) {
            if (args[key] != undefined) {
                var reg = new RegExp("\\{" + key + "\\}", "g");
                res = res.replace(reg, args[key]);
            }
        }
    } else {
        for (var i = 0; i < arguments.length; i++) {
            var reg = new RegExp("\\{" + i + "\\}", "g");
            res = res.replace(reg, arguments[i]);
        }
    }
    return res;
};

cc._RF.pop();