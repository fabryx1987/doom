function init() {

    $.fn.to_decimal_string = function (target) {

        return target.toFixed(2).toString().replace('.', ',');
    };

    $.fn.to_string_split = function (target) {

        return target.toString().split(',');
    };

    $.fn.activate_tab = function (id) {

        if (id === '' || !$(id).exists()) {
            return;
        }
        var active_tab = $('[href=' + id + ']');
        active_tab.tab('show');
    };

    $.fn.go_to_tab = function (id) {

        if (id === '' || !$(id).exists()) {
            return;
        }

        APP.global.body.activate_tab(id);
        var scroll_top_offset = $(id).offset().top - 55;
        APP.global.body.animate({'scrollTop': scroll_top_offset});
    };

    $.fn.get_input_field = function (id_container) {

        return $($(id_container).find('input, select, textarea')[0]);
    };

    $.fn.show_more = function (link) {

        var link_text = link.text();

        link.on('click', function (e) {

            e.preventDefault();
            var collapsed_group = link.closest('.collapsed-group');
            var collapsed = collapsed_group.find('.collapsed');
            var truncated = collapsed_group.find('.truncated');

            if (!truncated.hasClass('hide')) {
                link.text('[ Nascondi ]');
                truncated.display_none();
                collapsed.display_block();
            }
            else {
                link.text(link_text);
                truncated.display_block();
                collapsed.display_none();
            }

        });
    };

    $.fn.show_text_ellipsis = function (link) {

            var link_text = link.text();

            link.on('click', function (e) {

                e.preventDefault();
                var ellipsed_group = link.closest('.js-ellipsed-group'),
                    text = ellipsed_group.find('.text'),
                    text_dots = ellipsed_group.find('.text-ellipsis__dots');

                text.toggleClass('text-ellipsis');

                if (!text.hasClass('text-ellipsis')) {
                    link.text('[ Nascondi ]');
                    text_dots.hide();
                }
                else {
                    link.text(link_text);
                    text_dots.show();
                }

            });
        };

    $.fn.set_full_width_section = function () {

        var wrap_w = $('#wrap').width();
        var window_w = $(window).width();

        this.css({
            'margin-left': -((window_w - wrap_w) / 2),
            'width': window_w
        });
    };

    $.fn.enable_dropdown_link = function (selector) {

        selector.attr('data-toggle', 'dropdown disable');
    };

    $.fn.disable_dropdown_link = function (selector) {

        selector.attr('data-toggle', 'dropdown');
    };

    $.fn.disable_mobile_page_scroll = function () {

        this.addClass('no-scrollable');
    };

    $.fn.enable_mobile_page_scroll = function () {

        this.removeClass('no-scrollable');
    };

    // -- end utils

    $.fn.display_block = function () {

        this.removeClass('hide').addClass('block');
    };

    $.fn.display_none = function () {

        this.removeClass('block').addClass('hide');
    };

    $.fn.ajax_submit_form = function (url, options) {
        if (options === undefined) {
            options = {};
        }

        var data = $(this).serialize();

        var ajax_options = {
            type: "POST",
            url: url,
            data: data,
            dataType: 'json'
        };

        var jqXHR = $.ajax($.extend(ajax_options, options));

        if (options.done_fun !== undefined) {
            jqXHR.done(options.done_fun);
        }

        if (options.fail_fun !== undefined) {
            jqXHR.fail(options.fail_fun);
        }
    };

    $.fn.exists = function () {

        return !!this.length;
    };

    $.fn.remove_class_prefix = function (prefix) {

        this.each(function (i, el) {
            var classes = el.className.split(' ').filter(function (c) {
                return c.lastIndexOf(prefix, 0) !== 0;
            });
            el.className = $.trim(classes.join(' '));
        });
        return this;
    };

    $.fn.push_to = function (direction) {

        this.addClass('push-to-' + direction);
    };

    $.fn.pull_to = function (direction) {

        this.addClass('pull-to-' + direction);
    };

    $.fn.is_mobile = function () {

        return (Modernizr.mq('(max-width: 992px)'));
    };

    $.deparam = window.deparam;

    $.get_object_size = function (obj) {
        var count = 0;
        for (var el in obj) {
            if (obj.hasOwnProperty(el)) {
                count++;
            }
        }
        return count;
    };

    $.fn.dynamic_center_vertically = function () {
        this.css({
            'margin-top': -(this.outerHeight() / 2).toString() + 'px',
            'margin-left': -(this.outerWidth() / 2).toString() + 'px'
        });
    };

    $.fn.go_to_top = function go_to_top() {
        APP.global.body.animate({
            scrollTop: 0
        }, 500);
    };

    $.fn.go_to_anchor = function() {

        var $ctx = $(this);

        if($ctx.children().size()) {
            $ctx = $ctx.find("a");
        }

        $ctx.on("click", function(e) {

            var target = $($(e.target).attr("href"));

             APP.global.body.animate({
                scrollTop: target.offset().top
            }, 500);

            e.preventDefault();
        });
    };

    $.fn.create_preloader = function (preloader_container) {

        var preloader_overlay = $('.preloader-overlay').clone(),
            preloader = $('.preloader');

        $(preloader_container).before(preloader_overlay);
        $(preloader_container).before(preloader.clone());
        $(preloader_container).parent().addClass('preloader-parent');

        preloader = $(preloader_container).siblings('.preloader');
        preloader.addClass('fixed');
        preloader.dynamic_center_vertically();
    };

    $.fn.remove_preloader = function (preloader_parent) {

        if (preloader_parent.hasClass('preloader-parent')) {
            preloader_parent.find('.preloader-overlay').remove();
            preloader_parent.find('.preloader').remove();
        }
    };
}

module.exports = {
    init: init
};
