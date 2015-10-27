_form = require('./form.js');
_paymill = require('./paymill.js');
_gae = require('../logic/ga_enhanced.js');

var checkout = $('.checkout');


function update_next_btn() {

    var form = $('.step-pane.active').find('form'),
        submit_order_label = $('.grand-total').data('submit-order-label'),
        cta_next_step = $('#js-next-step'),
        caption = cta_next_step.find('.text');

    if (form.attr('id') === 'checkout-payment') {
        cta_next_step.addClass('submit-order');
        caption.text(submit_order_label);
    }
    else {
        cta_next_step.removeClass('submit-order');
        caption.text('Successivo');
    }
}

function submit_order(options) {

    _gae.track_payment($("input[name=payment_checkout-payment_type]:checked").val());
    _gae.track_success();

    if (options === undefined) {
        options = {};
    }

    var forms = $('.step-content').find('form');
    var data = forms.serialize();
    var jqXHR = $.ajax({
        type: "POST",
        url: APP.url['submit_order'],
        data: data,
        dataType: 'json'
    });

    if (options.done_fun !== undefined) {
        jqXHR.done(options.done_fun);
    }

    if (options.fail_fun !== undefined) {
        jqXHR.fail(options.fail_fun);
    }
    else {
        jqXHR.fail(function () {
            window.location = APP.url['order_fail'];
        });
    }
}

function next_step() {

    var form = $('.step-pane.active').find('form');

    var done_fun = function (data) {

        if (_form.handle_validate(form, data)) {

            var prev_step = checkout.wizard('selectedItem')['step'];

            if (form.attr('id') !== 'checkout-payment') {

                // When coming from step 3, track frequency to ga
                if(prev_step == 3) {
                    _gae.track_frequency(
                        $('input[name=frequency_type]:checked').val(),
                        $('input[name=delivery_type]:checked').val())
                }

                checkout.wizard('next');
                disable_prev_button(checkout);
                update_next_btn();
            }
            else {

                APP.global.body.create_preloader(APP.global.main);

                var payment_type = $("input[name=payment_checkout-payment_type]:checked").val();
                if (payment_type === 'CCR') {
                    _paymill.launch(
                        {
                            success: submit_order,
                            error: function() {
                                APP.global.body.remove_preloader(APP.global.main.parent());
                            }
                        }
                    );
                }
                else if (payment_type === 'PAL') {
                    submit_order({
                        done_fun: function (data) {
                            window.location.href = APP.url['go_to_paypal'] + "?ordine=" + data.ordine;
                        }
                    });
                }
                else {
                    submit_order();
                }
            }
        }
    };

    form.ajax_submit_form(form.attr('action'), {done_fun: done_fun});
}


function prev_step() {

    checkout.wizard('previous');
    disable_prev_button(checkout);
    update_next_btn();
}


function disable_steps_navigation(wizard) {

    wizard.find('.steps li').on('click', function (e) {

        e.preventDefault();
        e.stopPropagation();
    });
}

function disable_prev_button(wizard) {

    var form = $('.step-pane.active').find('form');
    var prev_step_button = wizard.find('#js-prev-step');

    if (form.attr('id') === 'checkout-shipping') {

        prev_step_button.prop('disabled', true);
    }
    else {

        prev_step_button.removeAttr('disabled');
    }
}

function handle_genere_visibility(id_prefix) {

    if ($('#id_' + id_prefix + '-genere').val() === 'FIS') {

        $($('#id_' + id_prefix + '-ragione_sociale').parents('.row')[1]).hide();
        $($('#id_' + id_prefix + '-p_iva').parents('.row')[1]).hide();
        $($('#id_' + id_prefix + '-codice_fiscale').parents('.row')[1]).hide();
        $($('#id_' + id_prefix + '-nome').parents('.row')[1]).show();
        $($('#id_' + id_prefix + '-cognome').parents('.row')[1]).show();
    }
    else {

        $($('#id_' + id_prefix + '-ragione_sociale').parents('.row')[1]).show();
        $($('#id_' + id_prefix + '-p_iva').parents('.row')[1]).show();
        $($('#id_' + id_prefix + '-codice_fiscale').parents('.row')[1]).show();
        $($('#id_' + id_prefix + '-nome').parents('.row')[1]).hide();
        $($('#id_' + id_prefix + '-cognome').parents('.row')[1]).hide();
    }
}

function handle_same_address_visibility(same_address_input, fields_container) {

    if (same_address_input.is(':checked')) {
        fields_container.hide();
    }
    else {
        fields_container.show();
    }
}

function handle_cash_on_delivery_visibility() {

    var grand_total = $('.grand-total').data('grand-total-int') / 100,
        cash_on_delivery_radio = $('#cash-on-delivery-radio'),
        cash_on_delivery_alert = $('#cash-on-delivery-alert');

    if (grand_total > 200) {
        cash_on_delivery_radio.hide();
        cash_on_delivery_alert.show();

        if (cash_on_delivery_radio.find('input').is(':checked')) {
            $('#id_payment_checkout-payment_type_0').prop('checked', true);
        }
    }
    else {
        cash_on_delivery_radio.show();
        cash_on_delivery_alert.hide();
    }
}

module.exports = {

    next_step: next_step,
    prev_step: prev_step,
    update_next_btn: update_next_btn,
    disable_steps_navigation: disable_steps_navigation,
    handle_genere_visibility: handle_genere_visibility,
    handle_same_address_visibility: handle_same_address_visibility,
    handle_cash_on_delivery_visibility: handle_cash_on_delivery_visibility
};