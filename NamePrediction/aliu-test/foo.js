var fs = require("fs");
var path = require("path");

var dir = "/home/aliu/Research/ML4P/NamePrediction/aliu-test/test_files/predicted_source/uglifyjs/";
var dir_minified = "/home/aliu/Research/ML4P/NamePrediction/aliu-test/test_files/minified_source/uglifyjs/";

var file_list = [];

file_list = fs.readdirSync(dir);

var size = 0;
for(i in file_list){
	var file_basename = path.basename(file_list[i], '.rename.js');
	var minified_file_name = dir_minified + file_basename + '.min.js';
	if(!fs.existsSync(minified_file_name))
		console.log(minified_file_name);
	size++;
}

console.log(size);
/*
console.log(file_list[0]);

if(fs.existsSync(dir + 'test1.js'))
	console.log('Yeah!');

console.log(path.basename('test1.rename.js', '.rename.js'));
*/