// ---------------------------------------------
// @module doom.serve
// ---------------------------------------------

var doom = process.doom;
var config = require('../lib/config');
var utils = require('../lib/utils');
var errors = require('../lib/errors');
var $ = require('../lib/plugins');

module.exports = function () {

    $.gulp.task('serve:browser-sync', function () {
        $.browser_sync.init({
            proxy: doom.proxy
        });
    });

    $.gulp.task('serve:html', ['set:wraith'], function () {
        return $.gulp.src(config.static + doom.templates)
            .pipe($.livereload());
    });
};