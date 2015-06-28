var fs = require("fs");

var dir = "/home/aliu/Research/ML4P/NamePrediction/aliu-test/origin/";

var file_list = [];

file_list = fs.readdirSync(dir);

for(file in file_list){
	console.log(file_list[file]);
}

console.log(file_list[0]);