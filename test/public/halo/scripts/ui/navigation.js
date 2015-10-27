var _nav = require('../ui/navigation/nav.js'),
    _user_nav = require('../ui/navigation/user_nav.js'),
    _search = require('../ui/navigation/search.js'),
    _sidebar = require('../ui/navigation/sidebar.js'),
    _page_header = require('../ui/navigation/page_header.js');

function init() {

    var sidebar_filter = APP.global.sidebar.find('.filter'),
        filter_exist = sidebar_filter.exists(),
        filter_trigger = $('#filter-trigger');

    $(window).on('resize', function (e) {

        e.preventDefault();
        APP.global.is_mobile = $(this).is_mobile();
        _nav.handle_nav(APP.global.is_mobile);
        _user_nav.handle_user_nav(APP.global.is_mobile);

        if (filter_exist) {
            _sidebar.handle_sidebar(APP.global.is_mobile);
        }

        if (APP.global.is_mobile === false) {

            APP.global.header.remove_class_prefix('pull-').remove_class_prefix('push-');
            APP.global.user_nav.remove_class_prefix('pull-').remove_class_prefix('push-');
            APP.global.sidebar.remove_class_prefix('pull-').remove_class_prefix('push-');
            APP.global.page_header.remove_class_prefix('pull-').remove_class_prefix('push-');

        }

    }).resize();

    $(window).on('scroll scrollstart', function (e) {

        e.preventDefault();

        if (($(window).scrollTop() > APP.global.header.outerHeight() && APP.global.is_mobile === true)) {

            APP.global.body.addClass('header-is-fixed');

            if (filter_exist) {
                _page_header.page_header_is_fixed();
            }
        }
        else {
            APP.global.body.removeClass('header-is-fixed');

            if (filter_exist) {
                _page_header.page_header_is_relative();
            }
        }
    });

    APP.global.overlay.on('click touchstart', function (e) {

        e.preventDefault();

        // nav
        _nav.close_nav();
        APP.global.nav_trigger.removeClass('active');

        // user_nav
        _user_nav.close_user_nav();
        APP.global.user_nav_trigger.removeClass('active');

        // sidebar
        _sidebar.close_sidebar();
        filter_trigger.removeClass('active');

    });

    APP.global.nav_trigger.on('click touchstart', function (e) {

        e.preventDefault();

        var this_clicked = $(this);
        this_clicked.toggleClass('active');

        if (this_clicked.hasClass('active') && APP.global.is_mobile === true) {

            _nav.open_nav();
        }
        else {

            _nav.close_nav();
        }
    });

    APP.global.search_trigger.on('click touchstart', function (e) {

        e.preventDefault();

        var this_clicked = $(this);
        this_clicked.toggleClass('active');

        if (this_clicked.hasClass('active') && APP.global.is_mobile === true) {

            _search.open_search();
        }
        else {

            _search.close_search();
        }
    });

    APP.global.user_nav_trigger.on('click touchstart', function (e) {

        e.preventDefault();

        var this_clicked = $(this);
        this_clicked.toggleClass('active');

        if (this_clicked.hasClass('active') && APP.global.is_mobile === true) {

            _user_nav.open_user_nav();
        }
        else {
            _user_nav.close_user_nav();
        }
    });

    APP.global.user_nav_dropdown.on('click touchstart', 'a', function(){

        APP.global.user_nav_trigger.removeClass('active');
        _user_nav.close_user_nav();
    });

    filter_trigger.on('click touchstart', function (e) {

        e.preventDefault();
        var this_clicked = $(this);
        this_clicked.toggleClass('active');

        if (this_clicked.hasClass('active') && APP.global.is_mobile === true) {

            _sidebar.open_sidebar();
        }
        else {

            _sidebar.close_sidebar();
        }
    });
}

module.exports = {
    init: init
};