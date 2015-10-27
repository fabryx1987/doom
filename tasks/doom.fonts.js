// ---------------------------------------------
// @module doom.fonts
// ---------------------------------------------

var doom = process.doom;
var config = require('../lib/config');
var core = require('../lib/core');
var errors = require('../lib/errors');
var $ = require('../lib/plugins');

// Methods
// ---------------------------------------------

var delete_fonts = function (target, type) {
    core.delete_files(target, type);
};

var create_fonts = function (target, type) {
    return $.gulp.src(config.static + type.fonts + '/**/*.{ttf,eot,woff,woff2}')
        .pipe($.gulp.dest(config.static + target))
        .pipe($.size({showFiles: true}));
};

var delete_fonts_app = function () {
    $.gulp.task('delete:fonts_app', function () {
        core.wraith_manager(function () {
            delete_fonts('/*', '.{ttf,eot,woff,woff2}');
        });
    });
};

var create_fonts_app = function () {
    $.gulp.task('create:fonts_app', function () {
        core.wraith_manager(function () {
            create_fonts(doom.dist, doom.app);
        });
    });
};

// Module Api
// ---------------------------------------------

module.exports = {
    delete_fonts_app: delete_fonts_app(),
    create_fonts_app: create_fonts_app()
};