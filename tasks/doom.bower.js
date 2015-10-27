// ---------------------------------------------
// @module doom.bower
// ---------------------------------------------

var doom = process.doom;
var config = require('../lib/config');
var core = require('../lib/core');
var errors = require('../lib/errors');
var $ = require('../lib/plugins');

// Functions
// ---------------------------------------------

var create_bower_stack = function (vendor_src, vendor_files) {

    var vendor_stack = [];
    for (i = 0; i < vendor_src.length; i++) {
        vendor_stack.push(config.static + doom.common + doom.bower.static + vendor_src[i] + vendor_files);
    }
    return vendor_stack;
};

var delete_bower_files = function (target, type) {
    core.delete_files(target, type);
};

var delete_bower_path = function (target) {
    core.delete_path(target);
};

var create_bower_styles = function (target, type) {
    return $.gulp.src(config.static + doom.common + type.static + '/**/*.css')
        .pipe($.order(doom.bower.order))
        .pipe($.concat(doom.bower.name + '.css'))
        .pipe($.replace(/([^'"(]*fonts\/|font\/|images\/|img\/)/g, './'))
        .pipe($.minify({
            keepBreaks: false,
            keepSpecialComments: 0,
            shorthandCompacting: true
        }))
        .pipe($.gulp.dest(doom.static + doom.common + target))
        .on('error', errors)
        .pipe($.size({showFiles: true}));
};

var create_bower_scripts = function (target, type) {
    return $.gulp.src(config.static + doom.common + type.static + '/**/*.js')
        .pipe($.order(doom.bower.order))
        .pipe($.concat(doom.bower.name + '.js'))
        .pipe($.uglify({mangle: true}))
        .pipe($.gulp.dest(config.static + doom.common + target))
        .on('error', errors)
        .pipe($.size({showFiles: true}));
};

var create_bower_images = function (target, type) {
    return $.gulp.src(create_bower_stack(type.images, '/*.{gif,png,jpg,jpeg,cur}'))
        .pipe($.gulp.dest(config.static + doom.common + target))
        .on('error', errors)
        .pipe($.size({showFiles: true}));
};

var create_bower_fonts = function (target, type) {
    return $.gulp.src(create_bower_stack(type.fonts, '/*.{ttf,eot,svg,woff,woff2}'))
        .pipe($.gulp.dest(config.static + doom.common + target))
        .on('error', errors)
        .pipe($.size({showFiles: true}));
};

module.exports = function () {

    // Tasks
    // ---------------------------------------------

    $.gulp.task('delete:bower_styles', function () {
        delete_bower_files(doom.bower.name, '.css');
    });

    $.gulp.task('delete:bower_scripts', function () {
        delete_bower_files(doom.bower.name, '.js');
    });

    $.gulp.task('delete:bower_images', function () {
        delete_bower_files('/*', '.{gif,png,jpg,jpeg,cur}');
    });

    $.gulp.task('delete:bower_fonts', function () {
        delete_bower_files('/*', '.{ttf,eot,svg,woff,woff2}');
    });

    $.gulp.task('delete:bower_install', function () {
        delete_bower_path(config.static + doom.bower.static);
    });

    $.gulp.task('create:bower_install', function () {
        $.run('bower-installer').exec();
    });

    $.gulp.task('create:bower_styles', function () {
        create_bower_styles(doom.dist, doom.bower);
    });

    $.gulp.task('create:bower_scripts', function () {
        create_bower_scripts(doom.dist, doom.bower);
    });

    $.gulp.task('create:bower_images', function () {
        create_bower_images(doom.dist, doom.bower);
    });

    $.gulp.task('create:bower_fonts', function () {
        create_bower_fonts(doom.dist, doom.bower);
    });

    $.gulp.task('vendor', ['delete:bower_install'], function () {
        $.run_sequence(
            ['create:bower_install'],
            ['delete:bower_styles', 'delete:bower_scripts'],
            ['create:bower_styles', 'create:bower_scripts', 'create:bower_fonts', 'create:bower_images']
        );
    });
};