var C2TK = require('./tokenizer.js');
var fs = require('fs');

var code = fs.readFileSync('/home/aliu/jquery_test.js', 'utf-8');
console.log(C2TK(code));