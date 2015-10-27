var _gallery = require('../ui/gallery.js'),
    _popup = require('../ui/popup.js'),
    _product = require('../logic/product.js'),
    _gae = require('../logic/ga_enhanced.js');

var void_box = $('.void-box');

function handle_visibility(list) {

    if (list.find('li').length) {

        list.parent().display_block();
    } else {

        list.parent().display_none();
    }
}

function match_data_attribute(li, list) {

    return list.children().filter(function () {
        return $(this).data('param-name') === li.data('param-name') &&
            $(this).data('param-value') === li.data('param-value');
    });
}

function select_item(li, list) {

    var item_to_select = match_data_attribute(li, list);
    item_to_select.addClass('active')
        .addClass('icon-check')
        .addClass('icon-green');
}

function deselect_item(li, list) {

    var item_to_deselect = match_data_attribute(li, list);
    item_to_deselect.removeClass('active')
        .removeClass('icon-check')
        .removeClass('icon-green');

    if (item_to_deselect.hasClass('hide')) {
        item_to_deselect.display_block();
    }
}

function add_to_container(li, list) {

    if (list.find('[data-param-name="ricerca"]').exists()) {
        list.find('[data-param-name="ricerca"]').remove();
    }
    var cloned_li = li.clone();
    cloned_li.appendTo(list);
    cloned_li.addClass('icon-remove')
        .removeClass('icon-check')
        .removeClass('icon-green')
        .removeClass('hide');
    handle_visibility(list);
}

function remove_from_container(li, list) {

    var item_to_remove = match_data_attribute(li, list);
    item_to_remove.remove();
    handle_visibility(list);
}

function extract_query_string_params(href) {

    var d = {
        pagina: extract_attr_from_href('pagina', href),
    }
    var landing_page = extract_attr_from_href('landing_page', href, '');
    if(landing_page)
        d['landing_page'] = landing_page;

    return d;
}

function transform_filter_to_params(filter) {

    var params = {},
        params_flatten = {},
        key,
        value,
        clicked_li;

    filter.find('.selected li').each(function () {

        clicked_li = $(this);

        key = clicked_li.data('param-name');
        value = clicked_li.data('param-value');

        if (!(key in params)) {
            params[key] = [];
        }
        params[key].push(value);
    });

    $.each(params, function (key, value) {
        params_flatten[key] = value.join(',');
    });

    return params_flatten;
}

function update_url(params) {

    var new_state;

    if ($.isEmptyObject(params)) {
        new_state = History.getBasePageUrl();
    }
    else {
        new_state = '?' + decodeURIComponent($.param(params));
    }
    History.replaceState(null, null, new_state);
}

function extract_attr_from_href(attr, href, dflt) {
    if (dflt === undefined)
        dflt = 1;
    var regex = new RegExp(attr + '=([\\w\\-\\_]+)');
    var match = regex.exec(href);
    if (match)
        return match[1];

    return dflt;
}

function set_noindex_meta(noindex) {
    $('meta[name="ROBOTS"]').remove();
    if(noindex)
        $('head').append($('<meta name="ROBOTS">').attr('content', "NOINDEX, NOFOLLOW"));

}

function inject_products(params, products_container, filter_attributes_container,
                         products_count, page_title, page_description,
                         products_only) {

    var catalog_length = products_container.data('catalog-length'),
        sidebar_filter = APP.global.sidebar.find('.filter'),
        selected_list = sidebar_filter.find('.selected').find('ul'),
        products_only = products_only || false;

    if (products_only)
        params['products_only'] = 1;

    var jqXHR = $.ajax({
        type: "GET",
        url: APP.url['get_catalog_products'],
        data: jQuery.extend({'pagina': 1}, params),
        dataType: 'json',
        preloader_container: '#main'
    });

    // Now strip out products_only to avoid passing it on
    delete params['products_only'];

    jqXHR.done(function (data) {
        products_container.html(data.html_products_list);

        products_container.data('catalog-length', catalog_length + data.products_count);
        products_count.find('.number').text(data.products_tot_count);
        products_count.display_block();

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

        if (!products_only) {
            if ('html_filters' in data) {
                filter_attributes_container.html(data.html_filters);
            }

            // Sync H1 and description
            if ('seo_titolo' in data && data['seo_titolo'] !== '') {
                page_title.html(data.seo_titolo);
            } else {
                page_title.html('Catalogo Prodotti');
            }
            if (page_description) {
                if ('seo_descrizione' in data && data['seo_descrizione'] !== '') {
                    page_description.text(data.seo_descrizione);
                } else {
                    page_description.text('');
                }
            }
        }

        // Update rel links
        $('link[rel="prev"]').remove();
        $('link[rel="next"]').remove();

        if (data.previous_page)
            $('head').append($('<link rel="prev">').attr('value', data.previous_page));
        if (data.next_page)
            $('head').append($('<link rel="next">').attr('value', data.next_page));

        // Update ROBOTS meta
        set_noindex_meta(data.noindex);

        update_url(params);

        if (data.products_count > 1) {
            $('.pagination li a[href!="#"]').on('click', function (e) {
                e.preventDefault();
                $(this).go_to_top();

                products_count.display_none();
                products_container.empty();
                products_container.data('catalog-length', 0);

                active_params = jQuery.extend(extract_query_string_params(this.href), transform_filter_to_params(sidebar_filter));

                inject_products(active_params, products_container, filter_attributes_container, products_count, page_title, page_description);
            });

            // Hook cart tracking
            _gae.init_cart_tracking();
            _gae.init_product_impression_tracking(true);
        }

        if (data.products_tot_count > 0) {
            void_box.hide();
        }
        else {
            void_box.show();
        }

        $('#filter-attributes').find('.scrollbar-dynamic').scrollbar();
        products_container.find('.scrollbar-dynamic').scrollbar();

        selected_list.empty();
        sidebar_filter.find('li.attribute').find('.active').each(function (e) {
            add_to_container($(this), selected_list);
        });
    });
}


module.exports = {

    handle_visibility: handle_visibility,
    match_data_attribute: match_data_attribute,
    select_item: select_item,
    deselect_item: deselect_item,
    add_to_container: add_to_container,
    remove_from_container: remove_from_container,
    transform_filter_to_params: transform_filter_to_params,
    extract_query_string_params: extract_query_string_params,
    extract_attr_from_href: extract_attr_from_href,
    inject_products: inject_products
};