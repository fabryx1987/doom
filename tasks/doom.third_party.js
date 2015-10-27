// ---------------------------------------------
// @module doom.third_party
// ---------------------------------------------

var doom = process.doom;
var config = require('../lib/config');
var core = require('../lib/core');
var errors = require('../lib/errors');
var $ = require('../lib/plugins');

// Methods
// ---------------------------------------------

var delete_third_party = function (target, type) {
    core.delete_files(target, type);
};

var delete_third_party_styles = function () {
    $.gulp.task('delete:third_party_styles', function () {
        core.wraith_manager(function () {
            delete_third_party(doom.third_party.name, '.css');
        });
    });
};

var delete_third_party_scripts = function () {
    $.gulp.task('delete:third_party_scripts', function () {
        core.wraith_manager(function () {
            delete_third_party(doom.third_party.name, '.js');
        });
    });
};

var create_third_party_styles = function () {
    $.gulp.task('create:third_party_styles', function () {
        core.wraith_manager(function () {
            return $.gulp.src(config.static + doom.third_party.static + '/**/*.css')
                .pipe($.concat(doom.third_party.name + '.css'))
                .pipe($.minify())
                .pipe($.gulp.dest(config.static + doom.dist))
                .on('error', errors)
                .pipe($.size({showFiles: true}));
        });
    });
};

var create_third_party_scripts = function () {
    $.gulp.task('create:third_party_scripts', function () {
        core.wraith_manager(function () {
            return $.gulp.src(config.static + doom.third_party.static + '/**/*.js')
                .pipe($.concat(doom.third_party.name + '.css'))
                .pipe($.uglify({mangle: true}))
                .pipe($.gulp.dest(config.static + doom.dist))
                .on('error', errors)
                .pipe($.size({showFiles: true}));
        });
    });
};

// Module API
// ---------------------------------------------

module.exports = {
    delete_third_party_styles: delete_third_party_styles,
    delete_third_party_scripts: delete_third_party_scripts,
    create_third_party: create_third_party,
    create_third_party_styles: create_third_party_styles,
    create_third_party_scripts: create_third_party_scripts
};