var UglifyJS = require("uglify-js");
var fs = require("fs");
var path = require("path");
var sourceMap = require('source-map');
/*
	Detect variable reusing.
	origin: the original code
	minified: the minified code from a minifier
*/
function detect_reuse(origin, minified) {
	var o_var = [];
	var m_var = [];
	var varTab = [];

	try {
		var o_top_level = UglifyJS.parse(origin);
		var m_top_level = UglifyJS.parse(minified);

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

		o_top_level.walk(walker);
		o_var = varTab;
		varTab = [];
		m_top_level.walk(walker);
		m_var = varTab;

		if( o_var.length > m_var.length ) {
			console.log("## Reuse detected: " + (o_var.length - m_var.length));
			return {"origin": o_var.length, "minified": m_var.length};
		}
		else if( o_var.length > m_var.length ) {
			console.log("## Error: origin = " + o_var.length + ", minified = " + m_var.length);
			return;
		}
		else {
			console.log("## No reuse");
			return;
		}
	}
	catch(ex) {
		console.log("*******EEEEEEEE********: Error caught!" );
		console.log(ex);
		return;
	}	
}

//Simple test function to handle single input file
function test_main() {
	//var dir_base = '/home/aliu/Research/closure-compiler/aliu-test/';
	//var dir_base = '/home/aliu/Research/ML4P/NamePrediction/aliu-test/test_files/uglifyjs/';
	//var dir_base = '/home/aliu/Research/TestDB/ML4P/NamePrediction/aliu-test/test_files/cc/';
	var dir_base = '/home/aliu/Research/More/TestBench/Deobfuscation/jquery_test/';

	var origin_file = dir_base + 'original_source/Data.js';
	var origin_code = fs.readFileSync(origin_file, 'utf-8');

	var minified_file = dir_base + 'cc_minified/Data.min.js';
	var minified_code = fs.readFileSync(minified_file, 'utf-8');

	var result = detect_reuse(origin_code, minified_code);
	if(result != null)
		console.log("## Origin: " + result.origin + ", Minified: " + result.minified);
}

//Revised test funcion to handle inputs via directory path
function test_main_1() {
	//var dir_base = '/home/aliu/Research/closure-compiler/aliu-test/';
	//var dir_base = '/home/aliu/Research/ML4P/NamePrediction/';
	//var dir_base = '/home/aliu/Research/TestDB/ML4P/NamePrediction/aliu-test/test_files/';
	var dir_base = '/home/aliu/Research/More/TestBench/Deobfuscation/jquery_test/';
	//var origin_file_dir = dir_base + 'jss/';
	//var minified_file_dir = dir_base + 'cc_jsm/';
	var origin_file_dir = dir_base + 'original_source/';
	var minified_file_dir = dir_base + 'uglifyjs_minified/';

	var origin_files = fs.readdirSync(origin_file_dir);
	var minified_files = fs.readdirSync(minified_file_dir);

	var reuse_num = 0;
	var used = 0;
	for(i in origin_files) {
		var origin_file = origin_file_dir + origin_files[i];
		if(checkMinifiedExist(origin_files[i], minified_file_dir) && (fs.statSync(origin_file)["size"] / 1024 < 10)) {
			used++;
			//var origin_file = origin_file_dir + origin_files[i];
			var origin_code = fs.readFileSync(origin_file, 'utf-8');

			var minified_file = minified_file_dir + path.basename(origin_files[i], '.js') + '.min.js';
			var minified_code = fs.readFileSync(minified_file, 'utf-8');

			var result = detect_reuse(origin_code, minified_code);
			if(result != null) {
				reuse_num += result.origin - result.minified;
				console.log("## Origin: " + result.origin + ", Minified: " + result.minified);
			}
		}
	}
	console.log("## Origin file used: " + used);
	console.log("## Total reuse: " + reuse_num);
}

//Check whether an original file is successfully minified
function checkMinifiedExist(file, dir) {
	var minified_file_name = dir + path.basename(file, '.js') + '.min.js';
	if(fs.existsSync(minified_file_name)){
		console.log("## Processing: " + minified_file_name);
		return true;
	}
	else
		return false;
}

test_main();
//test_main_1();