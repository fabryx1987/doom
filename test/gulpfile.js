/*
 gulpfile.js
 ===========
 Rather than manage one giant configuration file responsible
 for creating multiple tasks, each task has been broken out into
 its own file in ./tasks. Any files in that directory get
 automatically required below.
 To add a new task, simply add a new task file that directory.
 ./tasks/*.js specifies the default set of tasks to run
 when you run gulp.
 */


require('./doomfile')();
require('doom.core')();
require('doom.install')();
require('doom.bower')();
require('doom.styles')();
require('doom.scripts')();
require('doom.images')();
require('doom.fonts')();
require('doom.third_party')();
require('doom.mail')();
require('doom.serve')();