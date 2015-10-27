var header = $('#header'),
    user_nav = header.find('.user-menu'),
    cart = $('.cart');

global = {
    page: $('html'),
    body: $('body'),
    overlay: $('#overlay'),
    wrap: $('#wrap'),
    header: header,
    main: $('#main'),
    content: $('#content'),
    sidebar: $('#sidebar'),
    header_top: header.find('.header-top'),
    user_nav: user_nav,
    user_nav_dropdown: user_nav.find('.dropdown-menu'),
    nav: $('#nav'),
    page_header: $('.page-header'),
    search: header.find('.search'),
    user_nav_trigger: header.find('#user-nav-trigger'),
    nav_trigger: header.find('#nav-trigger'),
    search_trigger: header.find('#search-trigger'),
    cart: cart,
    cart_preview: cart.find('.cart-preview'),
    cart_qty: cart.find('.cart-cta .qty').children(),
    message_container: $('.message-container'),
    go_to_top: $('#go-to-top'),
    is_mobile: false
};

module.exports = {
    global: global
};