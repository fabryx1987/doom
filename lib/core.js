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
    // start @context_manager
    var config_static = config.static;

    for (k = 0; k < Object.keys(wraith.context).length; k++) {

        var context_path = Object.keys(wraith.context)[k];
        var wraith_context = wraith.context[context_path];
        config.static = config_static + wraith_context;
        config.templates = config_static + wraith_context;

        console.log(config.static);

        task_sequence();
    }
};

var wraith_manager = function (task_sequence) {
    process.wraith.active = {};
    var wraith = process.wraith;

    if ($.argv['all'] === true) {

        wraith.active = wraith.paths;

        for (i = 0; i < Object.keys(wraith.active).length; i++) {
            var path = Object.keys(wraith.active)[i];
            var wraith_active = wraith.active[path];
            config.static = doom.static + wraith_active;
            config.templates = doom.templates + wraith_active;

            context_manager(wraith, task_sequence);
        }
        return;
    }
    else {

        for (i = 0; i < Object.keys(wraith.paths).length; i++) {

            var path = Object.keys(wraith.paths)[i];

            if ($.argv[path] === true) {
                var wraith_active = wraith.active[path] = wraith.paths[path];
                config.static = doom.static + wraith_active;
                config.templates = doom.templates + wraith_active;

                context_manager(wraith, task_sequence);

                return;
            }
        }
    }
};

module.exports = {
    'delete_files': delete_files,
    'delete_path': delete_path,
    'wraith_manager': wraith_manager
};