// ---------------------------------------------
// @doom-tasks -- init
// ---------------------------------------------

var doom = process.doom;
var config = require('./lib/config');
var core = require('./lib/core');
var errors = require('./lib/errors');
var $ = require('./lib/plugins');

module.exports = function () {

    // Tasks
    // ---------------------------------------------

    $.gulp.task('default', $.task_listing);

    $.gulp.task('delete:dist', function () {
        core.wraith_manager(function () {
            $.del(config.static + doom.dist);
        });
    });

    $.gulp.task('flush:cache_npm', function () {
        $.run('npm cache clean').exec();
    });

    $.gulp.task('flush:cache_bower', function () {
        $.run('bower cache clean && bower prune').exec();
    });
};