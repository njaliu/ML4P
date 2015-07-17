var fs = require("fs");
var Esprima = require("esprima");
var _ = require("underscore");

var ignored = ['Identifier', 'Punctuator', 'String', 'RegularExpression', 'Numeric'];

function code2tokens(code) {
	var result = "";
	var tks = Esprima.tokenize(code);
	for(i in tks) {
		var token = tks[i];
		if( _.contains(ignored, token.type) )
			result = result.concat(token.type + ' ');
		else
			result = result.concat(token.value + ' ');
	}

	return result;
}

function test_main() {
	var dir_base = '/home/aliu/Research/ML4P/NamePrediction/aliu-test/mutation/';
	var file_minified = dir_base + 'jquery_test.min.js';
	var file_non_minified = dir_base + 'jquery_test.non.min.js';
	var code_minified = fs.readFileSync(file_minified, 'utf-8');
	var code_non_minified = fs.readFileSync(file_non_minified, 'utf-8');
	var lm_input_minified = '/home/aliu/Research/ML4P/NamePrediction/aliu-test/mutation/test_minified.input';
	var lm_input_non_minified = '/home/aliu/Research/ML4P/NamePrediction/aliu-test/mutation/test_non_minified.input';
	var result_minified = code2tokens(code_minified);
	var result_non_minified = code2tokens(code_non_minified);
	fs.appendFileSync(lm_input_minified, result_minified);
	fs.appendFileSync(lm_input_non_minified, result_non_minified);
}

function test_main_1() {
	var dir_base = '/home/aliu/Research/More/TestBench/Deobfuscation/jquery_test/original_source/';
	var lm_input = '/home/aliu/Research/ML4P/NamePrediction/aliu-test/mutation/lm/jquery.token.input';
	var files = fs.readdirSync(dir_base);
	var count = 0;
	console.log("#### Total files: " + files.length);

	for(i in files) {
		var file = dir_base + files[i];
		var code = fs.readFileSync(file, 'utf-8');
		try{
			var result = code2tokens(code);
			fs.appendFileSync(lm_input, result + '\n');
			count++;
		} catch(e) {
			console.log(e);
		}
	}
	
	console.log("#### File used: " + count);
	console.log("#### TOKEN EXTRACTION SUCCESS!");
}

test_main();
//test_main_1();
