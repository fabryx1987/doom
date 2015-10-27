(function (d, t) {
        var f = d.createElement(t), s = d.getElementsByTagName(t)[0];
        f.async = 1;
        f.src = ('https:' == location.protocol ? 'https:' : 'http:') + '//cdn.doofinder.com/media/js/doofinder-4.latest.min.js';
        s.parentNode.insertBefore(f, s)
    }(document, 'script')
);

if (!doofinder) {
    var doofinder = {};
}
doofinder.options = {
    "lang": "it",
    "zone": "eu1",
    "results": {
        "width": 600,
        "defaultTemplate": "GridView"
    },
    "header": {},
    "queryInput": "#id_ricerca",
    "hashid": "0e8d6f0ba21fbbfd2c66c0db90104055",
    "showInMobile": false
};