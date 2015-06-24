var UglifyJS = require("uglify-js");
var fs = require("fs");

var dir_1 = "/home/aliu/Research/ML4P/NamePrediction/jss/dst.js";
var dir_2 = "/home/aliu/Research/ML4P/NamePrediction/jsm/dst.min.js";

var VarTab = [];
var VarTab_1 = [];
var VarTab_2 = [];

function varCount(origin, minified) {
	if(origin.length > minified.length)
		console.log("## Variable reduced: " + (origin.length - minified.length) + ", ORIGIN: " + origin.length + ", MINIFIED: " + minified.length);
	else if(origin.length < minified.length)
		console.log("## Error: Variable added" + ", ORIGIN: " + origin.length + ", MINIFIED: " + minified.length);
	else
		console.log("## Variable unchanged.");
}

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

var main = function() {
	var code_1 = fs.readFileSync(dir_1, "utf-8");
	var code_2 = fs.readFileSync(dir_2, "utf-8");

	var toplevel_1 = UglifyJS.parse(code_1);
	var toplevel_2 = UglifyJS.parse(code_2);
	toplevel_1.walk(walker);
	VarTab_1 = VarTab;
	VarTab = [];
	toplevel_2.walk(walker);
	VarTab_2 = VarTab;

	varCount(VarTab_1, VarTab_2);
};

main();