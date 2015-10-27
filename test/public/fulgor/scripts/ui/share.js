function init() {

    $('.share').on('click', '.share__child',  function() {
        
        var $event_target = $(this),
            url = location.href,
            utm = $event_target.data('utm'),
            sep = '?';

        if(location.href.indexOf('?') !== -1) {
            sep = '&'
        }

        if(utm) {
            url = url + encodeURIComponent(sep) + utm;
        }

        var $data = $event_target.data("network"),
            open_popup = {
                pinterest: function() {},
                twitter: function(){ window.open("http://twitter.com/share?text=&url=" + url, "Condividi", "width=600,height=400"); },
                facebook: function(){ window.open("http://facebook.com/sharer/sharer.php?u=" + url, "Condividi", "width=600,height=400"); },
                googleplus: function(){ window.open("http://plus.google.com/share?url=" + url, "Condividi", "width=600,height=400"); },
                envelope: function(){ location.href = "mailto:?subject=" + document.title + "&body="+ url; }
            };

            open_popup[$data]();
    });
}

module.exports = {
    init: init
};
