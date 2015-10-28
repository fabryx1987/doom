// ---------------------------------------------
// @module doom.styles
// ---------------------------------------------

var doom = process.doom;
var config = require('../lib/config');
var core = require('../lib/core');
var errors = require('../lib/errors');
var $ = require('../lib/plugins');

// Methods
// ---------------------------------------------

var delete_styles_app = function () {
    $.gulp.task('delete:styles_app', function () {
        core.wraith_manager(function () {
            core.delete_files(doom.app.name, '.{css,css.map}');
        });
    });
};

var delete_styles_gui = function () {
    $.gulp.task('delete:styles_gui', function () {
        core.wraith_manager(function () {
            core.delete_files(doom.gui.name, '.{css,css.map}');
        });
    });
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

var create_styles_app = function () {
    $.gulp.task('create:styles_app', function () {
        core.wraith_manager(function () {
            create_styles(doom.app);
        });
    });
};

var create_styles_gui = function () {
    $.gulp.task('create:styles_gui', function () {
        core.wraith_manager(function () {
            create_styles(doom.gui)
        });
    });
}

// Module API
// ---------------------------------------------

module.exports = {
    'delete_styles_app': delete_styles_app(),
    'delete_styles_gui': delete_styles_gui(),
    'create_styles_app': create_styles_app(),
    'create_styles_gui': create_styles_gui()
};