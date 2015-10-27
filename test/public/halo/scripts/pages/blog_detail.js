var _carousel = require('../ui/carousel.js'),
    _share = require('../ui/share.js');

function init() {

    var products = $('.products');

    _share.init();

    _carousel.init(
        products,
        'multiple',
        {
            items: 3,
            margin: 5,
            dots: false,
            responsive: {
                0: {
                    items: 1
                },
                480: {
                    items: 2
                },
                768: {
                    items: 2
                },
                992: {
                    items: 3
                },
                1170: {
                    items: 3
                }
            }
        }
    );

}

APP.pages.blog_detail = {
    init: init
};