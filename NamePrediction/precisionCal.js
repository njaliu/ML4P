var UglifyJS = require("uglify-js");
var fs = require("fs");
var glob = require("glob");

//var dir_1 = "/home/aliu/Research/ML4P/NamePrediction/aliu-test/origin/";
//var dir_2 = "/home/aliu/Research/ML4P/NamePrediction/aliu-test/predicted/";
var dir_1 = "/home/aliu/Research/ML4P/NamePrediction/jss/";
var dir_2 = "/home/aliu/Research/ML4P/NamePrediction/jsp/";
var files_1 = [];
var files_2 = [];

var VarTab = [];
var VarTab_1 = [];
var VarTab_2 = [];

Array.prototype.clone = function() {
    return this.slice(0);
};

/*
var code_1 = "function foo(data) {\n\
  var apple,pear,peach;\n\
  data++;\n\
}\n\ ";

var code_2 = "function foo(data) {\n\
  var apple,pear,kiwi;\n\
  data++;\n\
}\n\ ";
*/

/*
glob("/home/aliu/Research/ML4P/NamePrediction/aliu-test/origin/*.js",function(err, files) {
    files_1 = files.clone();
    console.log(files.length);
    console.log(files_1.length);
});
*/
//console.log(files_1.length);
files_1 = fs.readdirSync(dir_1);
files_2 = fs.readdirSync(dir_2);

files_1.filter(function(file){
    return file.substr(-3) === ".js";
});
files_2.filter(function(file){
    return file.substr(-3) === ".js";
});

var code_1 = "";
var code_2 = "";

files_1.forEach(function(file) {
    code_1 += fs.readFileSync(dir_1 + file, "utf-8");
    
});
//console.log(code_1);
files_2.forEach(function(file) {
    code_2 += fs.readFileSync(dir_2 + file, "utf-8");
    
});



/*
var file_1_path = "/home/aliu/Research/ML4P/NamePrediction/aliu-test/test1.js";
var file_2_path = "/home/aliu/Research/ML4P/NamePrediction/aliu-test/test2.js";
var code_1 = fs.readFileSync(file_1_path, "utf-8");
var code_2 = fs.readFileSync(file_2_path, "utf-8");
*/


var walker = new UglifyJS.TreeWalker(function(node){
    if (node instanceof UglifyJS.AST_VarDef) {
        // string_template is a cute little function that UglifyJS uses for warnings
        console.log(UglifyJS.string_template("Found Variable {name} at {line},{col}", {
            name: node.name.name,
            line: node.start.line,
            col: node.start.col
        }));
        VarTab.push(node.name.name);
    }
    else if (node instanceof UglifyJS.AST_SymbolFunarg) {
        // string_template is a cute little function that UglifyJS uses for warnings
        console.log(UglifyJS.string_template("Found Function Argument {name} at {line},{col}", {
            name: node.name,
            line: node.start.line,
            col: node.start.col
        }));
        VarTab.push(node.name);
    }
});

var toplevel_1 = UglifyJS.parse(code_1);
var toplevel_2 = UglifyJS.parse(code_2);
toplevel_1.walk(walker);
VarTab_1 = VarTab;
VarTab = [];
toplevel_2.walk(walker);
VarTab_2 = VarTab;

//var x = ["apple", "pear", "tomato"];
//var y = ["apple", "pear", "potato"];

function calculate_precision(origin, predicted) {
    var origin_length = origin.length;
    var predicted_length = predicted.length;
    //var len = origin_length <= predicted_length ? origin_length : predicted_length;
    var total = origin_length;
    var count = 0;

    for (var i = 0; i < predicted_length; i++) {
        if (origin[i] == predicted[i])
            count++;
    }

    console.log("## Origin Var: " + origin_length);
    console.log("## Predicted Var: " + predicted_length);

    console.log("## Correct: " + count);
    console.log("## Total: " + total);

    return (count / total).toFixed(2);
}

console.log("## Precision: " + calculate_precision(VarTab_1, VarTab_2));

//console.log(files_1.length);
