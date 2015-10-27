var _carousel = require('../ui/carousel.js'),
    _gae = require('../logic/ga_enhanced.js');

function init() {

    var products_carousel = $('.products-carousel');

    //_carousel.init( $('.singleton'), 'single', { loop: false, nav: false, dots: false } );
    //
    //_carousel.init( $('.teaser-lg:not(.singleton)'), 'single', { nav: true, dots: false } );
    //
    //_carousel.init( $('.teaser-sm:not(.singleton)'), 'single', { nav: false, dots: false } );


    _carousel.init( $('.teaser-lg'), 'single', { loop: true, nav: true, dots: false}, function(target) {

        target.on('translated.owl.carousel', function(event) {

            var target  = event.target,
                item    = event.item.index,
                name    = event.type,
                el      = $(target).find("img").eq(item);

            _gae.track_promotion(el, name);
        });
    });

    _carousel.init($('.product-gallery').find('.owl-carousel'), 'news-ticker');

    _carousel.init(
        products_carousel.find('.owl-carousel'),
        'multiple',
        {
            margin: 0,
            dots: false,
            nav: true,
            autoplay: false,
            responsive: {
                0: {
                    items: 1
                },
                480: {
                    items: 2
                },
                768: {
                    items: 1
                },
                992: {
                    items: 2
                },
                1200: {
                    items: 3
                }
            }
        }
    );
}

APP.pages.homepage = {
    init: init
};
