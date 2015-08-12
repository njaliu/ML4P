var Esprima = require("esprima");

var code = "var x = 5;";

var tks = Esprima.tokenize(code);

for(i in tks) {
	var token = tks[i];
	if(token.type == 'Identifier')
		console.log(token.value);
}

console.log( tks );