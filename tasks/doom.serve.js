// ---------------------------------------------
// @module doom.serve
// ---------------------------------------------

var doom = process.doom;
var config = require('../lib/config');
var core = require('../lib/core');
var errors = require('../lib/errors');
var $ = require('../lib/plugins');

// Methods
// ---------------------------------------------

var serve_browser_sync = function () {
    $.gulp.task('serve:browser-sync', function () {
        $.browser_sync.init({
            proxy: doom.proxy
        });
    });
};

var serve_templates = function () {
    $.gulp.task('serve:html', ['set:wraith'], function () {
        return $.gulp.src(config.static + doom.templates)
            .pipe($.livereload());
    });
};

// Module Api
// ---------------------------------------------

module.exports = {
    serve_browser_sync: serve_browser_sync(),
    serve_templates: serve_templates()
};