var UglifyJS = require("uglify-js");
var fs = require("fs");
var _ = require("underscore");

var funExtractor = function(ast) {
	var funs = [];

	var walker = new UglifyJS.TreeWalker(function(node){
		if(node instanceof UglifyJS.AST_Defun) {
			//console.log(node.print_to_string({beautify: false}));
			console.log(node.name.name);
			//console.log(node.start);
			funs.push( {ast_node: node, json: JSON.stringify(node)} );
		}
	});
	ast.walk(walker);

	return funs;
}

var funMarker = function(ast, picked) {
	//console.log(picked[0]);
	var transformer = new UglifyJS.TreeTransformer(null, function(node){
		if( _.contains(picked, JSON.stringify(node)) ){
			return new UglifyJS.AST_String({value: ' _aliu_ '});
		}
	});

	return ast.transform(transformer);
}

//----------------------------------------------------------------------
//test cases
//----------------------------------------------------------------------

var code = "var a; function bar(b, c){console.log(a);} a++;console.log(a);";
var ast = UglifyJS.parse(code);
var picked = _.pluck(funExtractor(ast), 'json');
var ast_new = funMarker(ast, picked);

console.log(ast_new.print_to_string());