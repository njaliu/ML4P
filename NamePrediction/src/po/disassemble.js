var UglifyJS = require("uglify-js");
var fs = require("fs");
var _ = require("underscore");
var exec = require('child_process').execSync;

var PICKED = [];
var PREFIX = '_aliu_';
var markerMap = {};
var dir_base = '/home/aliu/experiments/';
var PO = 'po_', js_ext = '.js', js_min_ext = '.min.js', map_ext = '.map';
var CC = '/home/aliu/Research/More/Download/closure-compiler-master/build/compiler.jar';

function funExtractor(ast) {
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

function funMarker(ast, picked) {
	//console.log(picked[0]);
	var id = 0;
	var transformer = new UglifyJS.TreeTransformer(null, function(node){
		if( _.contains(picked, JSON.stringify(node)) ){
			var marker = PREFIX + id;
			fs.writeFileSync(dir_base + PO + id + js_ext, node.print_to_string({beautify: true}));
			markerMap[marker] = PO + id;
			id++;
			return new UglifyJS.AST_String({value: marker});
		}
	});

	return ast.transform(transformer);
}

function sampling(candidates) {
	var n = _.random(0, candidates.length);
	return _.sample(candidates, n);
}

function partialObufscate(markerMap, obfuscator, seed) {
	for( key in markerMap ) {
		if(markerMap.hasOwnProperty(key)) {
			var origin = dir_base + markerMap[key] + js_ext;
			var minified_mutant = dir_base + markerMap[key] + js_min_ext;
			var map_mutant = dir_base + markerMap[key] + map_ext;
			
			var cmd_minify = 'java -jar ' + obfuscator + ' --js ' + origin + ' --js_output_file ' 
					+ minified_mutant + ' --create_source_map ' + map_mutant
					+ ' --mutation_seed ' + seed;
			exec(cmd_minify);

			//var code = fs.readFileSync(dir_base + markerMap[key] + js_ext, 'utf-8');
			//fs.writeFileSync(dir_base + markerMap[key] + js_min_ext, code);
		}
	}
}

var disassembler = function(code, seed) {
	var ast = UglifyJS.parse(code);
	var candidates = _.pluck(funExtractor(ast), 'json');
	PICKED = sampling(candidates).slice();
	var ast_new = funMarker(ast, PICKED);
	partialObufscate(markerMap, CC, seed);
	var result = {code: ast_new.print_to_string({beautify: true}), marker: markerMap};
	return result;
}



//----------------------------------------------------------------------
//test cases
//----------------------------------------------------------------------

/*
var test_file = '/home/aliu/experiments/manipulation.js';
var test_code = fs.readFileSync(test_file, 'utf-8');
var output = disassembler(test_code);
fs.appendFileSync(dir_base + 'manipulation.after.js', output.code);
*/

module.exports = disassembler;