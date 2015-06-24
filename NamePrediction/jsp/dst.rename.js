var fs = require("fs"), consts = {
    DAY: 864e5,
    HOUR: 36e5,
    MINUTE: 6e4,
    SECOND: 1e3
};

function dst_dates(year) {
    for (var start = new Date(year, 0, 1, 0, 0, 1, 0).getTime(), end = new Date(year, 12, 31, 23, 59, 59).getTime(), t = start, len = new Date(t).getTimezoneOffset(), value = null, match = null; end - 864e5 > t; ) {
        var date = new Date(t), length = date.getTimezoneOffset();
        length !== len && (len > length && (value = date), length > len && (match = date), 
        len = length), t += 864e5;
    }
    return value && match ? {
        s: _find_dst_fold(value).getTime(),
        e: _find_dst_fold(match).getTime()
    } : !1;
}

function _find_dst_fold(yesterday, shift, s) {
    "undefined" == typeof shift && (shift = consts.DAY, s = consts.HOUR);
    for (var x = new Date(yesterday.getTime() - shift).getTime(), y = yesterday.getTime() + shift, idx = new Date(x).getTimezoneOffset(), w = x, h = null; y - s > w; ) {
        var t = new Date(w), v = t.getTimezoneOffset();
        if (v !== idx) {
            h = t;
            break;
        }
        w += s;
    }
    return shift === consts.DAY ? _find_dst_fold(h, consts.HOUR, consts.MINUTE) : shift === consts.HOUR ? _find_dst_fold(h, consts.MINUTE, consts.SECOND) : h;
}

"current" !== process.argv[2] && (process.env.TZ = process.argv[2]);

var years = function() {
    var seq = [];
    return process.argv.forEach(function(v, i, array) {
        i > 2 && seq.push(parseInt(process.argv[i], 10));
    }), seq;
}(), rules = function() {
    for (var sum = [], i = 0; i < years.length; i++) {
        var c = dst_dates(years[i]);
        sum.push(c);
    }
    return sum;
}();

console.log(JSON.stringify(rules));
