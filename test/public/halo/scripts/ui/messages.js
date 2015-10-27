
function init(type, content_html, position_y, position_x, delay) {

    var TITLES = {
        info: 'Informazione',
        success: 'Successo',
        warning: 'Attenzione',
        danger: 'Errore'
    };

    var ICONS = {
        info: 'icon fa fa-info-circle',
        success: 'icon fa fa-check-circle',
        warning: 'icon fa fa-warning',
        danger: 'icon fa fa-minus-circle'
    };

    $.growl(
        {
            title: TITLES[type],
            message: content_html,
            icon: ICONS[type]
        },
        {
            type: type,
            delay: delay,
            placement: {
                from: position_y,
                align: position_x
            },
            offset: {
                x: 15,
                y: 15
            },
            animate:{
                enter: 'animated fadeInDown',
                exit: 'animated fadeOutUp'
            }
        }
    );
}

module.exports = {
    init: init
};