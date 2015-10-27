
var _carousel = require('../ui/carousel.js');
var _popup = require('../ui/popup.js');
var _map = require('../ui/map.js');

function init() {

    // tooltip
    $('.tooltip-link').tooltip();

    // popover
    $('.popover-link').popover();

    // carousels
    _carousel.init( $('.owl-carousel.single'), 'single' );

    _carousel.init( $('.owl-carousel.multiple'), 'multiple', {lazyLoad: true, margin: 10} );

    // popups
    _popup.init( $('.popup-single-image'), 'single-image' );

    _popup.init( $('.popup-group-image'), 'group-image' );

    _popup.init( $('.popup-group-inline'), 'group-inline' );

    _popup.init( $('.popup-gallery-image'), 'gallery-image' );

    _popup.init( $('.popup-gallery-inline'), 'gallery-inline' );

    _popup.init( $('.popup-with-alert'), 'with-alert' );

    _popup.init( $('.popup-hinge'), 'hinge' );

    _popup.init($('.popup-ajax'), 'ajax');

    _popup.init($('.popup-inline'), 'modal');

    // map
    _map.init($('.map'));

}

APP.pages.shortcodes = {
    init: init
};
