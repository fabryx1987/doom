function validate_error(has_feedback, field_error) {
    has_feedback.find('.fa').addClass('fa-remove').removeClass('fa-ok');
    has_feedback.find('.field-error').text(field_error);
}

function validate_success(has_feedback) {
    has_feedback.find('.field-error').text('');
    has_feedback.find('.fa').addClass('fa-check').removeClass('fa-remove');
}

function handle_validate(form, data) {

    var result = true;
    var form_errors = form.find('.form-errors');

    if (data.errors['__all__'] !== undefined) {

        result = false;
        form_errors.empty();
        $.each(data.errors['__all__'], function (index, error) {
            form_errors.append(error + '<br>');
        });
    }

    $.each(data.fields, function (index, field_name) {

        var field = form.find("[name='" + field_name + "']");

        var has_feedback = field.closest('.has-feedback'),
            field_error = data.errors[field_name];

        if (field_name in data.errors) {
            result = false;
            //has_feedback.removeClass('has-success').addClass('has-error');
            has_feedback.addClass('has-error');
            validate_error(has_feedback, field_error);
        }
        else {
            //has_feedback.removeClass('has-error').addClass('has-success');
            has_feedback.removeClass('has-error');
            validate_success(has_feedback);
        }
    });

    return result;
}

function reset_validation(fields_container) {

    var fields = fields_container.find('input, select').not('input[type=submit]');

    $.each(fields, function (index, field) {

        $(field).closest('.has-feedback').removeClass('has-error has-success');
    });

    fields_container.closest('form').find('.form-errors').empty();
}

function fill_fields(select_input, dictionaries) {

    var fields_container = select_input.closest('.fields-container'),
        fields = fields_container.find('input[type=text], select').not('#' + select_input.attr('id')),
        field_name,
        field_tail,
        field_type,
        selected_option = parseInt(select_input.find('option:selected').val()),
        dictionary_to_fill = null;

    $.each(dictionaries, function (index, dictionary) {

        if (dictionary['id'] === selected_option) {

            dictionary_to_fill = dictionary;
            return false;
        }
    });

    $.each(fields, function (index, field) {

        field_name = $(field).attr('name');
        field_tail = field_name.split('-')[1];
        field_type = $(field).attr('type');

        if ($.isEmptyObject(dictionary_to_fill)) {

            if (field_type == 'text') {

                $(field).val('');
            }
        }
        else {

            $(field).val(dictionary_to_fill[field_tail]);
        }

        if (dictionary_to_fill && Object.keys(dictionary_to_fill).indexOf(field_tail) > -1) {

            $(field).attr('disabled', 'disabled');
        }
        else {

            $(field).removeAttr('disabled');
        }
    });
}

module.exports = {

    fill_fields: fill_fields,
    handle_validate: handle_validate,
    reset_validation: reset_validation
};