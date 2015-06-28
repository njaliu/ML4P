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
	//var dir_base = '/home/aliu/Research/closure-compiler/aliu-test/';
	//var dir_base = '/home/aliu/Research/ML4P/NamePrediction/aliu-test/test_files/uglifyjs/';
	var dir_base = '/home/aliu/Research/ML4P/NamePrediction/aliu-test/test_files/cc/';
	var mapFile =  dir_base + 'test3.map'
	var rawSourceMap = JSON.parse(fs.readFileSync(mapFile,'utf-8'));
	rawSourceMap["sourceRoot"] = dir_base;

	var minified_file = dir_base + 'test3.min.js';
	var minified_code = fs.readFileSync(minified_file, 'utf-8');
	var mapTab = extract_mapping(minified_code, rawSourceMap);

	var predicted_file = dir_base + 'test3.rename.js';
	var predicted_code = fs.readFileSync(predicted_file, 'utf-8');
	var varTab = extract_variables(predicted_code);

	var origin_file = dir_base + 'test3.js';
	var origin_code = fs.readFileSync(origin_file, 'utf-8');
	var origin_varTab = extract_variables(origin_code);
	//console.log(origin_code);
	//console.log(origin_varTab.length);

	console.log("\n## Precision: " + cal_precision(origin_varTab, mapTab, varTab));
}

function test_main_1() {
	var dir_base = '/home/aliu/Research/ML4P/NamePrediction/';
	//var dir_base = '/home/aliu/Research/ML4P/NamePrediction/aliu-test/test_files/';

	var origin_file_dir = dir_base + 'jss/';
	var minified_file_dir = dir_base + 'jsm/';
	var map_file_dir =  dir_base + 'jssm/';
	var predicted_file_dir = dir_base + 'jsp/';

	//var origin_file_dir = dir_base + 'original_source/';
	//var minified_file_dir = dir_base + 'minified_source/';
	//var map_file_dir =  dir_base + 'source-maps/';
	//var predicted_file_dir = dir_base + 'predicted_source/';

	var origin_files = fs.readdirSync(origin_file_dir);
	var minified_files = fs.readdirSync(minified_file_dir);
	var map_files = fs.readdirSync(map_file_dir);
	var predicted_files = fs.readdirSync(predicted_file_dir);

	var rawSourceMap_files = [];
	for(t in map_files){
		console.log("**** Reading Source-Map File: " + map_file_dir + map_files[t]);
		var rawSourceMap = JSON.parse(fs.readFileSync(map_file_dir + map_files[t],'utf-8'));
		rawSourceMap["sourceRoot"] = map_file_dir;
		rawSourceMap_files.push(rawSourceMap);
	}

	var map_varTab = [];
	for(i in minified_files){
		console.log("**** Reading Minified File: " + minified_file_dir + minified_files[i]);
		var minified_code = fs.readFileSync(minified_file_dir + minified_files[i], 'utf-8');
		map_varTab = map_varTab.concat(extract_mapping(minified_code, rawSourceMap_files[i]));
	}

	var predicted_varTab = [];
	for(j in predicted_files){
		console.log("**** Reading Predicted File: " + predicted_file_dir + predicted_files[j]);
		var predicted_code = fs.readFileSync(predicted_file_dir + predicted_files[j], 'utf-8');
		predicted_varTab = predicted_varTab.concat(extract_variables(predicted_code));
	}

	var origin_varTab = [];
	for(k in origin_files){
		console.log("**** Reading Origin File: " + origin_file_dir + origin_files[k]);
		var origin_code = fs.readFileSync(origin_file_dir + origin_files[k], 'utf-8');
		origin_varTab = origin_varTab.concat(extract_variables(origin_code));
	}

	console.log("\n## Precision: " + cal_precision(origin_varTab, map_varTab, predicted_varTab));
}

//test_main();
test_main_1();