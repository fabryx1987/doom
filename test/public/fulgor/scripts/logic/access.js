// Access
// --------------------------------------------------------------------------
var _modal = require('../ui/modal.js'),
    _form = require('./form.js');


function handle_registration_client(forms) {

    $(forms).each(function(i, form) {

        var $form = $(form);

        var done_fun = function (data) {

            _form.handle_validate($form, data);
        };

        $form.on('submit', function (e) {

            e.preventDefault();
            $form.ajax_submit_form($form.attr('action'), {done_fun: done_fun});
        });
    });
}

function handle_login_client(forms) {

    $(forms).each(function(i, form){

        var $form = $(form);

        var done_fun = function (data) {

            _form.handle_validate($form, data);
        };

        $form.on('submit', function(e) {

            e.preventDefault();
            $form.ajax_submit_form($form.attr('action'), {done_fun: done_fun});
        });
    });
}

function bind_fb_login() {

    $('.js-fb-login').on('click', function (e) {
        e.preventDefault();
        var facebook_login_url = $(this).prop('href');
        var current_querystring_dict = $.deparam(this.baseURI.split('?')[1] || '');

        FB.login(function (response) {
            var jqXHR = $.ajax({
                url: facebook_login_url,
                data: $.extend({accessToken: response.authResponse.accessToken}, current_querystring_dict),
                dataType: 'json'
            });
        }, {scope: 'email,publish_actions,user_birthday'});
    });
}

function bind_access() {

    $('.js-access').on('click', function (e) {

        e.preventDefault();
        _modal.open('#modal-access');
    });
}


function init() {

    bind_fb_login();
    bind_access();
    handle_login_client($('.access-login'));
    handle_registration_client($('.access-registration'));
}


module.exports = {
    init: init
};
