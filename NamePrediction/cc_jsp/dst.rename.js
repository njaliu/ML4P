var fs = require("fs"), consts = {
    DAY: 864e5,
    HOUR: 36e5,
    MINUTE: 6e4,
    SECOND: 1e3
};

function dst_dates(year) {
    var timestamp = new Date(year, 0, 1, 0, 0, 1, 0).getTime();
    year = new Date(year, 12, 31, 23, 59, 59).getTime();
    for (var b = new Date(timestamp).getTimezoneOffset(), value = null, v = null; timestamp < year - 864e5; ) {
        var date = new Date(timestamp), a = date.getTimezoneOffset();
        a !== b && (a < b && (value = date), a > b && (v = date), b = a);
        timestamp += 864e5;
    }
    return value && v ? {
        s: _find_dst_fold(value).getTime(),
        e: _find_dst_fold(v).getTime()
    } : !1;
}

function _find_dst_fold(endTime, shift, startTime) {
    "undefined" === typeof shift && (shift = consts.DAY, startTime = consts.HOUR);
    var timestamp = new Date(endTime.getTime() - shift).getTime();
    endTime = endTime.getTime() + shift;
    for (var ok = new Date(timestamp).getTimezoneOffset(), obj = null; timestamp < endTime - startTime; ) {
        var now = new Date(timestamp);
        if (now.getTimezoneOffset() !== ok) {
            obj = now;
            break;
        }
        timestamp += startTime;
    }
    return shift === consts.DAY ? _find_dst_fold(obj, consts.HOUR, consts.MINUTE) : shift === consts.HOUR ? _find_dst_fold(obj, consts.MINUTE, consts.SECOND) : obj;
}

"current" !== process.argv[2] && (process.env.TZ = process.argv[2]);

var years = function() {
    var seq = [];
    process.argv.forEach(function(v, i, array) {
        2 < i && seq.push(parseInt(process.argv[i], 10));
    });
    return seq;
}(), rules = function() {
    for (var sum = [], i = 0; i < years.length; i++) {
        var c = dst_dates(years[i]);
        sum.push(c);
    }
    return sum;
}();

console.log(JSON.stringify(rules));
