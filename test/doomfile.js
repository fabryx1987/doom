// ---------------------------------------------
// @doomfile settings
// ---------------------------------------------

var gulp = require('gulp');
var run_sequence = require('run-sequence');

// process objects
// ---------------------------------------------

var base = process.cwd();

process.wraith = {
    'paths': {
        'halo': '/halo',
        'fulgor': '/fulgor',
        'jago': '/jago'
    },
    'context': {
        'desktop': '/desktop',
        'tablet': '/tablet',
        'phone': '/phone'
    }
};

process.doom = {
    'gulp': gulp,
    'static': base + '/static',
    'templates': './templates',
    'common': '/_common',
    'dist': '/_dist',
    'proxy': 'local.dev:8000',
    'app': {
        'name': 'app',
        'styles': '/styles',
        'scripts': '/scripts',
        'images': '/images',
        'fonts': '/fonts'
    },
    'gui': {
        'name': 'gui',
        'styles': '/styles',
        'images': '/images'
    },
    'mail': {
        'root': base + '/mail_system',
        'dist': '/static/_dist',
        'styles': '/static/styles',
        'templates': {
            'origin': '/templates/origin',
            'inlined': '/templates/inlined'
        }
    },
    'bower': {
        'name': 'vendor',
        'root': './bower_components',
        'static': '/vendor',
        'install': {
            'base': 'static/common/',
            'path': 'vendor',
            'sources': {
                'jquery': [
                    'bower_components/jquery/dist/jquery.min.js'
                ],
                'font-awesome': [
                    'bower_components/font-awesome/css/font-awesome.css',
                    'bower_components/font-awesome/fonts/*.**'
                ],
                'modernizr': [
                    'bower_components/modernizr/modernizr.js'
                ]
            },
            'ignore': [
                'requirejs',
                'gsap',
                'bourbon',
                'neat',
                'sass-mediaqueries'
            ]
        },
        'order': [
            'jquery/*.js',
            'modernizr/*.js',
            '**/*.js'
        ],
        'include_paths': [
            base + '/bower_components/sass-mediaqueries',
            base + '/bower_components/bourbon/app/assets/stylesheets',
            base + '/bower_components/neat/app/assets/stylesheets'
        ],
        'fonts': [
            '/font-awesome'
        ],
        'images': []
    },
    'third_party': {
        'name': 'third_party',
        'static': '/third_party'
    },
    'serve': {
        'styles': '/styles/**/*.{sass,scss}',
        'scripts': '/scripts/**/*.js',
        'markup': '/**/*.{html, phtml}',
        'mail': {
            'templates': '/templates/src/**/*.{html}',
            'styles': '/styles/sass/**/*.{sass,scss}'
        },
        'bower': '/**/*.*',
        'third_party': '/**/*.js'
    }
};

// Methods
// ---------------------------------------------

var dev = function () {
    gulp.task('dev', ['delete:dist'], function () {
        process.prod = false;
        run_sequence(['create:styles_app', 'create:styles_gui']);
    });
};

var prod = function () {
    gulp.task('prod', ['delete:dist'], function () {
        process.prod = true;
        run_sequence(['create:styles_app', 'create:styles_gui']);
    });
};

var serve = function () {
    gulp.task('serve', function () {
        gulp.watch(serve_paths.styles, {interval: 900}, ['create:styles_app', 'create:styles_gui']);
        gulp.watch(serve_paths.scripts, {interval: 900}, ['create:scripts_app']);
        gulp.watch(serve_paths.markup, {interval: 900}, ['serve:html']);
        gulp.watch(serve_paths.bower, {interval: 900}, ['vendor']);
    });
};

// Module API
// ---------------------------------------------

module.exports = {
    'dev': dev(),
    'prod': prod(),
    'serve': serve()
};