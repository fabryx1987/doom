var doom = process.doom;
var config = require('./config');
var $ = require('./plugins');

var delete_files = function (target, type) {
    $.del(config.static + doom.dist + '/**' + target + type);
};

var delete_path = function (target) {
    $.del(config.static + target);
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
            task_sequence();
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
                task_sequence();
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