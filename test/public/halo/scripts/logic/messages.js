
var messages = require('../ui/messages.js');

function create_messages(selector){

    selector.children().each(function () {

        var message = $(this),
            message_classes = message.attr('class').split(' '),
            message_type = 'info',
            message_position_y = 'top',
            message_position_x = 'left',
            message_delay = APP.data['message_delay'],
            message_content = message.text();

        $.each(message_classes, function (key) {

             if (message_classes[key].indexOf('position-x-') > -1){
                 message_position_x = message_classes[key].replace('position-x-', '');
             }
             else if (message_classes[key].indexOf('position-y-') > -1){
                 message_position_y = message_classes[key].replace('position-y-', '');
             }
             else if (message_classes[key].indexOf('no-delay') > -1){
                 message_delay = 0;
             }
             else{
                 message_type = message_classes[key];
             }
        });

        messages.init(message_type, message_content, message_position_y, message_position_x, message_delay);
    });

    selector.empty();
}

module.exports = {

    create_messages: create_messages
};