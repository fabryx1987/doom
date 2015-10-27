var _checkout = require('../logic/checkout.js')
    _gae = require('../logic/ga_enhanced.js');

function cart_is_empty() {

    if (!APP.global.cart_preview.children().length) {

        APP.global.cart.addClass('empty');
    } else {

        APP.global.cart.removeClass('empty');
    }
}

function handle_cart_row_qty(btn, url, id_cart_row) {

    // Disable controls while updating...
    var el = $($(btn).parents()[2]).find('input, button');
    $(el).attr('disabled', true);

    var jqXHR = $.ajax({

        type: 'GET',
        url: url,
        data: {id_riga_carrello: id_cart_row},
        dataType: 'json'
    });

    jqXHR.done(function (data) {

        update_cart_preview();
        update_cart_body();
        update_cart_foot();
    });
}

function get_id_cart_row(clicked_spin) {

    return clicked_spin.closest('.row').data('id-riga-carrello');
}

function handle_spinbox() {

    var spinbox = $('.spinbox');

    spinbox.find('.spinbox-up').on('click', function (e) {

        e.preventDefault();
        handle_cart_row_qty(this, APP.url['inc_cart_row_qty'], get_id_cart_row($(this)));
    });

    spinbox.find('.spinbox-down').on('click', function (e) {

        e.preventDefault();

        if ($(this).closest('.spinbox').find('.spinbox-input').val() > 1) {

            handle_cart_row_qty(this, APP.url['dec_cart_row_qty'], get_id_cart_row($(this)));
        }
    });
}

function handle_remove_from_cart() {

    $('.basket').on('click', '.js-rm-from-cart', function (e) {

        e.preventDefault();
        var jqXHR = $.ajax({

            type: 'GET',
            url: APP.url['rm_from_cart'],
            data: {id_riga_carrello: get_id_cart_row($(this))},
            dataType: 'json'
        });

        jqXHR.done(function (data) {

            update_cart_preview();
            update_cart_body();
            update_cart_foot();
            update_goodies();
        });
    });
}

function update_cart_body() {

    var jqXHR = $.ajax({

        type: 'GET',
        url: APP.url['get_cart_body'],
        dataType: 'json'
    });

    jqXHR.done(function (data) {
        var basket = $('.basket');
        basket.find('.body').html(data.html);
        handle_spinbox();
        basket.find('.scrollbar-dynamic').scrollbar();
        // Restore bindings after reloading
        _gae.init_cart_tracking();
    });
}

function update_cart_foot() {

    var jqXHR = $.ajax({
        type: 'GET',
        url: APP.url['get_cart_foot'],
        dataType: 'json'
    });

    jqXHR.done(function (data) {

        $('.basket').find('.summary').html(data.html);
        _checkout.update_next_btn();
        _checkout.handle_cash_on_delivery_visibility();
    });
}

function update_goodies() {

    var jqXHR = $.ajax({
        type: 'GET',
        url: APP.url['get_goodies'],
        dataType: 'json'
    });

    jqXHR.done(function (data) {
        $('.goodies').html(data.html);
    });
}

function apply_coupon(url) {

    var jqXHR = $.ajax({

        type: 'GET',
        url: url,
        data: {
            carrello: $('.basket').data('id-carrello'),
            codiceCoupon: $('#cart-coupon').val()
        },
        dataType: 'json'
    });

    jqXHR.done(function () {

        update_cart_foot();
    });
}

function remove_coupon(url) {

    var jqXHR = $.ajax({

        type: 'GET',
        url: url,
        data: {carrello: $('.basket').data('id-carrello')},
        dataType: 'json'
    });

    jqXHR.done(function () {

        update_cart_foot();
    });
}

function handle_door_delivery(url, door_delivery) {

    var jqXHR = $.ajax({

        type: 'GET',
        url: url,
        data: {al_piano: door_delivery},
        dataType: 'json'
    });

    jqXHR.done(function (data) {

        update_cart_foot();

    });
}

function handle_cash_on_delivery(url, cash_on_delivery) {

    var jqXHR = $.ajax({

        type: 'GET',
        url: url,
        data: {contrassegno: cash_on_delivery},
        dataType: 'json'
    });

    jqXHR.done(function (data) {

        update_cart_foot();
    });
}

function update_cart_preview() {

    var jqXHR = $.ajax({

        type: 'GET',
        url: APP.url['get_cart_preview'],
        dataType: 'json'
    });

    jqXHR.done(function (data) {

        APP.global.cart_preview.html(data.html);
        APP.global.cart_qty.html(data.products_count);
        cart_is_empty(APP.global.cart);
    });
}

function create_modal_cart_rows(modal, product) {

    var modal_items = modal.find('.modal-product__items');
    modal_items.empty();

    $.each(product.find('.js-product-title'), function () {

        modal.find('.markup .row').clone()
            .appendTo(modal_items);
    });
}

function fill_add_to_cart_modal(modal, clicked_btn) {

    var product = clicked_btn.closest('.js-product-item');

    create_modal_cart_rows(modal, product);

    $.each(product.find('.js-product-image'), function (index) {

        $(this).clone().removeAttr('class').addClass('block-center__child')
            .appendTo($(modal.find('.modal-product__items .row')[index])
                .find('.modal-product__image'));
    });

    $.each(product.find('.js-product-title'), function (index) {

        $(modal.find('.modal-product__items .row')[index])
            .find('.modal-product__title').text($(this).text());
    });

    $.each(product.find('.js-product-row-active .js-product-desc'), function (index) {

        $(modal.find('.modal-product__items .row')[index])
            .find('.modal-product__type').text($(this).text());
    });

    $.each(product.find('.js-product-row-active .js-product-qty'), function (index) {

        $(modal.find('.modal-product__items .row')[index])
            .find('.modal-product__qty').text('x ' + $(this).val());
    });
}

function handle_add_to_cart(prodotto, quantita) {
    var jqXHR = $.ajax({

        type: 'GET',
        url: APP.url['add_to_cart'],
        data: {
            prodotto: prodotto,
            quantita: quantita
        },
        dataType: 'json'
    });

    jqXHR.done(function (data) {

        update_cart_preview();

        if ($('.basket').exists()) {
            update_cart_body();
            update_cart_foot();
            update_goodies();
        }
    });
}

function handle_genere(genere) {
    var frequency_selection = $('#frequency-selection');
    var jqXHR = $.ajax({

        type: 'GET',
        url: APP.url['handle_genere'],
        data: {genere: genere},
        dataType: 'json'
    });

    jqXHR.done(function (data) {
        update_cart_foot();

        if (genere === 'OTS') {
            frequency_selection.hide();
            $('#other-payments').show();
            $('#fds-payments-info').hide();
        }

        if (genere === 'FDS') {
            frequency_selection.show();
            $('#other-payments').hide();
            $('#fds-payments-info').show();
            $('[name="payment_checkout-payment_type"][value="CCR"]').prop('checked', true);
        }
    });
}


module.exports = {
    cart_is_empty: cart_is_empty,
    handle_spinbox: handle_spinbox,
    handle_remove_from_cart: handle_remove_from_cart,
    handle_add_to_cart: handle_add_to_cart,
    fill_add_to_cart_modal: fill_add_to_cart_modal,
    apply_coupon: apply_coupon,
    remove_coupon: remove_coupon,
    handle_door_delivery: handle_door_delivery,
    handle_cash_on_delivery: handle_cash_on_delivery,
    handle_genere: handle_genere
};