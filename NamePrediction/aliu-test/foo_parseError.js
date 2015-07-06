var UglifyJS = require("uglify-js");
var fs = require("fs");

var dir = '/home/aliu/Research/TestDB/ML4P/NamePrediction/aliu-test/test_files/';
var code = fs.readFileSync(dir + 'original_source/00-check-mock-dep.js', "utf-8");

var varTab = [];

var toplevel = UglifyJS.parse(code);
var walker = new UglifyJS.TreeWalker(function(node){
    		if (node instanceof UglifyJS.AST_VarDef) {
      	  	// string_template is a cute little function that UglifyJS uses for warnings
       	 		console.log(UglifyJS.string_template("Found Variable {name} at {line},{col}", {
       	     		name: node.name.name,
       	     		line: node.start.line,
      	      		col: node.start.col
      	  		}));
       	 		varTab.push({"name": node.name.name, "line": node.start.line, "col": node.start.col});
   			}
    		else if (node instanceof UglifyJS.AST_SymbolFunarg) {
        		// string_template is a cute little function that UglifyJS uses for warnings
        		console.log(UglifyJS.string_template("Found Function Argument {name} at {line},{col}", {
            		name: node.name,
            		line: node.start.line,
            		col: node.start.col
        		}));
        		varTab.push({"name": node.name, "line": node.start.line, "col": node.start.col});
    		}
		});
toplevel.walk(walker);	

console.log(varTab);
