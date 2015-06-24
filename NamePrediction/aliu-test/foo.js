var fs = require("fs");

var dir = "/home/aliu/Research/ML4P/NamePrediction/aliu-test/origin/";

var file_list = [];

file_list = fs.readdirSync(dir);

file_list.filter(function(file){
	return file.substr(-3) === ".js";
});

file_list.forEach(function(file){
	console.log(file);
});