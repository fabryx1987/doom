var _carousel = require('../ui/carousel.js'),
    _checkout = require('../logic/checkout.js'),
    _cart = require('../logic/cart.js'),
    _form = require('../logic/form.js'),
    _datepicker = require('../logic/datepicker.js'),
    _gae = require('../logic/ga_enhanced.js');

function init() {

    var basket = $('.basket'),
        checkout = $('.checkout'),
        step_number = APP.data.is_logged && 2 || 1,
        shipping_radio = '#id_delivery_type_',
        frequency_selection = $('#frequency-selection'),
        shipping_datepicker = $('#shipping-datepicker');

    _cart.handle_spinbox();
    _cart.handle_remove_from_cart();

    // Track checkout start
    if(step_number == 2)
        _gae.track_shipping();

    // Bind Add Coupon
    $('.js-apply-coupon').on('click', function (e) {

        e.preventDefault();
        _cart.apply_coupon(APP.url['apply_coupon']);
    });

    $('#cart-coupon').on('keydown', function (e) {

        if (e.which == 13) {
            _cart.apply_coupon(APP.url['apply_coupon']);
        }
    });

    basket.on('click', '.js-remove-coupon', function (e) {

        e.preventDefault();
        _cart.remove_coupon(APP.url['remove_coupon']);
    });

    // Bind Door Delivery
    basket.on('click', '.js-handle-door-delivery', function (e) {

        e.preventDefault();
        var this_clicked = $(this),
            door_delivery;

        if (this_clicked.data('door-delivery') === 1) {
            door_delivery = 0;
        } else {
            door_delivery = 1;
        }

        _cart.handle_door_delivery(APP.url['handle_door_delivery'], door_delivery);
    });

    // Bind Cash Delivery
    $('input[name=payment_checkout-payment_type]').on('change', function (e) {

        e.preventDefault();
        var cash_on_delivery;

        if ($(this).val() === 'COD') {
            cash_on_delivery = 1;
        } else {
            cash_on_delivery = 0;
        }
        _cart.handle_cash_on_delivery(APP.url['handle_cash_on_delivery'], cash_on_delivery);
    });

    _cart.handle_cash_on_delivery(APP.url['handle_cash_on_delivery'], 0);

    checkout.wizard('selectedItem', {'step': step_number});

    _checkout.disable_steps_navigation(checkout);

    // Activate CCR payment when clicking on its form
    $('.js-ccr-form input, .js-ccr-form select').on('change', function() {
        $('#id_payment_checkout-payment_type_0').prop('checked', true);
    });

    // other-products
    _carousel.init(
        $('.products-carousel').find('.owl-carousel'),
        'multiple',
        {
            margin: 20,
            dots: false,
            nav: true,
            autoplay: false,
            responsive: {
                0: {
                    items: 1
                },
                480: {
                    items: 2
                },
                992: {
                    items: 4
                }
            }
        }
    );

    // goodies
    _carousel.init(
        $('.goodies').find('.owl-carousel'),
        'single',
        {
            margin: 0,
            dots: false,
            nav: false,
            items: 1
        }
    );

    if (APP.data.is_logged) {

        frequency_selection.hide();

        var restricted_dates = _datepicker.restrict_dates();

        shipping_datepicker.datepicker({
            date: _datepicker.get_first_not_restricted_date(restricted_dates),
            allowPastDates: false,
            formatDate: _datepicker.format_date,
            restricted: restricted_dates
        });

        shipping_datepicker.hide();

        $('[name="frequency_type"]').on('change', function () {

            _cart.handle_genere($(this).val());
        });
        _cart.handle_genere('OTS');

        $(shipping_radio + '0').on('change', function () {
            shipping_datepicker.hide();
        });

        $(shipping_radio + '1').on('change', function () {
            shipping_datepicker.show();
        });

        $('#js-prev-step').on('click', function (e) {

            e.preventDefault();
            _checkout.prev_step();
        });

        $('#js-next-step').on('click', function (e) {

            e.preventDefault();
            _checkout.next_step();
        });

        $('#id_billing-choice_from_db, #id_shipping-choice_from_db').on('change', function (e) {

            e.preventDefault();
            _form.fill_fields($(this), APP.data['addresses']);
            _checkout.handle_genere_visibility('billing');
            _checkout.handle_genere_visibility('shipping');
            _form.reset_validation($(this).closest('.fields-container'));

        }).change();

        $('#id_billing-genere, #id_shipping-genere').on('change', function (e) {

            e.preventDefault();
            _checkout.handle_genere_visibility('billing');
            _checkout.handle_genere_visibility('shipping');
            _form.reset_validation($(this).closest('.fields-container'));

        }).change();

        $('#id_billing-same_address').on('change', function (e) {

            _checkout.handle_same_address_visibility($(this), $('#same-address-container'));
        }).change();

        $('#id_payment_checkout-choice_from_db').on('change', function (e) {

            e.preventDefault();
            _form.fill_fields($(this), APP.data['payments']);
            _form.reset_validation($(this).closest('.fields-container'));

        }).change();
    }

    _checkout.handle_cash_on_delivery_visibility();

    basket.find('.scrollbar-dynamic').scrollbar();
}

APP.pages.checkout = {
    init: init
};