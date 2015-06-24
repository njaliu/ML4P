!function(root) {
    var jstz = function() {
        "use strict";
        var b = "s", c = {
            DAY: 864e5,
            HOUR: 36e5,
            MINUTE: 6e4,
            SECOND: 1e3,
            BASELINE_YEAR: 2014,
            MAX_SCORE: 864e6,
            AMBIGUITIES: {
                "America/Denver": [ "America/Mazatlan" ],
                "America/Chicago": [ "America/Mexico_City" ],
                "America/Santiago": [ "America/Asuncion", "America/Campo_Grande" ],
                "America/Montevideo": [ "America/Sao_Paulo" ],
                "Asia/Beirut": [ "Asia/Amman", "Asia/Jerusalem", "Europe/Helsinki", "Asia/Damascus", "Africa/Cairo", "Asia/Gaza", "Europe/Minsk" ],
                "Pacific/Auckland": [ "Pacific/Fiji" ],
                "America/Los_Angeles": [ "America/Santa_Isabel" ],
                "America/New_York": [ "America/Havana" ],
                "America/Halifax": [ "America/Goose_Bay" ],
                "America/Godthab": [ "America/Miquelon" ],
                "Asia/Dubai": [ "Asia/Yerevan" ],
                "Asia/Jakarta": [ "Asia/Krasnoyarsk" ],
                "Asia/Shanghai": [ "Asia/Irkutsk", "Australia/Perth" ],
                "Australia/Sydney": [ "Australia/Lord_Howe" ],
                "Asia/Tokyo": [ "Asia/Yakutsk" ],
                "Asia/Dhaka": [ "Asia/Omsk" ],
                "Asia/Baku": [ "Asia/Yerevan" ],
                "Australia/Brisbane": [ "Asia/Vladivostok" ],
                "Pacific/Noumea": [ "Asia/Vladivostok" ],
                "Pacific/Majuro": [ "Asia/Kamchatka", "Pacific/Fiji" ],
                "Pacific/Tongatapu": [ "Pacific/Apia" ],
                "Asia/Baghdad": [ "Europe/Minsk", "Europe/Moscow" ],
                "Asia/Karachi": [ "Asia/Yekaterinburg" ],
                "Africa/Johannesburg": [ "Asia/Gaza", "Africa/Cairo" ]
            }
        }, r = function(suite) {
            var val = -suite.getTimezoneOffset();
            return null !== val ? val : 0;
        }, e = function() {
            var y = r(new Date(c.BASELINE_YEAR, 0, 2)), l = r(new Date(c.BASELINE_YEAR, 5, 2)), d = y - l;
            return 0 > d ? y + ",1" : d > 0 ? l + ",1," + b : y + ",0";
        }, f = function() {
            if ("undefined" != typeof Intl && "undefined" != typeof Intl.DateTimeFormat) {
                var name = Intl.DateTimeFormat();
                if ("undefined" != typeof name && "undefined" != typeof name.resolvedOptions) return name.resolvedOptions().timeZone;
            }
        }, test = function(year) {
            for (var a = new Date(year, 0, 1, 0, 0, 1, 0).getTime(), b = new Date(year, 12, 31, 23, 59, 59).getTime(), f = a, i = new Date(f).getTimezoneOffset(), l = null, v = null; b - 864e5 > f; ) {
                var t = new Date(f), j = t.getTimezoneOffset();
                j !== i && (i > j && (l = t), j > i && (v = t), i = j), f += 864e5;
            }
            return l && v ? {
                s: g(l).getTime(),
                e: g(v).getTime()
            } : !1;
        }, g = function max(a, b, r) {
            "undefined" == typeof b && (b = c.DAY, r = c.HOUR);
            for (var x = new Date(a.getTime() - b).getTime(), y = a.getTime() + b, z = new Date(x).getTimezoneOffset(), i = x, h = null; y - r > i; ) {
                var d = new Date(i), e = d.getTimezoneOffset();
                if (e !== z) {
                    h = d;
                    break;
                }
                i += r;
            }
            return b === c.DAY ? max(h, c.HOUR, c.MINUTE) : b === c.HOUR ? max(h, c.MINUTE, c.SECOND) : h;
        }, fn = function(a, b, c, d) {
            if ("N/A" !== c) return c;
            if ("Asia/Beirut" === b) {
                if ("Africa/Cairo" === d.name && 13983768e5 === a[6].s && 14116788e5 === a[6].e) return 0;
                if ("Asia/Jerusalem" === d.name && 13959648e5 === a[6].s && 14118588e5 === a[6].e) return 0;
            } else if ("America/Santiago" === b) {
                if ("America/Asuncion" === d.name && 14124816e5 === a[6].s && 1397358e6 === a[6].e) return 0;
                if ("America/Campo_Grande" === d.name && 14136912e5 === a[6].s && 13925196e5 === a[6].e) return 0;
            } else if ("America/Montevideo" === b) {
                if ("America/Sao_Paulo" === d.name && 14136876e5 === a[6].s && 1392516e6 === a[6].e) return 0;
            } else if ("Pacific/Auckland" === b && "Pacific/Fiji" === d.name && 14142456e5 === a[6].s && 13961016e5 === a[6].e) return 0;
            return c;
        }, extend = function(target, a) {
            for (var all = function(options) {
                for (var value = 0, key = 0; key < target.length; key++) if (options.rules[key] && target[key]) {
                    if (!(target[key].s >= options.rules[key].s && target[key].e <= options.rules[key].e)) {
                        value = "N/A";
                        break;
                    }
                    if (value = 0, value += Math.abs(target[key].s - options.rules[key].s), value += Math.abs(options.rules[key].e - target[key].e), 
                    value > c.MAX_SCORE) {
                        value = "N/A";
                        break;
                    }
                }
                return value = fn(target, a, value, options);
            }, data = {}, files = jstz.olson.dst_rules.zones, l = files.length, r = c.AMBIGUITIES[a], i = 0; l > i; i++) {
                var entry = files[i], content = all(files[i]);
                "N/A" !== content && (data[entry.name] = content);
            }
            for (var lang in data) if (data.hasOwnProperty(lang) && -1 != r.indexOf(lang)) return lang;
            return a;
        }, call = function(args) {
            var qs = function() {
                for (var str = [], i = 0; i < jstz.olson.dst_rules.years.length; i++) {
                    var s = test(jstz.olson.dst_rules.years[i]);
                    str.push(s);
                }
                return str;
            }, run = function(params) {
                for (var i = 0; i < params.length; i++) if (params[i] !== !1) return !0;
                return !1;
            }, key = qs(), current = run(key);
            return current ? extend(key, args) : args;
        }, onLoad = function() {
            var a = f();
            return a || (a = jstz.olson.timezones[e()], "undefined" != typeof c.AMBIGUITIES[a] && (a = call(a))), 
            {
                name: function() {
                    return a;
                }
            };
        };
        return {
            determine: onLoad
        };
    }();
    jstz.olson = jstz.olson || {}, jstz.olson.timezones = {
        "-720,0": "Etc/GMT+12",
        "-660,0": "Pacific/Pago_Pago",
        "-660,1,s": "Pacific/Apia",
        "-600,1": "America/Adak",
        "-600,0": "Pacific/Honolulu",
        "-570,0": "Pacific/Marquesas",
        "-540,0": "Pacific/Gambier",
        "-540,1": "America/Anchorage",
        "-480,1": "America/Los_Angeles",
        "-480,0": "Pacific/Pitcairn",
        "-420,0": "America/Phoenix",
        "-420,1": "America/Denver",
        "-360,0": "America/Guatemala",
        "-360,1": "America/Chicago",
        "-360,1,s": "Pacific/Easter",
        "-300,0": "America/Bogota",
        "-300,1": "America/New_York",
        "-270,0": "America/Caracas",
        "-240,1": "America/Halifax",
        "-240,0": "America/Santo_Domingo",
        "-240,1,s": "America/Santiago",
        "-210,1": "America/St_Johns",
        "-180,1": "America/Godthab",
        "-180,0": "America/Argentina/Buenos_Aires",
        "-180,1,s": "America/Montevideo",
        "-120,0": "America/Noronha",
        "-120,1": "America/Noronha",
        "-60,1": "Atlantic/Azores",
        "-60,0": "Atlantic/Cape_Verde",
        "0,0": "UTC",
        "0,1": "Europe/London",
        "60,1": "Europe/Berlin",
        "60,0": "Africa/Lagos",
        "60,1,s": "Africa/Windhoek",
        "120,1": "Asia/Beirut",
        "120,0": "Africa/Johannesburg",
        "180,0": "Asia/Baghdad",
        "180,1": "Europe/Moscow",
        "210,1": "Asia/Tehran",
        "240,0": "Asia/Dubai",
        "240,1": "Asia/Baku",
        "270,0": "Asia/Kabul",
        "300,1": "Asia/Yekaterinburg",
        "300,0": "Asia/Karachi",
        "330,0": "Asia/Kolkata",
        "345,0": "Asia/Kathmandu",
        "360,0": "Asia/Dhaka",
        "360,1": "Asia/Omsk",
        "390,0": "Asia/Rangoon",
        "420,1": "Asia/Krasnoyarsk",
        "420,0": "Asia/Jakarta",
        "480,0": "Asia/Shanghai",
        "480,1": "Asia/Irkutsk",
        "525,0": "Australia/Eucla",
        "525,1,s": "Australia/Eucla",
        "540,1": "Asia/Yakutsk",
        "540,0": "Asia/Tokyo",
        "570,0": "Australia/Darwin",
        "570,1,s": "Australia/Adelaide",
        "600,0": "Australia/Brisbane",
        "600,1": "Asia/Vladivostok",
        "600,1,s": "Australia/Sydney",
        "630,1,s": "Australia/Lord_Howe",
        "660,1": "Asia/Kamchatka",
        "660,0": "Pacific/Noumea",
        "690,0": "Pacific/Norfolk",
        "720,1,s": "Pacific/Auckland",
        "720,0": "Pacific/Majuro",
        "765,1,s": "Pacific/Chatham",
        "780,0": "Pacific/Tongatapu",
        "780,1,s": "Pacific/Apia",
        "840,0": "Pacific/Kiritimati"
    }, jstz.olson.dst_rules = {
        years: [ 2008, 2009, 2010, 2011, 2012, 2013, 2014 ],
        zones: [ {
            name: "Africa/Cairo",
            rules: [ {
                e: 12199572e5,
                s: 12090744e5
            }, {
                e: 1250802e6,
                s: 1240524e6
            }, {
                e: 12858804e5,
                s: 12840696e5
            }, !1, !1, !1, {
                e: 14116788e5,
                s: 1406844e6
            } ]
        }, {
            name: "America/Asuncion",
            rules: [ {
                e: 12050316e5,
                s: 12243888e5
            }, {
                e: 12364812e5,
                s: 12558384e5
            }, {
                e: 12709548e5,
                s: 12860784e5
            }, {
                e: 13024044e5,
                s: 1317528e6
            }, {
                e: 1333854e6,
                s: 13495824e5
            }, {
                e: 1364094e6,
                s: 1381032e6
            }, {
                e: 13955436e5,
                s: 14124816e5
            } ]
        }, {
            name: "America/Campo_Grande",
            rules: [ {
                e: 12032172e5,
                s: 12243888e5
            }, {
                e: 12346668e5,
                s: 12558384e5
            }, {
                e: 12667212e5,
                s: 1287288e6
            }, {
                e: 12981708e5,
                s: 13187376e5
            }, {
                e: 13302252e5,
                s: 1350792e6
            }, {
                e: 136107e7,
                s: 13822416e5
            }, {
                e: 13925196e5,
                s: 14136912e5
            } ]
        }, {
            name: "America/Goose_Bay",
            rules: [ {
                e: 122559486e4,
                s: 120503526e4
            }, {
                e: 125704446e4,
                s: 123648486e4
            }, {
                e: 128909886e4,
                s: 126853926e4
            }, {
                e: 13205556e5,
                s: 129998886e4
            }, {
                e: 13520052e5,
                s: 13314456e5
            }, {
                e: 13834548e5,
                s: 13628952e5
            }, {
                e: 14149044e5,
                s: 13943448e5
            } ]
        }, {
            name: "America/Havana",
            rules: [ {
                e: 12249972e5,
                s: 12056436e5
            }, {
                e: 12564468e5,
                s: 12364884e5
            }, {
                e: 12885012e5,
                s: 12685428e5
            }, {
                e: 13211604e5,
                s: 13005972e5
            }, {
                e: 13520052e5,
                s: 13332564e5
            }, {
                e: 13834548e5,
                s: 13628916e5
            }, {
                e: 14149044e5,
                s: 13943412e5
            } ]
        }, {
            name: "America/Mazatlan",
            rules: [ {
                e: 1225008e6,
                s: 12074724e5
            }, {
                e: 12564576e5,
                s: 1238922e6
            }, {
                e: 1288512e6,
                s: 12703716e5
            }, {
                e: 13199616e5,
                s: 13018212e5
            }, {
                e: 13514112e5,
                s: 13332708e5
            }, {
                e: 13828608e5,
                s: 13653252e5
            }, {
                e: 14143104e5,
                s: 13967748e5
            } ]
        }, {
            name: "America/Mexico_City",
            rules: [ {
                e: 12250044e5,
                s: 12074688e5
            }, {
                e: 1256454e6,
                s: 12389184e5
            }, {
                e: 12885084e5,
                s: 1270368e6
            }, {
                e: 1319958e6,
                s: 13018176e5
            }, {
                e: 13514076e5,
                s: 13332672e5
            }, {
                e: 13828572e5,
                s: 13653216e5
            }, {
                e: 14143068e5,
                s: 13967712e5
            } ]
        }, {
            name: "America/Miquelon",
            rules: [ {
                e: 12255984e5,
                s: 12050388e5
            }, {
                e: 1257048e6,
                s: 12364884e5
            }, {
                e: 12891024e5,
                s: 12685428e5
            }, {
                e: 1320552e6,
                s: 12999924e5
            }, {
                e: 13520016e5,
                s: 1331442e6
            }, {
                e: 13834512e5,
                s: 13628916e5
            }, {
                e: 14149008e5,
                s: 13943412e5
            } ]
        }, {
            name: "America/Santa_Isabel",
            rules: [ {
                e: 12250116e5,
                s: 1207476e6
            }, {
                e: 12564612e5,
                s: 12389256e5
            }, {
                e: 12885156e5,
                s: 12703752e5
            }, {
                e: 13199652e5,
                s: 13018248e5
            }, {
                e: 13514148e5,
                s: 13332744e5
            }, {
                e: 13828644e5,
                s: 13653288e5
            }, {
                e: 1414314e6,
                s: 13967784e5
            } ]
        }, {
            name: "America/Sao_Paulo",
            rules: [ {
                e: 12032136e5,
                s: 12243852e5
            }, {
                e: 12346632e5,
                s: 12558348e5
            }, {
                e: 12667176e5,
                s: 12872844e5
            }, {
                e: 12981672e5,
                s: 1318734e6
            }, {
                e: 13302216e5,
                s: 13507884e5
            }, {
                e: 13610664e5,
                s: 1382238e6
            }, {
                e: 1392516e6,
                s: 14136876e5
            } ]
        }, {
            name: "Asia/Amman",
            rules: [ {
                e: 1225404e6,
                s: 12066552e5
            }, {
                e: 12568536e5,
                s: 12381048e5
            }, {
                e: 12883032e5,
                s: 12695544e5
            }, {
                e: 13197528e5,
                s: 13016088e5
            }, !1, !1, {
                e: 14147064e5,
                s: 13959576e5
            } ]
        }, {
            name: "Asia/Damascus",
            rules: [ {
                e: 12254868e5,
                s: 120726e7
            }, {
                e: 125685e7,
                s: 12381048e5
            }, {
                e: 12882996e5,
                s: 12701592e5
            }, {
                e: 13197492e5,
                s: 13016088e5
            }, {
                e: 13511988e5,
                s: 13330584e5
            }, {
                e: 13826484e5,
                s: 1364508e6
            }, {
                e: 14147028e5,
                s: 13959576e5
            } ]
        }, {
            name: "Asia/Dubai",
            rules: [ !1, !1, !1, !1, !1, !1, !1 ]
        }, {
            name: "Asia/Gaza",
            rules: [ {
                e: 12199572e5,
                s: 12066552e5
            }, {
                e: 12520152e5,
                s: 12381048e5
            }, {
                e: 1281474e6,
                s: 126964086e4
            }, {
                e: 1312146e6,
                s: 130160886e4
            }, {
                e: 13481784e5,
                s: 13330584e5
            }, {
                e: 13802292e5,
                s: 1364508e6
            }, {
                e: 14116788e5,
                s: 13959576e5
            } ]
        }, {
            name: "Asia/Irkutsk",
            rules: [ {
                e: 12249576e5,
                s: 12068136e5
            }, {
                e: 12564072e5,
                s: 12382632e5
            }, {
                e: 12884616e5,
                s: 12697128e5
            }, !1, !1, !1, !1 ]
        }, {
            name: "Asia/Jerusalem",
            rules: [ {
                e: 12231612e5,
                s: 12066624e5
            }, {
                e: 1254006e6,
                s: 1238112e6
            }, {
                e: 1284246e6,
                s: 12695616e5
            }, {
                e: 131751e7,
                s: 1301616e6
            }, {
                e: 13483548e5,
                s: 13330656e5
            }, {
                e: 13828284e5,
                s: 13645152e5
            }, {
                e: 1414278e6,
                s: 13959648e5
            } ]
        }, {
            name: "Asia/Kamchatka",
            rules: [ {
                e: 12249432e5,
                s: 12067992e5
            }, {
                e: 12563928e5,
                s: 12382488e5
            }, {
                e: 12884508e5,
                s: 12696984e5
            }, !1, !1, !1, !1 ]
        }, {
            name: "Asia/Krasnoyarsk",
            rules: [ {
                e: 12249612e5,
                s: 12068172e5
            }, {
                e: 12564108e5,
                s: 12382668e5
            }, {
                e: 12884652e5,
                s: 12697164e5
            }, !1, !1, !1, !1 ]
        }, {
            name: "Asia/Omsk",
            rules: [ {
                e: 12249648e5,
                s: 12068208e5
            }, {
                e: 12564144e5,
                s: 12382704e5
            }, {
                e: 12884688e5,
                s: 126972e7
            }, !1, !1, !1, !1 ]
        }, {
            name: "Asia/Vladivostok",
            rules: [ {
                e: 12249504e5,
                s: 12068064e5
            }, {
                e: 12564e8,
                s: 1238256e6
            }, {
                e: 12884544e5,
                s: 12697056e5
            }, !1, !1, !1, !1 ]
        }, {
            name: "Asia/Yakutsk",
            rules: [ {
                e: 1224954e6,
                s: 120681e7
            }, {
                e: 12564036e5,
                s: 12382596e5
            }, {
                e: 1288458e6,
                s: 12697092e5
            }, !1, !1, !1, !1 ]
        }, {
            name: "Asia/Yekaterinburg",
            rules: [ {
                e: 12249684e5,
                s: 12068244e5
            }, {
                e: 1256418e6,
                s: 1238274e6
            }, {
                e: 12884724e5,
                s: 12697236e5
            }, !1, !1, !1, !1 ]
        }, {
            name: "Asia/Yerevan",
            rules: [ {
                e: 1224972e6,
                s: 1206828e6
            }, {
                e: 12564216e5,
                s: 12382776e5
            }, {
                e: 1288476e6,
                s: 12697272e5
            }, {
                e: 13199256e5,
                s: 13011768e5
            }, !1, !1, !1 ]
        }, {
            name: "Australia/Lord_Howe",
            rules: [ {
                e: 12074076e5,
                s: 12231342e5
            }, {
                e: 12388572e5,
                s: 12545838e5
            }, {
                e: 12703068e5,
                s: 12860334e5
            }, {
                e: 13017564e5,
                s: 1317483e6
            }, {
                e: 1333206e6,
                s: 13495374e5
            }, {
                e: 13652604e5,
                s: 1380987e6
            }, {
                e: 139671e7,
                s: 14124366e5
            } ]
        }, {
            name: "Australia/Perth",
            rules: [ {
                e: 12068136e5,
                s: 12249576e5
            }, !1, !1, !1, !1, !1, !1 ]
        }, {
            name: "Europe/Helsinki",
            rules: [ {
                e: 12249828e5,
                s: 12068388e5
            }, {
                e: 12564324e5,
                s: 12382884e5
            }, {
                e: 12884868e5,
                s: 1269738e6
            }, {
                e: 13199364e5,
                s: 13011876e5
            }, {
                e: 1351386e6,
                s: 13326372e5
            }, {
                e: 13828356e5,
                s: 13646916e5
            }, {
                e: 14142852e5,
                s: 13961412e5
            } ]
        }, {
            name: "Europe/Minsk",
            rules: [ {
                e: 12249792e5,
                s: 12068352e5
            }, {
                e: 12564288e5,
                s: 12382848e5
            }, {
                e: 12884832e5,
                s: 12697344e5
            }, !1, !1, !1, !1 ]
        }, {
            name: "Europe/Moscow",
            rules: [ {
                e: 12249756e5,
                s: 12068316e5
            }, {
                e: 12564252e5,
                s: 12382812e5
            }, {
                e: 12884796e5,
                s: 12697308e5
            }, !1, !1, !1, !1 ]
        }, {
            name: "Pacific/Apia",
            rules: [ !1, !1, !1, {
                e: 13017528e5,
                s: 13168728e5
            }, {
                e: 13332024e5,
                s: 13489272e5
            }, {
                e: 13652568e5,
                s: 13803768e5
            }, {
                e: 13967064e5,
                s: 14118264e5
            } ]
        }, {
            name: "Pacific/Fiji",
            rules: [ !1, !1, {
                e: 12696984e5,
                s: 12878424e5
            }, {
                e: 13271544e5,
                s: 1319292e6
            }, {
                e: 1358604e6,
                s: 13507416e5
            }, {
                e: 139005e7,
                s: 1382796e6
            }, {
                e: 14215032e5,
                s: 14148504e5
            } ]
        } ]
    }, "undefined" != typeof exports ? exports.jstz = jstz : root.jstz = jstz;
}(this), !function(root) {
    var jstz = function() {
        "use strict";
        var b = "s", c = {
            DAY: 864e5,
            HOUR: 36e5,
            MINUTE: 6e4,
            SECOND: 1e3,
            BASELINE_YEAR: 2014,
            MAX_SCORE: 864e6,
            AMBIGUITIES: {
                "America/Denver": [ "America/Mazatlan" ],
                "America/Chicago": [ "America/Mexico_City" ],
                "America/Santiago": [ "America/Asuncion", "America/Campo_Grande" ],
                "America/Montevideo": [ "America/Sao_Paulo" ],
                "Asia/Beirut": [ "Asia/Amman", "Asia/Jerusalem", "Europe/Helsinki", "Asia/Damascus", "Africa/Cairo", "Asia/Gaza", "Europe/Minsk" ],
                "Pacific/Auckland": [ "Pacific/Fiji" ],
                "America/Los_Angeles": [ "America/Santa_Isabel" ],
                "America/New_York": [ "America/Havana" ],
                "America/Halifax": [ "America/Goose_Bay" ],
                "America/Godthab": [ "America/Miquelon" ],
                "Asia/Dubai": [ "Asia/Yerevan" ],
                "Asia/Jakarta": [ "Asia/Krasnoyarsk" ],
                "Asia/Shanghai": [ "Asia/Irkutsk", "Australia/Perth" ],
                "Australia/Sydney": [ "Australia/Lord_Howe" ],
                "Asia/Tokyo": [ "Asia/Yakutsk" ],
                "Asia/Dhaka": [ "Asia/Omsk" ],
                "Asia/Baku": [ "Asia/Yerevan" ],
                "Australia/Brisbane": [ "Asia/Vladivostok" ],
                "Pacific/Noumea": [ "Asia/Vladivostok" ],
                "Pacific/Majuro": [ "Asia/Kamchatka", "Pacific/Fiji" ],
                "Pacific/Tongatapu": [ "Pacific/Apia" ],
                "Asia/Baghdad": [ "Europe/Minsk", "Europe/Moscow" ],
                "Asia/Karachi": [ "Asia/Yekaterinburg" ],
                "Africa/Johannesburg": [ "Asia/Gaza", "Africa/Cairo" ]
            }
        }, r = function(suite) {
            var val = -suite.getTimezoneOffset();
            return null !== val ? val : 0;
        }, e = function() {
            var y = r(new Date(c.BASELINE_YEAR, 0, 2)), l = r(new Date(c.BASELINE_YEAR, 5, 2)), d = y - l;
            return 0 > d ? y + ",1" : d > 0 ? l + ",1," + b : y + ",0";
        }, f = function() {
            if ("undefined" != typeof Intl && "undefined" != typeof Intl.DateTimeFormat) {
                var name = Intl.DateTimeFormat();
                if ("undefined" != typeof name && "undefined" != typeof name.resolvedOptions) return name.resolvedOptions().timeZone;
            }
        }, test = function(year) {
            for (var a = new Date(year, 0, 1, 0, 0, 1, 0).getTime(), b = new Date(year, 12, 31, 23, 59, 59).getTime(), f = a, i = new Date(f).getTimezoneOffset(), l = null, v = null; b - 864e5 > f; ) {
                var t = new Date(f), j = t.getTimezoneOffset();
                j !== i && (i > j && (l = t), j > i && (v = t), i = j), f += 864e5;
            }
            return l && v ? {
                s: g(l).getTime(),
                e: g(v).getTime()
            } : !1;
        }, g = function max(a, b, r) {
            "undefined" == typeof b && (b = c.DAY, r = c.HOUR);
            for (var x = new Date(a.getTime() - b).getTime(), y = a.getTime() + b, z = new Date(x).getTimezoneOffset(), i = x, h = null; y - r > i; ) {
                var d = new Date(i), e = d.getTimezoneOffset();
                if (e !== z) {
                    h = d;
                    break;
                }
                i += r;
            }
            return b === c.DAY ? max(h, c.HOUR, c.MINUTE) : b === c.HOUR ? max(h, c.MINUTE, c.SECOND) : h;
        }, fn = function(a, b, c, d) {
            if ("N/A" !== c) return c;
            if ("Asia/Beirut" === b) {
                if ("Africa/Cairo" === d.name && 13983768e5 === a[6].s && 14116788e5 === a[6].e) return 0;
                if ("Asia/Jerusalem" === d.name && 13959648e5 === a[6].s && 14118588e5 === a[6].e) return 0;
            } else if ("America/Santiago" === b) {
                if ("America/Asuncion" === d.name && 14124816e5 === a[6].s && 1397358e6 === a[6].e) return 0;
                if ("America/Campo_Grande" === d.name && 14136912e5 === a[6].s && 13925196e5 === a[6].e) return 0;
            } else if ("America/Montevideo" === b) {
                if ("America/Sao_Paulo" === d.name && 14136876e5 === a[6].s && 1392516e6 === a[6].e) return 0;
            } else if ("Pacific/Auckland" === b && "Pacific/Fiji" === d.name && 14142456e5 === a[6].s && 13961016e5 === a[6].e) return 0;
            return c;
        }, extend = function(target, a) {
            for (var all = function(options) {
                for (var value = 0, key = 0; key < target.length; key++) if (options.rules[key] && target[key]) {
                    if (!(target[key].s >= options.rules[key].s && target[key].e <= options.rules[key].e)) {
                        value = "N/A";
                        break;
                    }
                    if (value = 0, value += Math.abs(target[key].s - options.rules[key].s), value += Math.abs(options.rules[key].e - target[key].e), 
                    value > c.MAX_SCORE) {
                        value = "N/A";
                        break;
                    }
                }
                return value = fn(target, a, value, options);
            }, data = {}, files = jstz.olson.dst_rules.zones, l = files.length, r = c.AMBIGUITIES[a], i = 0; l > i; i++) {
                var entry = files[i], content = all(files[i]);
                "N/A" !== content && (data[entry.name] = content);
            }
            for (var lang in data) if (data.hasOwnProperty(lang) && -1 != r.indexOf(lang)) return lang;
            return a;
        }, call = function(args) {
            var qs = function() {
                for (var str = [], i = 0; i < jstz.olson.dst_rules.years.length; i++) {
                    var s = test(jstz.olson.dst_rules.years[i]);
                    str.push(s);
                }
                return str;
            }, run = function(params) {
                for (var i = 0; i < params.length; i++) if (params[i] !== !1) return !0;
                return !1;
            }, key = qs(), current = run(key);
            return current ? extend(key, args) : args;
        }, onLoad = function() {
            var a = f();
            return a || (a = jstz.olson.timezones[e()], "undefined" != typeof c.AMBIGUITIES[a] && (a = call(a))), 
            {
                name: function() {
                    return a;
                }
            };
        };
        return {
            determine: onLoad
        };
    }();
    jstz.olson = jstz.olson || {}, jstz.olson.timezones = {
        "-720,0": "Etc/GMT+12",
        "-660,0": "Pacific/Pago_Pago",
        "-660,1,s": "Pacific/Apia",
        "-600,1": "America/Adak",
        "-600,0": "Pacific/Honolulu",
        "-570,0": "Pacific/Marquesas",
        "-540,0": "Pacific/Gambier",
        "-540,1": "America/Anchorage",
        "-480,1": "America/Los_Angeles",
        "-480,0": "Pacific/Pitcairn",
        "-420,0": "America/Phoenix",
        "-420,1": "America/Denver",
        "-360,0": "America/Guatemala",
        "-360,1": "America/Chicago",
        "-360,1,s": "Pacific/Easter",
        "-300,0": "America/Bogota",
        "-300,1": "America/New_York",
        "-270,0": "America/Caracas",
        "-240,1": "America/Halifax",
        "-240,0": "America/Santo_Domingo",
        "-240,1,s": "America/Santiago",
        "-210,1": "America/St_Johns",
        "-180,1": "America/Godthab",
        "-180,0": "America/Argentina/Buenos_Aires",
        "-180,1,s": "America/Montevideo",
        "-120,0": "America/Noronha",
        "-120,1": "America/Noronha",
        "-60,1": "Atlantic/Azores",
        "-60,0": "Atlantic/Cape_Verde",
        "0,0": "UTC",
        "0,1": "Europe/London",
        "60,1": "Europe/Berlin",
        "60,0": "Africa/Lagos",
        "60,1,s": "Africa/Windhoek",
        "120,1": "Asia/Beirut",
        "120,0": "Africa/Johannesburg",
        "180,0": "Asia/Baghdad",
        "180,1": "Europe/Moscow",
        "210,1": "Asia/Tehran",
        "240,0": "Asia/Dubai",
        "240,1": "Asia/Baku",
        "270,0": "Asia/Kabul",
        "300,1": "Asia/Yekaterinburg",
        "300,0": "Asia/Karachi",
        "330,0": "Asia/Kolkata",
        "345,0": "Asia/Kathmandu",
        "360,0": "Asia/Dhaka",
        "360,1": "Asia/Omsk",
        "390,0": "Asia/Rangoon",
        "420,1": "Asia/Krasnoyarsk",
        "420,0": "Asia/Jakarta",
        "480,0": "Asia/Shanghai",
        "480,1": "Asia/Irkutsk",
        "525,0": "Australia/Eucla",
        "525,1,s": "Australia/Eucla",
        "540,1": "Asia/Yakutsk",
        "540,0": "Asia/Tokyo",
        "570,0": "Australia/Darwin",
        "570,1,s": "Australia/Adelaide",
        "600,0": "Australia/Brisbane",
        "600,1": "Asia/Vladivostok",
        "600,1,s": "Australia/Sydney",
        "630,1,s": "Australia/Lord_Howe",
        "660,1": "Asia/Kamchatka",
        "660,0": "Pacific/Noumea",
        "690,0": "Pacific/Norfolk",
        "720,1,s": "Pacific/Auckland",
        "720,0": "Pacific/Majuro",
        "765,1,s": "Pacific/Chatham",
        "780,0": "Pacific/Tongatapu",
        "780,1,s": "Pacific/Apia",
        "840,0": "Pacific/Kiritimati"
    }, jstz.olson.dst_rules = {
        years: [ 2008, 2009, 2010, 2011, 2012, 2013, 2014 ],
        zones: [ {
            name: "Africa/Cairo",
            rules: [ {
                e: 12199572e5,
                s: 12090744e5
            }, {
                e: 1250802e6,
                s: 1240524e6
            }, {
                e: 12858804e5,
                s: 12840696e5
            }, !1, !1, !1, {
                e: 14116788e5,
                s: 1406844e6
            } ]
        }, {
            name: "America/Asuncion",
            rules: [ {
                e: 12050316e5,
                s: 12243888e5
            }, {
                e: 12364812e5,
                s: 12558384e5
            }, {
                e: 12709548e5,
                s: 12860784e5
            }, {
                e: 13024044e5,
                s: 1317528e6
            }, {
                e: 1333854e6,
                s: 13495824e5
            }, {
                e: 1364094e6,
                s: 1381032e6
            }, {
                e: 13955436e5,
                s: 14124816e5
            } ]
        }, {
            name: "America/Campo_Grande",
            rules: [ {
                e: 12032172e5,
                s: 12243888e5
            }, {
                e: 12346668e5,
                s: 12558384e5
            }, {
                e: 12667212e5,
                s: 1287288e6
            }, {
                e: 12981708e5,
                s: 13187376e5
            }, {
                e: 13302252e5,
                s: 1350792e6
            }, {
                e: 136107e7,
                s: 13822416e5
            }, {
                e: 13925196e5,
                s: 14136912e5
            } ]
        }, {
            name: "America/Goose_Bay",
            rules: [ {
                e: 122559486e4,
                s: 120503526e4
            }, {
                e: 125704446e4,
                s: 123648486e4
            }, {
                e: 128909886e4,
                s: 126853926e4
            }, {
                e: 13205556e5,
                s: 129998886e4
            }, {
                e: 13520052e5,
                s: 13314456e5
            }, {
                e: 13834548e5,
                s: 13628952e5
            }, {
                e: 14149044e5,
                s: 13943448e5
            } ]
        }, {
            name: "America/Havana",
            rules: [ {
                e: 12249972e5,
                s: 12056436e5
            }, {
                e: 12564468e5,
                s: 12364884e5
            }, {
                e: 12885012e5,
                s: 12685428e5
            }, {
                e: 13211604e5,
                s: 13005972e5
            }, {
                e: 13520052e5,
                s: 13332564e5
            }, {
                e: 13834548e5,
                s: 13628916e5
            }, {
                e: 14149044e5,
                s: 13943412e5
            } ]
        }, {
            name: "America/Mazatlan",
            rules: [ {
                e: 1225008e6,
                s: 12074724e5
            }, {
                e: 12564576e5,
                s: 1238922e6
            }, {
                e: 1288512e6,
                s: 12703716e5
            }, {
                e: 13199616e5,
                s: 13018212e5
            }, {
                e: 13514112e5,
                s: 13332708e5
            }, {
                e: 13828608e5,
                s: 13653252e5
            }, {
                e: 14143104e5,
                s: 13967748e5
            } ]
        }, {
            name: "America/Mexico_City",
            rules: [ {
                e: 12250044e5,
                s: 12074688e5
            }, {
                e: 1256454e6,
                s: 12389184e5
            }, {
                e: 12885084e5,
                s: 1270368e6
            }, {
                e: 1319958e6,
                s: 13018176e5
            }, {
                e: 13514076e5,
                s: 13332672e5
            }, {
                e: 13828572e5,
                s: 13653216e5
            }, {
                e: 14143068e5,
                s: 13967712e5
            } ]
        }, {
            name: "America/Miquelon",
            rules: [ {
                e: 12255984e5,
                s: 12050388e5
            }, {
                e: 1257048e6,
                s: 12364884e5
            }, {
                e: 12891024e5,
                s: 12685428e5
            }, {
                e: 1320552e6,
                s: 12999924e5
            }, {
                e: 13520016e5,
                s: 1331442e6
            }, {
                e: 13834512e5,
                s: 13628916e5
            }, {
                e: 14149008e5,
                s: 13943412e5
            } ]
        }, {
            name: "America/Santa_Isabel",
            rules: [ {
                e: 12250116e5,
                s: 1207476e6
            }, {
                e: 12564612e5,
                s: 12389256e5
            }, {
                e: 12885156e5,
                s: 12703752e5
            }, {
                e: 13199652e5,
                s: 13018248e5
            }, {
                e: 13514148e5,
                s: 13332744e5
            }, {
                e: 13828644e5,
                s: 13653288e5
            }, {
                e: 1414314e6,
                s: 13967784e5
            } ]
        }, {
            name: "America/Sao_Paulo",
            rules: [ {
                e: 12032136e5,
                s: 12243852e5
            }, {
                e: 12346632e5,
                s: 12558348e5
            }, {
                e: 12667176e5,
                s: 12872844e5
            }, {
                e: 12981672e5,
                s: 1318734e6
            }, {
                e: 13302216e5,
                s: 13507884e5
            }, {
                e: 13610664e5,
                s: 1382238e6
            }, {
                e: 1392516e6,
                s: 14136876e5
            } ]
        }, {
            name: "Asia/Amman",
            rules: [ {
                e: 1225404e6,
                s: 12066552e5
            }, {
                e: 12568536e5,
                s: 12381048e5
            }, {
                e: 12883032e5,
                s: 12695544e5
            }, {
                e: 13197528e5,
                s: 13016088e5
            }, !1, !1, {
                e: 14147064e5,
                s: 13959576e5
            } ]
        }, {
            name: "Asia/Damascus",
            rules: [ {
                e: 12254868e5,
                s: 120726e7
            }, {
                e: 125685e7,
                s: 12381048e5
            }, {
                e: 12882996e5,
                s: 12701592e5
            }, {
                e: 13197492e5,
                s: 13016088e5
            }, {
                e: 13511988e5,
                s: 13330584e5
            }, {
                e: 13826484e5,
                s: 1364508e6
            }, {
                e: 14147028e5,
                s: 13959576e5
            } ]
        }, {
            name: "Asia/Dubai",
            rules: [ !1, !1, !1, !1, !1, !1, !1 ]
        }, {
            name: "Asia/Gaza",
            rules: [ {
                e: 12199572e5,
                s: 12066552e5
            }, {
                e: 12520152e5,
                s: 12381048e5
            }, {
                e: 1281474e6,
                s: 126964086e4
            }, {
                e: 1312146e6,
                s: 130160886e4
            }, {
                e: 13481784e5,
                s: 13330584e5
            }, {
                e: 13802292e5,
                s: 1364508e6
            }, {
                e: 14116788e5,
                s: 13959576e5
            } ]
        }, {
            name: "Asia/Irkutsk",
            rules: [ {
                e: 12249576e5,
                s: 12068136e5
            }, {
                e: 12564072e5,
                s: 12382632e5
            }, {
                e: 12884616e5,
                s: 12697128e5
            }, !1, !1, !1, !1 ]
        }, {
            name: "Asia/Jerusalem",
            rules: [ {
                e: 12231612e5,
                s: 12066624e5
            }, {
                e: 1254006e6,
                s: 1238112e6
            }, {
                e: 1284246e6,
                s: 12695616e5
            }, {
                e: 131751e7,
                s: 1301616e6
            }, {
                e: 13483548e5,
                s: 13330656e5
            }, {
                e: 13828284e5,
                s: 13645152e5
            }, {
                e: 1414278e6,
                s: 13959648e5
            } ]
        }, {
            name: "Asia/Kamchatka",
            rules: [ {
                e: 12249432e5,
                s: 12067992e5
            }, {
                e: 12563928e5,
                s: 12382488e5
            }, {
                e: 12884508e5,
                s: 12696984e5
            }, !1, !1, !1, !1 ]
        }, {
            name: "Asia/Krasnoyarsk",
            rules: [ {
                e: 12249612e5,
                s: 12068172e5
            }, {
                e: 12564108e5,
                s: 12382668e5
            }, {
                e: 12884652e5,
                s: 12697164e5
            }, !1, !1, !1, !1 ]
        }, {
            name: "Asia/Omsk",
            rules: [ {
                e: 12249648e5,
                s: 12068208e5
            }, {
                e: 12564144e5,
                s: 12382704e5
            }, {
                e: 12884688e5,
                s: 126972e7
            }, !1, !1, !1, !1 ]
        }, {
            name: "Asia/Vladivostok",
            rules: [ {
                e: 12249504e5,
                s: 12068064e5
            }, {
                e: 12564e8,
                s: 1238256e6
            }, {
                e: 12884544e5,
                s: 12697056e5
            }, !1, !1, !1, !1 ]
        }, {
            name: "Asia/Yakutsk",
            rules: [ {
                e: 1224954e6,
                s: 120681e7
            }, {
                e: 12564036e5,
                s: 12382596e5
            }, {
                e: 1288458e6,
                s: 12697092e5
            }, !1, !1, !1, !1 ]
        }, {
            name: "Asia/Yekaterinburg",
            rules: [ {
                e: 12249684e5,
                s: 12068244e5
            }, {
                e: 1256418e6,
                s: 1238274e6
            }, {
                e: 12884724e5,
                s: 12697236e5
            }, !1, !1, !1, !1 ]
        }, {
            name: "Asia/Yerevan",
            rules: [ {
                e: 1224972e6,
                s: 1206828e6
            }, {
                e: 12564216e5,
                s: 12382776e5
            }, {
                e: 1288476e6,
                s: 12697272e5
            }, {
                e: 13199256e5,
                s: 13011768e5
            }, !1, !1, !1 ]
        }, {
            name: "Australia/Lord_Howe",
            rules: [ {
                e: 12074076e5,
                s: 12231342e5
            }, {
                e: 12388572e5,
                s: 12545838e5
            }, {
                e: 12703068e5,
                s: 12860334e5
            }, {
                e: 13017564e5,
                s: 1317483e6
            }, {
                e: 1333206e6,
                s: 13495374e5
            }, {
                e: 13652604e5,
                s: 1380987e6
            }, {
                e: 139671e7,
                s: 14124366e5
            } ]
        }, {
            name: "Australia/Perth",
            rules: [ {
                e: 12068136e5,
                s: 12249576e5
            }, !1, !1, !1, !1, !1, !1 ]
        }, {
            name: "Europe/Helsinki",
            rules: [ {
                e: 12249828e5,
                s: 12068388e5
            }, {
                e: 12564324e5,
                s: 12382884e5
            }, {
                e: 12884868e5,
                s: 1269738e6
            }, {
                e: 13199364e5,
                s: 13011876e5
            }, {
                e: 1351386e6,
                s: 13326372e5
            }, {
                e: 13828356e5,
                s: 13646916e5
            }, {
                e: 14142852e5,
                s: 13961412e5
            } ]
        }, {
            name: "Europe/Minsk",
            rules: [ {
                e: 12249792e5,
                s: 12068352e5
            }, {
                e: 12564288e5,
                s: 12382848e5
            }, {
                e: 12884832e5,
                s: 12697344e5
            }, !1, !1, !1, !1 ]
        }, {
            name: "Europe/Moscow",
            rules: [ {
                e: 12249756e5,
                s: 12068316e5
            }, {
                e: 12564252e5,
                s: 12382812e5
            }, {
                e: 12884796e5,
                s: 12697308e5
            }, !1, !1, !1, !1 ]
        }, {
            name: "Pacific/Apia",
            rules: [ !1, !1, !1, {
                e: 13017528e5,
                s: 13168728e5
            }, {
                e: 13332024e5,
                s: 13489272e5
            }, {
                e: 13652568e5,
                s: 13803768e5
            }, {
                e: 13967064e5,
                s: 14118264e5
            } ]
        }, {
            name: "Pacific/Fiji",
            rules: [ !1, !1, {
                e: 12696984e5,
                s: 12878424e5
            }, {
                e: 13271544e5,
                s: 1319292e6
            }, {
                e: 1358604e6,
                s: 13507416e5
            }, {
                e: 139005e7,
                s: 1382796e6
            }, {
                e: 14215032e5,
                s: 14148504e5
            } ]
        } ]
    }, "undefined" != typeof exports ? exports.jstz = jstz : root.jstz = jstz;
}(this);

var jstz = function() {
    "use strict";
    var a = "s", b = {
        DAY: 864e5,
        HOUR: 36e5,
        MINUTE: 6e4,
        SECOND: 1e3,
        BASELINE_YEAR: 2014,
        MAX_SCORE: 864e6,
        AMBIGUITIES: {
            "America/Denver": [ "America/Mazatlan" ],
            "America/Chicago": [ "America/Mexico_City" ],
            "America/Santiago": [ "America/Asuncion", "America/Campo_Grande" ],
            "America/Montevideo": [ "America/Sao_Paulo" ],
            "Asia/Beirut": [ "Asia/Amman", "Asia/Jerusalem", "Europe/Helsinki", "Asia/Damascus", "Africa/Cairo", "Asia/Gaza", "Europe/Minsk" ],
            "Pacific/Auckland": [ "Pacific/Fiji" ],
            "America/Los_Angeles": [ "America/Santa_Isabel" ],
            "America/New_York": [ "America/Havana" ],
            "America/Halifax": [ "America/Goose_Bay" ],
            "America/Godthab": [ "America/Miquelon" ],
            "Asia/Dubai": [ "Asia/Yerevan" ],
            "Asia/Jakarta": [ "Asia/Krasnoyarsk" ],
            "Asia/Shanghai": [ "Asia/Irkutsk", "Australia/Perth" ],
            "Australia/Sydney": [ "Australia/Lord_Howe" ],
            "Asia/Tokyo": [ "Asia/Yakutsk" ],
            "Asia/Dhaka": [ "Asia/Omsk" ],
            "Asia/Baku": [ "Asia/Yerevan" ],
            "Australia/Brisbane": [ "Asia/Vladivostok" ],
            "Pacific/Noumea": [ "Asia/Vladivostok" ],
            "Pacific/Majuro": [ "Asia/Kamchatka", "Pacific/Fiji" ],
            "Pacific/Tongatapu": [ "Pacific/Apia" ],
            "Asia/Baghdad": [ "Europe/Minsk", "Europe/Moscow" ],
            "Asia/Karachi": [ "Asia/Yekaterinburg" ],
            "Africa/Johannesburg": [ "Asia/Gaza", "Africa/Cairo" ]
        }
    }, c = function(date) {
        var val = -date.getTimezoneOffset();
        return null !== val ? val : 0;
    }, d = function() {
        var n = c(new Date(b.BASELINE_YEAR, 0, 2)), r = c(new Date(b.BASELINE_YEAR, 5, 2)), i = n - r;
        return 0 > i ? n + ",1" : i > 0 ? r + ",1," + a : n + ",0";
    }, e = function() {
        if ("undefined" != typeof Intl && "undefined" != typeof Intl.DateTimeFormat) {
            var a = Intl.DateTimeFormat();
            if ("undefined" != typeof a && "undefined" != typeof a.resolvedOptions) return a.resolvedOptions().timeZone;
        }
    }, f = function(year) {
        for (var a = new Date(year, 0, 1, 0, 0, 1, 0).getTime(), i = new Date(year, 12, 31, 23, 59, 59).getTime(), t = a, len = new Date(t).getTimezoneOffset(), d = null, v = null; i - 864e5 > t; ) {
            var date = new Date(t), length = date.getTimezoneOffset();
            length !== len && (len > length && (d = date), length > len && (v = date), len = length), 
            t += 864e5;
        }
        return d && v ? {
            s: g(d).getTime(),
            e: g(v).getTime()
        } : !1;
    }, g = function id(dd, e, data) {
        "undefined" == typeof e && (e = b.DAY, data = b.HOUR);
        for (var x = new Date(dd.getTime() - e).getTime(), y = dd.getTime() + e, z = new Date(x).getTimezoneOffset(), i = x, el = null; y - data > i; ) {
            var d = new Date(i), a = d.getTimezoneOffset();
            if (a !== z) {
                el = d;
                break;
            }
            i += data;
        }
        return e === b.DAY ? id(el, b.HOUR, b.MINUTE) : e === b.HOUR ? id(el, b.MINUTE, b.SECOND) : el;
    }, n = function(a, b, c, d) {
        if ("N/A" !== c) return c;
        if ("Asia/Beirut" === b) {
            if ("Africa/Cairo" === d.name && 13983768e5 === a[6].s && 14116788e5 === a[6].e) return 0;
            if ("Asia/Jerusalem" === d.name && 13959648e5 === a[6].s && 14118588e5 === a[6].e) return 0;
        } else if ("America/Santiago" === b) {
            if ("America/Asuncion" === d.name && 14124816e5 === a[6].s && 1397358e6 === a[6].e) return 0;
            if ("America/Campo_Grande" === d.name && 14136912e5 === a[6].s && 13925196e5 === a[6].e) return 0;
        } else if ("America/Montevideo" === b) {
            if ("America/Sao_Paulo" === d.name && 14136876e5 === a[6].s && 1392516e6 === a[6].e) return 0;
        } else if ("Pacific/Auckland" === b && "Pacific/Fiji" === d.name && 14142456e5 === a[6].s && 13961016e5 === a[6].e) return 0;
        return c;
    }, test = function(a, k) {
        for (var x = function(d) {
            for (var h = 0, i = 0; i < a.length; i++) if (d.rules[i] && a[i]) {
                if (!(a[i].s >= d.rules[i].s && a[i].e <= d.rules[i].e)) {
                    h = "N/A";
                    break;
                }
                if (h = 0, h += Math.abs(a[i].s - d.rules[i].s), h += Math.abs(d.rules[i].e - a[i].e), 
                h > b.MAX_SCORE) {
                    h = "N/A";
                    break;
                }
            }
            return h = n(a, k, h, d);
        }, o = {}, items = jstz.olson.dst_rules.zones, len = items.length, node = b.AMBIGUITIES[k], i = 0; len > i; i++) {
            var options = items[i], value = x(items[i]);
            "N/A" !== value && (o[options.name] = value);
        }
        for (var ns in o) if (o.hasOwnProperty(ns) && -1 != node.indexOf(ns)) return ns;
        return k;
    }, filter = function(item) {
        var next = function() {
            for (var l = [], i = 0; i < jstz.olson.dst_rules.years.length; i++) {
                var r = f(jstz.olson.dst_rules.years[i]);
                l.push(r);
            }
            return l;
        }, fn = function(_readedCustomers) {
            for (var i = 0; i < _readedCustomers.length; i++) if (_readedCustomers[i] !== !1) return !0;
            return !1;
        }, name = next(), value = fn(name);
        return value ? test(name, item) : item;
    }, k = function() {
        var f = e();
        return f || (f = jstz.olson.timezones[d()], "undefined" != typeof b.AMBIGUITIES[f] && (f = filter(f))), 
        {
            name: function() {
                return f;
            }
        };
    };
    return {
        determine: k
    };
}();

jstz.olson = jstz.olson || {}, jstz.olson.timezones = {
    "-720,0": "Etc/GMT+12",
    "-660,0": "Pacific/Pago_Pago",
    "-660,1,s": "Pacific/Apia",
    "-600,1": "America/Adak",
    "-600,0": "Pacific/Honolulu",
    "-570,0": "Pacific/Marquesas",
    "-540,0": "Pacific/Gambier",
    "-540,1": "America/Anchorage",
    "-480,1": "America/Los_Angeles",
    "-480,0": "Pacific/Pitcairn",
    "-420,0": "America/Phoenix",
    "-420,1": "America/Denver",
    "-360,0": "America/Guatemala",
    "-360,1": "America/Chicago",
    "-360,1,s": "Pacific/Easter",
    "-300,0": "America/Bogota",
    "-300,1": "America/New_York",
    "-270,0": "America/Caracas",
    "-240,1": "America/Halifax",
    "-240,0": "America/Santo_Domingo",
    "-240,1,s": "America/Santiago",
    "-210,1": "America/St_Johns",
    "-180,1": "America/Godthab",
    "-180,0": "America/Argentina/Buenos_Aires",
    "-180,1,s": "America/Montevideo",
    "-120,0": "America/Noronha",
    "-120,1": "America/Noronha",
    "-60,1": "Atlantic/Azores",
    "-60,0": "Atlantic/Cape_Verde",
    "0,0": "UTC",
    "0,1": "Europe/London",
    "60,1": "Europe/Berlin",
    "60,0": "Africa/Lagos",
    "60,1,s": "Africa/Windhoek",
    "120,1": "Asia/Beirut",
    "120,0": "Africa/Johannesburg",
    "180,0": "Asia/Baghdad",
    "180,1": "Europe/Moscow",
    "210,1": "Asia/Tehran",
    "240,0": "Asia/Dubai",
    "240,1": "Asia/Baku",
    "270,0": "Asia/Kabul",
    "300,1": "Asia/Yekaterinburg",
    "300,0": "Asia/Karachi",
    "330,0": "Asia/Kolkata",
    "345,0": "Asia/Kathmandu",
    "360,0": "Asia/Dhaka",
    "360,1": "Asia/Omsk",
    "390,0": "Asia/Rangoon",
    "420,1": "Asia/Krasnoyarsk",
    "420,0": "Asia/Jakarta",
    "480,0": "Asia/Shanghai",
    "480,1": "Asia/Irkutsk",
    "525,0": "Australia/Eucla",
    "525,1,s": "Australia/Eucla",
    "540,1": "Asia/Yakutsk",
    "540,0": "Asia/Tokyo",
    "570,0": "Australia/Darwin",
    "570,1,s": "Australia/Adelaide",
    "600,0": "Australia/Brisbane",
    "600,1": "Asia/Vladivostok",
    "600,1,s": "Australia/Sydney",
    "630,1,s": "Australia/Lord_Howe",
    "660,1": "Asia/Kamchatka",
    "660,0": "Pacific/Noumea",
    "690,0": "Pacific/Norfolk",
    "720,1,s": "Pacific/Auckland",
    "720,0": "Pacific/Majuro",
    "765,1,s": "Pacific/Chatham",
    "780,0": "Pacific/Tongatapu",
    "780,1,s": "Pacific/Apia",
    "840,0": "Pacific/Kiritimati"
}, jstz.olson.dst_rules = {
    years: [ 2008, 2009, 2010, 2011, 2012, 2013, 2014 ],
    zones: [ {
        name: "Africa/Cairo",
        rules: [ {
            e: 12199572e5,
            s: 12090744e5
        }, {
            e: 1250802e6,
            s: 1240524e6
        }, {
            e: 12858804e5,
            s: 12840696e5
        }, !1, !1, !1, {
            e: 14116788e5,
            s: 1406844e6
        } ]
    }, {
        name: "America/Asuncion",
        rules: [ {
            e: 12050316e5,
            s: 12243888e5
        }, {
            e: 12364812e5,
            s: 12558384e5
        }, {
            e: 12709548e5,
            s: 12860784e5
        }, {
            e: 13024044e5,
            s: 1317528e6
        }, {
            e: 1333854e6,
            s: 13495824e5
        }, {
            e: 1364094e6,
            s: 1381032e6
        }, {
            e: 13955436e5,
            s: 14124816e5
        } ]
    }, {
        name: "America/Campo_Grande",
        rules: [ {
            e: 12032172e5,
            s: 12243888e5
        }, {
            e: 12346668e5,
            s: 12558384e5
        }, {
            e: 12667212e5,
            s: 1287288e6
        }, {
            e: 12981708e5,
            s: 13187376e5
        }, {
            e: 13302252e5,
            s: 1350792e6
        }, {
            e: 136107e7,
            s: 13822416e5
        }, {
            e: 13925196e5,
            s: 14136912e5
        } ]
    }, {
        name: "America/Goose_Bay",
        rules: [ {
            e: 122559486e4,
            s: 120503526e4
        }, {
            e: 125704446e4,
            s: 123648486e4
        }, {
            e: 128909886e4,
            s: 126853926e4
        }, {
            e: 13205556e5,
            s: 129998886e4
        }, {
            e: 13520052e5,
            s: 13314456e5
        }, {
            e: 13834548e5,
            s: 13628952e5
        }, {
            e: 14149044e5,
            s: 13943448e5
        } ]
    }, {
        name: "America/Havana",
        rules: [ {
            e: 12249972e5,
            s: 12056436e5
        }, {
            e: 12564468e5,
            s: 12364884e5
        }, {
            e: 12885012e5,
            s: 12685428e5
        }, {
            e: 13211604e5,
            s: 13005972e5
        }, {
            e: 13520052e5,
            s: 13332564e5
        }, {
            e: 13834548e5,
            s: 13628916e5
        }, {
            e: 14149044e5,
            s: 13943412e5
        } ]
    }, {
        name: "America/Mazatlan",
        rules: [ {
            e: 1225008e6,
            s: 12074724e5
        }, {
            e: 12564576e5,
            s: 1238922e6
        }, {
            e: 1288512e6,
            s: 12703716e5
        }, {
            e: 13199616e5,
            s: 13018212e5
        }, {
            e: 13514112e5,
            s: 13332708e5
        }, {
            e: 13828608e5,
            s: 13653252e5
        }, {
            e: 14143104e5,
            s: 13967748e5
        } ]
    }, {
        name: "America/Mexico_City",
        rules: [ {
            e: 12250044e5,
            s: 12074688e5
        }, {
            e: 1256454e6,
            s: 12389184e5
        }, {
            e: 12885084e5,
            s: 1270368e6
        }, {
            e: 1319958e6,
            s: 13018176e5
        }, {
            e: 13514076e5,
            s: 13332672e5
        }, {
            e: 13828572e5,
            s: 13653216e5
        }, {
            e: 14143068e5,
            s: 13967712e5
        } ]
    }, {
        name: "America/Miquelon",
        rules: [ {
            e: 12255984e5,
            s: 12050388e5
        }, {
            e: 1257048e6,
            s: 12364884e5
        }, {
            e: 12891024e5,
            s: 12685428e5
        }, {
            e: 1320552e6,
            s: 12999924e5
        }, {
            e: 13520016e5,
            s: 1331442e6
        }, {
            e: 13834512e5,
            s: 13628916e5
        }, {
            e: 14149008e5,
            s: 13943412e5
        } ]
    }, {
        name: "America/Santa_Isabel",
        rules: [ {
            e: 12250116e5,
            s: 1207476e6
        }, {
            e: 12564612e5,
            s: 12389256e5
        }, {
            e: 12885156e5,
            s: 12703752e5
        }, {
            e: 13199652e5,
            s: 13018248e5
        }, {
            e: 13514148e5,
            s: 13332744e5
        }, {
            e: 13828644e5,
            s: 13653288e5
        }, {
            e: 1414314e6,
            s: 13967784e5
        } ]
    }, {
        name: "America/Sao_Paulo",
        rules: [ {
            e: 12032136e5,
            s: 12243852e5
        }, {
            e: 12346632e5,
            s: 12558348e5
        }, {
            e: 12667176e5,
            s: 12872844e5
        }, {
            e: 12981672e5,
            s: 1318734e6
        }, {
            e: 13302216e5,
            s: 13507884e5
        }, {
            e: 13610664e5,
            s: 1382238e6
        }, {
            e: 1392516e6,
            s: 14136876e5
        } ]
    }, {
        name: "Asia/Amman",
        rules: [ {
            e: 1225404e6,
            s: 12066552e5
        }, {
            e: 12568536e5,
            s: 12381048e5
        }, {
            e: 12883032e5,
            s: 12695544e5
        }, {
            e: 13197528e5,
            s: 13016088e5
        }, !1, !1, {
            e: 14147064e5,
            s: 13959576e5
        } ]
    }, {
        name: "Asia/Damascus",
        rules: [ {
            e: 12254868e5,
            s: 120726e7
        }, {
            e: 125685e7,
            s: 12381048e5
        }, {
            e: 12882996e5,
            s: 12701592e5
        }, {
            e: 13197492e5,
            s: 13016088e5
        }, {
            e: 13511988e5,
            s: 13330584e5
        }, {
            e: 13826484e5,
            s: 1364508e6
        }, {
            e: 14147028e5,
            s: 13959576e5
        } ]
    }, {
        name: "Asia/Dubai",
        rules: [ !1, !1, !1, !1, !1, !1, !1 ]
    }, {
        name: "Asia/Gaza",
        rules: [ {
            e: 12199572e5,
            s: 12066552e5
        }, {
            e: 12520152e5,
            s: 12381048e5
        }, {
            e: 1281474e6,
            s: 126964086e4
        }, {
            e: 1312146e6,
            s: 130160886e4
        }, {
            e: 13481784e5,
            s: 13330584e5
        }, {
            e: 13802292e5,
            s: 1364508e6
        }, {
            e: 14116788e5,
            s: 13959576e5
        } ]
    }, {
        name: "Asia/Irkutsk",
        rules: [ {
            e: 12249576e5,
            s: 12068136e5
        }, {
            e: 12564072e5,
            s: 12382632e5
        }, {
            e: 12884616e5,
            s: 12697128e5
        }, !1, !1, !1, !1 ]
    }, {
        name: "Asia/Jerusalem",
        rules: [ {
            e: 12231612e5,
            s: 12066624e5
        }, {
            e: 1254006e6,
            s: 1238112e6
        }, {
            e: 1284246e6,
            s: 12695616e5
        }, {
            e: 131751e7,
            s: 1301616e6
        }, {
            e: 13483548e5,
            s: 13330656e5
        }, {
            e: 13828284e5,
            s: 13645152e5
        }, {
            e: 1414278e6,
            s: 13959648e5
        } ]
    }, {
        name: "Asia/Kamchatka",
        rules: [ {
            e: 12249432e5,
            s: 12067992e5
        }, {
            e: 12563928e5,
            s: 12382488e5
        }, {
            e: 12884508e5,
            s: 12696984e5
        }, !1, !1, !1, !1 ]
    }, {
        name: "Asia/Krasnoyarsk",
        rules: [ {
            e: 12249612e5,
            s: 12068172e5
        }, {
            e: 12564108e5,
            s: 12382668e5
        }, {
            e: 12884652e5,
            s: 12697164e5
        }, !1, !1, !1, !1 ]
    }, {
        name: "Asia/Omsk",
        rules: [ {
            e: 12249648e5,
            s: 12068208e5
        }, {
            e: 12564144e5,
            s: 12382704e5
        }, {
            e: 12884688e5,
            s: 126972e7
        }, !1, !1, !1, !1 ]
    }, {
        name: "Asia/Vladivostok",
        rules: [ {
            e: 12249504e5,
            s: 12068064e5
        }, {
            e: 12564e8,
            s: 1238256e6
        }, {
            e: 12884544e5,
            s: 12697056e5
        }, !1, !1, !1, !1 ]
    }, {
        name: "Asia/Yakutsk",
        rules: [ {
            e: 1224954e6,
            s: 120681e7
        }, {
            e: 12564036e5,
            s: 12382596e5
        }, {
            e: 1288458e6,
            s: 12697092e5
        }, !1, !1, !1, !1 ]
    }, {
        name: "Asia/Yekaterinburg",
        rules: [ {
            e: 12249684e5,
            s: 12068244e5
        }, {
            e: 1256418e6,
            s: 1238274e6
        }, {
            e: 12884724e5,
            s: 12697236e5
        }, !1, !1, !1, !1 ]
    }, {
        name: "Asia/Yerevan",
        rules: [ {
            e: 1224972e6,
            s: 1206828e6
        }, {
            e: 12564216e5,
            s: 12382776e5
        }, {
            e: 1288476e6,
            s: 12697272e5
        }, {
            e: 13199256e5,
            s: 13011768e5
        }, !1, !1, !1 ]
    }, {
        name: "Australia/Lord_Howe",
        rules: [ {
            e: 12074076e5,
            s: 12231342e5
        }, {
            e: 12388572e5,
            s: 12545838e5
        }, {
            e: 12703068e5,
            s: 12860334e5
        }, {
            e: 13017564e5,
            s: 1317483e6
        }, {
            e: 1333206e6,
            s: 13495374e5
        }, {
            e: 13652604e5,
            s: 1380987e6
        }, {
            e: 139671e7,
            s: 14124366e5
        } ]
    }, {
        name: "Australia/Perth",
        rules: [ {
            e: 12068136e5,
            s: 12249576e5
        }, !1, !1, !1, !1, !1, !1 ]
    }, {
        name: "Europe/Helsinki",
        rules: [ {
            e: 12249828e5,
            s: 12068388e5
        }, {
            e: 12564324e5,
            s: 12382884e5
        }, {
            e: 12884868e5,
            s: 1269738e6
        }, {
            e: 13199364e5,
            s: 13011876e5
        }, {
            e: 1351386e6,
            s: 13326372e5
        }, {
            e: 13828356e5,
            s: 13646916e5
        }, {
            e: 14142852e5,
            s: 13961412e5
        } ]
    }, {
        name: "Europe/Minsk",
        rules: [ {
            e: 12249792e5,
            s: 12068352e5
        }, {
            e: 12564288e5,
            s: 12382848e5
        }, {
            e: 12884832e5,
            s: 12697344e5
        }, !1, !1, !1, !1 ]
    }, {
        name: "Europe/Moscow",
        rules: [ {
            e: 12249756e5,
            s: 12068316e5
        }, {
            e: 12564252e5,
            s: 12382812e5
        }, {
            e: 12884796e5,
            s: 12697308e5
        }, !1, !1, !1, !1 ]
    }, {
        name: "Pacific/Apia",
        rules: [ !1, !1, !1, {
            e: 13017528e5,
            s: 13168728e5
        }, {
            e: 13332024e5,
            s: 13489272e5
        }, {
            e: 13652568e5,
            s: 13803768e5
        }, {
            e: 13967064e5,
            s: 14118264e5
        } ]
    }, {
        name: "Pacific/Fiji",
        rules: [ !1, !1, {
            e: 12696984e5,
            s: 12878424e5
        }, {
            e: 13271544e5,
            s: 1319292e6
        }, {
            e: 1358604e6,
            s: 13507416e5
        }, {
            e: 139005e7,
            s: 1382796e6
        }, {
            e: 14215032e5,
            s: 14148504e5
        } ]
    } ]
};
