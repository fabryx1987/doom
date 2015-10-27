var _catalog = require('../logic/catalog.js'),
    _sidebar = require('../ui/navigation/sidebar.js');

function init() {

    var products_container = $('.products'),
        page_title = $('.page-title'),
        page_description = $('.page-description'),
        products_count = $('.products-count'),
        sidebar_filter = APP.global.sidebar.find('.filter'),
        selected_list = sidebar_filter.find('.selected').find('ul'),
        attribute_list = sidebar_filter.find('.attribute').find('ul'),
        filter_attributes_container = sidebar_filter.find('#filter-attributes'),
        active_params;

    // toggle (add/remove) from filters
    sidebar_filter.on('click', 'a', function (e) {

        e.preventDefault();

        var clicked_a = $(this),
            clicked_li = clicked_a.closest('li');

        $('.catalog-list .landing-page').remove();

        if (APP.global.is_mobile === true) {
            _sidebar.close_sidebar();
            $('#filter-trigger').removeClass('active');
        }

        if (clicked_a.closest('.attribute').length) {

            $(this).go_to_top();

            if (clicked_li.hasClass('active')) {
                _catalog.deselect_item(clicked_li, attribute_list);
                _catalog.remove_from_container(clicked_li, selected_list);
            }
            else {
                _catalog.select_item(clicked_li, attribute_list);
                _catalog.add_to_container(clicked_li, selected_list);
            }

            selected_list.change();

        }
        else if (clicked_a.closest('.selected').length) {

            _catalog.remove_from_container(clicked_li, selected_list);
            _catalog.deselect_item(clicked_li, attribute_list);
            selected_list.change();
        }

        _catalog.handle_visibility(selected_list);
    });

    selected_list.on('change', function (e) {

        e.preventDefault();

        products_count.display_none();
        products_container.empty();
        products_container.data('catalog-length', 0);

        active_params = _catalog.transform_filter_to_params(sidebar_filter);
        var landing_page = _catalog.extract_attr_from_href('landing_page', location.href, null);
        if(landing_page)
            active_params['landing_page'] = landing_page;

        _catalog.inject_products(active_params, products_container, filter_attributes_container,
            products_count, page_title, page_description);
    });

    active_params = $.deparam(History.getState().hash.split('?')[1] || '');
    _catalog.inject_products(active_params, products_container, filter_attributes_container,
        products_count, page_title, page_description);
}

APP.pages.catalog = {
    init: init
};