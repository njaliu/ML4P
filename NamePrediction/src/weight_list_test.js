var jwl = require('./js-weighted-list.js');
var _ = require('underscore');

var data = [[0, 10],  
                [1,  1],
                [2,  1],
                [3,  5],
                [4,  3]];

var wl = new jwl(data);

function mutate4options(prob, old) {
	var limit = prob.length;
	var n = _.random(1, limit);
	console.log("n: " + n);
	var flips = prob.peek(n);
	console.log("flips: " + flips);
	var newly = old;
	for(i in old) {
		if( _.contains(flips, i) )
			newly[i] = 1 - old[i];
	}
	console.log("newly: " + newly);
	return newly;
}

var config = [0,0,0,0,0];

console.log(config);
config = mutate4options(wl, config);
console.log(config);
config = mutate4options(wl, config);
console.log(config);