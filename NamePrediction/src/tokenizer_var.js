var UglifyJS = require("uglify-js");
var fs = require("fs");
var Esprima = require("esprima");
var _ = require("underscore");

var prefix = '_aliu_';
var ignored = ['String', 'RegularExpression', 'Numeric'];
var ign_punc = [';', ',', '.', '(', ')', '[', ']', '{', '}'];

var id_map = {};
var count = 0;

function init() {
	id_map = {};
	count = 0;
}

var transformer = new UglifyJS.TreeTransformer(null, function (node){
	if( node instanceof UglifyJS.AST_SymbolRef ) {
		if(node.thedef.undeclared)
			return;
		var defs = new UglifyJS.AST_SymbolRef({
			    		name 	: prefix + node.name,
			   	 		value 	: node
					});
		return defs;
	}
	if( node instanceof UglifyJS.AST_SymbolVar ) {
		var defs = new UglifyJS.AST_SymbolVar({
			    		name 	: prefix + node.name,
			   	 		value 	: node
					});
		return defs;
	}
});

function rewrite(code) {
	var ast = UglifyJS.parse(code);
	ast.figure_out_scope();
	var ast_new = ast.transform(transformer);
	var code_new = ast_new.print_to_string({ beautify: true });

	return code_new;
}

var tokenizer = function(code) {
	var code_new = rewrite(code);
	var result = "";
	init();
	try {
		var tks = Esprima.tokenize(code_new);
		
		for(i in tks) {
			var token = tks[i];
			var tt = token.type;
			if( tt != 'Punctuator' ) {
				if( tt == 'Identifier' ) {
					if( token.value.indexOf(prefix) === 0 ){
						result = result.concat(getName(token).id + ' ');
					}
					else {
						result = result.concat(token.value + ' ');
					}
				}
				else if( _.contains(ignored, tt) )
					result = result.concat(tt + ' ');
				else
					result = result.concat(token.value + ' ');
			}
			else {
				if( !(_.contains(ign_punc, token.value)) )
					result = result.concat(token.value + ' ');
			}

			if( i % 50 == 0)
				result = result.concat('\n' + ' ');
		}
	} catch(ex) {
		console.log("*******EEEEEEEE********: Error caught!" );
		console.log(ex);
	}

	return result;
}

function getName(token) {
	var str = token.value;
	if (id_map.hasOwnProperty(str)) return id_map[str];
    var id_str = "_" + (++count);
    return id_map[str] = { name: str, id: id_str };
}

//------------------------------------------------------------------
//test main
//------------------------------------------------------------------

var code = 
		function bar(x) {
			var z;
			var y = x.pos;
			y = 1;
			y = 2;
			y = 3;
			console.log(y);
			if(y > 2)
				z = y;
			y = x.pos + 1;
		};
code = code.toString();

function test_main_simple() {
	//var dir_base = '/home/aliu/Research/ML4P/NamePrediction/aliu-test/mutation/';
	var dir_base = '/home/aliu/';
	var file_origin = dir_base + 'tmp1.js';
	var code_origin = fs.readFileSync(file_origin, 'utf-8');
	var lm_input_origin = '/home/aliu/Research/More/TestBench/Deobfuscation/Bench4prob/results/guidance/tmp1.token';	
	id_map = {};
	count = 0;
	var result_origin = tokenizer(code_origin);
	id_map = {};
	count = 0;
	fs.appendFileSync(lm_input_origin, result_origin);
}

function test_main_single_file() {
	var dir_base = '/home/aliu/Research/ML4P/NamePrediction/aliu-test/mutation/';
	var file_origin = dir_base + 'jquery_test.js';
	var file_minified = dir_base + 'jquery_test.min.js';
	var file_non_minified = dir_base + 'jquery_test.non.min.js';
	var code_origin = fs.readFileSync(file_origin, 'utf-8');
	var code_minified = fs.readFileSync(file_minified, 'utf-8');
	var code_non_minified = fs.readFileSync(file_non_minified, 'utf-8');
	var lm_input_origin = '/home/aliu/Research/ML4P/NamePrediction/aliu-test/mutation/test_origin.input';
	var lm_input_minified = '/home/aliu/Research/ML4P/NamePrediction/aliu-test/mutation/test_minified.input';
	var lm_input_non_minified = '/home/aliu/Research/ML4P/NamePrediction/aliu-test/mutation/test_non_minified.input';
	id_map = {};
	count = 0;
	var result_origin = tokenizer(code_origin);
	id_map = {};
	count = 0;
	var result_minified = tokenizer(code_minified);
	id_map = {};
	count = 0;
	var result_non_minified = tokenizer(code_non_minified);
	id_map = {};
	count = 0;
	fs.appendFileSync(lm_input_origin, result_origin);
	fs.appendFileSync(lm_input_minified, result_minified);
	fs.appendFileSync(lm_input_non_minified, result_non_minified);
}

function test_main() {
	//var dir_base = '/home/aliu/Research/More/TestBench/Deobfuscation/jquery_test/original_source/';
	var dir_base = '/home/aliu/Research/More/TestBench/Deobfuscation/Bench4prob/original_source/';
	//var lm_input = '/home/aliu/Research/ML4P/NamePrediction/aliu-test/mutation/lm/jquery.token.input';
	var lm_github_150 = '/home/aliu/Research/ML4P/NamePrediction/aliu-test/mutation/lm/github_150.noPun.id.token.input';
	var files = fs.readdirSync(dir_base);
	var n = 0;
	console.log("#### Total files: " + files.length);

	for(i in files) {
		var file = dir_base + files[i];
		console.log("#### Extracting: " + file);
		var code = fs.readFileSync(file, 'utf-8');
		try{
			var result = tokenizer(code);
			fs.appendFileSync(lm_github_150, result + '\n');
			n++;

			id_map = {};
			count = 0;
		} catch(e) {
			console.log(e);
		}
	}
	
	console.log("#### File used: " + n);
	console.log("#### TOKEN EXTRACTION SUCCESS!");
}

module.exports = tokenizer;
//test_main_single_file();
//test_main_simple();

console.log(rewrite(fs.readFileSync('/home/aliu/tmp.js', 'utf-8')));