
function open_user_nav() {

    APP.global.body.remove_class_prefix('pull-').remove_class_prefix('push-').push_to('bottom');
    APP.global.user_nav_dropdown.remove_class_prefix('pull-').remove_class_prefix('push-').push_to('bottom');
    APP.global.header_top.addClass('user-nav-open');
    APP.global.overlay.show();
}

function close_user_nav() {

    APP.global.body.remove_class_prefix('pull-').remove_class_prefix('push-').pull_to('top');
    APP.global.user_nav_dropdown.remove_class_prefix('pull-').remove_class_prefix('push-').pull_to('top');
    APP.global.header_top.removeClass('user-nav-open');
    APP.global.overlay.hide();
}

function handle_user_nav(is_mobile) {

    if (is_mobile === true) {

        APP.global.user_nav_dropdown.addClass('to-push');
    }
    else {
        APP.global.user_nav_dropdown.removeClass('to-push');
        APP.global.user_nav_trigger.removeClass('active');
        close_user_nav();
    }
}

module.exports = {

    open_user_nav: open_user_nav,
    close_user_nav: close_user_nav,
    handle_user_nav: handle_user_nav
};