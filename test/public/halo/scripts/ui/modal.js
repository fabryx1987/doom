
function open(target, custom_options) {

    var options = {
        items: {
            src: $(target),
            type: 'inline'
        }
    };

    if (custom_options !== undefined) {

        options = $.extend(options, custom_options);
    }

    $.magnificPopup.open(options);
}

function close(target, custom_options) {

    var options = {
        items: {
            src: $(target),
            type: 'inline'
        }
    };

    if (custom_options !== undefined) {

        options = $.extend(options, custom_options);
    }

    $.magnificPopup.close(options);
}

module.exports = {
    open: open,
    close: close
};
