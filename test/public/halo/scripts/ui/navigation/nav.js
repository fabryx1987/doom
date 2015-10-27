
function open_nav() {

    APP.global.page.disable_mobile_page_scroll();
    APP.global.nav.push_to('right');
    APP.global.overlay.show();

    if (APP.global.body.hasClass('header-is-fixed')) {

        APP.global.header.remove_class_prefix('pull-').remove_class_prefix('push-').push_to('right');

        if (APP.global.body.hasClass('page-header-is-fixed')) {

            APP.global.page_header.remove_class_prefix('pull-').remove_class_prefix('push-').push_to('right');
        }
    }
}

function close_nav() {

    APP.global.page.enable_mobile_page_scroll();
    APP.global.nav.remove_class_prefix('pull-').remove_class_prefix('push-').pull_to('left');
    APP.global.overlay.hide();

    if (APP.global.body.hasClass('header-is-fixed')) {

        APP.global.header.remove_class_prefix('pull-').remove_class_prefix('push-').pull_to('left');

        if (APP.global.body.hasClass('page-header-is-fixed')) {

            APP.global.page_header.remove_class_prefix('pull-').remove_class_prefix('push-').pull_to('left');
        }
    }
}

function handle_nav(is_mobile) {

    if (is_mobile === true) {

        APP.global.nav.addClass('to-push');
        APP.global.body.disable_dropdown_link($('.primary-nav > .dropdown > a'));
        APP.global.body.enable_dropdown_link($('.secondary-nav'));

        APP.global.overlay.on('scroll', function (e) {
            e.preventDefault();
        });

    } else {

        APP.global.body.removeClass('header-is-fixed');
        APP.global.nav.removeClass('to-push');
        APP.global.nav_trigger.removeClass('active');
        APP.global.body.enable_dropdown_link($('.primary-nav > .dropdown > a'));
        close_nav();
    }
}

module.exports = {

    open_nav: open_nav,
    close_nav: close_nav,
    handle_nav: handle_nav
};
