function bar(x) {
    var z;
    var y = x;
    y = 1;
    y = 2;
    y = 3;
    console.log(y);
    if (y > 2) z = y;
    for (var i = 0; i < 10; i++) {
        z = 1;
        z = 2;
    }
    y = x + 1;
}

var xx;

function foo(x) {
    var z;
    var y = x;
    y = 1;
    var _1 = y;
    _1 = 2;
    _1 = 3;
    console.log(_1);
    if (_1 > 2) z = _1;
    for (var i = 0; i < 10; i++) {
        z = 1;
        z = 2;
    }
    _1 = x + 1;
}

xx = 1;

console.log(xx);

xx++;