var gulp = require("gulp"), uglify = require("gulp-uglify"), jshint = require("gulp-jshint"), concat = require("gulp-concat"), header = require("gulp-header"), footer = require("gulp-footer"), commonjs = require("gulp-wrap-commonjs"), rename = require("gulp-rename"), del = require("del"), pkg = require("./package.json"), buildTime = function() {
    var d = new Date(), f = function() {
        return d.getMonth() < 10 ? "0" + d.getMonth() : d.getMonth();
    }, g = function() {
        return d.getDate() < 10 ? "0" + d.getDate() : d.getDate();
    };
    return d.getFullYear() + "-" + f() + "-" + g();
}, paths = {
    scripts: [ "jstz.*.js" ]
};

gulp.task("jshint", [], function() {
    return gulp.src(paths.scripts).pipe(jshint()).pipe(jshint.reporter("default"));
}), gulp.task("concat", [ "jshint" ], function() {
    return gulp.src(paths.scripts).pipe(concat("jstz.concat.js")).pipe(gulp.dest("dist"));
}), gulp.task("common-js", [ "concat" ], function() {
    return gulp.src([ "dist/jstz.concat.js" ]).pipe(header("(function (root) {")).pipe(footer("\n    if (typeof exports !== 'undefined') {\n        exports.jstz = jstz;\n    } else {\n        root.jstz = jstz;\n    }\n})(this);\n")).pipe(rename("jstz.js")).pipe(gulp.dest("dist"));
}), gulp.task("uglify", [ "common-js" ], function() {
    return gulp.src([ "dist/jstz.js" ]).pipe(uglify()).pipe(rename("jstz.min.js")).pipe(header("/* jstz.min.js Version: " + pkg.version + " Build date: " + buildTime() + " */\n")).pipe(gulp.dest("dist"));
}), gulp.task("build", [ "uglify" ], function() {
    return del([ "dist/jstz.co*.js" ]);
}), gulp.task("watch", function() {
    gulp.watch(paths.scripts, [ "build" ]);
}), gulp.task("default", [ "watch", "build" ]);
