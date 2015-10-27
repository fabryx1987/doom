// ---------------------------------------------
// @doomfile settings
// ---------------------------------------------

// dependecies
var gulp = require('gulp');
var run_sequence = require('run-sequence');

process.wraith = {
    paths: {
        halo: '/halo',
        fulgor: '/fulgor'
    }
};

process.doom = {
    gulp: gulp,
    static: './static',
    templates: './templates',
    common: '/common',
    dist: '/_dist',
    proxy: 'local.dev:8000',
    app: {
        name: 'app',
        styles: '/styles',
        scripts: '/scripts',
        images: '/images',
        fonts: '/fonts'
    },
    gui: {
        name: 'gui',
        styles: '/styles',
        images: '/images'
    },
    mail: {
        dist: '/_dist',
        root: '/mail_system',
        styles: '/styles',
        templates: {
            src: '/templates/src',
            inlined: '/templates/inlined'
        }
    },
    bower: {
        name: 'vendor',
        root: '/bower_components',
        static: '/vendor',
        order: [
            'jquery/*.js',
            'modernizr/*.js',
            '**/*.js'
        ],
        include_paths: [
            './bower_components/sass-mediaqueries',
            './bower_components/bourbon/app/assets/stylesheets',
            './bower_components/neat/app/assets/stylesheets'
        ],
        fonts: [
            '/font-awesome'
        ],
        images: []
    },
    third_party: {
        name: 'third_party',
        static: '/third_party'
    },
    serve: {
        styles: '/styles/**/*.{sass,scss}',
        scripts: '/scripts/**/*.js',
        markup: '/**/*.{html, phtml}',
        mail: {
            templates: '/templates/src/**/*.{html}',
            styles: '/styles/sass/**/*.{sass,scss}'
        },
        bower: '/**/*.*',
        third_party: '/**/*.js'
    }
};

module.exports = function () {

    gulp.task('dev', ['delete:dist'], function () {
        process.prod = false;
        run_sequence(['create:styles_app', 'create:styles_gui']);
    });

    gulp.task('prod', ['delete:dist'], function () {
        process.prod = true;
        run_sequence(['create:styles_app', 'create:styles_gui']);
    });

    gulp.task('serve', function () {
        gulp.watch(serve_paths.styles, {interval: 900}, ['create:styles_app', 'create:styles_gui']);
        gulp.watch(serve_paths.scripts, {interval: 900}, ['create:scripts_app']);
        gulp.watch(serve_paths.markup, {interval: 900}, ['serve:html']);
        gulp.watch(serve_paths.bower, {interval: 900}, ['vendor']);
    });
};