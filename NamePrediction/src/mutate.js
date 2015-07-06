var UglifyJS = require("uglify-js");
var _ = require("underscore");
var fs = require("fs");
var path = require("path");

//Variable insertion
var top_node, count, varTab, iterate, pos, inserted;

function var_insert_init() {
	top_node = null;
	count = 0;
	varTab = {};
	iterate = 0;
	pos = -2;
	inserted = false;
}

var_insert_init();

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
	if(node.name == getMutateName() && node instanceof UglifyJS.AST_SymbolRef) {
		iterate++;
		if(iterate > 1) {
			console.log("YYYYYYYYYYYYYYYYY");
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

function getMutateName() {
	return 'xx';
}

function getInsertPos(top) {
	var i = 0;
	while(1) {
		var p = var_transformer.parent(i);
		if( !p || _.isEqual(top, p) ) return -1;
		else {
			for( j in top.body ) {
				if( _.isEqual(top.body[j], p) ){
					inserted = true;
					return j;
				}
			}
		}
		i++;
	}
}

function getName(node) {
	var str = node.name;
	if (varTab.hasOwnProperty(str)) return varTab[str];
    var name = "_" + (++count);
    return varTab[str] = { name: name, node: node };
}

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
	fs.writeFileSync('/home/aliu/Research/ML4P/NamePrediction/jss/insert_test1.mutate.js', output);
	console.log(output);
}

test_main();

