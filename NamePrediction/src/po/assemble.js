var disassembler = require('./disassemble.js');
var fs = require('fs');

var dir_base = '/home/aliu/experiments/';
var PO = 'po_', js_ext = '.js', js_min_ext = '.min.js', map_ext = '.map';

function locate(host, guest) {
	var pos = 1;
	var lines = host.split(/\r\n|\r|\n/);
	for(i in lines) {
		var line = lines[i];
		if(line.indexOf(guest) == -1)
			pos++;
		else
			return pos;
	}
	return -1;
}

var assembler = function(code, seed) {
	var input = disassembler(code, seed);
	var code = input.code;
	var marker = input.marker;
	var smInfo = {};

	for( key in marker ) {
		if( marker.hasOwnProperty(key) ) {
			var replace_str = '\"' + key + '\"';
			var start_pos = locate(code, replace_str);
			var file = dir_base + marker[key] + js_min_ext;
			var content = fs.readFileSync(file, 'utf-8');
			var end_pos = start_pos + content.split(/\r\n|\r|\n/).length;
			//var range = {start: start_pos, end: end_pos};
			var range = start_pos + '#' + end_pos;
			smInfo[range] = dir_base + marker[key] + map_ext;
			code = code.replace(replace_str, content);
		}
	}
	var output = {code: code, sm: smInfo};
	
	return output;
}

//----------------------------------------------------------------------
//test cases
//----------------------------------------------------------------------

/*
var test_file = '/home/aliu/experiments/manipulation.js';
var test_code = fs.readFileSync(test_file, 'utf-8');
var output = assembler(test_code);
fs.writeFileSync(dir_base + 'manipulation.after.js', output.code);
*/

module.exports = assembler;