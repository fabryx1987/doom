
var _carousel = require('./carousel.js');


function gallery_swap(product, product_thumbs, product_to_swap) {

    product.each(function (i, item) {
        product_to_swap = $(item).find('.gallery__swap')[0];
        product_thumbs = $(item).find('.gallery__thumbs a:not(.active)')
            .clone().removeClass('trigger-content').removeAttr('data-target');
        product_thumbs.appendTo(product_to_swap);
    });
}

function set_image_in_preview(active_thumb) {

    var active = active_thumb,
        this_gallery = active.closest('.gallery'),
        preview = this_gallery.find('.gallery__preview'),
        thumbs = this_gallery.find('.gallery__thumbs'),
        trigger = this_gallery.closest('.product').find('.trigger'),
        active_img = active.find('img');

    thumbs.find('a').removeClass('active');
    active.closest('a').addClass('active');

    preview.find('img').attr({
        src: active_img.attr('src'),
        alt: active_img.attr('alt')
    });

    preview.attr({
        href: active.attr('href'),
        title: active.attr('title')
    });

    trigger.each(function () {

        var this_trigger = $(this);

        if (active.data('target') === this_trigger.data('target')) {

            trigger.removeClass('active');
            this_trigger.addClass('active').prop("checked", true).change();

        }
    });
}

function gallery_thumbs(product) {

    product.on('click', '.gallery__thumbs a', function (e) {

        e.preventDefault();
        e.stopPropagation();
        set_image_in_preview($(this));
    });

    set_image_in_preview(product.find('.gallery__thumbs a.active'));
}

function gallery_triggers(product) {

    product.on('change', '.trigger', function () {

        var active = $(this),
            trigger = active.closest('.product').find('.trigger'),
            trigger_content = active.closest('.product').find('.trigger-content'),
            thumbs = active.closest('.product').find('.gallery__thumbs'),
            preview = active.closest('.product').find('.gallery__preview');

        trigger.removeClass('active');
        active.addClass('active');
        trigger_content.removeClass('active');

        thumbs.find('.owl-item').each(function (i) {

            var this_trigger_content = $(this).find('.trigger-content');

            // item to show into preview
            if (active.data('target') === this_trigger_content.data('target')) {

                thumbs.find('a').removeClass('active');
                this_trigger_content.addClass('active');

                preview.find('img').attr({
                    src: this_trigger_content.find('img').attr('src')
                });

                preview.attr({
                    href: this_trigger_content.attr('href')
                });

                // on radio click slide owlcarousel to position [ position, speed, offset ];
                thumbs.trigger('to.owl.carousel', [i, 100, true]);
            }
        });
    });
}

function init(products_container, index) {

    var product = $(products_container.find('.product')[index]),
        gallery = product.find('.gallery'),
        thumbs = product.find('.gallery__thumbs');

    _carousel.init(
        thumbs,
        'multiple',
        {
            margin: 0,
            dots: false,
            nav: true,
            autoplay: false,

            callbacks: true,
            loop: false,

            responsive: {
                0: {
                    items: 4
                },
                320: {
                    items: 5
                },
                480: {
                    items: 6
                },
                768: {
                    items: 4
                },
                992: {
                    items: 4
                }
            },
            navRewind: false // add .disabled on owl-nav first and last if items are less than display
        }
    );

    gallery_triggers(product);
    gallery_swap(product);
    gallery_thumbs(product);
}

module.exports = {
    init: init
};