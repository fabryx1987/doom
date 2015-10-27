
function page_header_is_fixed() {

    APP.global.body.addClass('page-header-is-fixed');
    APP.global.page_header.css({ 'top': APP.global.header.outerHeight() });
}

function page_header_is_relative() {

    APP.global.body.removeClass('page-header-is-fixed');
    APP.global.page_header.css({ 'top': 0 });
}

module.exports = {

    page_header_is_fixed: page_header_is_fixed,
    page_header_is_relative: page_header_is_relative
};