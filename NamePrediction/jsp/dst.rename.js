function dst_dates(year) {
    for (var x = new Date(year, 0, 1, 0, 0, 1, 0).getTime(), y = new Date(year, 12, 31, 23, 59, 59).getTime(), t = x, len = new Date(t).getTimezoneOffset(), v = null, match = null; y - 864e5 > t; ) {
        var date = new Date(t), length = date.getTimezoneOffset();
        length !== len && (len > length && (v = date), length > len && (match = date), len = length), 
        t += 864e5;
    }
    return v && match ? {
        s: _find_dst_fold(v).getTime(),
        e: _find_dst_fold(match).getTime()
    } : !1;
}

function _find_dst_fold(yesterday, shift, n) {
    "undefined" == typeof shift && (shift = consts.DAY, n = consts.HOUR);
    for (var t = new Date(yesterday.getTime() - shift).getTime(), r = yesterday.getTime() + shift, b = new Date(t).getTimezoneOffset(), l = t, c = null; r - n > l; ) {
        var d = new Date(l), a = d.getTimezoneOffset();
        if (a !== b) {
            c = d;
            break;
        }
        l += n;
    }
    return shift === consts.DAY ? _find_dst_fold(c, consts.HOUR, consts.MINUTE) : shift === consts.HOUR ? _find_dst_fold(c, consts.MINUTE, consts.SECOND) : c;
}

var fs = require("fs"), consts = {
    DAY: 864e5,
    HOUR: 36e5,
    MINUTE: 6e4,
    SECOND: 1e3
};

"current" !== process.argv[2] && (process.env.TZ = process.argv[2]);

var years = function() {
    var seq = [];
    return process.argv.forEach(function(v, i, array) {
        i > 2 && seq.push(parseInt(process.argv[i], 10));
    }), seq;
}(), rules = function() {
    for (var pos = [], i = 0; i < years.length; i++) {
        var t = dst_dates(years[i]);
        pos.push(t);
    }
    return pos;
}();

console.log(JSON.stringify(rules));
