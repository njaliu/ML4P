var UglifyJS = require("uglify-js");

var x = {"b": 'b', "c": 'c'};

var json = {"a": 'a', "com": x};

var json1 = {"a": 1, "com": 2};

//var obj = JSON.parse(json1);

console.log(json["com"]["b"]);