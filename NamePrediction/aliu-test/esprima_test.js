var Esprima = require("esprima");

var code = "var x = 5;";

console.log( Esprima.tokenize(code) );