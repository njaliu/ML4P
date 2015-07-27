var exec = require('child_process').execSync;
var spawn = require('child_process').spawn;
var who = spawn('echo', ['haha']);

var fs = require('fs');

var cmd = 'java -jar /home/aliu/Research/More/Download/closure-compiler-master/build/compiler.jar --js /home/aliu/jquery_test.js --js_output_file /home/aliu/jquery_test.min.js --formatting PRETTY_PRINT --mutation_seed 4';
var cmd_who = 'who am i';
var cmd_python = './python /home/aliu/Research/ML4P/NamePrediction/src/lm/test_lm.py';

//process.chdir('/home/aliu/Research/klm/bin/');
//exec(cmd_python);
//var score = fs.readFileSync('/home/aliu/klm_score');
//if(Number(score) < -5)
	//console.log('YES!');
//console.log(out);
//var content = fs.readFileSync('/home/aliu/jquery_test.min.js', 'utf-8');
//console.log(content);

var obj = {yes: 1, no: 0};
console.log(JSON.stringify(obj) + 'haha');