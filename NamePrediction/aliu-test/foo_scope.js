var UglifyJS = require("uglify-js");

var code = 
	function bar(x) {
		var z;
		var y = x;
		y = 1;
		y = 2;
		y = x + 1;
		z = y;
	};
code = code.toString();
// sample AST
var ast = UglifyJS.parse(code);

ast.figure_out_scope();

var walker = new UglifyJS.TreeWalker(function(node){
	if(node instanceof UglifyJS.AST_Defun) {
		console.log(node.name);
		console.log(Object.keys(node.variables).length);
		console.log(node.variables.hasOwnProperty('z'));

		for( i in Object.keys(node.variables) ) {
			console.log(node.variables[i]);
		}		
	}
});

//ast.walk(walker);
ast.compute_char_frequency();

