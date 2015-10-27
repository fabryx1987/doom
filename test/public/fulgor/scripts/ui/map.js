
function init(target) {

    target.each(function () {

        var map = $(this);
        var map_id = map.attr('id');
        var map_type = map.data('map-type');
        var map_lat = map.data('map-lat');
        var map_lon = map.data('map-lon');
        var map_zoom = parseInt(map.data('map-zoom'));
        var map_pin = map.data('map-pin');
        var map_title = map.data('map-title');
        var map_info = map.data('map-info');
        var map_scroll = map.data('map-scroll');
        var map_drag = map.data('map-drag');
        var map_zoom_control = map.data('map-zoom-control');
        var map_disable_doubleclick = map.data('map-disable-doubleclick');
        var map_streetview = map.data('map-streetview');
        var latlng = new google.maps.LatLng(map_lat, map_lon);
        var options = {
            scrollwheel: map_scroll,
            draggable: map_drag,
            zoomControl: map_zoom_control,
            disableDoubleClickZoom: map_disable_doubleclick,
            zoom: map_zoom,
            center: latlng,
            streetViewControl: map_streetview
        };

        switch (map_type) {
            case 'HYBRID':
                options.mapTypeId = google.maps.MapTypeId.HYBRID;
                break;
            case 'ROADMAP':
                options.mapTypeId = google.maps.MapTypeId.ROADMAP;
                break;
            case 'SATELLITE':
                options.mapTypeId = google.maps.MapTypeId.SATELLITE;
                break;
            case 'TERRAIN':
                options.mapTypeId = google.maps.MapTypeId.TERRAIN;
                break;
        }

        map = new google.maps.Map(document.getElementById(map_id), options);


        if (map_pin) {
            var marker = new google.maps.Marker({
                position: latlng,
                map: map,
                title: map_title,
                icon: map_pin
            });

            if (map_info) {
                var infowindow = new google.maps.InfoWindow({
                    content: map_info
                });


                google.maps.event.addListener(marker, 'click', function () {
                    infowindow.open(map, marker);
                });
            }
        }
    });

}

module.exports = {
    init: init
};