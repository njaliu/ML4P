var fs = require('fs');
var _ = require('underscore');

var MAX_NON_CONSISTENCY = 2;

function coef_sorting(data) {
	var result = [];
	var perplexity_list = _.pluck(data, 'perplexity');
	var correct_list = _.pluck(data, 'correct');
	var sorted_perplexity = perplexity_list.sort(function(a,b) { return a-b; });
	var sorted_correct = correct_list.sort(function(a,b) { return a-b; });
	
	for(i in data) {
		var perplexity = data[i].perplexity;
		var p_rank = _.indexOf(sorted_perplexity, perplexity);
		var correct = data[i].correct;
		var c_rank = _.indexOf(sorted_correct, correct);

		if( Math.abs(p_rank - c_rank) < MAX_NON_CONSISTENCY ) {
			result.push({p_rank: p_rank, c_rank: c_rank});
		}
	}

	return result;
}

//extract perplexity and correct properties from a line of String
function extract_pc_pair(line) {
	var blocks = line;
	var p_block = blocks.match(/perplexity:\s[+-]?\d+(\.\d+)?/)[0];
	var c_block = blocks.match(/correct:\s[+-]?\d+(\.\d+)?/)[0];
	var perplexity = Number(p_block.split(':')[1]);
	var correct = Number(c_block.split(':')[1]);

	return {perplexity: perplexity, correct: correct};
}

function generate_coef_gnuplot(results) {
	//var report = '/home/aliu/Research/More/TestBench/Deobfuscation/Bench4prob/results/guidance/20151117_mcmc_n10_3gram_var_highest_485_lm_gnuplot';
	var report = '/home/aliu/Research/More/TestBench/Deobfuscation/Bench4prob/results/guidance/20151118_mcmc_n10_4gram_var_highest_485_lm_gnuplot';
	//var report = '/home/aliu/Research/More/TestBench/Deobfuscation/Bench4prob/results/guidance/20150805_mcmc_n10_5gram_var_highest_485_lm_gnuplot'; 
	for(i in results) {
		var line = i + '    ' + results[i].p_rank + '    ' + results[i].c_rank + '\n';
		fs.appendFileSync(report, line);
	}
}

function main_test_coef_0() {
	//var report = '/home/aliu/Research/More/TestBench/Deobfuscation/Bench4prob/results/guidance/20151117_mcmc_n10_3gram_var_highest_485_lm';
	var report = '/home/aliu/Research/More/TestBench/Deobfuscation/Bench4prob/results/guidance/20151118_mcmc_n10_4gram_var_highest_485_lm';
	//var report = '/home/aliu/Research/More/TestBench/Deobfuscation/Bench4prob/results/guidance/20150805_mcmc_n10_5gram_var_highest_485_lm';
	var records = fs.readFileSync(report, 'utf-8').split('\n');
	var len = records.length;

	var result = [];
	var obj = [];

	for(var i = 1; i < len; i++) {
		if( i % 11 != 0 ) {
			obj.push(extract_pc_pair(records[i]));
		}
		else {
			result = result.concat(coef_sorting(obj));
			obj = [];
		}
	}
	console.log(result.length);
	generate_coef_gnuplot(result);
	console.log('Done!');
}


//var td = [{perplexity: -5, correct: 0}, {perplexity: -6, correct: 3}, {perplexity: -9, correct: 1}];
//console.log(coef_sorting(td));
//console.log(extract_pc_pair('    options: 0,0,0,0,0,0,0,0,0,0,0,0,1, perplexity: -498.863861084, correct: 24'));
main_test_coef_0();