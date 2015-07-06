var UglifyJS = require("uglify-js");
var _ = require('underscore');

var code = function bar(x) {
	var z;
	var y;
	y = 1;
	z = 2;
};

code = code.toString();

var ast = UglifyJS.parse(code);

var top_node;
var pos = -2;

var transformer = new UglifyJS.TreeTransformer(null, function(node){
	if( node instanceof UglifyJS.AST_SymbolRef && node.name == 'z' ) {
		console.log("$$ Found symbol: " + node.name);
		
		//var parent = transformer.parent(1);
		//console.log(parent);
		//console.log(parent instanceof UglifyJS.AST_SimpleStatement);
		var innerParent = transformer.find_parent(UglifyJS.AST_Defun);
		//console.log(innerParent.body.indexOf(parent));
		//console.log(_.isEqual((innerParent.body[0]), (parent)));
		pos = getInsertPos(innerParent);
		//console.log("iiiiiiiii " + pos);
		if( pos >= 0 )
			top_node = innerParent;
	}
	if( node == top_node) {
		console.log("POS: " + pos);
		node.body.splice(pos, 0, new UglifyJS.AST_Var({
			definitions: [new UglifyJS.AST_VarDef({
				name  : new UglifyJS.AST_SymbolVar({
					name: 'haha'
				})
			})]
		}));
		return node;
	}
});

function getInsertPos(top) {
	var i = 0;
	while(1) {
		var p = transformer.parent(i);
		if( !p || _.isEqual(top, p) ) return -1;
		else {
			for( j in top.body ) {
				if( _.isEqual(top.body[j], p) )
					return j;
			}
		}
		i++;
	}
}

//console.log(ast.body);
var ast1 = ast.transform(transformer);
console.log(ast1.print_to_string({ beautify: true }));
//ast.walk(walker);