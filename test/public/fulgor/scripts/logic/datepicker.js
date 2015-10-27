function format_date(date) {

    return moment(date).format('DD/MM/YYYY');
}

function restrict_dates() {

    var today = moment(),
        tomorrow,
        restricted_dates = [];

    for (i = 1; i <= APP.data['shipped_after_td']; i++) {
        restricted_dates.push({

            from: today,
            to: today
        });

        today = moment(today).add(1, 'days');
    }

    for (i = APP.data['shipped_after_td']; i <= 700; i++) {
        tomorrow = moment(today).add(1, 'days');

        if (today.weekday() === 6) {
            restricted_dates.push({

                from: today,
                to: moment(tomorrow)
            });
        }

        today = tomorrow;
    }

    return restricted_dates;
}

function get_first_not_restricted_date(restricted_dates) {

    var start_date = moment().add(APP.data['shipped_after_td']-1, 'days'),
        restricted_date_strings = [],
        start_date_string;

    $.each(restricted_dates, function(index, from_to_dict){
        restricted_date_strings.push(format_date(from_to_dict.from));
        restricted_date_strings.push(format_date(from_to_dict.to));
    });

    for (i=1; i < 1000; i++) { // 1000 is a dummy value to avoid risk of browser hang

        start_date_string = format_date(start_date);

        if(restricted_date_strings.indexOf(start_date_string) < 0) {
            return start_date;
        }
        start_date.add(1, 'days');
    }
}

module.exports = {
    format_date: format_date,
    restrict_dates: restrict_dates,
    get_first_not_restricted_date: get_first_not_restricted_date
};