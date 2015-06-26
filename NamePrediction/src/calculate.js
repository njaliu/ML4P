var UglifyJS = require("uglify-js");
var fs = require("fs");
var sourceMap = require('source-map');

/*
	origin - JSON: variable table of the original file
	minified - JSON: variable mapping table in the minified file
	predicted - JSON: variable table of the predicted file 
*/
function cal_precision(origin, minified, predicted) {
	var total = origin.length;
	var count = 0;


	for(var i = 0; i < predicted.length; i++) {
		var o_var = minified[i];
		var p_var = predicted[i];

		console.log("## o_var: " + o_var + ", p_var: " + p_var);
		if(o_var == p_var)
			count++;
	}

	console.log("\n## Correct: " + count + ", Total: " + total);

	if(total != 0)
		return (count / total).toFixed(2);
	else
		return 1;
}



//extract the variable table of the input file
function extract_variables(code) {
	var varTab = [];
	var top_level = UglifyJS.parse(code);

	var walker = new UglifyJS.TreeWalker(function(node){
    	if (node instanceof UglifyJS.AST_VarDef) {
      	  	// string_template is a cute little function that UglifyJS uses for warnings
       	 	console.log(UglifyJS.string_template("Found Variable {name} at {line},{col}", {
       	     	name: node.name.name,
       	     	line: node.start.line,
      	      	col: node.start.col
      	  	}));
       	 	varTab.push(node.name.name);
   		}
    	else if (node instanceof UglifyJS.AST_SymbolFunarg) {
        	// string_template is a cute little function that UglifyJS uses for warnings
        	console.log(UglifyJS.string_template("Found Function Argument {name} at {line},{col}", {
            	name: node.name,
            	line: node.start.line,
            	col: node.start.col
        	}));
        	varTab.push(node.name);
    	}
	});

	top_level.walk(walker);
	//console.log("hahaha " + varTab);
	
	return varTab;
}

//extract the variable mapping from the minified file and source-map file
// code: minified file
// rawSourceMap: source-map file
function extract_mapping(code, rawSourceMap) {
	var varTab = [];
	var mapTab = []
	var top_level = UglifyJS.parse(code);
	var smc = new sourceMap.SourceMapConsumer(rawSourceMap)

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

	top_level.walk(walker);

	for( var i = 0; i < varTab.length; i++ ) {
		var v = varTab[i];
		mapTab.push((smc.originalPositionFor({line: v.line, column: v.col})).name);
	}

	//console.log("hahaha " + varTab + ", " + varTab.length);
	//console.log("hahaha " + mapTab);

	return mapTab;
}

function test_main() {
	var dir_base = '/home/aliu/Research/closure-compiler/';
	var mapFile =  dir_base + 'aliu-test/test2.map'
	var rawSourceMap = JSON.parse(fs.readFileSync(mapFile,'utf-8'));
	rawSourceMap["sourceRoot"] = dir_base;

	var minified_file = dir_base + 'aliu-test/test2.min.js';
	var minified_code = fs.readFileSync(minified_file, 'utf-8');
	var mapTab = extract_mapping(minified_code, rawSourceMap);

	var predicted_file = dir_base + 'aliu-test/test2.rename.js';
	var predicted_code = fs.readFileSync(predicted_file, 'utf-8');
	var varTab = extract_variables(predicted_code);

	var origin_file = dir_base + 'aliu-test/test2.js';
	var origin_code = fs.readFileSync(origin_file, 'utf-8');
	var origin_varTab = extract_variables(origin_code);
	//console.log(origin_code);
	//console.log(origin_varTab.length);

	console.log("\n## Precision: " + cal_precision(origin_varTab, mapTab, varTab));
}

test_main();