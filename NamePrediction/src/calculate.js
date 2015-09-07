var UglifyJS = require("uglify-js");
var fs = require("fs");
var path = require("path");
var sourceMap = require("source-map");
var _ = require("underscore");
var exec = require('child_process').execSync;
var JWL = require('./js-weighted-list.js');
var C2TK = require('./tokenizer.js');
var TKN = require('./tokenizer_var.js');
var assembler = require('./po/assemble.js');
var extract_mapping_po = require('./po/sm_core.js');

//Individual probability for each option, calculated by single-obfuscation.
var obfuscation_options =  [[0, 8.54],  [1,  9.45],  [2,  7.01],
                		    [3, 7.32],  [4,  7.62],  [5,  8.23],
                		    [6, 7.01],  [7,  6.10],  [8,  7.93],
                		    [9, 8.23],  [10, 8.54],  [11, 7.01], [12, 7.01]];
var PROB = new JWL(obfuscation_options);
var INIT_OPTION = [0,0,0,0,0,0,0,0,0,0,0,0,1];
var PO_INDEX = [0,1,2,3,4,5,6,7,8,9];
var NO_INLINE_FUNC = [6, 7];

/*
	origin - JSON: variable table of the original file
	minified - JSON: variable mapping table in the minified file
	predicted - JSON: variable table of the predicted file 
*/
function cal_precision(origin, minified, predicted) {
	var total = origin.length;
	var count = 0;


	for(var i = 0; i < predicted.length; i++) {
		var o_var = minified[i];
		var p_var = predicted[i];

		console.log("## o_var: " + o_var + ", p_var: " + p_var);
		if(o_var == p_var)
			count++;
	}

	console.log("\n## Correct: " + count + ", Total: " + total);

	if(total != 0)
		return (count / total).toFixed(2);
	else
		return 1;
}

//Revised calculation to return results as a JSON object
function cal_precision_json(origin, minified, predicted) {
	var total = origin.length;
	var count = 0;


	for(var i = 0; i < predicted.length; i++) {
		var o_var = minified[i];
		var p_var = predicted[i];

		console.log("## o_var: " + o_var + ", p_var: " + p_var);
		if(o_var == p_var)
			count++;
	}

	//console.log("\n## Correct: " + count + ", Total: " + total);

	return {"correct": count, "total": total};
}


//extract the variable table of the input file
function extract_variables(code) {
	var varTab = [];

	try {
		var top_level = UglifyJS.parse(code);

		var walker = new UglifyJS.TreeWalker(function(node){
    		if (node instanceof UglifyJS.AST_VarDef) {
      	  	// string_template is a cute little function that UglifyJS uses for warnings
       	 		console.log(UglifyJS.string_template("Found Variable {name} at {line},{col}", {
       	     		name: node.name.name,
       	    	 	line: node.start.line,
      	     	 	col: node.start.col
      	  		}));
       	 		varTab.push(node.name.name);
   			}
    		else if (node instanceof UglifyJS.AST_SymbolFunarg) {
        		// string_template is a cute little function that UglifyJS uses for warnings
        		console.log(UglifyJS.string_template("Found Function Argument {name} at {line},{col}", {
            		name: node.name,
            		line: node.start.line,
            		col: node.start.col
        		}));
        		varTab.push(node.name);
    		}
		});

		top_level.walk(walker);
	}
	catch(ex) {
		console.log("*******EEEEEEEE********: Error caught!" );
		console.log(ex);
	}
	//console.log("hahaha " + varTab);
	
	return varTab;
}

//extract the variable mapping from the minified file and source-map file
// code: minified file
// rawSourceMap: source-map file
function extract_mapping(code, rawSourceMap) {
	var varTab = [];
	var mapTab = []

	try {
		var top_level = UglifyJS.parse(code);
		var smc = new sourceMap.SourceMapConsumer(rawSourceMap);

		var walker = new UglifyJS.TreeWalker(function(node){
    		if (node instanceof UglifyJS.AST_VarDef) {
      	  	// string_template is a cute little function that UglifyJS uses for warnings
       	 		console.log(UglifyJS.string_template("Found Variable {name} at {line},{col}", {
       	     		name: node.name.name,
       	     		line: node.start.line,
      	      		col: node.start.col
      	  		}));
       	 		varTab.push({"name": node.name.name, "line": node.start.line, "col": node.start.col});
   			}
    		else if (node instanceof UglifyJS.AST_SymbolFunarg) {
        		// string_template is a cute little function that UglifyJS uses for warnings
        		console.log(UglifyJS.string_template("Found Function Argument {name} at {line},{col}", {
            		name: node.name,
            		line: node.start.line,
            		col: node.start.col
        		}));
        		varTab.push({"name": node.name, "line": node.start.line, "col": node.start.col});
    		}
		});

		top_level.walk(walker);

		for( var i = 0; i < varTab.length; i++ ) {
			var v = varTab[i];
			mapTab.push((smc.originalPositionFor({line: v.line, column: v.col})).name);
		}
	}
	catch(ex) {
		console.log("*******EEEEEEEE********: Error caught!" );
		console.log(ex);
	}

	//console.log("hahaha " + varTab + ", " + varTab.length);
	//console.log("hahaha " + mapTab);

	return mapTab;
}

//evaluate the n-gram LM using MCMC
function evaluate_lm(origin, minified, source_map, predicted, mutator, N) {
	var origin_code = fs.readFileSync(origin, 'utf-8');
	var origin_varTab = extract_variables(origin_code);

	var minified_code = fs.readFileSync(minified, 'utf-8');
	var map_varTab = extract_mapping(minified_code, source_map);

	var predicted_code = fs.readFileSync(predicted, 'utf-8');
	var predicted_varTab = extract_variables(predicted_code);

	var result_stat = cal_precision_json(origin_varTab, map_varTab, predicted_varTab);
	var baseline_correct = result_stat.correct;
	console.log("#### Baseline correct: " + baseline_correct);

	var minified_mutant = '/home/aliu/Research/More/TestBench/Deobfuscation/Bench4prob/results/guidance/mutant.min.js';
	var map_mutant = '/home/aliu/Research/More/TestBench/Deobfuscation/Bench4prob/results/guidance/mutant.map';
	var predicted_mutant = '/home/aliu/Research/More/TestBench/Deobfuscation/Bench4prob/results/guidance/mutant.rename.js';
	var tokens_mutant = '/home/aliu/Research/More/TestBench/Deobfuscation/Bench4prob/results/guidance/mutant.tokens';
	var perplexity_file = '/home/aliu/Research/More/TestBench/Deobfuscation/Bench4prob/results/guidance/github_150.perplexity';
	var options = INIT_OPTION.slice();
	//console.log("init zzzz: " + INIT_OPTION);
	var current_options = options;
	var current_perplexity = 0;
	for(var i = 0; i < N; i++) {
		var seed = compute_seed(options);
		var cmd_minify = 'java -jar ' + mutator + ' --js ' + origin + ' --js_output_file ' 
					+ minified_mutant + ' --create_source_map ' + map_mutant
					+ ' --mutation_seed ' + seed;
		var cmd_perplexity = './python /home/aliu/Research/ML4P/NamePrediction/src/lm/calculate_perplexity_lm.py';

		exec(cmd_minify);
		//var tks = C2TK(fs.readFileSync(minified_mutant, 'utf-8'));
		var tks = TKN(fs.readFileSync(minified_mutant, 'utf-8'));
		fs.writeFileSync(tokens_mutant, tks);
		process.chdir('/home/aliu/Research/klm/bin/');
		exec(cmd_perplexity);
		var perplexity = Number(fs.readFileSync(perplexity_file, 'utf-8'));
		console.log("#### Perplexity: " + perplexity);
		
		//record correct prediction and perplexity for current iterate.
		var cmd_predict = 'unuglifyjs --nice2predict_server localhost:5745 ' 
						+ minified_mutant +  ' > ' + predicted_mutant;
		process.chdir('/home/aliu/');
		exec(cmd_predict);

		var map_mutant_code = JSON.parse(fs.readFileSync(map_mutant,'utf-8'));
		map_mutant_code["sourceRoot"] = '/home/aliu/Research/More/TestBench/Deobfuscation/Bench4prob/results/guidance/';

		var minified_mutant_code = fs.readFileSync(minified_mutant, 'utf-8');
		var map_mutant_varTab = extract_mapping(minified_mutant_code, map_mutant_code);

		var predicted_mutant_code = fs.readFileSync(predicted_mutant, 'utf-8');
		var predicted_mutant_varTab = extract_variables(predicted_mutant_code);

		var result_mutant_stat = cal_precision_json(origin_varTab, map_mutant_varTab, predicted_mutant_varTab);
		var mutant_correct = result_mutant_stat.correct;
		console.log("#### Mutant correct: " + mutant_correct);

		recordIRresult_lm(origin, i, options, perplexity, mutant_correct);
		//finish evaluation for current iterate

		if(perplexity <= current_perplexity) {
			current_options = options
			options = mutate4options(current_options);	
			//options = mutate4options_code_reused(current_options);
			current_perplexity = perplexity;
			console.log("#### Round: " + i + ", PASS. PERP: " + current_perplexity);
		}
		else {
			//mcmc: accept at a low probability, here 0.1
			var low_prob = _.random(1, 100);
			if( low_prob <= 15 ){
				current_options = options;
				console.log("#### Accept low probability: " + low_prob);
				options = mutate4options(current_options);
				//options = mutate4options_code_reused(current_options);
				current_perplexity = perplexity;
				console.log("#### Round: " + i + ", PASS. PERP: " + current_perplexity);
			}
			else {
				options = mutate4options(current_options);
				//options = mutate4options_code_reused(current_options);
				console.log("#### Round: " + i + ", FAIL. PERP: " + current_perplexity);
			}
		}
	}		

	console.log("#### DONE!");
}

//mutate compilation options - unguided version
function mutation_unguided(origin, minified, source_map, predicted, mutator, N) {
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

	var minified_mutant = '/home/aliu/mutant.min.js';
	var map_mutant = '/home/aliu/mutant.map';
	var predicted_mutant = '/home/aliu/mutant.rename.js';
	var tokens_mutant = '/home/aliu/mutant.tokens';
	var perplexity_file = '/home/aliu/github_150.perplexity';
	var options = INIT_OPTION;
	for(var i = 0; i < N; i++) {
		var seed = compute_seed(options);
		var cmd_minify = 'java -jar ' + mutator + ' --js ' + origin + ' --js_output_file ' 
					+ minified_mutant + ' --create_source_map ' + map_mutant
					+ ' --mutation_seed ' + seed;
		var cmd_predict = 'unuglifyjs --nice2predict_server localhost:5745 ' 
					+ minified_mutant +  ' > ' + predicted_mutant;
		var cmd_perplexity = './python /home/aliu/Research/ML4P/NamePrediction/src/lm/calculate_perplexity.py';

		exec(cmd_minify);
		var tks = C2TK(fs.readFileSync(minified_mutant, 'utf-8'));
		fs.writeFileSync(tokens_mutant, tks);
		process.chdir('/home/aliu/Research/klm/bin/');
		exec(cmd_perplexity);
		var perplexity = Number(fs.readFileSync(perplexity_file, 'utf-8'));
		console.log("#### Perplexity: " + perplexity);
		process.chdir('/home/aliu/');
		exec(cmd_predict);

		var map_mutant_code = JSON.parse(fs.readFileSync(map_mutant,'utf-8'));
		map_mutant_code["sourceRoot"] = '/home/aliu';

		var minified_mutant_code = fs.readFileSync(minified_mutant, 'utf-8');
		var map_mutant_varTab = extract_mapping(minified_mutant_code, map_mutant_code);

		var predicted_mutant_code = fs.readFileSync(predicted_mutant, 'utf-8');
		var predicted_mutant_varTab = extract_variables(predicted_mutant_code);

		var result_mutant_stat = cal_precision_json(origin_varTab, map_mutant_varTab, predicted_mutant_varTab);
		var mutant_correct = result_mutant_stat.correct;
		console.log("#### Mutant correct: " + mutant_correct);

		var report_obj = {total: result_stat.total, baseline: baseline_correct, mutant: mutant_correct, comment: "bad", config: seed};
		if(mutant_correct < baseline_correct && mutant_correct != 0)
			report_obj.comment = "good";
		output.push(report_obj);

		options = mutate4options(options);
	}

	console.log("#### DONE!");
	return output;
}

//mutate compilation options - guided version (Greedy)
function mutation_guided(origin, minified, source_map, predicted, mutator, N) {
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

	var minified_mutant = '/home/aliu/mutant.min.js';
	var map_mutant = '/home/aliu/mutant.map';
	var predicted_mutant = '/home/aliu/mutant.rename.js';
	var tokens_mutant = '/home/aliu/mutant.tokens';
	var perplexity_file = '/home/aliu/github_150.perplexity';
	var options = INIT_OPTION;
	var current_options = options;
	var current_perplexity = 0;
	for(var i = 0; i < N; i++) {
		var seed = compute_seed(options);
		var cmd_minify = 'java -jar ' + mutator + ' --js ' + origin + ' --js_output_file ' 
					+ minified_mutant + ' --create_source_map ' + map_mutant
					+ ' --mutation_seed ' + seed;
		var cmd_perplexity = './python /home/aliu/Research/ML4P/NamePrediction/src/lm/calculate_perplexity.py';

		exec(cmd_minify);
		var tks = C2TK(fs.readFileSync(minified_mutant, 'utf-8'));
		fs.writeFileSync(tokens_mutant, tks);
		process.chdir('/home/aliu/Research/klm/bin/');
		exec(cmd_perplexity);
		var perplexity = Number(fs.readFileSync(perplexity_file, 'utf-8'));
		console.log("#### Perplexity: " + perplexity);
		
		if(perplexity <= current_perplexity) {
			current_options = options
			options = mutate4options(current_options);	
			current_perplexity = perplexity;
			console.log("#### Round: " + i + ", PASS. PERP: " + current_perplexity);
		}
		else {
			options = mutate4options(current_options);
			console.log("#### Round: " + i + ", FAIL. PERP: " + current_perplexity);
		}
	}		

	//choose the obfuscation with highest perplexity, instead of the last one.
	obfuscateWithOptions(current_options, origin, minified_mutant, map_mutant, mutator);

	var cmd_predict = 'unuglifyjs --nice2predict_server localhost:5745 ' 
						+ minified_mutant +  ' > ' + predicted_mutant;
	process.chdir('/home/aliu/');
	exec(cmd_predict);

	var map_mutant_code = JSON.parse(fs.readFileSync(map_mutant,'utf-8'));
	map_mutant_code["sourceRoot"] = '/home/aliu';

	var minified_mutant_code = fs.readFileSync(minified_mutant, 'utf-8');
	var map_mutant_varTab = extract_mapping(minified_mutant_code, map_mutant_code);

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

//mutate compilation options using greedy for partial obfuscation
function mutation_greedy_po(origin, minified, source_map, predicted, mutator, N) {
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
	var current_pick_best;
	var current_best_seed = 0;
	for(var i = 0; i < N; i++) {
		var seed = compute_seed(options);
		var po_output = assembler(origin_code, seed, false, null);
		var pick = po_output.pick.slice();
		
		fs.writeFileSync(after_po_mutant, po_output.code);
		var smInfo = po_output.sm;
		var flag = po_output.po;
		//console.log("zzzzzzzzzzzzzzz flag " + flag);	

		var cmd_minify = 'java -jar ' + mutator + ' --js ' + after_po_mutant + ' --js_output_file ' 
					+ minified_mutant + ' --create_source_map ' + map_mutant
					+ ' --formatting PRETTY_PRINT' + ' --mutation_seed ' + (flag ? 287 : seed);	
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
			//options = mutate4options(current_options);
			options = mutate4options_no_inline_func(current_options);	
			//options = mutate4options_code_reused(current_options);
			current_perplexity = perplexity;
			current_pick_best = pick.slice();
			current_best_seed = seed;
			console.log("#### Round: " + i + ", PASS. PERP: " + current_perplexity);
		}
		else {
			//greedy: reject if the perplexity score decreases.
			options = mutate4options_no_inline_func(current_options);
			console.log("#### Round: " + i + ", FAIL. PERP: " + current_perplexity);
		}
	}		

	//choose the obfuscation with highest perplexity, instead of the last one.
	console.log("Start reproducing the best partial-obfuscation...");
	po_output = assembler(origin_code, seed, true, current_pick_best);
	pick = po_output.pick.slice();
	fs.writeFileSync(after_po_mutant, po_output.code);
	smInfo = po_output.sm;
	flag = po_output.po;
	cmd_minify = 'java -jar ' + mutator + ' --js ' + after_po_mutant + ' --js_output_file ' 
					+ minified_mutant + ' --create_source_map ' + map_mutant
					+ ' --formatting PRETTY_PRINT' + ' --mutation_seed ' + (flag ? 287 : current_best_seed);
	exec(cmd_minify);
	console.log("Finish reproducing the best partial-obfuscation...");
	//finish reproducing the best partial-obfuscation

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

//mutate compilation options - guided version (MCMC)
function mutation_mcmc(origin, minified, source_map, predicted, mutator, N) {
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

	var minified_mutant = '/home/aliu/mutant.min.js';
	var map_mutant = '/home/aliu/mutant.map';
	var predicted_mutant = '/home/aliu/mutant.rename.js';
	var tokens_mutant = '/home/aliu/mutant.tokens';
	var perplexity_file = '/home/aliu/github_150.perplexity';
	var options = INIT_OPTION.slice();
	//console.log("init zzzz: " + INIT_OPTION);
	var current_options = options;
	var current_perplexity = 0;
	for(var i = 0; i < N; i++) {
		var seed = compute_seed(options);
		var cmd_minify = 'java -jar ' + mutator + ' --js ' + origin + ' --js_output_file ' 
					+ minified_mutant + ' --create_source_map ' + map_mutant
					+ ' --mutation_seed ' + seed;
		var cmd_perplexity = './python /home/aliu/Research/ML4P/NamePrediction/src/lm/calculate_perplexity.py';

		exec(cmd_minify);
		//var tks = C2TK(fs.readFileSync(minified_mutant, 'utf-8'));
		var tks = TKN(fs.readFileSync(minified_mutant, 'utf-8'));
		fs.writeFileSync(tokens_mutant, tks);
		process.chdir('/home/aliu/Research/klm/bin/');
		exec(cmd_perplexity);
		var perplexity = Number(fs.readFileSync(perplexity_file, 'utf-8'));
		console.log("#### Perplexity: " + perplexity);
		
		//record IR results
		//console.log("zzzz " + options);
		recordIRresult(origin, i, options, perplexity);

		if(perplexity <= current_perplexity) {
			current_options = options
			options = mutate4options(current_options);	
			//options = mutate4options_code_reused(current_options);
			current_perplexity = perplexity;
			console.log("#### Round: " + i + ", PASS. PERP: " + current_perplexity);
		}
		else {
			//mcmc: accept at a low probability, here 0.1
			var low_prob = _.random(1, 100);
			if( low_prob <= 15 ){
				current_options = options;
				console.log("#### Accept low probability: " + low_prob);
				options = mutate4options(current_options);
				//options = mutate4options_code_reused(current_options);
				current_perplexity = perplexity;
				console.log("#### Round: " + i + ", PASS. PERP: " + current_perplexity);
			}
			else {
				options = mutate4options(current_options);
				//options = mutate4options_code_reused(current_options);
				console.log("#### Round: " + i + ", FAIL. PERP: " + current_perplexity);
			}
		}
	}		

	var picked = '    options: ' + current_options + 
					', perplexity: ' + current_perplexity + ' **\n';
	fs.appendFileSync('/home/aliu/Research/More/TestBench/Deobfuscation/Bench4prob/results/logs/20150805_mcmc_n10_5gram_var_highest_371_new_IR', picked);
	//choose the obfuscation with highest perplexity, instead of the last one.
	obfuscateWithOptions(current_options, origin, minified_mutant, map_mutant, mutator);

	var cmd_predict = 'unuglifyjs --nice2predict_server localhost:5745 ' 
						+ minified_mutant +  ' > ' + predicted_mutant;
	process.chdir('/home/aliu/');
	exec(cmd_predict);

	var map_mutant_code = JSON.parse(fs.readFileSync(map_mutant,'utf-8'));
	map_mutant_code["sourceRoot"] = '/home/aliu';

	var minified_mutant_code = fs.readFileSync(minified_mutant, 'utf-8');
	var map_mutant_varTab = extract_mapping(minified_mutant_code, map_mutant_code);

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
	var current_pick_best;
	var current_best_seed = 0;
	for(var i = 0; i < N; i++) {
		var seed = compute_seed(options);
		var po_output = assembler(origin_code, seed, false, null);
		var pick = po_output.pick.slice();

		debugger;
		
		fs.writeFileSync(after_po_mutant, po_output.code);
		var smInfo = po_output.sm;
		var flag = po_output.po;
		//console.log("zzzzzzzzzzzzzzz flag " + flag);	

		var cmd_minify = 'java -jar ' + mutator + ' --js ' + after_po_mutant + ' --js_output_file ' 
					+ minified_mutant + ' --create_source_map ' + map_mutant
					+ ' --formatting PRETTY_PRINT' + ' --mutation_seed ' + (flag ? 287 : seed);	
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
			//options = mutate4options(current_options);
			options = mutate4options_no_inline_func(current_options);	
			//options = mutate4options_code_reused(current_options);
			current_perplexity = perplexity;
			current_pick_best = pick.slice();
			current_best_seed = seed;
			console.log("#### Round: " + i + ", PASS. PERP: " + current_perplexity);
		}
		else {
			//mcmc: accept at a low probability, here 0.15
			var low_prob = _.random(1, 100);
			if( low_prob <= 15 ){
				current_options = options;
				console.log("#### Accept low probability: " + low_prob);
				//options = mutate4options(current_options);
				options = mutate4options_no_inline_func(current_options);
				//options = mutate4options_code_reused(current_options);
				current_perplexity = perplexity;
				current_pick_best = pick.slice();
				current_best_seed = seed;
				console.log("#### Round: " + i + ", PASS. PERP: " + current_perplexity);
			}
			else {
				//options = mutate4options(current_options);
				options = mutate4options_no_inline_func(current_options);
				console.log("#### Round: " + i + ", FAIL. PERP: " + current_perplexity);
			}
		}
	}		

	//choose the obfuscation with highest perplexity, instead of the last one.
	console.log("Start reproducing the best partial-obfuscation...");
	po_output = assembler(origin_code, seed, true, current_pick_best);
	pick = po_output.pick.slice();
	fs.writeFileSync(after_po_mutant, po_output.code);
	smInfo = po_output.sm;
	flag = po_output.po;
	cmd_minify = 'java -jar ' + mutator + ' --js ' + after_po_mutant + ' --js_output_file ' 
					+ minified_mutant + ' --create_source_map ' + map_mutant
					+ ' --formatting PRETTY_PRINT' + ' --mutation_seed ' + (flag ? 287 : current_best_seed);
	exec(cmd_minify);
	console.log("Finish reproducing the best partial-obfuscation...");
	//finish reproducing the best partial-obfuscation

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

function sampling_po_index() {
	var n = _.random(0, PO_INDEX.length);
	return _.sample(PO_INDEX, n);
}

function compute_seed(options) {
	var result = 0;
	var len = options.length;
	for(var i = 0; i < len; i++) {
		result += options[len-1-i] * Math.pow(2, i);
	}
	return result;
}

function mutate4options(old) {
	var limit = PROB.length;
	var n = _.random(1, limit);
	var flips = PROB.peek(n);
	var newly = old.slice();
	for(i in old) {
		if( _.contains(flips, i) )
			newly[i] = 1 - old[i];
	}
	return newly;
}

function mutate4options_no_inline_func(old) {
	var limit = PROB.length;
	var n = _.random(1, limit);
	var flips = PROB.peek(n);
	var newly = old.slice();
	for(i in old) {
		if( _.contains(flips, i) && (!_.contains(NO_INLINE_FUNC, i)) )
			newly[i] = 1 - old[i];
	}
	return newly;
}

//This function performs mutation on obfuscated code, instead of original code.
function mutate4options_code_reused(old) {
	var limit = PROB.length;
	var n = _.random(1, limit);
	var flips = PROB.peek(n);
	var newly = old;
	for(i in old) {
		if( _.contains(flips, i) )
			newly[i] = ( (old[i] == 1) ? old[i] : 1 - old[i] );
	}
	return newly;
}

function recordIRresult(origin, round, options, perplexity) {
	var log = '/home/aliu/Research/More/TestBench/Deobfuscation/Bench4prob/results/logs/20150805_mcmc_n10_5gram_var_highest_371_new_IR';
	var record = '    options: ' + options + 
					', perplexity: ' + perplexity + '\n';
	if(round == 0)
		fs.appendFileSync(log, origin + '\n');
	fs.appendFileSync(log, record);
}

function recordIRresult_lm(origin, round, options, perplexity, correct) {
	var log = '/home/aliu/Research/More/TestBench/Deobfuscation/Bench4prob/results/guidance/20150805_mcmc_n10_5gram_var_highest_485_lm';
	var record = '    options: ' + options + 
					', perplexity: ' + perplexity +
					', correct: ' + correct + '\n';
	if(round == 0)
		fs.appendFileSync(log, origin + '\n');
	fs.appendFileSync(log, record);
}

function obfuscateWithOptions(options, origin, minified_mutant, map_mutant, mutator) {
	var seed = compute_seed(options);
	var cmd_minify = 'java -jar ' + mutator + ' --js ' + origin + ' --js_output_file ' 
					+ minified_mutant + ' --create_source_map ' + map_mutant
					+ ' --mutation_seed ' + seed;
	exec(cmd_minify);
}

//---------------------------------------------------------------------------------------------------
//Test cases
//---------------------------------------------------------------------------------------------------

//Simple test function to handle single input file
function test_main() {
	//var dir_base = '/home/aliu/Research/closure-compiler/aliu-test/';
	//var dir_base = '/home/aliu/Research/ML4P/NamePrediction/aliu-test/test_files/uglifyjs/';
	//var dir_base = '/home/aliu/Research/TestDB/ML4P/NamePrediction/aliu-test/test_files/';
	//var dir_base = '/home/aliu/Research/More/TestBench/Deobfuscation/jquery_test/';
	var dir_base = '/home/aliu/Research/More/TestBench/Deobfuscation/Bench4prob/';
	var mapFile =  dir_base + 'source_maps/baseline_default/messageFormatInterpolationParts.map';
	var rawSourceMap = JSON.parse(fs.readFileSync(mapFile,'utf-8'));
	rawSourceMap["sourceRoot"] = dir_base + 'source_maps/baseline_default/';

	var minified_file = dir_base + 'minified/baseline_default/messageFormatInterpolationParts.min.js';
	var minified_code = fs.readFileSync(minified_file, 'utf-8');
	var mapTab = extract_mapping(minified_code, rawSourceMap);

	var predicted_file = dir_base + 'predicted/baseline_default/messageFormatInterpolationParts.rename.js';
	var predicted_code = fs.readFileSync(predicted_file, 'utf-8');
	var varTab = extract_variables(predicted_code);

	var origin_file = dir_base + 'original_source/messageFormatInterpolationParts.js';
	var origin_code = fs.readFileSync(origin_file, 'utf-8');
	var origin_varTab = extract_variables(origin_code);
	//console.log(origin_code);
	//console.log(origin_varTab.length);

	console.log("\n## Precision: " + cal_precision(origin_varTab, mapTab, varTab));
}

//Simple test function to handle input via directory, not safe
function test_main_1() {
	//var dir_base = '/home/aliu/Research/ML4P/NamePrediction/';
	var dir_base = '/home/aliu/Research/TestDB/ML4P/NamePrediction/aliu-test/test_files/';

	//var origin_file_dir = dir_base + 'jss/';
	//var minified_file_dir = dir_base + 'jsm/';
	//var map_file_dir =  dir_base + 'jssm/';
	//var predicted_file_dir = dir_base + 'jsp/';

	var origin_file_dir = dir_base + 'original_source/';
	var minified_file_dir = dir_base + 'minified_source/uglifyjs/';
	var map_file_dir =  dir_base + 'source_maps/uglifyjs/';
	var predicted_file_dir = dir_base + 'predicted_source/uglifyjs/';

	var origin_files = fs.readdirSync(origin_file_dir);
	var minified_files = fs.readdirSync(minified_file_dir);
	var map_files = fs.readdirSync(map_file_dir);
	var predicted_files = fs.readdirSync(predicted_file_dir);

	var origin_varTab = [];
	var origin_size = 0;
	var origin_used = [];
	for(k in origin_files){
		var o_file = origin_file_dir + origin_files[k];
		if(checkMinifiedExist(origin_files[k], minified_file_dir) && getFileSizeInKB(o_file) < 10) {
			origin_used.push(path.basename(origin_files[k], '.js'));
			console.log("**** Reading Origin File: " + o_file);
			var origin_code = fs.readFileSync(o_file, 'utf-8');
			origin_varTab = origin_varTab.concat(extract_variables(origin_code));
			origin_size++;
		}
	}

	var rawSourceMap_files = [];
	for(t in origin_used){
		var ma_file = map_file_dir + origin_used[t] + '.map';
		console.log("**** Reading Source-Map File: " + ma_file);
		var rawSourceMap = JSON.parse(fs.readFileSync(ma_file,'utf-8'));
		rawSourceMap["sourceRoot"] = map_file_dir;
		rawSourceMap_files.push(rawSourceMap);
	}

	var map_varTab = [];
	for(i in origin_used){
		var m_file = minified_file_dir + origin_used[i] + '.min.js';
		console.log("**** Reading Minified File: " + m_file);
		var minified_code = fs.readFileSync(m_file, 'utf-8');
		map_varTab = map_varTab.concat(extract_mapping(minified_code, rawSourceMap_files[i]));
	}

	var predicted_varTab = [];
	for(j in origin_used){
		var p_file = predicted_file_dir + origin_used[j] + '.rename.js';
		console.log("**** Reading Predicted File: " + p_file);
		var predicted_code = fs.readFileSync(p_file, 'utf-8');
		predicted_varTab = predicted_varTab.concat(extract_variables(predicted_code));
	}

	

	console.log("\n## Precision: " + cal_precision(origin_varTab, map_varTab, predicted_varTab));
	console.log("\n## Origin file used: " + origin_size);
}

//Revised test function to calculate each file first, then summarize the results
function test_main_2() {
	//var dir_base = '/home/aliu/Research/ML4P/NamePrediction/';
	//var dir_base = '/home/aliu/Research/TestDB/ML4P/NamePrediction/aliu-test/test_files/';
	//JQuery Test
	//var dir_base = '/home/aliu/Research/More/TestBench/Deobfuscation/jquery_test/';
	var dir_base = '/home/aliu/Research/More/TestBench/Deobfuscation/Bench4prob/';
	
	
	var origin_file_dir = dir_base + 'original_source_github_trending/';
	var minified_file_dir = dir_base + 'minified/baseline_default_github_trending/';
	var map_file_dir =  dir_base + 'source_maps/baseline_default_github_trending/';
	var predicted_file_dir = dir_base + 'predicted/baseline_default_github_trending/';
	

	//Dir path 'cc' for Closure-Compiler, 'uglifyjs' for UglifyJS
	//var origin_file_dir = dir_base + 'original_source/';
	//var minified_file_dir = dir_base + 'minified_source/cc/';
	//var map_file_dir =  dir_base + 'source_maps/cc/';
	//var predicted_file_dir = dir_base + 'predicted_source/cc/';
	

	var origin_files = fs.readdirSync(origin_file_dir);

	var used_origin_file = 0;
	var result_json = [];
	var correct = 0, total = 0;

	for(k in origin_files){
		var o_file = origin_file_dir + origin_files[k];
		if(checkMinifiedExist(origin_files[k], minified_file_dir) && getFileSizeInKB(o_file) < 50) {
			var origin_varTab = [];
			var origin_code = fs.readFileSync(o_file, 'utf-8');
			origin_varTab = extract_variables(origin_code);
			
			var ma_file = map_file_dir + getGroupFile(origin_files[k], 'map');
			var rawSourceMap = JSON.parse(fs.readFileSync(ma_file,'utf-8'));
			rawSourceMap["sourceRoot"] = map_file_dir;

			var map_varTab = [];
			var m_file = minified_file_dir + getGroupFile(origin_files[k], 'minified');
			var minified_code = fs.readFileSync(m_file, 'utf-8');
			map_varTab = extract_mapping(minified_code, rawSourceMap);

			var predicted_varTab = [];
			var p_file = predicted_file_dir + getGroupFile(origin_files[k], 'predicted');
			/*
			Following statement is used to calculate the "baseline" precision
			*/
			//var p_file = minified_file_dir + getGroupFile(origin_files[k], 'minified');
			var predicted_code = fs.readFileSync(p_file, 'utf-8');
			predicted_varTab = extract_variables(predicted_code);

			if( checkLegalVarTab(origin_varTab, map_varTab, predicted_varTab) ) {
				used_origin_file++;
				var result_stat = cal_precision_json(origin_varTab, map_varTab, predicted_varTab);
				correct += result_stat.correct;
				total += result_stat.total;
				result_json.push( {"filename": p_file, "result": result_stat} );
				//Report the file with low precision
				//reportLowPrecisionFiles(result_stat, p_file);	
				//Report the file with high precision
				reportHighPrecisionFiles(result_stat, p_file);
			}
		}
	}

	displayResult(result_json);
	console.log("\n## General Correct: " + correct + ", General Total: " + total);
	console.log("\n## General Precision: " + (correct / total).toFixed(2));
	console.log("\n## Origin file used: " + used_origin_file);
}

function test_main_mutation_unguided() {
	var origin = '/home/aliu/Research/More/TestBench/Deobfuscation/Bench4prob/original_source/messageFormatInterpolationParts.js';
	var minified = '/home/aliu/Research/More/TestBench/Deobfuscation/Bench4prob/minified/baseline_default/messageFormatInterpolationParts.min.js';
	var source_map = '/home/aliu/Research/More/TestBench/Deobfuscation/Bench4prob/source_maps/baseline_default/messageFormatInterpolationParts.map';
	var predicted = '/home/aliu/Research/More/TestBench/Deobfuscation/Bench4prob/predicted/baseline_default/messageFormatInterpolationParts.rename.js';
	var mutator = '/home/aliu/Research/More/Download/closure-compiler-master/build/compiler.jar';
	var N = 10;

	var rawSourceMap = JSON.parse(fs.readFileSync(source_map,'utf-8'));
	rawSourceMap["sourceRoot"] = '/home/aliu/Research/More/TestBench/Deobfuscation/Bench4prob/source_maps/baseline_default/';

	var result = mutation_unguided(origin, minified, rawSourceMap, predicted, mutator, N);
	console.log("#### Result size: " + result.length);
	var good_result = result.filter(function(e){
		return e.comment == 'good';
	});
	console.log("#### Good result size: " + good_result.length);
	for(i in good_result) {
		console.log(good_result[i]);
	}
}

function test_main_mutation_guided() {
	var origin = '/home/aliu/Research/More/TestBench/Deobfuscation/Bench4prob/original_source/messageFormatInterpolationParts.js';
	var minified = '/home/aliu/Research/More/TestBench/Deobfuscation/Bench4prob/minified/baseline_default/messageFormatInterpolationParts.min.js';
	var source_map = '/home/aliu/Research/More/TestBench/Deobfuscation/Bench4prob/source_maps/baseline_default/messageFormatInterpolationParts.map';
	var predicted = '/home/aliu/Research/More/TestBench/Deobfuscation/Bench4prob/predicted/baseline_default/messageFormatInterpolationParts.rename.js';
	var mutator = '/home/aliu/Research/More/Download/closure-compiler-master/build/compiler.jar';
	var N = 20;

	var rawSourceMap = JSON.parse(fs.readFileSync(source_map,'utf-8'));
	rawSourceMap["sourceRoot"] = '/home/aliu/Research/More/TestBench/Deobfuscation/Bench4prob/source_maps/baseline_default/';

	var result = mutation_guided(origin, minified, rawSourceMap, predicted, mutator, N);
	console.log("#### Result size: " + result.length);
	var good_result = result.filter(function(e){
		return e.comment == 'good';
	});
	console.log("#### Good result size: " + good_result.length);
	for(i in good_result) {
		console.log(good_result[i]);
	}
}

function test_main_mutation_high_precision() {
	var output = [];
	var dir_base = '/home/aliu/Research/More/TestBench/Deobfuscation/Bench4prob/';
	//var high_precision_file_report = '/home/aliu/Research/More/TestBench/Deobfuscation/Bench4prob/results/high_precision_baseline';
	//var high_precision_file_report = '/home/aliu/Research/More/TestBench/Deobfuscation/Bench4prob/results/high_precision_github_trending_jsnice';
	//report for trending repo in GitHub with few global variables
	//var high_precision_file_report = '/home/aliu/Research/More/TestBench/Deobfuscation/Bench4prob/results/few_global_varibales_rename_benchmark';
	var high_precision_file_report = '/home/aliu/Research/More/TestBench/Deobfuscation/Bench4prob/results/few_global_varibales_rename_trained_benchmark';
	var high_precision_records = fs.readFileSync(high_precision_file_report, 'utf-8').split('\n');
	var len = high_precision_records.length - 1;
	//Output file
	var high_precision_results = '/home/aliu/Research/More/TestBench/Deobfuscation/Bench4prob/results/logs/20150829_mcmc_n20_5gram_var_few_global_po_trained';

	var origin_dir = dir_base + 'original_source/';
	var minified_dir = dir_base + 'minified/baseline_default/';
	var source_map_dir = dir_base + 'source_maps/baseline_default/';
	var predicted_dir = dir_base + 'predicted/baseline_default_jsnice/';
	var mutator = '/home/aliu/Research/More/Download/closure-compiler-master/build/compiler.jar';
	var N = 20;

	//This variable is for experimenting specific files.
	//var first_total = 51;
	//len = first_total;
	for(var i = 0; i < len; i++) {
		var record_str = high_precision_records[i];
		var record_json = process_precision_record(record_str);
		var precision = record_json.precision;
		var prefix = record_json.prefix;

		var origin = origin_dir + prefix + '.js';
		var minified = minified_dir + prefix + '.min.js';
		var source_map = source_map_dir + prefix + '.map';
		var predicted = predicted_dir + prefix + '.rename.js';

		if( !fs.existsSync(origin) || !fs.existsSync(minified) || !fs.existsSync(source_map) || !fs.existsSync(predicted) )
			continue;

		var rawSourceMap = JSON.parse(fs.readFileSync(source_map,'utf-8'));
		rawSourceMap["sourceRoot"] = source_map_dir;

		try {
			//Next line is to use greedy mutation
			//var result = mutation_guided(origin, minified, rawSourceMap, predicted, mutator, N);
			//Next line is to use mcmc mutation
			//var result = mutation_mcmc(origin, minified, rawSourceMap, predicted, mutator, N);
			//Next line is to use greedy-po mutation
			//var result = mutation_greedy_po(origin, minified, rawSourceMap, predicted, mutator, N);
			//Next line is to use mcmc-po mutation
			var result = mutation_mcmc_po(origin, minified, rawSourceMap, predicted, mutator, N);
		} catch(ex) {
			console.log("*******EEEEEEEE********: Error caught!" );
			console.log(ex);
			continue;
		}
		
		
		console.log("#### Result size: " + result.length);
		var report_obj = result[0];
		if(report_obj.comment == 'good' || true) {
			var good = {  file: origin,
				  		  total: report_obj.total,
				  		  baseline: report_obj.baseline,
				  		  mutant: report_obj.mutant,
				  		  improve: ((report_obj.baseline - report_obj.mutant) / report_obj.baseline).toFixed(2),
				  		  config: report_obj.config };
			output.push(good);
			fs.appendFileSync(high_precision_results, JSON.stringify(good) + '\n');
		}
	}

	for(i in output) {
		console.log(output[i]);
	}
	console.log("#### Good result size(high precision): " + output.length);
	console.log("#### Test(high precision) finish!");
}

function test_main_evaluate_lm() {
	var dir_base = '/home/aliu/Research/More/TestBench/Deobfuscation/Bench4prob/';
	var high_precision_file_report = '/home/aliu/Research/More/TestBench/Deobfuscation/Bench4prob/results/high_precision_baseline';
	var high_precision_records = fs.readFileSync(high_precision_file_report, 'utf-8').split('\n');
	var len = high_precision_records.length - 1;

	var origin_dir = dir_base + 'original_source/';
	var minified_dir = dir_base + 'minified/baseline_default/';
	var source_map_dir = dir_base + 'source_maps/baseline_default/';
	var predicted_dir = dir_base + 'predicted/baseline_default/';
	var mutator = '/home/aliu/Research/More/Download/closure-compiler-master/build/compiler.jar';
	var N = 10;

	//This variable is for experimenting the first 100 files.
	var first_total = 250;
	//len = first_total;
	for(var i = 0; i < len; i++) {
		var record_str = high_precision_records[i];
		var record_json = process_precision_record(record_str);
		var precision = record_json.precision;
		var prefix = record_json.prefix;

		var origin = origin_dir + prefix + '.js';
		var minified = minified_dir + prefix + '.min.js';
		var source_map = source_map_dir + prefix + '.map';
		var predicted = predicted_dir + prefix + '.rename.js';

		var rawSourceMap = JSON.parse(fs.readFileSync(source_map,'utf-8'));
		rawSourceMap["sourceRoot"] = source_map_dir;

		evaluate_lm(origin, minified, rawSourceMap, predicted, mutator, N);
	}

	console.log("#### Evaluate LM finish!");
}

//Check whether an original file is successfully minified
function checkMinifiedExist(file, dir) {
	var minified_file_name = dir + path.basename(file, '.js') + '.min.js';
	if(fs.existsSync(minified_file_name))
		return true;
	else
		return false;
}

//Check whether the variable lists are legal
function checkLegalVarTab(origin, mapped, predicted) {
	if(origin.length <= 0)
		return false;
	else {
		if(mapped.length != predicted.length)
			return false;
		else
			return true;
	}
}

function getFileSizeInKB(file) {
	return fs.statSync(file)["size"] / 1024;
}

function getGroupFile(file, tag) {
	var basename = path.basename(file, '.js');
	if( tag == 'minified' )
		return basename + '.min.js';
	else if( tag == 'map' )
		return basename + '.map';
	else if( tag == 'predicted' )
		return basename + '.rename.js';
	else
		return;
}

function process_precision_record(record) {
	var items = record.split(' ');
	if(items.length != 2) {
		console.log("#### Error record size: " + items.length);
		return;
	}
	try {
		var precision_val = Number(items[0]);	
	} catch(ex) {
		var precision_val = 0;
	}	
	var len = items[1].split('/').length;
	var prefix_val = path.basename(items[1].split('/')[len-1], '.rename.js');
	return {precision: precision_val, prefix: prefix_val};	
}

//Display the calculation result for each file
//result_json: list object of {"filename": name, "result": {"correct": count, "total": total}}
function displayResult(result_json) {
	for( r in result_json ) {
		console.log("##" + result_json[r]["filename"]);
		var result = result_json[r]["result"];
		console.log("--" + " Correct: " + result["correct"] + ", Total: " + result["total"]);
		if( result["total"] != 0)
			console.log("--" + " Precision: " + ( result["correct"] / result["total"] ).toFixed(2));
		else
			console.log("--" + " Precision " + 1);
	}
}

//Report files with precision less than 50%, and variables more than 10
var low_precision_file_report = '/home/aliu/Research/More/TestBench/Deobfuscation/Bench4prob/results/low_precision_O13';
function reportLowPrecisionFiles(result_stat, fname) {
	var precision = (result_stat.correct / result_stat.total).toFixed(2);
	if ( result_stat.total >= 10 && precision <= 0.5 )
		fs.appendFileSync(low_precision_file_report, precision + ' ' + fname + '\n');
}

//Report files with precision higher than 70%, and variables more than 10
var high_precision_file_report = '/home/aliu/Research/More/TestBench/Deobfuscation/Bench4prob/results/high_precision_github_trending_jsnice';
function reportHighPrecisionFiles(result_stat, fname) {
	var precision = (result_stat.correct / result_stat.total).toFixed(2);
	if ( result_stat.total >= 10 && precision >= 0.5 )
		fs.appendFileSync(high_precision_file_report, precision + ' ' + fname + '\n');
}

//test_main();
//test_main_1();
//test_main_2();
//test_main_mutation_unguided();
//test_main_mutation_guided();
test_main_mutation_high_precision();
//test_main_evaluate_lm();