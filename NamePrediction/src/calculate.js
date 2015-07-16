var UglifyJS = require("uglify-js");
var fs = require("fs");
var path = require("path");
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

//Revised calculation to return results as a JSON object
function cal_precision_json(origin, minified, predicted) {
	var total = origin.length;
	var count = 0;


	for(var i = 0; i < predicted.length; i++) {
		var o_var = minified[i];
		var p_var = predicted[i];

		console.log("## o_var: " + o_var + ", p_var: " + p_var);
		if(o_var == p_var)
			count++;
	}

	//console.log("\n## Correct: " + count + ", Total: " + total);

	return {"correct": count, "total": total};
}


//extract the variable table of the input file
function extract_variables(code) {
	var varTab = [];

	try {
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
	}
	catch(ex) {
		console.log("*******EEEEEEEE********: Error caught!" );
		console.log(ex);
	}
	//console.log("hahaha " + varTab);
	
	return varTab;
}

//extract the variable mapping from the minified file and source-map file
// code: minified file
// rawSourceMap: source-map file
function extract_mapping(code, rawSourceMap) {
	var varTab = [];
	var mapTab = []

	try {
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
	}
	catch(ex) {
		console.log("*******EEEEEEEE********: Error caught!" );
		console.log(ex);
	}

	//console.log("hahaha " + varTab + ", " + varTab.length);
	//console.log("hahaha " + mapTab);

	return mapTab;
}

//Simple test function to handle single input file
function test_main() {
	//var dir_base = '/home/aliu/Research/closure-compiler/aliu-test/';
	//var dir_base = '/home/aliu/Research/ML4P/NamePrediction/aliu-test/test_files/uglifyjs/';
	//var dir_base = '/home/aliu/Research/TestDB/ML4P/NamePrediction/aliu-test/test_files/';
	//var dir_base = '/home/aliu/Research/More/TestBench/Deobfuscation/jquery_test/';
	var dir_base = '/home/aliu/Research/More/Download/closure-compiler-master/aliu-test/';
	var mapFile =  dir_base + 'manipulation1.map';
	var rawSourceMap = JSON.parse(fs.readFileSync(mapFile,'utf-8'));
	rawSourceMap["sourceRoot"] = dir_base + 'cc_source_maps/';

	var minified_file = dir_base + 'manipulation1.min.js';
	var minified_code = fs.readFileSync(minified_file, 'utf-8');
	var mapTab = extract_mapping(minified_code, rawSourceMap);

	var predicted_file = dir_base + 'manipulation1.rename.js';
	var predicted_code = fs.readFileSync(predicted_file, 'utf-8');
	var varTab = extract_variables(predicted_code);

	var origin_file = dir_base + 'manipulation.js';
	var origin_code = fs.readFileSync(origin_file, 'utf-8');
	var origin_varTab = extract_variables(origin_code);
	//console.log(origin_code);
	//console.log(origin_varTab.length);

	console.log("\n## Precision: " + cal_precision(origin_varTab, mapTab, varTab));
}

//Simple test function to handle input via directory, not safe
function test_main_1() {
	//var dir_base = '/home/aliu/Research/ML4P/NamePrediction/';
	var dir_base = '/home/aliu/Research/TestDB/ML4P/NamePrediction/aliu-test/test_files/';

	//var origin_file_dir = dir_base + 'jss/';
	//var minified_file_dir = dir_base + 'jsm/';
	//var map_file_dir =  dir_base + 'jssm/';
	//var predicted_file_dir = dir_base + 'jsp/';

	var origin_file_dir = dir_base + 'original_source/';
	var minified_file_dir = dir_base + 'minified_source/uglifyjs/';
	var map_file_dir =  dir_base + 'source_maps/uglifyjs/';
	var predicted_file_dir = dir_base + 'predicted_source/uglifyjs/';

	var origin_files = fs.readdirSync(origin_file_dir);
	var minified_files = fs.readdirSync(minified_file_dir);
	var map_files = fs.readdirSync(map_file_dir);
	var predicted_files = fs.readdirSync(predicted_file_dir);

	var origin_varTab = [];
	var origin_size = 0;
	var origin_used = [];
	for(k in origin_files){
		var o_file = origin_file_dir + origin_files[k];
		if(checkMinifiedExist(origin_files[k], minified_file_dir) && getFileSizeInKB(o_file) < 10) {
			origin_used.push(path.basename(origin_files[k], '.js'));
			console.log("**** Reading Origin File: " + o_file);
			var origin_code = fs.readFileSync(o_file, 'utf-8');
			origin_varTab = origin_varTab.concat(extract_variables(origin_code));
			origin_size++;
		}
	}

	var rawSourceMap_files = [];
	for(t in origin_used){
		var ma_file = map_file_dir + origin_used[t] + '.map';
		console.log("**** Reading Source-Map File: " + ma_file);
		var rawSourceMap = JSON.parse(fs.readFileSync(ma_file,'utf-8'));
		rawSourceMap["sourceRoot"] = map_file_dir;
		rawSourceMap_files.push(rawSourceMap);
	}

	var map_varTab = [];
	for(i in origin_used){
		var m_file = minified_file_dir + origin_used[i] + '.min.js';
		console.log("**** Reading Minified File: " + m_file);
		var minified_code = fs.readFileSync(m_file, 'utf-8');
		map_varTab = map_varTab.concat(extract_mapping(minified_code, rawSourceMap_files[i]));
	}

	var predicted_varTab = [];
	for(j in origin_used){
		var p_file = predicted_file_dir + origin_used[j] + '.rename.js';
		console.log("**** Reading Predicted File: " + p_file);
		var predicted_code = fs.readFileSync(p_file, 'utf-8');
		predicted_varTab = predicted_varTab.concat(extract_variables(predicted_code));
	}

	

	console.log("\n## Precision: " + cal_precision(origin_varTab, map_varTab, predicted_varTab));
	console.log("\n## Origin file used: " + origin_size);
}

//Revised test function to calculate each file first, then summarize the results
function test_main_2() {
	//var dir_base = '/home/aliu/Research/ML4P/NamePrediction/';
	//var dir_base = '/home/aliu/Research/TestDB/ML4P/NamePrediction/aliu-test/test_files/';
	//JQuery Test
	var dir_base = '/home/aliu/Research/More/TestBench/Deobfuscation/jquery_test/';
	
	
	var origin_file_dir = dir_base + 'original_source/';
	var minified_file_dir = dir_base + 'cc_minified/';
	var map_file_dir =  dir_base + 'cc_source_maps/';
	var predicted_file_dir = dir_base + 'cc_predicted/';
	

	//Dir path 'cc' for Closure-Compiler, 'uglifyjs' for UglifyJS
	//var origin_file_dir = dir_base + 'original_source/';
	//var minified_file_dir = dir_base + 'minified_source/cc/';
	//var map_file_dir =  dir_base + 'source_maps/cc/';
	//var predicted_file_dir = dir_base + 'predicted_source/cc/';
	

	var origin_files = fs.readdirSync(origin_file_dir);

	var used_origin_file = 0;
	var result_json = [];
	var correct = 0, total = 0;

	for(k in origin_files){
		var o_file = origin_file_dir + origin_files[k];
		if(checkMinifiedExist(origin_files[k], minified_file_dir) && getFileSizeInKB(o_file) < 50) {
			var origin_varTab = [];
			var origin_code = fs.readFileSync(o_file, 'utf-8');
			origin_varTab = extract_variables(origin_code);
			
			var ma_file = map_file_dir + getGroupFile(origin_files[k], 'map');
			var rawSourceMap = JSON.parse(fs.readFileSync(ma_file,'utf-8'));
			rawSourceMap["sourceRoot"] = map_file_dir;

			var map_varTab = [];
			var m_file = minified_file_dir + getGroupFile(origin_files[k], 'minified');
			var minified_code = fs.readFileSync(m_file, 'utf-8');
			map_varTab = extract_mapping(minified_code, rawSourceMap);

			var predicted_varTab = [];
			var p_file = predicted_file_dir + getGroupFile(origin_files[k], 'predicted');
			/*
			Following statement is used to calculate the "baseline" precision
			*/
			//var p_file = minified_file_dir + getGroupFile(origin_files[k], 'minified');
			var predicted_code = fs.readFileSync(p_file, 'utf-8');
			predicted_varTab = extract_variables(predicted_code);

			if( checkLegalVarTab(origin_varTab, map_varTab, predicted_varTab) ) {
				used_origin_file++;
				var result_stat = cal_precision_json(origin_varTab, map_varTab, predicted_varTab);
				correct += result_stat.correct;
				total += result_stat.total;
				result_json.push( {"filename": p_file, "result": result_stat} );
				//Report the file with low precision
				reportLowPrecisionFiles(result_stat, p_file);	
			}
		}
	}

	displayResult(result_json);
	console.log("\n## General Correct: " + correct + ", General Total: " + total);
	console.log("\n## General Precision: " + (correct / total).toFixed(2));
	console.log("\n## Origin file used: " + used_origin_file);
}

//Check whether an original file is successfully minified
function checkMinifiedExist(file, dir) {
	var minified_file_name = dir + path.basename(file, '.js') + '.min.js';
	if(fs.existsSync(minified_file_name))
		return true;
	else
		return false;
}

//Check whether the variable lists are legal
function checkLegalVarTab(origin, mapped, predicted) {
	if(origin.length <= 0)
		return false;
	else {
		if(mapped.length != predicted.length)
			return false;
		else
			return true;
	}
}

function getFileSizeInKB(file) {
	return fs.statSync(file)["size"] / 1024;
}

function getGroupFile(file, tag) {
	var basename = path.basename(file, '.js');
	if( tag == 'minified' )
		return basename + '.min.js';
	else if( tag == 'map' )
		return basename + '.map';
	else if( tag == 'predicted' )
		return basename + '.rename.js';
	else
		return;
}

//Display the calculation result for each file
//result_json: list object of {"filename": name, "result": {"correct": count, "total": total}}
function displayResult(result_json) {
	for( r in result_json ) {
		console.log("##" + result_json[r]["filename"]);
		var result = result_json[r]["result"];
		console.log("--" + " Correct: " + result["correct"] + ", Total: " + result["total"]);
		if( result["total"] != 0)
			console.log("--" + " Precision: " + ( result["correct"] / result["total"] ).toFixed(2));
		else
			console.log("--" + " Precision " + 1);
	}
}

//Report files with precision less than 50%, and variables more than 10
var low_precision_file_report = '/home/aliu/Research/TestDB/ML4P/NamePrediction/aliu-test/test_files/low_precision_jquery';
function reportLowPrecisionFiles(result_stat, fname) {
	var precision = (result_stat.correct / result_stat.total).toFixed(2);
	if ( result_stat.total >= 10 && precision <= 0.5 )
		fs.appendFileSync(low_precision_file_report, precision + ' ' + fname + '\n');
}

test_main();
//test_main_1();
//test_main_2();