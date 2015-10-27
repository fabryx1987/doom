// global vars
APP.global = require('./core/globals.js').global;

// Browserify entry points
require('./core/utils.js').init();
require('./core/common.js').init();
require('./pages/catalog.js');
require('./pages/checkout.js');
require('./pages/detail_page.js');
require('./pages/flash_sale.js');
require('./pages/user_admin.js');
require('./pages/homepage.js');
require('./pages/landing_page_closed.js');
require('./pages/shortcodes.js');
require('./pages/type.js');
require('./pages/blog_detail.js');
