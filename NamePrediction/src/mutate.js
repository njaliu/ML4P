var UglifyJS = require("uglify-js");
var _ = require("underscore");
var fs = require("fs");
var path = require("path");

//Variable insertion
var top_node, count, varTab, iterate, pos, inserted;
var cntr_set = {varName: '', iterate: 10000};
var total_for_mutate;
var already_mutate = [];

function var_insert_init() {
	top_node = null;
	count = 0;
	varTab = {};
	iterate = 0;
	pos = -2;
	inserted = false;
	//cntr_set.varName = generateMutateName();
	cntr_set.iterate = generateIterate();
	//total_for_mutate = [];
	//already_mutate = [];
}

//var_insert_init();

//collect every defined variable
function collectVar(ast) {
	var vars = [];
	var var_walker = new UglifyJS.TreeWalker(function(node){
		if(node instanceof UglifyJS.AST_VarDef){
			vars.push(node);
		}
	});
	ast.walk(var_walker);
	return vars;
}

//collect most referenced variables
function collectMostReferenceVar(ast) {
	var vars = [];
	var vars_symbol = [];
	var var_walker = new UglifyJS.TreeWalker(function(node){
		if(node instanceof UglifyJS.AST_VarDef) {
			vars.push({symbol: node, ref: 0});
			vars_symbol.push(node.name);
		}
		if(node instanceof UglifyJS.AST_SymbolRef && !(node.thedef.orig[0] instanceof UglifyJS.AST_SymbolFunarg)) {
			for(k in node.thedef.orig) {
				if( _.contains( vars_symbol, node.thedef.orig[k]) ){
					var idx = _.indexOf( vars_symbol, node.thedef.orig[k] );
					vars[idx].ref++;
				}
				//else
					//vars[node.thedef.orig[k]] = 0;
			}
		}
	});
	ast.walk(var_walker);
	//var varDef_keys = _.pluck(vars, 'symbol');
	var sorted = _.sortBy(vars, function(elem){ return elem.ref; });
	var result = _.last( _.pluck(sorted, 'symbol' ), 2);
	console.log("RRRRRRRRRRRRRR: " + result.length);
	return result;
}

function before(node, descend) {
	if(node instanceof UglifyJS.AST_Defun) {
		//var_insert_init();
	}
}

var var_transformer = new UglifyJS.TreeTransformer(before, function (node) {
	if (node == top_node) {
		var defs = new UglifyJS.AST_Var({
            definitions: Object.keys(varTab).map(function(key){
                var x = varTab[key];
                return new UglifyJS.AST_VarDef({
                    name  : new UglifyJS.AST_SymbolVar({ name: x.name }),
                    value : x.node, 
                });
            })
        });
        
        node.body.splice(pos, 0, defs);
        var_insert_init();
        //node = insertForVarDef(node, defs);
        return node;
	}
	if( node instanceof UglifyJS.AST_SymbolRef && _.contains(node.thedef.orig, cntr_set.varName.name) ) {
		iterate++;
		if(iterate > cntr_set.iterate) {
			var innerParent = var_transformer.find_parent(UglifyJS.AST_Scope);
			pos = inserted ? pos : getInsertPos(innerParent);

			if( pos >= 0 ) top_node = innerParent;
			
			var defs = new UglifyJS.AST_SymbolRef({
			    name 	: getName(node).name,
			    value 	: node
			});
			return defs;
		}	
	}
});

function generateMutateName() {
	var not_mutate = total_for_mutate.filter(function(elem){ return already_mutate.indexOf(elem) < 0; });
	console.log("############### " + not_mutate.length);
	if( !_.isEmpty(not_mutate) ) {
		var random_mutate = not_mutate[ _.random(0, not_mutate.length - 1) ];
		console.log("#### Random mutate: " + random_mutate.name.name);
		already_mutate.push(random_mutate);

		return random_mutate;
	}
	else
		return "GENERATE_NO_NAME";
}

function generateIterate() {
	return 4;
}

function getInsertPos(top) {
	var i = 0;
	while(1) {
		var p = var_transformer.parent(i);
		if( !p || _.isEqual(top, p) ) return -1;
		else {
			for( var j = 0; j < top.body.length; j++ ) {
				if( isEqualJSON(top.body[j], p) ){
					inserted = true;
					console.log("jjjjjjjjjjjjjjjjjjj " + j);
					return j;
				}
			}
		}
		i++;
	}
}

//Compare AST_NODE JSON via 'start' and 'end' properties, to solve 'frame' property issue
function isEqualJSON(a, b) {
	return ( _.isEqual(a.start, b.start) && _.isEqual(a.end, b.end) );
}

//Get the name for mutation, or create a new one
function getName(node) {
	var str = node.name;
	if (varTab.hasOwnProperty(str)) return varTab[str];
    var name = "_" + (++count);
    return varTab[str] = { name: name, node: node };
}

//Mutate the program once by inserting one variable
function mutate(ast) {
	try {
		//var ast = UglifyJS.parse(code);
		var_insert_init();
		total_for_mutate = [];
		//already_mutate = [];
		total_for_mutate = collectMostReferenceVar(ast);
		cntr_set.varName = generateMutateName();
		if( cntr_set.varName == "GENERATE_NO_NAME" )
			return "MUTATE_END";

		var ast_new = ast.transform(var_transformer);

		return ast_new;	
	} catch(ex) {
		console.log("EEEE: " + ex);
		return;
	}
	
}

//--------------------------------------------------------------------------------------------
//--------------------------------------------------------------------------------------------

function test_main() {
	var code = 
		function bar(x) {
			var z;
			var y = x;
			y = 1;
			y = 2;
			y = 3;
			console.log(y);
			if(y > 2)
				z = y;
			y = x + 1;
		};
	var code1 = 
		function foo(x) {
			var z;
			var y = x;
			y = 1;
			y = 2;
			y = 3;
			console.log(y);
			if(y > 2)
				z = y;
			y = x + 1;
		};
	code = code.toString() + code1.toString();
	code = fs.readFileSync('/home/aliu/Research/ML4P/NamePrediction/jss/insert_test1.js','utf-8');
	var ast = UglifyJS.parse(code);

	var ast_new = ast.transform(var_transformer);

	console.log(ast.print_to_string({ beautify: true }));
	console.log("--------------------------------------------------");
	var output = ast_new.print_to_string({ beautify: true });
	var output = mutate(ast).print_to_string({ beautify: true });
	fs.writeFileSync('/home/aliu/Research/ML4P/NamePrediction/jss/insert_test1.mutate.js', output);
	console.log(output);
}

function test_main_1() {
	var dir_base = '/home/aliu/Research/ML4P/NamePrediction/jss/';
	code = fs.readFileSync(dir_base + 'jquery_test.min.js', 'utf-8');
	var ast = UglifyJS.parse(code);
	ast.figure_out_scope();
	var ast_new = mutate(ast);
	var count = 0;
	while( ast_new != "MUTATE_END" && ast_new != null ) {
		var output = ast_new.print_to_string({ beautify: true });
		fs.writeFileSync(dir_base + 'jquery_test.min.mutate' + count + '.js', output);
		console.log("#### Mutant " + count + " : " + dir_base + 'jquery_test.min.mutate' + count + '.js');
		ast_new = mutate(ast);
		count++;
	}
}

//test_main();
test_main_1()

