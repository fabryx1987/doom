var GENERIC_ERROR = 'Si è verificato un errore di comunicazione con la banca. ' +
    'Il pagamento non è riuscito. Ti preghiamo di riprovare o contattare il nostro servizio clienti :)';
var SECURE_CODE_ERROR = 'Problemi con il 3-D Secure Code, ti preghiamo di contattarci';

var PAYMILL_ERRORS = {

    'internal_server_error': GENERIC_ERROR,
    'invalid_public_key': GENERIC_ERROR,
    'invalid_payment_data': GENERIC_ERROR,
    'unknown_error': GENERIC_ERROR,

    '3ds_cancelled': 'Problemi con l\'inserimento del 3-D Secure Code',
    'field_invalid_card_number': 'Numero di carta non valido',
    'field_invalid_card_exp_year': 'Anno di scadenza non valido',
    'field_invalid_card_exp_month': 'Mese di scadenza non valido',
    'field_invalid_card_exp': 'La carta è scaduta o non è più valida',
    'field_invalid_card_cvc': 'Codice CVV o CVC non valido',
    'field_invalid_card_holder': 'Intestatario non valido',
    'field_invalid_amount_int': SECURE_CODE_ERROR,
    'field_invalid_amount': SECURE_CODE_ERROR,
    'field_invalid_currency': SECURE_CODE_ERROR,

    'field_invalid_account_number': GENERIC_ERROR,
    'field_invalid_account_holder': GENERIC_ERROR,
    'field_invalid_bank_code': GENERIC_ERROR,
    'field_invalid_iban': GENERIC_ERROR,
    'field_invalid_bic': GENERIC_ERROR,
    'field_invalid_country': GENERIC_ERROR,
    'field_invalid_bank_data': GENERIC_ERROR
};


function create_token(credit_card_data, paymill_token_field, callbacks) {

    var form_errors = paymill_token_field.closest('form').find('.form-errors');

    paymill.createToken({
        number: credit_card_data['card_number'],           // required
        exp_month: credit_card_data['expiration_month'],   // required
        exp_year: credit_card_data['expiration_year'],     // required, "2016"
        cvc: credit_card_data['cvc'],                      // required
        amount_int: credit_card_data['amount_int'],        // required, integer, "15" for 0,15 Euro
        currency: 'EUR',                                   // required, ISO 4217: "EUR" or "GBP"
        cardholder: credit_card_data['card_holder']        // optional
    }, function (error, result) {

        if (error) {
            form_errors.html(PAYMILL_ERRORS[error.apierror]);
            if (callbacks.error !== undefined) {
                callbacks.error();
            }

            return;
        }
        paymill_token_field.val(result.token);

        if (callbacks.success !== undefined) {
            callbacks.success();
        }
    });
}


function launch(callbacks) {

    if (callbacks === undefined) {
        callbacks = {};
    }

    var paymill_token_field = $("#id_payment_checkout-paymill_token"),
        id_selected = $("select#id_payment_checkout-choice_from_db option:selected").val(),
        credit_card_data = {
            card_number: $('#id_payment_checkout-number').val(),
            card_holder: $('#id_payment_checkout-holder').val(),
            expiration_month: $('#id_payment_checkout-expiration_month').val(),
            expiration_year: $('#id_payment_checkout-expiration_year').val(),
            cvc: $('#id_payment_checkout-cvv').val(),
            amount_int: $('.grand-total').data('grand-total-int')
        };

    if (id_selected === '-1') {

        create_token(credit_card_data, paymill_token_field, callbacks);
    }
    else {

        if (callbacks.success !== undefined) {
            callbacks.success();
        }
    }
}

module.exports = {
    create_token: create_token,
    launch: launch
};