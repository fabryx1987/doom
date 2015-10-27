// ---------------------------------------------
// @module doom.mail
// ---------------------------------------------

var doom = process.doom;
var config = require('../lib/config');
var utils = require('../lib/utils');
var errors = require('../lib/errors');
var $ = require('../lib/plugins');

// Functions
// ---------------------------------------------

var delete_mail_files = function (target, type) {
    utils.set_wraith(utils.which_wraith);
    utils.delete_files(target, type);
};

module.exports = function () {

    // Tasks
    // ---------------------------------------------

    $.gulp.task('delete:mail_templates', function () {
        delete_mail_files(doom.mail.templates.inlined);
    });

    $.gulp.task('delete:mail_styles', function () {
        delete_mail_files(doom.mail.styles, doom.mail.dist);
    });

    $.gulp.task('mail:styles', function () {
        utils.set_wraith(utils.which_wraith);
        return $.gulp.src(config.static + doom.mail.styles)
            .pipe($.changed(config.static + doom.mail.root + doom.mail.dist))
            .pipe($.globbing({extensions: ['.scss', '.sass']}))
            .pipe($.sass({
                sourceMap: doom.dist,
                includePaths: doom.bower.include_paths,
                indentedSyntax: true,
                precision: 10,
                outputStyle: 'expanded',
                sourceMapContents: true
            }))
            .on('error', errors)
            .pipe($.gulp.dest(config.static + doom.mail.root + doom.mail.dist))
            .pipe($.gulp_if(!process.prod || !$.argv.prod, $.browser_sync.reload({stream: true})))
            .pipe($.size({showFiles: true}))
            .pipe($.gulp_if(!process.prod || !$.argv.prod, $.livereload()));
    });

    $.gulp.task('mail:styles_inliner', function () {
        utils.set_wraith(utils.which_wraith);
        return $.gulp.src(config.static + doom.mail.templates.src)
            .pipe($.inject(
                $.gulp.src(config.static + doom.mail.root + doom.mail.dist + '/base.css', {read: false}), {
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
            .pipe($.gulp.dest(config.static + doom.mail.templates.inlined))
            .pipe($.size({showFiles: true}));
    });

    $.gulp.task('mail:styles_inject', function () {
        utils.set_wraith(utils.which_wraith);
        return $.gulp.src(config.static + doom.mail.templates.inlined + '/_extend/base.html')
            .pipe($.inject(
                $.gulp.src(config.static + doom.mail.root + doom.mail.dist + '/responsive.css', {read: true}), {
                    relative: true,
                    starttag: '<!-- inject:responsive:{{ext}} -->',
                    transform: function (filePath, file) {
                        return "<style>" + file.contents.toString('utf8') + "</style>";
                    }
                }
            ))
            .pipe($.gulp.dest(config.static + doom.mail.templates.inlined + '/_extend'))
            .pipe($.size({showFiles: true}));
    });

    $.gulp.task('mail:styles_convert', function () {
        utils.set_wraith(utils.which_wraith);
        return $.gulp.src(config.static + doom.mail.templates.inlined + '/_extend/base.html')
            .pipe($.debug())
            .pipe($.replace(/<link.*?href="(.+?\.css)"[^>]*>/g, function (s, filename) {
                var style = $.fs.readFileSync(filename, 'utf8');
                return '<style>\n' + style + '\n</style>';
            }))
            .pipe($.gulp.dest(config.static + doom.mail.templates.inlined + '/_extend'))
            .pipe($.size({showFiles: true}));
    });

    $.gulp.task('mail', ['delete:mail_styles', 'delete:mail_templates'], function () {
        $.run_sequence('mail:styles', ['mail:styles_inliner'], ['mail:styles_inject'], ['mail:styles_convert']);
    });
};