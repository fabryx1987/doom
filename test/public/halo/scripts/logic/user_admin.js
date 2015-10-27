_form = require('./form.js');
_checkout = require('./checkout.js');
_datepicker = require('./datepicker.js');
_paymill = require('./paymill.js');


function bind_address_choice_from_db(choice_from_db, addresses) {
    choice_from_db.on('change', function (e) {

        e.preventDefault();
        _form.fill_fields($(this), addresses || APP.data['addresses']);
        _checkout.handle_genere_visibility('my_address');
        _form.reset_validation($(this).closest('.fields-container'));

        if ($(this).val() === '-1') {

            $('#js-save-address').show();
            $('#js-remove-address').hide();
        }
        else {

            $('#js-save-address').hide();
            $('#js-remove-address').show();
        }
    }).change();
}

function bind_address_genere(genere) {
    genere.on('change', function (e) {
        e.preventDefault();
        _checkout.handle_genere_visibility('my_address');
        _form.reset_validation($(this).closest('.fields-container'));

    }).change();
}

function bind_credit_card_choice_from_db(choice_from_db, payments) {
    choice_from_db.on('change', function (e) {

        e.preventDefault();
        _form.fill_fields($(this), payments || APP.data['payments']);
        _form.reset_validation($(this).closest('.fields-container'));

        if ($(this).val() === '-1') {

            $('#js-save-payment').show();
            $('#js-remove-payment').hide();
        }
        else {

            $('#js-save-payment').hide();
            $('#js-remove-payment').show();
        }
    }).change();
}


function update_client_info() {

    var client_info_form = $('#client-info-form'),
        client_info_fields = client_info_form.find('.fields-container');

    var done_fun = function (data) {
        client_info_fields.html(data.html);
        _form.handle_validate(client_info_form, data);
    };

    client_info_form.ajax_submit_form(APP.url['update_client_info'], {done_fun: done_fun});
}

function update_user_info() {

    var user_info_form = $('#user-info-form'),
        user_info_fields = user_info_form.find('.fields-container');

    var done_fun = function (data) {
        user_info_fields.html(data.html);
        _form.handle_validate(user_info_form, data);
    };

    user_info_form.ajax_submit_form(APP.url['update_user_info'], {done_fun: done_fun});
}

function add_address() {

    var my_addresses_form = $('#my-address-form'),
        my_addresses_fields = my_addresses_form.find('.fields-container');

    var done_fun = function (data) {
        if ($.get_object_size(data.errors)) {

            _form.handle_validate(my_addresses_form, data);
        }
        else {

            my_addresses_fields.html(data.html);
            bind_address_choice_from_db(
                $('#id_my_address-choice_from_db'), $.parseJSON(data.json_addresses));
            bind_address_genere($('#id_my_address-genere'));
        }
    };

    my_addresses_form.ajax_submit_form(APP.url['add_address'], {done_fun: done_fun});
}

function remove_address() {

    var my_addresses_form = $('#my-address-form'),
        my_addresses_fields = my_addresses_form.find('.fields-container');

    var done_fun = function (data) {
        if ($.get_object_size(data.errors)) {

            _form.handle_validate(my_addresses_form, data);
        }
        else {

            my_addresses_fields.html(data.html);
            bind_address_choice_from_db(
                $('#id_my_address-choice_from_db'), $.parseJSON(data.json_addresses));
            bind_address_genere($('#id_my_address-genere'));
        }
    };

    my_addresses_form.ajax_submit_form(APP.url['remove_address'], {done_fun: done_fun});
}

function add_credit_card() {

    var paymill_token_field = $("#id_my_credit_card-paymill_token"),
        credit_card_data = {
            card_number: $('#id_my_credit_card-number').val(),
            id_selected: $("select#id_my_credit_card-choice_from_db option:selected").val(),
            card_holder: $('#id_my_credit_card-holder').val(),
            expiration_month: $('#id_my_credit_card-expiration_month').val(),
            expiration_year: $('#id_my_credit_card-expiration_year').val(),
            cvc: $('#id_my_credit_card-cvv').val(),
            amount_int: APP.data['preauth_amount_int']
        };

    _paymill.create_token(credit_card_data, paymill_token_field, {
        success: function () {
            var credit_card_form = $('#credit-card-form'),
                credit_card_fields = credit_card_form.find('.fields-container');

            var done_fun = function (data) {
                if ($.get_object_size(data.errors)) {

                    _form.handle_validate(credit_card_form, data);
                }
                else {

                    credit_card_fields.html(data.html);
                    bind_credit_card_choice_from_db(
                        $('#id_my_credit_card-choice_from_db'), $.parseJSON(data.json_payments));
                }
            };

            credit_card_form.ajax_submit_form(
                APP.url['add_credit_card'], {
                    done_fun: done_fun,
                    preloader_container: '#main'
                });
        }
    });
}

function remove_credit_card() {

    var credit_card_form = $('#credit-card-form'),
        credit_card_fields = credit_card_form.find('.fields-container');

    var done_fun = function (data) {
        if ($.get_object_size(data.errors)) {

            _form.handle_validate(credit_card_form, data);
        }
        else {

            credit_card_fields.html(data.html);
            bind_credit_card_choice_from_db(
                $('#id_my_credit_card-choice_from_db'), $.parseJSON(data.json_payments));
        }
    };

    credit_card_form.ajax_submit_form(APP.url['remove_credit_card'], {done_fun: done_fun});
}

function save_fds_head() {

    var fds_head_form = $('#fds-head-form'),
        fds_head_fields = fds_head_form.find('.fields-container');

    var done_fun = function (data) {
        fds_head_fields.html(data['html_fds_head']);
        $('#fds-schedules').find('.body').html(data['html_fds_schedules']);
        $('#fds-body').html(data['html_fds_body']);

        _form.handle_validate(fds_head_form, data);
        init_datepicker('.fds-datepicker');
    };

    fds_head_form.ajax_submit_form(APP.url['save_fds_head'], {done_fun: done_fun});
}

function save_fds_schedule(fds_datepicker) {

    var jqXHR = $.ajax({
        type: "GET",
        url: APP.url['save_fds_schedule'],
        data: {
            riga_calendario_programma: fds_datepicker.data('id-riga-calendario-programma'),
            epoch_time: moment(fds_datepicker.datepicker('getDate')).unix()
        },
        dataType: 'json'
    });

    jqXHR.done(function (data) {
        $('#fds-schedules').find('.body').html(data.html);
        init_datepicker('.fds-datepicker');
    });
}

function init_datepicker(datepicker_selector) {

    $(datepicker_selector).each(function (index, fds_datepicker) {

        fds_datepicker = $(fds_datepicker);
        fds_datepicker.siblings('.js-save-date').hide();

        fds_datepicker.datepicker({
            allowPastDates: false,
            date: new Date(fds_datepicker.data('epoch') * 1000),
            formatDate: _datepicker.format_date,
            restricted: _datepicker.restrict_dates()
        });

        fds_datepicker.on('dateClicked.fu.datepicker', function (e) {

            e.preventDefault();
            fds_datepicker.siblings('.js-save-date').show();
        });
    });
}

module.exports = {

    update_client_info: update_client_info,
    update_user_info: update_user_info,
    add_address: add_address,
    remove_address: remove_address,
    add_credit_card: add_credit_card,
    remove_credit_card: remove_credit_card,
    save_fds_head: save_fds_head,
    init_datepicker: init_datepicker,
    save_fds_schedule: save_fds_schedule,
    bind_address_choice_from_db: bind_address_choice_from_db,
    bind_address_genere: bind_address_genere,
    bind_credit_card_choice_from_db: bind_credit_card_choice_from_db
};