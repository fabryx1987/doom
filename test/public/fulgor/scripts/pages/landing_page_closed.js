function init() {

    var registration_box = $('#registration-box'),
        login_box = $('#login-box'),
        login_trigger = $('#login-trigger'),
        registration_trigger = $('#registration-trigger');

    registration_trigger.hide();
    login_box.hide();

    login_trigger.on('click', function (e) {

        e.preventDefault();
        login_box.show();
        login_trigger.hide();
        registration_box.hide();
        registration_trigger.show();
    });

    registration_trigger.on('click', function (e) {

        e.preventDefault();
        login_box.hide();
        login_trigger.show();
        registration_box.show();
        registration_trigger.hide();
    });

}

APP.pages.landing_page_closed = {
    init: init
};