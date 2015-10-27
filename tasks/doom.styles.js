// ---------------------------------------------
// @module doom.styles
// ---------------------------------------------

var doom = process.doom;
var config = require('../lib/config');
var core = require('../lib/core');
var errors = require('../lib/errors');
var $ = require('../lib/plugins');

// Functions
// ---------------------------------------------

var delete_styles = function (target, type) {
    core.delete_files(target, type);
};

var create_styles = function (type) {
    return $.gulp.src(config.static + type.styles + '/' + type.name + '.{sass,scss}')
        .pipe($.changed(config.static + doom.dist))
        .pipe($.gulp_if(!process.prod || !$.argv.prod, $.sourcemaps.init()))
        .pipe($.globbing({extensions: ['.scss', '.sass']}))
        .pipe($.sass({
            sourceMap: config.static + doom.dist,
            includePaths: doom.bower.include_paths, // @TODO when set doom.bower.root here sass doesn't work ??
            indentedSyntax: true,
            precision: 10,
            outputStyle: 'expanded',
            sourceMapContents: true
        }))
        .on('error', errors)
        .pipe($.rename({basename: type.name}))
        .pipe($.autoprefixer({
            browsers: ['last 3 versions'],
            cascade: false
        }))
        .pipe($.gulp_if(!process.prod || !$.argv.prod, $.sourcemaps.write({includeContent: true})))
        .pipe($.streamify($.gulp_if(process.prod || $.argv.prod, $.minify({sourceMap: false}))))
        .pipe($.gulp.dest(config.static + doom.dist))
        .pipe($.gulp_if(!process.prod || !$.argv.prod, $.browser_sync.reload({stream: true})))
        .pipe($.size({showFiles: true}))
        .pipe($.gulp_if(!process.prod || !$.argv.prod, $.livereload()));
};

module.exports = function () {

    // Tasks
    // ---------------------------------------------

    $.gulp.task('delete:styles_app', function () {
        core.wraith_manager(function () {
            delete_styles(doom.app.name, '.{css,css.map}')
        });
    });

    $.gulp.task('delete:styles_gui', function () {
        core.wraith_manager(function () {
            delete_styles(doom.gui.name, '.{css,css.map}');
        });
    });

    $.gulp.task('create:styles_app', function () {
        core.wraith_manager(function () {
            create_styles(doom.app);
        });
    });

    $.gulp.task('create:styles_gui', function () {
        core.wraith_manager(function () {
            create_styles(doom.gui)
        });
    });
};