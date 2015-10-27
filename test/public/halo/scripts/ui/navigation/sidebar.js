
function sidebar_is_fixed() {

    APP.global.body.addClass('sidebar-is-fixed');
    APP.global.content.addClass('full-width');
    APP.global.sidebar.addClass('to-push');
}

function sidebar_is_relative() {

    APP.global.body.removeClass('sidebar-is-fixed');
    APP.global.content.removeClass('full-width');
    APP.global.sidebar.removeClass('to-push');
}

function handle_sidebar(is_mobile) {

    if (is_mobile === true) {
        APP.global.sidebar.show();
        sidebar_is_fixed();
    }
    else {
        sidebar_is_relative();
    }
}

function open_sidebar() {

    APP.global.page.disable_mobile_page_scroll();
    APP.global.sidebar.remove_class_prefix('pull-').remove_class_prefix('push-').push_to('left');
    APP.global.overlay.show();

    if (APP.global.body.hasClass('header-is-fixed')) {

        APP.global.header.remove_class_prefix('pull-').remove_class_prefix('push-').push_to('left');

        if (APP.global.body.hasClass('page-header-is-fixed')) {

            APP.global.page_header.remove_class_prefix('pull-').remove_class_prefix('push-').push_to('left');
        }
    }
}

function close_sidebar() {

    APP.global.page.enable_mobile_page_scroll();
    APP.global.sidebar.remove_class_prefix('pull-').remove_class_prefix('push-').pull_to('right');
    APP.global.overlay.hide();

    if (APP.global.body.hasClass('header-is-fixed')) {

        APP.global.header.remove_class_prefix('pull-').remove_class_prefix('push-').pull_to('right');

        if (APP.global.body.hasClass('page-header-is-fixed')) {

            APP.global.page_header.remove_class_prefix('pull-').remove_class_prefix('push-').pull_to('right');
        }
    }
}

module.exports = {

    sidebar_is_fixed: sidebar_is_fixed,
    sidebar_is_relative: sidebar_is_relative,
    handle_sidebar: handle_sidebar,
    open_sidebar: open_sidebar,
    close_sidebar: close_sidebar

};