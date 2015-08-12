var fs = require('fs');
var sourceMap = require("source-map");
var assembler = require('./assemble.js');
var UglifyJS = require('uglify-js');
var exec = require('child_process').execSync;

var dir_base = '/home/aliu/experiments/';
var CC = '/home/aliu/Research/More/Download/closure-compiler-master/build/compiler.jar';

function checkOriginal(line, smInfo) {
	var keys = Object.keys(smInfo);
	for(i in keys) {
		var start = Number(keys[i].split('#')[0]), end = Number(keys[i].split('#')[1]);
		if( line >= start && line <= end )
			return {start: start, map_file: smInfo[keys[i]]};
	}
	return null;
}

function find_source_mapping(smc, smInfo, pos) {
	var line = pos.line;
	var column = pos.column;
	var origin_obj = smc.originalPositionFor({
		line: line,
		column: column
	});
	console.log(origin_obj);
	var origin_line = origin_obj.line;
	var origin_column = origin_obj.column;
	var result = checkOriginal(origin_line, smInfo);
	var map_file = (result == null) ? null : result.map_file;
	if( map_file == null) {
		return origin_obj.name;
	}
	else {
		var rawSourceMap = JSON.parse(fs.readFileSync(map_file,'utf-8'));
		rawSourceMap["sourceRoot"] = dir_base;
		var smc_new = new sourceMap.SourceMapConsumer(rawSourceMap);
		var origin_obj_new = smc_new.originalPositionFor({
			line: origin_line - result.start + 1,
			column: origin_column
		});
		console.log(origin_obj_new);
		return origin_obj_new.name;
	}
}

var extract_mapping_po = function(code, smInfo, rawSourceMap) {
	var varTab = [];
	var mapTab = []

	try {
		var top_level = UglifyJS.parse(code);
		var smc = new sourceMap.SourceMapConsumer(rawSourceMap);

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
			//mapTab.push((smc.originalPositionFor({line: v.line, column: v.col})).name);
			var pos = {line: v.line, column: v.col};
			var found = find_source_mapping(smc, smInfo, pos);
			mapTab.push(found);
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

function displaySMINFO(smInfo) {
	for( key in smInfo ) {
		var start = key.split('#')[0], end = key.split('#')[1];
		console.log("# (" + start + ", " + end + "): " + smInfo[key]);
	}
}
//----------------------------------------------------------------------
//test cases
//----------------------------------------------------------------------

function test_main() {
	var test_file = '/home/aliu/experiments/manipulation.js';
	var test_code = fs.readFileSync(test_file, 'utf-8');
	var output = assembler(test_code, 207);
	fs.writeFileSync(dir_base + 'manipulation.after.js', output.code);
	var smInfo = output.sm;
	displaySMINFO(smInfo);

	console.log("Start final obfuscation ...");
	var cmd_minify = 'java -jar ' + CC + ' --js ' + '/home/aliu/experiments/manipulation.after.js' + ' --js_output_file ' 
					+ '/home/aliu/experiments/manipulation.after.min.js' + ' --create_source_map ' + '/home/aliu/experiments/manipulation.map'
					+ ' --formatting PRETTY_PRINT' + ' --mutation_seed ' + 0;
	exec(cmd_minify);
	console.log("Finish final obfuscation ...");

	var rawSourceMap = JSON.parse(fs.readFileSync('/home/aliu/experiments/manipulation.map','utf-8'));
	rawSourceMap["sourceRoot"] = dir_base;
	var after_code = fs.readFileSync('/home/aliu/experiments/manipulation.after.min.js', 'utf-8');
	var mapTab = extract_mapping_po(after_code, smInfo, rawSourceMap);

	console.log("Done!\n" + mapTab);
}

//test_main();

module.exports = extract_mapping_po;