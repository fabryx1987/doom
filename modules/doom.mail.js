// ---------------------------------------------
// @module doom.mail
// ---------------------------------------------

var doom = process.doom;
var config = require('../lib/config');
var core = require('../lib/core');
var errors = require('../lib/errors');
var $ = require('../lib/plugins');

// Methods
// ---------------------------------------------

var delete_mail_templates = function () {
    $.gulp.task('mail:delete_templates', function () {
        $.del(doom.mail.root + doom.mail.templates.inlined);
    });
};

var delete_mail_styles = function () {
    $.gulp.task('mail:delete_styles', function () {
        core.delete_files(doom.mail.root + doom.mail.styles, doom.mail.dist);
    });
};

var mail_styles = function () {
    $.gulp.task('mail:styles', function () {
        return $.gulp.src(doom.mail.root + doom.mail.styles + '/*.{sass,scss}')
            .pipe($.changed(doom.mail.root + doom.mail.dist))
            .pipe($.globbing({extensions: ['.scss', '.sass']}))
            .pipe($.sass({
                sourceMap: doom.mail.dist,
                includePaths: doom.bower.include_paths,
                indentedSyntax: true,
                precision: 10,
                outputStyle: 'expanded',
                sourceMapContents: true
            }))
            .on('error', errors)
            .pipe($.gulp.dest(doom.mail.root + doom.mail.dist))
            .pipe($.gulp_if(!process.prod || !$.argv.prod, $.browser_sync.reload({stream: true})))
            .pipe($.size({showFiles: true}))
            .pipe($.gulp_if(!process.prod || !$.argv.prod, $.livereload()));
    });
};

var mail_styles_inliner = function () {
    $.gulp.task('mail:styles_inliner', function () {

        return $.gulp.src(doom.mail.root + doom.mail.templates.origin + '/**/**/*.html')
            .pipe($.inject(
                $.gulp.src(doom.mail.root + doom.mail.dist + '/base.css', {read: false}), {
                    relative: true,
                    starttag: '<!-- inject:base:{{ext}} -->'
                }
            ))
            .pipe($.inline_css({
                applyStyleTags: true,
                applyLinkTags: true,
                removeStyleTags: true,
                removeLinkTags: true
            }))
            .pipe($.gulp.dest(doom.mail.root + doom.mail.templates.inlined))
            .pipe($.size({showFiles: true}));
    });
}

var mail_styles_inject = function () {
    $.gulp.task('mail:styles_inject', function () {
        return $.gulp.src(doom.mail.root + doom.mail.templates.inlined + '/_extend/base.html')
            .pipe($.inject(
                $.gulp.src(doom.mail.root + doom.mail.dist + '/responsive.css', {read: true}), {
                    relative: true,
                    starttag: '<!-- inject:responsive:{{ext}} -->',
                    transform: function (filePath, file) {
                        return "<style>" + file.contents.toString('utf8') + "</style>";
                    }
                }
            ))
            .pipe($.gulp.dest(doom.mail.root + doom.mail.templates.inlined + '/_extend'))
            .pipe($.size({showFiles: true}));
    });
};

var mail_styles_convert = function () {
    $.gulp.task('mail:styles_convert', function () {
        return $.gulp.src(doom.mail.root + doom.mail.templates.inlined + '/_extend/base.html')
            .pipe($.debug())
            .pipe($.replace(/<link.*?href="(.+?\.css)"[^>]*>/g, function (s, filename) {
                var style = $.fs.readFileSync(filename, 'utf8');
                return '<style>\n' + style + '\n</style>';
            }))
            .pipe($.gulp.dest(doom.mail.root + doom.mail.templates.inlined + '/_extend'))
            .pipe($.size({showFiles: true}));
    });
}

var mail = function () {
    $.gulp.task('mail', ['mail:delete_styles', 'mail:delete_templates'], function () {
        $.run_sequence('mail:styles', ['mail:styles_inliner'], ['mail:styles_inject'], ['mail:styles_convert']);
    });
};

// Module API
// ---------------------------------------------

module.exports = {
    'delete_mail_templates': delete_mail_templates(),
    'delete_mail_styles': delete_mail_styles(),
    'mail_styles': mail_styles(),
    'mail_styles_inliner': mail_styles_inliner(),
    'mail_styles_inject': mail_styles_inject(),
    'mail_styles_convert': mail_styles_convert(),
    'mail': mail()
};