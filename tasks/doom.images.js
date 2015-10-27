// ---------------------------------------------
// @module doom.images
// ---------------------------------------------

var doom = process.doom;
var config = require('../lib/config');
var core = require('../lib/core');
var errors = require('../lib/errors');
var $ = require('../lib/plugins');

// Methods
// ---------------------------------------------

var delete_images = function (target, type) {
    core.delete_files(target, type);
};

var create_images = function (target, type) {
    return $.gulp.src(config.static + type.images + '/**/*.{jpg,jpeg,png,gif,svg,ico}')
        .pipe($.gulp.dest(config.static + target))
        .pipe($.size({showFiles: true}));
};

var delete_images_app = function () {
    $.gulp.task('delete:images_app', function () {
        core.wraith_manager(function () {
            delete_images('/*', '.{gif,jpg,png,svg}');
        });
    });
};

var create_images_app = function () {
    $.gulp.task('create:images_app', function () {
        core.wraith_manager(function () {
            create_images(doom.dist, doom.app);
        });
    });
};

// Module Api
// ---------------------------------------------

module.exports = {
    delete_images_app: delete_images_app(),
    create_images_app: create_images_app()
};