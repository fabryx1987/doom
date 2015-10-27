function select_product_row(product_row_input) {

    product_row_input.prop("checked", true).change();
}

function get_spinbox_value(product_row_selected) {

    var spinbox = product_row_selected.find('.spinbox-input'),
        spinbox_value = spinbox.val();

    if (!spinbox.length) {
        spinbox_value = 1;
    }

    return spinbox_value;
}

function verify_delivery_cost(selected_radio, product_row_selected) {

    if ((selected_radio.data('price-gp') * parseFloat(selected_radio.data('quantita-da-ordinare')).toFixed(2)) >= APP.data.spese_spedizione_threshold) {
        product_row_selected.find('.js-delivery-label').display_block();
    }
    else {
        product_row_selected.find('.js-delivery-label').display_none();
    }
}

function update_product_row_prices(product_row_selected, price_rrp, price_gp) {

    var price_rrp_updated = parseFloat(price_rrp * get_spinbox_value(product_row_selected)).toFixed(2),
        price_gp_updated = parseFloat(price_gp * get_spinbox_value(product_row_selected)).toFixed(2);

    product_row_selected.find('.js-rrp-price')
        .data('price-rrp-updated', price_rrp_updated).text(price_rrp_updated);

    product_row_selected.find('.js-gp-price')
        .data('price-gp-updated', price_gp_updated).text(price_gp_updated);

    var qty_to_order_updated = product_row_selected.find('.spinbox-input').val(),
        selected_radio = product_row_selected.find('input.trigger');

    selected_radio.data('quantita-da-ordinare', parseInt(qty_to_order_updated));
    verify_delivery_cost(selected_radio, product_row_selected);
}

function update_product_total_price(product, product_row_selected) {

    var total_price_selector = product.find('.product__total-price'),
        total_price_rrp = product_row_selected.find('.js-rrp-price').data('price-rrp-updated'),
        total_price_gp = product_row_selected.find('.js-gp-price').data('price-gp-updated');

    total_price_selector.find('.price__old__text').text(total_price_rrp);
    total_price_selector.find('.price__new__text').text(total_price_gp);
}

function highlight_selected_row(product, product_row_selected) {

    product_row_selected.addClass('js-product-row-active');
}

function remove_highlight_selected_row(product) {

    product.find('.row.form-group').removeClass('js-product-row-active');
}

function check_quantity_value(spinbox_input, event) {

    var spinbox_input_value = parseInt(spinbox_input.val());

    if (spinbox_input_value < 1 || (spinbox_input.val() === '' && event.type === 'change')) {

        spinbox_input.val(1);
    }
    else if (spinbox_input_value >= 10) {

        spinbox_input.val(10);
    }

    select_product_row(spinbox_input.closest('.row').find('input.trigger'));
}

function reset_other_spinbox_values(product) {

    product.find('.row.form-group').each(function () {

        var product_row = $(this).not('.js-product-row-active'),
            product_input_radio = product_row.find('input.trigger');

        product_row.find('.spinbox-input').val(1);

        update_product_row_prices(
            product_row,
            product_input_radio.data('price-rrp'),
            product_input_radio.data('price-gp')
        );

        verify_delivery_cost(product_input_radio, product_row);
    });
}

function auto_select_best_offer(product, selected_radio) {

    var input_best_offer = selected_radio;

    select_product_row(input_best_offer);
    input_best_offer.closest('.row').find('.js-best-offer-label').removeClass('hide');

    product.find('.trigger-content').each(function () {

        var gallery_thumb_selected = $(this);

        gallery_thumb_selected.removeClass('active');

        if (gallery_thumb_selected.data('target') === input_best_offer.data('target')) {
            gallery_thumb_selected.addClass('active');
        }
    });
}

function calculate_product_prices(product) {

    var selected_radio,
        price_gp,
        price_rrp,
        number_items_sellable,
        offer_has_expired,
        first_order_coupon_discount,
        price_gp_final,
        discount_percentage,
        promo,
        total_price_rrp = product.find('.price__old');

    total_price_rrp.show();

    product.on('change', 'input.trigger', function () {

        selected_radio = $(this);
        price_gp = Number(selected_radio.data('price-gp'));
        price_rrp = Number(selected_radio.data('price-rrp'));
        number_items_sellable = selected_radio.data('disponibili');
        promo = selected_radio.data('promo');
        offer_has_expired = selected_radio.data('scaduta');
        first_order_coupon_discount = price_gp * APP.data.first_order_coupon_percent / 100;
        price_gp_final = price_gp - parseFloat(first_order_coupon_discount).toFixed(2);
        discount_percentage = Math.ceil((price_rrp - price_gp) * 100 / price_rrp);

        var product_row_selected = selected_radio.closest('.row'),
            spinbox_input = product_row_selected.find('.spinbox-input'),
            spinbox_input_value = parseInt(spinbox_input.val()),
            is_grid = false;

        remove_highlight_selected_row(product);
        highlight_selected_row(product, product_row_selected);

        if(promo) {
          var row = selected_radio.closest(".row");
          row.find(".js-promo-label").display_block();
        }

        if (price_gp < price_rrp && discount_percentage > 1) {
            product.find('.discount-container').show().find('.discount-percentage')
                .text('-' + discount_percentage + '%');
        }
        else {
            product.find('.discount-container')
                .hide();
        }

        if (product.hasClass('product--grid')) {
            is_grid = true;
        }

        if (product.hasClass('js-flash-product')) {

            if (number_items_sellable < 1) {

                product.addClass('js-product-sold-out');
                product.find('.js-product__overlay__ribbon').text('Esaurito');
            }

            else if (offer_has_expired === 1) {
                product.addClass('js-product-expired');
                product.find('.js-product__overlay__ribbon').text('Offerta Scaduta');
            }

            product.find('.starburst__number').text(number_items_sellable);
        }

        if ((spinbox_input.val() !== '' && spinbox_input_value <= 10 && spinbox_input_value >= 1) || is_grid === true) {

            update_product_row_prices(product_row_selected, price_rrp, price_gp);
            update_product_total_price(product, product_row_selected);
            reset_other_spinbox_values(product);
        }

        product.find('.js-add-to-cart')
            .data('id-paginavendita-referenza', selected_radio.data('target'));

    });

    product.on('mousewheel', '.spinbox-input', function (e) {
        return;
    });

    product.on('change keyup keydown keypress blur', '.spinbox-input', function (e) {
        check_quantity_value($(this), e);
    });

    product.on('click', '.spinbox-up', function (e) {

        var spinbox_input = $(this).closest('.spinbox').find('.spinbox-input');
        var spinbox_input_value = spinbox_input.val();

        spinbox_input.val(parseInt(spinbox_input_value) + 1);

        check_quantity_value($(this), e);
    });

    product.on('click', '.spinbox-down', function (e) {

        var spinbox_input = $(this).closest('.spinbox').find('.spinbox-input');
        var spinbox_input_value = spinbox_input.val();

        spinbox_input.val(parseInt(spinbox_input_value) - 1);

        check_quantity_value($(this), e);
    });
}

function handle_product_radios(product) {

    product.find('input.trigger').each(function (index) {

        var selected_radio = $(this),
            product_row_selected = selected_radio.closest('.row'),
            promo = selected_radio.data('promo');

        if (index === 0) {

            select_product_row(selected_radio);
            highlight_selected_row(product, product_row_selected);
        }

        else if (promo) {
          var row = selected_radio.closest(".row");
          row.find(".js-promo-label").display_block();
        }

        else if (selected_radio.data('best-offer') === 1) {

            auto_select_best_offer(product, selected_radio);
        }

        verify_delivery_cost(selected_radio, product_row_selected);
    });
}

function init(product) {

    product.find('.spinbox-input').val(1);

    calculate_product_prices(product);
    handle_product_radios(product);

    if (product.hasClass('product--grid') && !product.hasClass('product--flash')) {
        product.find($('.product__table')).hide();
    }
}

module.exports = {
    init: init
};
