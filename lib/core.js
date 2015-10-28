var doom = process.doom;
var config = require('./config');
var $ = require('./plugins');

var delete_files = function (target, type) {
    $.del(config.static + doom.dist + '/**' + target + type);
};

var delete_path = function (target) {
    $.del(config.static + target);
};

var context_manager = function (wraith, task_sequence) {

    // @create or @delete static into wraith context
    // ---------------------------------------------

    var static = config.static;
    var templates = config.templates;

    for (var k = 0; k < Object.keys(wraith.context).length; k++) {

        var context_path = Object.keys(wraith.context)[k];
        var context = wraith.context[context_path];

        config.static = static + context;
        config.templates = templates + context;

        task_sequence();
    }
};

var wraith_manager = function (task_sequence) {

    process.wraith.active = {};
    var wraith = process.wraith;

    if ($.argv['app:all'] === true) {

        // @create or @delete static into all wraiths
        // ---------------------------------------------

        wraith.active = wraith.paths;

        for (var i = 0; i < Object.keys(wraith.active).length; i++) {

            var path = Object.keys(wraith.active)[i];
            var wraith_active = wraith.active[path];

            config.static = doom.static + wraith_active;
            config.templates = doom.templates + wraith_active;

            console.log(config.static);

            context_manager(wraith, task_sequence);
        }

        return;
    }
    else {

        var is_wraith = false;

        for (var i = 0; i < Object.keys(wraith.paths).length; i++) {

            var path = Object.keys(wraith.paths)[i];

            if ($.argv['app:' + path] === true) {

                // @create or @delete static into specific wraith
                // ---------------------------------------------

                var wraith_active = wraith.active[path] = wraith.paths[path];

                config.static = doom.static + wraith_active;
                config.templates = doom.templates + wraith_active;

                context_manager(wraith, task_sequence);

                is_wraith = true;

                return;
            }
        }

        if (is_wraith === false || $.argv['app:common']) {

            // @create or @delete static into common
            // ---------------------------------------------

            config.static = doom.static + doom.common
            config.templates = doom.templates + doom.common

            task_sequence();
        }
    }
};

module.exports = {
    'delete_files': delete_files,
    'delete_path': delete_path,
    'wraith_manager': wraith_manager
};