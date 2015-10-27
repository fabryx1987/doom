var _carousel = require('../ui/carousel.js'),
    _gallery = require('../ui/gallery.js'),
    _popup = require('../ui/popup.js'),
    _product = require('../logic/product.js');

function init() {

    var products_container = $('.products');

    products_container.find('.product').each(function (index) {

        var product = $(this);

        if (product.data('gallery') !== 'singleton') {
            _gallery.init(products_container, index);
        }

        product.find('.gallery__preview').on('click', function () {
            _popup.init($(this).closest('.gallery'), 'gallery-image');
        });

        _product.init(product);
    });

    // Products carousel
    _carousel.init(
        $('.products-carousel').find('.owl-carousel'),
        'multiple',
        {
            items: 3,
            margin: 30,
            dots: false,
            responsive: {
                0: {
                    items: 1
                },
                480: {
                    items: 2
                },
                768: {
                    items: 3
                },
                992: {
                    items: 4
                },
                1170: {
                    items: 6
                }
            }
        }
    );

    var bought_together = $('.bought-together');

    // Bought Together carousel
    _carousel.init(
        bought_together.find('.owl-carousel'),
        'multiple',
        {
            items: 3,
            margin: 30,
            dots: false,
            responsive: {
                0: {
                    items: 1
                },
                480: {
                    items: 1
                },
                768: {
                    items: 2
                },
                992: {
                    items: 2
                },
                1170: {
                    items: 3
                }
            }
        }
    );

    // Comments Collapse
    APP.global.body.show_more($('.show-more'));
    APP.global.body.show_text_ellipsis($('.js-show-text-ellipsis'));

    // Easy Paginate

    var reviews_items = $('.reviews').children();

    reviews_items.easyPaginate({
        paginateElement: 'li',
        elementsPerPage: 4,
        prevButtonText: '<i class="fa fa-chevron-left"></i>',
        nextButtonText: '<i class="fa fa-chevron-right"></i>'
    });
}

APP.pages.detail_page = {
    init: init
};
