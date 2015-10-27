// ---------------------------------------------
// @doomfile settings
// ---------------------------------------------

// dependecies
var gulp = require('gulp');
var run_sequence = require('run-sequence');

process.wraith = {
    paths: {
        halo: '/desktop/halo',
        quake: '/desktop/quake',
        rampage: '/desktop/rampage',
        jago: '/desktop/jago',
        riptor: '/desktop/riptor',
        cinder: '/desktop/cinder',
        glacius: '/desktop/glacius',
        sabrewolf: '/desktop/sabrewolf',
        eydol: '/desktop/eydol',
        orchid: '/desktop/orchid',
        fulgor: '/pincopalla/fulgor'
    },
    active: ''
};

process.doom = {
    gulp: gulp,
    static: './public',
    templates: './view/',
    dist: '/_dist',
    proxy: 'local2-preventivi.it',
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
        root: './bower_components',
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
}

module.exports = function () {

    gulp.task('dev', ['clean:dist'], function () {
        process.prod = false;
        run_sequence(['styles:app', 'styles:gui', 'serve:halo']);
    });

    gulp.task('prod', ['clean:dist'], function () {
        process.prod = true;
        run_sequence('vendor', ['styles:app', 'styles:gui']);
    });

    gulp.task('serve', function () {
        gulp.watch(serve_paths.styles, {interval: 900}, ['clean:app_styles', 'clean:gui_styles', 'styles:app', 'styles:gui']);
        gulp.watch(serve_paths.scripts, {interval: 900}, ['clean:scripts', 'scripts:app']);
        gulp.watch(serve_paths.markup, {interval: 900}, ['serve:html']);
        gulp.watch(serve_paths.bower, {interval: 900}, ['clean:vendor_dist', 'vendor']);
    });
};