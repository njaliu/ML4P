var fs = require("fs");
var _ = require("underscore");
var exec = require('child_process').execSync;
var TKN = require('./tokenizer_var.js');
var assembler = require('./assemble.js');
var extract_mapping_po = require('./sm_core.js');


//mutate compilation options using mcmc for partial obfuscation
function mutation_mcmc_po(origin, minified, source_map, predicted, mutator, N) {
	var output = [];

	var origin_code = fs.readFileSync(origin, 'utf-8');
	var origin_varTab = extract_variables(origin_code);

	var minified_code = fs.readFileSync(minified, 'utf-8');
	var map_varTab = extract_mapping(minified_code, source_map);

	var predicted_code = fs.readFileSync(predicted, 'utf-8');
	var predicted_varTab = extract_variables(predicted_code);

	var result_stat = cal_precision_json(origin_varTab, map_varTab, predicted_varTab);
	var baseline_correct = result_stat.correct;
	console.log("#### Baseline correct: " + baseline_correct);

	var after_po_mutant = '/home/aliu/experiments/mutant.after.js';
	var minified_mutant = '/home/aliu/mutant.min.js';
	var map_mutant = '/home/aliu/mutant.map';
	var predicted_mutant = '/home/aliu/mutant.rename.js';
	var tokens_mutant = '/home/aliu/mutant.tokens';
	var perplexity_file = '/home/aliu/github_150.perplexity';
	var options = INIT_OPTION.slice();
	//console.log("init zzzz: " + INIT_OPTION);
	var current_options = options;
	var current_perplexity = 0;
	var current_best = "";
	for(var i = 0; i < N; i++) {
		var seed = compute_seed(options);
		var po_output = assembler(origin_code, seed);
		fs.writeFileSync(after_po_mutant, po_output.code);
		var smInfo = po_output.sm;

		var cmd_minify = 'java -jar ' + mutator + ' --js ' + after_po_mutant + ' --js_output_file ' 
					+ minified_mutant + ' --create_source_map ' + map_mutant
					+ '--formatting PRETTY_PRINT' + ' --mutation_seed ' + 0;	
		exec(cmd_minify);

		//var tks = C2TK(fs.readFileSync(minified_mutant, 'utf-8'));
		var tks = TKN(fs.readFileSync(minified_mutant, 'utf-8'));
		fs.writeFileSync(tokens_mutant, tks);
		process.chdir('/home/aliu/Research/klm/bin/');
		var cmd_perplexity = './python /home/aliu/Research/ML4P/NamePrediction/src/lm/calculate_perplexity.py';
		exec(cmd_perplexity);
		var perplexity = Number(fs.readFileSync(perplexity_file, 'utf-8'));
		console.log("#### Perplexity: " + perplexity);

		if(perplexity <= current_perplexity) {
			current_options = options
			options = mutate4options(current_options);	
			//options = mutate4options_code_reused(current_options);
			current_perplexity = perplexity;
			current_best = po_output.code;
			console.log("#### Round: " + i + ", PASS. PERP: " + current_perplexity);
		}
		else {
			//mcmc: accept at a low probability, here 0.15
			var low_prob = _.random(1, 100);
			if( low_prob <= 15 ){
				current_options = options;
				console.log("#### Accept low probability: " + low_prob);
				options = mutate4options(current_options);
				//options = mutate4options_code_reused(current_options);
				current_perplexity = perplexity;
				current_best = po_output.code;
				console.log("#### Round: " + i + ", PASS. PERP: " + current_perplexity);
			}
			else {
				options = mutate4options(current_options);
				console.log("#### Round: " + i + ", FAIL. PERP: " + current_perplexity);
			}
		}
	}		

	//choose the obfuscation with highest perplexity, instead of the last one.
	fs.writeFileSync(after_po_mutant, current_best);
	exec(cmd_minify);

	var cmd_predict = 'unuglifyjs --nice2predict_server localhost:5745 ' 
						+ minified_mutant +  ' > ' + predicted_mutant;
	process.chdir('/home/aliu/');
	exec(cmd_predict);

	var map_mutant_code = JSON.parse(fs.readFileSync(map_mutant,'utf-8'));
	map_mutant_code["sourceRoot"] = '/home/aliu';

	var minified_mutant_code = fs.readFileSync(minified_mutant, 'utf-8');
	var map_mutant_varTab = extract_mapping_po(minified_mutant_code, smInfo, map_mutant_code);

	var predicted_mutant_code = fs.readFileSync(predicted_mutant, 'utf-8');
	var predicted_mutant_varTab = extract_variables(predicted_mutant_code);

	var result_mutant_stat = cal_precision_json(origin_varTab, map_mutant_varTab, predicted_mutant_varTab);
	var mutant_correct = result_mutant_stat.correct;
	console.log("#### Mutant correct: " + mutant_correct);

	var report_obj = {total: result_stat.total, baseline: baseline_correct, mutant: mutant_correct, comment: "bad", config: seed};
	if(mutant_correct < baseline_correct && mutant_correct != 0)
		report_obj.comment = "good";
	output.push(report_obj);

	console.log("#### DONE!");
	return output;
}