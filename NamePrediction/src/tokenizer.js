var fs = require("fs");
var Esprima = require("esprima");
var _ = require("underscore");

var ignored = ['String', 'RegularExpression', 'Numeric'];
var ign_punc = [';', ',', '.', '(', ')', '[', ']', '{', '}'];

var id_map = {};
var count = 0;

var c2tk_punc = function (code) {
	var result = "";
	try {
		var tks = Esprima.tokenize(code);
		for(i in tks) {
			var token = tks[i];
			if( token.type == 'Punctuator' ) {
				if( _.contains(ign_punc, token.value) )
					result = result.concat(token.value + ' ');
			} 
			else if( token.type == 'Identifier' ) {
				result = result.concat(getName(token).id + ' ');
			}
			else if( _.contains(ignored, token.type) )
				result = result.concat(token.type + ' ');
			else
				result = result.concat(token.value + ' ');

			if( i % 50 == 0)
				result = result.concat('\n' + ' ');
		}
	} catch(ex) {
		console.log("*******EEEEEEEE********: Error caught!" );
		console.log(ex);
	}

	return result;
}



var c2tk = function(code) {
	var ign = ['Identifier', 'Punctuator', 'String', 'RegularExpression', 'Numeric'];
	var result = "";
	try {
		var tks = Esprima.tokenize(code);
		for(i in tks) {
			var token = tks[i];
			if( token.type != 'Punctuator' ) {
				if( token.type == 'Identifier' ) {
					result = result.concat(getName(token).id + ' ');
					//console.log("hhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhh");
				}
				else if( _.contains(ign, token.type) )
					result = result.concat(token.type + ' ');
				else
					result = result.concat(token.value + ' ');	
			}

			if( i % 50 == 0)
				result = result.concat('\n' + ' ');
		}	
	} catch(ex){
		console.log("*******EEEEEEEE********: Error caught!" );
		console.log(ex);
	}
	

	return result;
};

function getName(token) {
	var str = token.value;
	if (id_map.hasOwnProperty(str)) return id_map[str];
    var id_str = "_" + (++count);
    return id_map[str] = { name: str, id: id_str };
}


//--------------------------------------------------------------------------
//Test cases
//--------------------------------------------------------------------------

function test_main() {
	var dir_base = '/home/aliu/Research/ML4P/NamePrediction/aliu-test/mutation/';
	var file_minified = dir_base + 'jquery_test.min.js';
	var file_non_minified = dir_base + 'jquery_test.non.min.js';
	var code_minified = fs.readFileSync(file_minified, 'utf-8');
	var code_non_minified = fs.readFileSync(file_non_minified, 'utf-8');
	var lm_input_minified = '/home/aliu/Research/ML4P/NamePrediction/aliu-test/mutation/test_minified.input';
	var lm_input_non_minified = '/home/aliu/Research/ML4P/NamePrediction/aliu-test/mutation/test_non_minified.input';
	var result_minified = c2tk(code_minified);
	var result_non_minified = c2tk(code_non_minified);
	fs.appendFileSync(lm_input_minified, result_minified);
	fs.appendFileSync(lm_input_non_minified, result_non_minified);
}

function test_main_1() {
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
			//var result = c2tk(code);
			var result = c2tk_punc(code);
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

module.exports = c2tk;
//test_main();
//test_main_1();
