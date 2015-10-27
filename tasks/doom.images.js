// ---------------------------------------------
// @module doom.images
// ---------------------------------------------

var doom = process.doom;
var config = require('../lib/config');
var core = require('../lib/core');
var errors = require('../lib/errors');
var $ = require('../lib/plugins');

// Functions
// ---------------------------------------------

var delete_images = function (target, type) {
    core.delete_files(target, type);
};

var create_images = function (target, type) {
    return $.gulp.src(config.static + type.images + '/**/*.{jpg,jpeg,png,gif,svg,ico}')
        .pipe($.gulp.dest(config.static + target))
        .pipe($.size({showFiles: true}));
};

module.exports = function () {

    // Tasks
    // ---------------------------------------------

    $.gulp.task('delete:images_app', function () {
        core.wraith_manager(function () {
            delete_images('/*','.{gif,jpg,png,svg}');
        });
    });

    $.gulp.task('create:images_app', function () {
        core.wraith_manager(function () {
            create_images(doom.dist, doom.app);
        });
    });
};