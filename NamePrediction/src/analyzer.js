var fs = require('fs');

function getImprove(result_str) {
	var result_json = JSON.parse(result_str);
	var erase = result_json.improve;

	return (erase < 0.9) ? (result_json.baseline - result_json.mutant) : 0;
}

function getStats(result_str) {
	var result_json = JSON.parse(result_str);

	return {total: result_json.total, baseline: result_json.baseline, mutant: result_json.mutant};
}

var improved_analyzer = function() {
	var base_dir = '/home/aliu/Research/More/TestBench/Deobfuscation/Bench4prob/results/logs/';
	var file = '20150822_mcmc_n10_5gram_var_highest_po';

	var results = fs.readFileSync(base_dir + file, 'utf-8').split('\n');
	var len = results.length - 1;
	var improve = 0;

	for(var i = 0; i < len; i++) {
		var result = results[i];
		improve += getImprove(result);
	}

	console.log("#### Total improved: " + improve);
}

var stats_analyzer = function() {
	var base_dir = '/home/aliu/Research/More/TestBench/Deobfuscation/Bench4prob/results/logs/';
	var file = '20150822_mcmc_n10_5gram_var_highest_po';

	var results = fs.readFileSync(base_dir + file, 'utf-8').split('\n');
	var len = results.length - 1;
	var total = 0, baseline = 0, mutant = 0;
	var n = 0;

	for(var i = 0; i < len; i++) {
		var result = results[i];
		if(getStats(result).baseline > getStats(result).mutant + 5) {
			n++;
			total += getStats(result).total;
			baseline += getStats(result).baseline;
			mutant += getStats(result).mutant;
		}
	}

	console.log("#### Files: " + n);
	console.log("#### Total: " + total);
	console.log("#### Baseline: " + baseline + ", Precision: " + (baseline / total).toFixed(2));
	console.log("#### Mutant: " + mutant + ", Precision: " + (mutant / total).toFixed(2));
}

//improved_analyzer();
stats_analyzer();