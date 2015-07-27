var fs = require('fs');
var path = require('path');

var file = '/home/aliu/Research/More/TestBench/Deobfuscation/Bench4prob/results/high_precision_baseline';
var content = fs.readFileSync(file, 'utf-8');

var first = content.split('\n')[0];
var second = content.split('\n')[0];
var len = second.split('/').length;
var file_prefix = path.basename(second.split('/')[len-1], '.rename.js');

var precision = Number(first.split(' ')[0]);

console.log(file_prefix);