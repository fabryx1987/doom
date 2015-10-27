var _user_admin = require('../logic/user_admin.js'),
    _modal = require('../ui/modal.js');

function init() {

    _user_admin.bind_address_choice_from_db($('#id_my_address-choice_from_db'));
    _user_admin.bind_address_genere($('#id_my_address-genere'));
    _user_admin.bind_credit_card_choice_from_db($('#id_my_credit_card-choice_from_db'));

    $('body').on('click', '.js-dismiss-program', function (e) {

        e.preventDefault();
        _modal.open('#modal-dismiss-program');
    });

    $('#js-update-client-info').on('click', function (e) {

        e.preventDefault();
        _user_admin.update_client_info();
    });

    $('#js-update-user-info').on('click', function (e) {

        e.preventDefault();
        _user_admin.update_user_info();
    });

    $('#js-save-address').on('click', function (e) {

        e.preventDefault();
        _user_admin.add_address();
    });

    $('#js-remove-address').on('click', function (e) {

        e.preventDefault();
        _user_admin.remove_address();
    });

    $('#js-save-payment').on('click', function (e) {

        e.preventDefault();
        _user_admin.add_credit_card();
    });

    $('#js-remove-payment').on('click', function (e) {

        e.preventDefault();
        _user_admin.remove_credit_card();
    });

    $('#js-save-fds-head').on('click', function (e) {

        e.preventDefault();
        _user_admin.save_fds_head();
    });

    $('#fds-schedules').on('click', '.js-save-date', function (e) {

        e.preventDefault();
        _user_admin.save_fds_schedule($(this).siblings('.fds-datepicker'));
    });

    _user_admin.init_datepicker('.fds-datepicker');
}


APP.pages.user_admin = {
    init: init
};