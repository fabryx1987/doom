// ---------------------------------------------
// @doom-tasks -- init
// ---------------------------------------------

var doom = process.doom;
var config = require('./lib/config');
var core = require('./lib/core');
var errors = require('./lib/errors');
var $ = require('./lib/plugins');

// Methods
// ---------------------------------------------

var task_listing = function () {
    $.gulp.task('ls', $.task_listing);
};

var init = function () {
    $.gulp.task('default', ['ls'], function () {

        console.log(' ');
        console.log($.colors.gray('Wraiths'));
        console.log($.colors.gray('------------------------------'));

        for (var i = 0; i < Object.keys(process.wraith.paths).length; i++) {

            var wraith = Object.keys(process.wraith.paths)[i];
            console.log('    ' + $.colors.magenta('--wraith:' + wraith));
        }

        console.log(' ');
        console.log($.colors.gray('Contexts'));
        console.log($.colors.gray('------------------------------'));

        for (var i = 0; i < Object.keys(process.wraith.context).length; i++) {

            var context = Object.keys(process.wraith.context)[i];
            console.log('    ' + $.colors.yellow('--context:' + context));
        }

        console.log(' ');
    });
};

var delete_dist = function () {
    $.gulp.task('delete:dist', function () {
        core.wraith_manager(function () {
            $.del(config.static + doom.dist);
        });
    });
};

var flush_cache_npm = function () {
    $.gulp.task('flush:cache_npm', function () {
        $.run('npm cache clean').exec();
    });
};

var flush_cache_bower = function () {
    $.gulp.task('flush:cache_bower', function () {
        $.run('bower cache clean && bower prune').exec();
    });
};

// Module Api
// ---------------------------------------------

module.exports = {
    'init': init(),
    'task_listing': task_listing(),
    'delete_dist': delete_dist(),
    'flush_cache_npm': flush_cache_npm(),
    'flush_cache_bower': flush_cache_bower()
};