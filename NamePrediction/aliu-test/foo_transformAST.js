var UglifyJS = require("uglify-js");

var code = 
	function bar(x) {
		var z;
		var y = x;
		y = 1;
		y = 2;
		y = x + 1;
		z = y;
	};
code = code.toString();
// sample AST
var ast = UglifyJS.parse(code);


//console.log(ast.print_to_string());

// this is the transformer
var add_ = new UglifyJS.TreeTransformer(null, function(node){
    if (node instanceof UglifyJS.AST_SymbolVar || node instanceof UglifyJS.AST_SymbolRef) {
        return new UglifyJS.AST_SymbolRef({
        	start 	: node.start,
        	end 	: node.end,
        	name 	: '_' + node.name
        });
    }
});

var count = 0;

function before(node, descend) {
	if(node.name == 'y' && node instanceof UglifyJS.AST_SymbolRef) {
		var newVarDef = new UglifyJS.AST_VarDef({
			name: '_' + node.name,
			value: node
		});
		//node.unshift(newVarDef);
	}
	//return node;
}
var count = 0;
var varTab = {};
var iterate = 0;

function after(node) {
	//console.log(node.start);
	if (node instanceof UglifyJS.AST_Defun) {
		//console.log("## " + node.name + ", " + Object.keys(varTab).length);
		var defs = new UglifyJS.AST_Var({
            definitions: Object.keys(varTab).map(function(key){
                var x = varTab[key];
                return new UglifyJS.AST_VarDef({
                    name  : new UglifyJS.AST_SymbolVar({ name: x.name }),
                    value : x.node, 
                });
            })
        });
        
        node = insertForVarDef(node, defs);
        return node;
	}
	if(node.name == 'y' && node instanceof UglifyJS.AST_SymbolRef) {
		iterate++;
		if(iterate > 2) {
			var defs = new UglifyJS.AST_SymbolRef({
			    name 	: getName(node).name,
			    value 	: node
			});
			//varTab[defs.name] = {name: defs.name, node: defs.value};
			return defs;
		}	
	}
}

function getName(node) {
	var str = node.name;
	if (varTab.hasOwnProperty(str)) return varTab[str];
    var name = "_" + (++count);
    return varTab[str] = { name: name, node: node };
}

function insertForVarDef(node, defs) {
	var def_arr = defs.definitions;
	for( i in def_arr ) {
		var pos = getInsertPos(node, def_arr[i]);
		console.log("## POS: " + pos);
		node.body.splice(pos, 0, new UglifyJS.AST_Var({definitions: [def_arr[i]]}));
	}
	return node;
}

function getInsertPos(fundef, v) {
	var result = 0;
	var iterate = 0;
	var walker = new UglifyJS.TreeWalker(function(node){
    		if (node instanceof UglifyJS.AST_VarDef) {
      	  	// string_template is a cute little function that UglifyJS uses for warnings
       	 		console.log(UglifyJS.string_template("Found Variable {name} at {line},{col}", {
       	     		name: node.name.name,
       	    	 	line: node.start.line,
      	     	 	col: node.start.col
      	  		}));
      	  		iterate++;
      	  		console.log("## V: " + v.value.name);
       	 		if(node.name.name == v.value.name)
       	 			result = iterate;
   			}
		});
	fundef.walk(walker);
	return result;
}

var add_1 = new UglifyJS.TreeTransformer(null, after);


var ast2 = ast.transform(add_1);

//console.log(ast);

console.log(ast.print_to_string({ beautify: true }));
console.log(ast2.print_to_string({ beautify: true }));