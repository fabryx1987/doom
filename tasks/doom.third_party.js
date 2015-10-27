// ---------------------------------------------
// @module doom.third_party
// ---------------------------------------------

var doom = process.doom;
var config = require('../lib/config');
var utils = require('../lib/utils');
var errors = require('../lib/errors');
var $ = require('../lib/plugins');

// Functions
// ---------------------------------------------

var delete_third_party = function (target, type) {
    utils.delete_files(target, type);
};

module.exports = function () {

    // Tasks
    // ---------------------------------------------

    $.gulp.task('delete:third_party_styles', ['set:wraith'], function () {
        delete_third_party(doom.third_party.name, '.css');
    });

    $.gulp.task('delete:third_party_scripts', ['set:wraith'], function () {
        delete_third_party(doom.third_party.name, '.js');
    });

    $.gulp.task('create:third_party_styles', ['set:wraith'], function () {
        return $.gulp.src(config.static + doom.third_party.static + '/**/*.css')
            .pipe($.concat(doom.third_party.name + '.css'))
            .pipe($.minify())
            .pipe($.gulp.dest(config.static + doom.dist))
            .on('error', errors)
            .pipe($.size({showFiles: true}));
    });

    $.gulp.task('create:third_party_scripts', ['set:wraith'], function () {
        return $.gulp.src(config.static + doom.third_party.static + '/**/*.js')
            .pipe($.concat(doom.third_party.name + '.js'))
            .pipe($.uglify({mangle: true}))
            .pipe($.gulp.dest(config.static + doom.dist))
            .on('error', errors)
            .pipe($.size({showFiles: true}));
    });
};