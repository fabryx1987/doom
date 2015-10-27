function csrfSafeMethod(method) {
    // these HTTP methods do not require CSRF protection
    return (/^(GET|HEAD|OPTIONS|TRACE)$/.test(method));
}

function detect_IE() {

    var ua = window.navigator.userAgent;

    var msie = ua.indexOf('MSIE ');
    if (msie > 0) {
        // IE 10 or older => return version number
        return parseInt(ua.substring(msie + 5, ua.indexOf('.', msie)), 10);
    }

    var trident = ua.indexOf('Trident/');
    if (trident > 0) {
        // IE 11 => return version number
        var rv = ua.indexOf('rv:');
        return parseInt(ua.substring(rv + 3, ua.indexOf('.', rv)), 10);
    }

    var edge = ua.indexOf('Edge/');
    if (edge > 0) {
        // IE 12 => return version number
        return parseInt(ua.substring(edge + 5, ua.indexOf('.', edge)), 10);
    }

    // other browser
    return false;
}

function init() {

    var IE_version = detect_IE();

    if (IE_version !== false) {

        APP.global.body.addClass('ie' + IE_version);
    } else {

        APP.global.body.addClass('not-ie');
    }

    var _navigation = require('../ui/navigation.js'),
        _cart = require('../logic/cart.js'),
        _messages = require('../logic/messages.js'),
        _access = require('../logic/access.js'),
        _modal = require('../ui/modal.js'),
        _gae = require('../logic/ga_enhanced.js');

    window.preloader_spawned = 0;

    $.ajaxSetup({
        cache: false, // for IE
        beforeSend: function (jqXHR, settings) {

            if (!csrfSafeMethod(settings.type) && !this.crossDomain) {
                jqXHR.setRequestHeader("X-CSRFToken", $.cookie('csrftoken'));
            }

            var preloader_container = settings.preloader_container;

            if (preloader_container !== undefined) {

                jqXHR.preloader_container = preloader_container;

                if (window.preloader_spawned === 0) {
                    APP.global.body.create_preloader(preloader_container);
                }
                window.preloader_spawned += 1;
            }

            // needed by 'error' method below
            jqXHR.url = settings.url;
            jqXHR.request_data = settings.data;

        },
        success: function (data, textStatus, jqXHR) {

            if (jqXHR.getResponseHeader("Content-Type") === "application/json") {
                if ('redirect_url' in data) {
                    window.location = data.redirect_url;
                }

                $.each(data.django_messages, function (i, item) {
                    $(item).appendTo(APP.global.message_container)
                });
                _messages.create_messages(APP.global.message_container);
            }
        },
        error: function (jqXHR, textStatus, errorThrown) {

            if (!APP.data['debug'] && jqXHR.status !== 500) {
                $.ajax({
                    type: "POST",
                    url: APP.url['track_javascript_failure'],
                    data: {
                        url: jqXHR.url,
                        request_data: jqXHR.request_data,
                        returnCode: jqXHR.status,
                        textStatus: textStatus,
                        errorThrown: errorThrown
                    },
                    dataType: 'json'
                });
            }
        },
        complete: function (jqXHR, textStatus) {
            window.preloader_spawned -= 1;

            if (window.preloader_spawned <= 0) {
                APP.global.body.remove_preloader($(jqXHR.preloader_container).parent());
            }
        }
    });

    _navigation.init();

    APP.global.nav.enable_dropdown_link($('.dropdown--disabled > a'));

    // Enable GA enhanced ecommerce internal promotions and cart tracking
    _gae.init_promotion_tracking();
    _gae.init_cart_tracking();
    _gae.init_product_impression_tracking();

    // Tabs hash change
    $('.tabs').on('click', 'a[data-toggle="tab"]', function (e) {
        e.preventDefault();

        var id = $(this).attr('href').split('#')[1];
        history.replaceState(undefined, undefined, '#' + id);
    });

    $('input, textarea').placeholder();

    _cart.cart_is_empty();

    // Bind Add to Cart
    APP.global.body.on('click', '.js-add-to-cart', function (e) {

        e.preventDefault();

        var input_trigger_active = $(this).closest('.product').find('.js-product-row-active input.trigger');

        if ($(this).hasClass('js-input-auto-trigger')) {
            input_trigger_active.prop('checked', true).trigger('change');
        }

        var data_id = $(this).data('id-paginavendita-referenza'),
            data_id_as_array = APP.global.body.to_string_split(data_id);

        $.each(data_id_as_array, function (index) {
            _cart.handle_add_to_cart(
                parseInt(data_id_as_array[index]),
                input_trigger_active.data('quantita-da-ordinare')
            );
        });

        if (!$('.basket').exists()) {
            _modal.open('#modal-cart');
            _cart.fill_add_to_cart_modal($('#modal-cart'), $(this));
        }
    });

    $('.js-close-add-to-cart').on('click', function (e) {

        e.preventDefault();
        _modal.close('#modal-cart');
    });

    _messages.create_messages($('.message-container'));

    _access.init();

    // Go to Window Hash on Click
    $('.user-menu .dropdown-menu a').on('click', function () {

        APP.global.body.go_to_tab('#' + $(this).attr('href').split('#')[1]);
    });

    // Go to Window Hash on Click
    APP.global.body.on('click', '.tab-anchor-link', function () {

        APP.global.body.go_to_tab('#' + $(this).attr('href').split('#')[1]);
    });

    $('.tooltip-link').tooltip();

    $('[data-toggle="popover"]').on('click', function (e) {

        e.preventDefault();
    }).popover();

    APP.global.body.on('click', function (e) {

        $('[data-toggle="popover"]').each(function () {
            if (!$(this).is(e.target) && $(this).has(e.target).length === 0 && $('.popover').has(e.target).length === 0) {
                $(this).popover('hide');
            }
        });
    });

    APP.global.body.on('click', '.form-group:has(:checkbox) .control-label', function (e) {

        e.stopPropagation();
        var form_group = $(this).closest('.form-group');
        var input = form_group.find('input');

        if (input.is(':checked')) {
            input.prop('checked', false).trigger('change');
        } else {
            input.prop('checked', true).trigger('change');
        }
    });

    APP.global.body.on('click', '.row.form-group:has(:radio)', function (e) {

        e.stopPropagation();
        $(this).closest('.form-group').find('input').prop('checked', true).trigger('change');
    });

    APP.global.body.on('mousewheel', '.spinbox', function (e) {
        e.stopPropagation();
    });

    // Go to Window Hash on Load
    $(window).on('load', function () {
        APP.global.body.go_to_tab(window.location.hash);
    });

    APP.global.header.find('.cart .scrollbar-dynamic').scrollbar();

    APP.global.go_to_top.on('click touchstart', function (e) {

        e.preventDefault();
        $(this).go_to_top();
    });

    $(window).on('scroll', function () {

        if ($(this).scrollTop() >= 50) {
            APP.global.go_to_top.show();
        } else {
            APP.global.go_to_top.hide();
        }
    });

    $(".js-go-to-anchor").go_to_anchor();

    APP.global.header.find('form.search').on('submit', function (e) {
        e.preventDefault();
    });

    $('.products > .product').find('.scrollbar-dynamic').scrollbar();

    $(window).load(function () {
        $.cookie('cookie_law_accepted', 'true', {expires: 365, path: '/'});
    });

    // Exit Popup
    // -----------------------------------

    APP.global['page'].on('mouseleave', function (e) {

        e.preventDefault();

        if ($.cookie('cookie_exit_popup') || APP.data['is_logged']) {
            return;
        }

        if (e.pageY - $(window).scrollTop() <= 1) {
            _modal.open('#exit-popup');
            $.cookie('cookie_exit_popup', 'true', {expires: 30, path: '/'});
        }
    });

}

module.exports = {
    init: init
};
