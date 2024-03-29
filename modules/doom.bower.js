// ---------------------------------------------
// @module doom.bower
// ---------------------------------------------

var doom = process.doom;
var config = require('../lib/config');
var core = require('../lib/core');
var errors = require('../lib/errors');
var $ = require('../lib/plugins');

// Methods
// ---------------------------------------------

var bower_manager = function () {
    core.wraith_manager(function () {
        $.gulp.task('bower:manager', function () {

            $.bower.commands.list().on('end', function (results) {

                var bower_components = {
                    main: {},
                    no_main: {}
                };

                var dependencies = results.dependencies;

                for (var i = 0; i < Object.keys(dependencies).length; i++) {
                    var key = Object.keys(dependencies)[i];
                    var value = dependencies[key];
                    var canonical = value.canonicalDir;
                    var pkg = value.pkgMeta;
                    var main = pkg.main;

                    if (main === undefined) {
                        bower_components.no_main[key] = key;
                    }
                    else {
                        bower_components.main[key] = canonical + '/' + main;
                    }

                    // dont't work -- only first file is written
                    return $.gulp.src(bower_components.main[key])
                        .pipe($.gulp.dest(config.static + '/vendor/' + key))
                        .on('error', errors)
                        .pipe($.size({showFiles: true}));

                }

                console.log(bower_components);
            });

            //return $.gulp.src($.path.join(doom.bower.root, '/**/bower.json'))
            //    .pipe();
        });
    })
};

var create_bower_stack = function (vendor_src, vendor_files) {

    var vendor_stack = [];
    for (var i = 0; i < vendor_src.length; i++) {
        vendor_stack.push(config.static + doom.core + doom.bower.static + vendor_src[i] + vendor_files);
    }
    return vendor_stack;
};

var delete_bower_files = function (target, type) {
    core.delete_files(target, type);
};

var delete_bower_path = function (target) {
    core.delete_path(target);
};

var delete_bower_styles = function () {
    $.gulp.task('delete:bower_styles', function () {
        delete_bower_files(doom.bower.name, '.css');
    });
};

var delete_bower_scripts = function () {
    $.gulp.task('delete:bower_scripts', function () {
        delete_bower_files(doom.bower.name, '.js');
    });
};

var delete_bower_fonts = function () {
    $.gulp.task('delete:bower_fonts', function () {
        delete_bower_files('/*', '.{ttf,eot,svg,woff,woff2}');
    });
};

var delete_bower_images = function () {
    $.gulp.task('delete:bower_images', function () {
        delete_bower_files('/*', '.{gif,png,jpg,jpeg,cur}');
    });
};

var delete_bower_install = function () {
    $.gulp.task('delete:bower_install', function () {
        delete_bower_path(config.static + doom.bower.static);
    });
};

var create_bower_install = function () {
    $.gulp.task('create:bower_install', function () {
        $.run('bower-installer').exec();
    });
};

var create_bower_styles = function () {
    $.gulp.task('create:bower_styles', function () {
        return $.gulp.src(config.static + doom.core + doom.bower.static + '/**/*.css')
            .pipe($.order(doom.bower.order))
            .pipe($.concat(doom.bower.name + '.css'))
            .pipe($.replace(/([^'"(]*fonts\/|font\/|images\/|img\/)/g, './'))
            .pipe($.minify({
                keepBreaks: false,
                keepSpecialComments: 0,
                shorthandCompacting: true
            }))
            .pipe($.gulp.dest(doom.static + doom.core + doom.dist))
            .on('error', errors)
            .pipe($.size({showFiles: true}));
    });
};

var create_bower_scripts = function () {
    $.gulp.task('create:bower_scripts', function () {
        return $.gulp.src(config.static + doom.core + doom.bower.static + '/**/*.js')
            .pipe($.order(doom.bower.order))
            .pipe($.concat(doom.bower.name + '.js'))
            .pipe($.uglify({mangle: true}))
            .pipe($.gulp.dest(config.static + doom.core + doom.dist))
            .on('error', errors)
            .pipe($.size({showFiles: true}));
    });
};

var create_bower_images = function () {
    $.gulp.task('create:bower_images', function () {
        return $.gulp.src(create_bower_stack(doom.bower.images, '/*.{gif,png,jpg,jpeg,cur}'))
            .pipe($.gulp.dest(config.static + doom.core + doom.dist))
            .on('error', errors)
            .pipe($.size({showFiles: true}));
    });
};

var create_bower_fonts = function () {
    $.gulp.task('create:bower_fonts', function () {
        return $.gulp.src(create_bower_stack(doom.bower.fonts, '/*.{ttf,eot,svg,woff,woff2}'))
            .pipe($.gulp.dest(config.static + doom.core + doom.dist))
            .on('error', errors)
            .pipe($.size({showFiles: true}));
    });
};

var vendor = function () {
    $.gulp.task('vendor', ['delete:bower_install', 'create:bower_install'], function () {
        $.run_sequence(
            ['delete:bower_styles', 'delete:bower_scripts'],
            ['create:bower_styles', 'create:bower_scripts', 'create:bower_fonts', 'create:bower_images']
        );
    });
};

// Module API
// ---------------------------------------------

module.exports = {
    'delete_bower_styles': delete_bower_styles(),
    'delete_bower_scripts': delete_bower_scripts(),
    'delete_bower_fonts': delete_bower_fonts(),
    'delete_bower_images': delete_bower_images(),
    'delete_bower_install': delete_bower_install(),
    'create_bower_install': create_bower_install(),
    'create_bower_styles': create_bower_styles(),
    'create_bower_scripts': create_bower_scripts(),
    'create_bower_images': create_bower_images(),
    'create_bower_fonts': create_bower_fonts(),
    'bower_manager': bower_manager(),
    'vendor': vendor()
};