// ---------------------------------------------
// @module doom.scripts
// ---------------------------------------------

var doom = process.doom;
var config = require('../lib/config');
var core = require('../lib/core');
var errors = require('../lib/errors');
var $ = require('../lib/plugins');

// Functions
// ---------------------------------------------

var delete_scripts = function (target, type) {
    core.delete_files(target, type);
};

var create_scripts = function (type) {
    return $.browserify({
        entries: [config.static + type.scripts + '/' + type.name + '.js'],
        debug: !process.prod
    })
    .bundle()
    .on('error', errors)
    .pipe($.source(doom.app.name + '.js'))
    .pipe($.streamify($.gulp_if(process.prod || $.argv.prod, $.uglify({mangle: true}))))
    .pipe($.gulp.dest(config.static + doom.dist))
    .pipe($.streamify($.size({showFiles: true})))
    .pipe($.gulp_if(!process.prod || !$.argv.prod, $.livereload()));
};

module.exports = function () {

    // Tasks
    // ---------------------------------------------

    $.gulp.task('delete:scripts_app', function () {
        core.wraith_manager(function () {
            delete_scripts(doom.app.name, '.{js,js.map}');
        });
    });

    $.gulp.task('create:scripts_app', function () {
        core.wraith_manager(function () {
            create_scripts(doom.app);
        });
    });
};