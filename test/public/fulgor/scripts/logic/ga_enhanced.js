/*
 * Handles Google Analytics Enhanced Ecommerce tracking.
 */

var ga_enabled = typeof ga !== "undefined";


function init_promotion_tracking() {

    // Only track images' impressions
    $('img.js-ga-teaser').each(function() {
        track_promotion(this, 'impression');
    });
    // Track clicks on every promotion link
    $('.js-ga-teaser').on('click', function(e) {
        e.preventDefault();
        track_promotion(this, 'click');
        var href = this.href || this.parentElement.href;
        if(href)
            window.location.replace(href);
    });
}


function init_cart_tracking() {

    var js_add_to_cart = $('.js-add-to-cart'),
        js_rm_from_cart = $('.js-rm-from-cart'),
        spinbox_up = $('.spinbox .spinbox-up'),
        spinbox_down = $('.spinbox .spinbox-down');

    // Disable previous handler to avoid double invocations on ajax pages
    js_add_to_cart.unbind('click', track_add_to_cart);
    js_rm_from_cart.unbind('click', track_rm_from_cart);

    js_add_to_cart.on('click', track_add_to_cart);
    js_rm_from_cart.on('click', track_rm_from_cart);

    spinbox_up.on('click', track_cart_qty_up);
    spinbox_down.on('click', track_cart_qty_down);
}


function init_product_impression_tracking(send) {

    var send = send || false;
    $('.product').each(track_product_impression);
    if(send)
        send_event();
}


function ga_decorator(f) {

    if(!ga_enabled)
        return function() {
            if(APP.data['debug'])
                console.log("Dropping call to " + f.toString());
        };

    return f;
}


function track_add_to_cart(e) {

    if($(this).hasClass('js-ga-cart-local')) {
        var el = $(this);
        var position = el.data('position');
    } else {
        var el = $($('.js-product-row-active input[type="radio"]')[0]);
        var position = $(this).data('position');
    }

    // Avoid trouble: drop out if we could not find our guy
    if(!el)
        return;

    if($(this).hasClass('js-ga-cart-multiple')) {
        _track_add_to_cart_multiple($(this).data('id-paginavendita-referenza').split(','));
    } else {

        ga('ec:addProduct', {
            'id': '[SP' + el.data('sp-id') + '][RF' + el.data('rf-id') + ']',
            'name': el.data('name'),
            'category': el.data('category'),
            'brand': el.data('brand'),
            'variant': el.data('variant'),
            'price': el.data('price-gp'),
            'quantity': el.data('quantita-da-ordinare')
        });
    }

    ga('ec:setAction', 'add');
    ga('send', 'event', position || 'unknown', 'click', 'add to cart');
}


function track_cart_qty_up() {

    // FIXME: find a better way
    var el = $($(this).parents()[4]).find('.js-rm-from-cart');

    if(!el)
        return;

    ga('ec:addProduct', {
        'id': '[SP' + el.data('sp-id') + '][RF' + el.data('rf-id') + ']',
        'name': el.data('name'),
        'category': el.data('category'),
        'brand': el.data('brand'),
        'variant': el.data('variant'),
        'price': el.data('price-gp'),
        'quantity': 1
    });

    ga('ec:setAction', 'add');
    ga('send', 'event', 'checkout:cart', 'click', 'qty UP');
}


function track_cart_qty_down() {

    // FIXME: find a better way
    var el = $($(this).parents()[4]).find('.js-rm-from-cart');

    if(!el)
        return;

    ga('ec:addProduct', {
        'id': '[SP' + el.data('sp-id') + '][RF' + el.data('rf-id') + ']',
        'name': el.data('name'),
        'category': el.data('category'),
        'brand': el.data('brand'),
        'variant': el.data('variant'),
        'price': el.data('price-gp'),
        'quantity': 1
    });

    ga('ec:setAction', 'remove');
    ga('send', 'event', 'checkout:cart', 'click', 'qty DOWN');
}


function _track_add_to_cart_multiple(ids) {

    $(ids).each(function(i, v) {
        var el = $('#js-product-data-' + v);
        if(!el)
            return;

        ga('ec:addProduct', {
            'id': '[SP' + el.data('sp-id') + '][RF' + el.data('rf-id') + ']',
            'name': el.data('name'),
            'category': el.data('category'),
            'brand': el.data('brand'),
            'variant': el.data('variant'),
            'price': el.data('price-gp'),
            'quantity': el.data('quantita-da-ordinare')
        });
    });
}


function track_rm_from_cart(e) {

    var el = $(this);

    // Avoid trouble: drop out if we could not find our guy
    if (!el)
        return;

    // FIXME: find a better way
    var qty = $(el.parents()[2]).find('.spinbox-input').val() || 1;

    ga('ec:addProduct', {
        'id': '[SP' + el.data('sp-id') + '][RF' + el.data('rf-id') + ']',
        'name': el.data('name'),
        'category': el.data('category'),
        'brand': el.data('brand'),
        'variant': el.data('variant'),
        'price': el.data('price-gp'),
        'quantity': qty
    });

    ga('ec:setAction', 'remove');
    ga('send', 'event', 'checkout:cart', 'click', 'remove from cart');
}


function track_product_impression(i, product) {

    var el = $($(product).find('*[data-sp-id]')[0]);
    if(!el.length)
        return;

    var position = el.data('position') || $($(product).find('*[data-position]')[0]).data('position');

    ga('ec:addImpression', {
      'id': el.data('sp-id'),
      'name': el.data('name'),
      'type': 'view',
      'category': el.data('category'),
      'brand': el.data('brand'),
      'list': position
    });
}


function track_promotion(el, action) {

    var id = $(el).data('teaser-id');
    var name = id;
    var position = $(el).data('teaser-position');
    var creative = $(el).attr("src");

    ga('ec:addPromo', {
        'id': id,
        'name': name,
        'position': position,
        'creative': creative
    });

    if(action == 'click') {
        ga('ec:setAction', 'promo_click');
        ga('send', 'event', 'Internal Promotions', 'click', name);
    }

    if(action == 'translated') {
      send_event();
    }
}


function track_shipping() {

    ga('ec:setAction', 'checkout', {
        'step': 1
    });
    send_event();
}


function track_frequency(frequency_type, delivery_type) {

    ga('ec:setAction', 'checkout', {
        'step': 2,
        'option': frequency_type + '-' + delivery_type
    });
    send_event();
}


function track_payment(payment_type) {

    ga('ec:setAction', 'checkout', {
        'step': 3,
        'option': payment_type
    });
    send_event();
}


function track_success() {

    ga('ec:setAction', 'checkout', {
        'step': 4
    });
    send_event();
}


function send_event() {

    ga('send', 'pageview');
}


module.exports = {
    init_product_impression_tracking: ga_decorator(init_product_impression_tracking),
    init_promotion_tracking: ga_decorator(init_promotion_tracking),
    init_cart_tracking: ga_decorator(init_cart_tracking),
    track_shipping: ga_decorator(track_shipping),
    track_promotion: ga_decorator(track_promotion),
    track_frequency: ga_decorator(track_frequency),
    track_payment: ga_decorator(track_payment),
    track_success: ga_decorator(track_success)
};
