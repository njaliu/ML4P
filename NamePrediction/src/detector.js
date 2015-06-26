var UglifyJS = require("uglify-js");
var fs = require("fs");
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

function test_main() {
	var dir_base = '/home/aliu/Research/closure-compiler/';
	
	var origin_file = dir_base + 'aliu-test/test2.js';
	var origin_code = fs.readFileSync(origin_file, 'utf-8');

	var minified_file = dir_base + 'aliu-test/test2.min.js';
	var minified_code = fs.readFileSync(minified_file, 'utf-8');

	var result = detect_reuse(origin_code, minified_code);
	if(result != null)
		console.log("## Origin: " + result.origin + ", Minified: " + result.minified);
}

test_main();