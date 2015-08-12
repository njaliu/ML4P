var fs = require('fs');

function getImprove(result_str) {
	var result_json = JSON.parse(result_str);
	var erase = result_json.improve;

	return (erase < 0.9) ? (result_json.baseline - result_json.mutant) : 0;
}

var improved_analyzer = function() {
	var base_dir = '/home/aliu/Research/More/TestBench/Deobfuscation/Bench4prob/results/logs/';
	var file = '20150804_mcmc_n10_5gram_highest_100';

	var results = fs.readFileSync(base_dir + file, 'utf-8').split('\n');
	var len = results.length - 1;
	var improve = 0;

	for(var i = 0; i < len; i++) {
		var result = results[i];
		improve += getImprove(result);
	}

	console.log("#### Total improved: " + improve);
}

improved_analyzer();