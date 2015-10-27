function init(target, target_type, custom_options, callback) {

    var options = null;

    switch (target_type) {

        case 'single':

            options = {

                loop: true,
                stagePadding: 0,
                lazyLoad: false,
                navRewind: true,
                autoplayHoverPause: true,
                mouseDrag: true,
                touchDrag: true,
                pullDrag: true,
                navText: ['<i class="fa-chevron-left fa"></i>', '<i class="fa-chevron-right fa"></i>'],
                autoplay: true,
                items: 1,
                margin: 0,
                nav: true,
                dots: false,
                autoWidth: false,
                autoHeight: false,
                autoplayTimeout: 7000,
                autoplaySpeed: 1000
                //
                ///*animateOut: 'slideOutDown',
                // animateIn: 'flipInX'*/
            };

            break;

        case 'multiple':

            options = {

                loop: true,
                stagePadding: 0,
                lazyLoad: false,
                navRewind: true,
                autoplayHoverPause: true,
                mouseDrag: true,
                touchDrag: true,
                pullDrag: true,
                navText: ['<i class="fa-chevron-left fa"></i>', '<i class="fa-chevron-right fa"></i>'],
                autoplay: true,
                items: 4,
                margin: 0,
                nav: true,
                dots: false,
                autoWidth: false,
                autoHeight: false,

                responsiveClass: true,
                responsive: {
                    0: {
                        items: 1
                    },
                    480: {
                        items: 2
                    },
                    768: {
                        items: 4
                    },
                    992: {
                        items: 6
                    }
                }

            };

            break;

        case 'news-ticker':

            options = {

                loop: true,
                stagePadding: 0,
                lazyLoad: false,
                navRewind: true,
                autoplayHoverPause: true,
                responsiveClass: true,
                mouseDrag: true,
                touchDrag: true,
                pullDrag: true,
                navText: ['<i class="fa-chevron-left fa"></i>', '<i class="fa-chevron-right fa"></i>'],
                autoplay: true,
                items: 1,
                margin: 0,
                nav: false,
                dots: false,
                autoWidth: false,
                autoHeight: false,
                autoplayTimeout: 3000,
                autoplaySpeed: 1000

            };

            break;

        default:

            options = {

                loop: true,
                stagePadding: 0,
                lazyLoad: false,
                navRewind: true,
                autoplayHoverPause: true,
                responsiveClass: true,
                mouseDrag: true,
                touchDrag: true,
                pullDrag: true,
                navText: ['<i class="fa-chevron-left fa"></i>', '<i class="fa-chevron-right fa"></i>'],
                items: 8,
                margin: 0,
                nav: nav,
                dots: false,
                autoWidth: false,
                autoHeight: false,
                autoplay: true,
                autoplayTimeout: 7000,
                autoplaySpeed: 1000
            };

    }

    // set custom options
    if (custom_options !== undefined) {

        options = $.extend(options, custom_options);
    }

    target.owlCarousel(options);


    if(target.find('.owl-item:not(.cloned)').length <= options.items){
        target.find('.owl-nav').hide();
    }

    if(callback) {
        callback(target);
    }

}

module.exports = {
    init: init
};