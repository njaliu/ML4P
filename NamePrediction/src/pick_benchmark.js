var UglifyJS = require('uglify-js');
var fs = require('fs');
var path = require("path");

function count_global_local_variable(code) {
	var global_count = 0, local_count = 0;
	try {
		var ast = UglifyJS.parse(code);
		ast.figure_out_scope();
	
		var walker = new UglifyJS.TreeWalker(function(node){
			if( node instanceof UglifyJS.AST_VarDef ) {
				if(node.name.thedef.global)
					global_count++;
				else
					local_count++;
			}
			if( node instanceof UglifyJS.AST_SymbolFunarg ) {
				local_count++;
			}
		});

		ast.walk(walker);	
	} catch(ex) {
		console.log("*******EEEEEEEE********: Error caught!" );
		console.log(ex);
	}
	

	return {total: global_count + local_count, global: global_count, local: local_count};
}

//----------------------------------------------------------------------
//test cases
//----------------------------------------------------------------------

function test_main_0() {
	//var file = '/home/aliu/experiments/temp/accounts_server.js';
	var file = '/home/aliu/Research/More/TestBench/Deobfuscation/Bench4prob/original_source_github_trending/ligaturesSpec.js';
	var code = fs.readFileSync(file, 'utf-8');
	var stat = count_global_local_variable(code);
	console.log("Global: " + stat.global + ", Local: " + stat.local);
}

function test_main_1() {
	//var file = '/home/aliu/experiments/temp/accounts_server.js';
	var base_dir = '/home/aliu/Research/More/TestBench/Deobfuscation/Bench4prob/';
	var origin_dir = base_dir + 'original_source/';
	//var origin_dir = base_dir + 'original_source_github_trending/';
	var minified_dir = base_dir + 'minified/baseline_default/';
	//var minified_dir = base_dir + 'minified/baseline_default_github_trending/';
	var report = base_dir + 'results/few_global_varibales_rename_trained_benchmark';
	//var report = base_dir + 'results/few_global_varibales_rename_benchmark';

	var files = fs.readdirSync(origin_dir);
	for(i in files) {
		var basename = path.basename(files[i], '.js');
		var origin_file = origin_dir + basename + '.rename.js';
		var minified_file = minified_dir + basename + '.min.js';
		if(!fs.existsSync(minified_file))
			continue;
		var minified_code = fs.readFileSync(minified_file, 'utf-8');
		var stat = count_global_local_variable(minified_code);
		if(stat.total > 10 && (stat.local / stat.total).toFixed(2) >= 0.7)	
			fs.appendFileSync(report, stat.total + '#' + stat.local + ' ' + origin_file + '\n');
	}

	console.log("Picking benchmark done!");
}

//test_main_0();
test_main_1();