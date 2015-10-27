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
    $.gulp.task('default', $.task_listing);
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
    task_listing: task_listing(),
    delete_dist: delete_dist(),
    flush_cache_npm: flush_cache_npm(),
    flush_cache_bower: flush_cache_bower()
};