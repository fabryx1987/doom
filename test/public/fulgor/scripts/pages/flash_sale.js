var _gallery = require('../ui/gallery.js'),
    _popup = require('../ui/popup.js'),
    _product = require('../logic/product.js');

function flash_sale_products(products_container) {

    products_container.find('.product').each(function (index) {

        var product = $(this);

        _gallery.init(products_container, index);

        product.find('.gallery__preview').on('click', function () {
            _popup.init($(this).closest('.gallery'), 'gallery-image');
        });

        _product.init(product);
    });
}

function init() {

    $('#nav').find('.dropdown--flashsales').on('hover', function (e) {
        e.preventDefault();
    });

    // Bind Door Delivery
    $('.js-category-toggle').on('click', function (e) {

        var this_clicked = $(this);

        if (this_clicked.data('category') === 'dog') {
            this_clicked.data('category', 'cat')
                .removeClass('js-category-cat').addClass('js-category-dog js-active');
            this_clicked.siblings('.icon--dog')
                .removeClass('icon--white').addClass('icon--dark-cyan');
            this_clicked.siblings('.icon--cat')
                .removeClass('icon--dark-cyan').addClass('icon--white');
            $('.products--dog').removeClass('js-active');
            $('.products--cat').addClass('js-active');
        }
        else {
            this_clicked.data('category', 'dog')
                .removeClass('js-category-dog js-active').addClass('js-category-cat');
            this_clicked.siblings('.icon--cat')
                .removeClass('icon--white').addClass('icon--dark-cyan');
            this_clicked.siblings('.icon--dog')
                .removeClass('icon--dark-cyan').addClass('icon--white');
            $('.products--cat').removeClass('js-active');
            $('.products--dog').addClass('js-active')
        }
    });

    flash_sale_products($('.products--dog'));
    flash_sale_products($('.products--cat'));
}

APP.pages.flash_sale = {
    init: init
};