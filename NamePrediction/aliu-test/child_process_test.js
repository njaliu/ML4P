var exec = require('child_process').execSync;

var fs = require('fs');

var cmd = 'java -jar /home/aliu/Research/More/Download/closure-compiler-master/build/compiler.jar --js /home/aliu/jquery_test.js --js_output_file /home/aliu/jquery_test.min.js --formatting PRETTY_PRINT --mutation_seed 4';
exec(cmd);
//var content = fs.readFileSync('/home/aliu/jquery_test.min.js', 'utf-8');
//console.log(content);