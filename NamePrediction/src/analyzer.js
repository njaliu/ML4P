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
	//var file = '20150822_mcmc_n10_5gram_var_highest_po';
	//var file = '20150826_mcmc_n10_5gram_var_highest_po_trending';
	//var file = '20150827_mcmc_n20_5gram_var_highest_po_trending';
	//var file = '20150827_greedy_n20_5gram_var_highest_po_trending';
	//var file = '20150915_mcmc_n10_5gram_var_high_precision_po_trained'; 
	//var file = '20150922_mcmc_n10_5gram_var_high_precision_po_trained'; 
	//var file = '20151001_mcmc_n10_5gram_var_high_precision_po_trending';
	//var file = '20151015_mcmc_n20_5gram_var_high_precision_po_trending';
	//var file = '20151016_mcmc_n10_p10_5gram_var_high_precision_po_trending';
	//var file = '20151012_mcmc_n10_5gram_var_high_precision_po_training';
	//var file = '20151013_mcmc_n20_5gram_var_high_precision_po_training';
	//var file = '20151016_mcmc_n10_p10_5gram_var_high_precision_po_training';
	//var file = '20151117_mcmc_n25_5gram_var_high_precision_po_training';
	var file = '20151117_mcmc_n25_5gram_var_high_precision_po_training';
	//var target = '/home/aliu/Research/More/TestBench/Deobfuscation/Bench4prob/results/po_20_percentage_better';

	var results = fs.readFileSync(base_dir + file, 'utf-8').split('\n');
	var len = results.length - 1;
	var total = 0, baseline = 0, mutant = 0;
	var n = 0;

	for(var i = 0; i < len; i++) {
		var result = results[i];
		if(getStats(result).baseline > getStats(result).mutant + 3 || true) {
			n++;
			total += getStats(result).total;
			baseline += getStats(result).baseline;
			mutant += getStats(result).mutant;
			//fs.appendFileSync(target, result + '\n');
		}
	}

	console.log("#### Files: " + n);
	console.log("#### Total: " + total);
	console.log("#### Baseline: " + baseline + ", Precision: " + (baseline / total).toFixed(2));
	console.log("#### Mutant: " + mutant + ", Precision: " + (mutant / total).toFixed(2));
}

var gnuplot_improvement = function() {
	var base_dir = '/home/aliu/Research/More/TestBench/Deobfuscation/Bench4prob/results/logs/';
	//var file = '20151013_mcmc_n20_5gram_var_high_precision_po_training';
	var file = '20151016_mcmc_n10_p10_5gram_var_high_precision_po_trending';

	var output_file = base_dir + 'gnuplot_improve_' + file;
	var output = [];

	var results = fs.readFileSync(base_dir + file, 'utf-8').split('\n');
	var len = results.length - 1;
	var total = 0, baseline = 0, mutant = 0;
	var n = 0;

	for(var i = 0; i < len; i++) {
		var result = results[i];
		var json_obj = getStats(result);
		if(json_obj.baseline > json_obj.mutant + 0 || true) {
			n++;
			total += json_obj.total;
			baseline += json_obj.baseline;
			mutant += json_obj.mutant;
			output.push({x: n, y: json_obj.baseline, xdelta: 0, ydelta: json_obj.mutant - json_obj.baseline});
			//fs.appendFileSync(target, result + '\n');
		}
	}

	console.log("#### Files: " + n);
	console.log("#### Total: " + total);
	console.log("#### Baseline: " + baseline + ", Precision: " + (baseline / total).toFixed(2));
	console.log("#### Mutant: " + mutant + ", Precision: " + (mutant / total).toFixed(2));

	streat2file(output, output_file);

	console.log('Done!')
}

function streat2file(json_list, file) {
	for(i in json_list) {
		var json = json_list[i];
		fs.appendFileSync(file, json.x + '  ' + json.y + '  ' + json.xdelta + '  ' + json.ydelta + '\n');
	}
}

//improved_analyzer();
stats_analyzer();
//gnuplot_improvement();