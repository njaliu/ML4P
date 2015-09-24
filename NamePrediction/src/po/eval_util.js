var UglifyJS = require("uglify-js");
var fs = require("fs");
var _ = require("underscore");

var small_func = [];
var MIN_FUNC_SYMBOL = 2;

function detect_small_function(code) {
	try {
		var top_level = UglifyJS.parse(code);
		top_level.figure_out_scope();

		var walker = new UglifyJS.TreeWalker(function (node){
			if(node instanceof UglifyJS.AST_Defun) {
				if( node.enclosed.length <= MIN_FUNC_SYMBOL )
					small_func.push(node.name.name);
				console.log(node.name.name);
			}
		});

		top_level.walk(walker);
	} catch (ex) {
		console.log("*******EEEEEEEE********: Error caught!" );
		console.log(ex);
	}
}

function extract_variables_no_small_function(code) {
	//varTab is a JSON, as {variable: value, local: value, small: value}
	var varTab = [];

	try {
		var top_level = UglifyJS.parse(code);
		top_level.figure_out_scope();

		var walker = new UglifyJS.TreeWalker(function (node){
			if(node instanceof UglifyJS.AST_Defun) {
				if( node.enclosed.length <= MIN_FUNC_SYMBOL )
					small_func.push(node.name.name);
				console.log(node.name.name);
			}

    		if (node instanceof UglifyJS.AST_VarDef) {
      	  	// string_template is a cute little function that UglifyJS uses for warnings
       	 		console.log(UglifyJS.string_template("Found Variable {name} at {line},{col}", {
       	     		name: node.name.name,
       	    	 	line: node.start.line,
      	     	 	col: node.start.col
      	  		}));

				var var_scope = node.name.scope.name;
				if(var_scope == undefined)
					fn_name = "TOP_LEVEL";
				else if(var_scope == null)
					fn_name = "ANONYMOUS_FN";
				else
					var fn_name = node.name.scope.name.name;
				
				if( is_small_function(small_func, fn_name) ) {
      	  			varTab.push({variable: node.name.name, local: true, small: true});
      	  		}
      	  		else {
      	  			//Mark the variable as global or local for later comparison.
      	  			if(node.name.thedef.global)
       	 				varTab.push({variable: node.name.name, local: false, small: false});
       	 			else
       	 				varTab.push({variable: node.name.name, local: true, small: false});
      	  		}
   			}

    		if (node instanceof UglifyJS.AST_SymbolFunarg) {
        		// string_template is a cute little function that UglifyJS uses for warnings
        		console.log(UglifyJS.string_template("Found Function Argument {name} at {line},{col}", {
            		name: node.name,
            		line: node.start.line,
            		col: node.start.col
        		}));

        		var fn_anonymous = node.scope.name;
        		var fn_anonymous_name = (fn_anonymous == null ? "ANONYMOUS_FN" : node.scope.name.name);

        		if( is_small_function(small_func, fn_anonymous_name) ) {
        			varTab.push({variable: node.name, local: true, small: true});
        		}
        		else {
        			//varTab.push(node.name);
        			varTab.push({variable: node.name, local: true, small: false});	
        		}
    		}
		});

		top_level.walk(walker);
	}
	catch(ex) {
		console.log("*******EEEEEEEE********: Error caught!" );
		console.log(ex);
	}
	
	return varTab;
}

function is_small_function(blacklist, fn) {
	if( _.contains(blacklist, fn) )
		return true;
	else
		return false;
}

//------------------------------------------------------------------
//test main
//------------------------------------------------------------------

function test_main() {
	var code = function foo(a){var b; b = a; return b;};
	code = code.toString();
	detect_small_function(code);
	console.log(small_func);
}

function test_main_simple_file() {
	var file = '/home/aliu/small_fn_test.js';
	var code = fs.readFileSync(file, 'utf-8');
	var vars = extract_variables_no_small_function(code);
	console.log(vars);
	console.log(small_func);
}

//test_main();
//test_main_simple_file();

module.exports = extract_variables_no_small_function;