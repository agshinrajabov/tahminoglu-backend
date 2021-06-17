
exports.success = function(response,message, callBack) {
    callBack({ body: response, key: 200, message: message });
}

exports.fail = function(response,message, callBack) {
    callBack({ body: response, key: 400, message: message });
}