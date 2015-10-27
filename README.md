# doom

A bunch of useful configurable Gulp tasks global to many projects,
to manage development and production tasks with ease.

- Asset pipeline for SASS, JavaScript, images, and HTML that does compilation with souremaps
and syntax checking in development mode and minification for production mode
- Advanced Bower integration
- Watch changed files with [LiveReload](https://chrome.google.com/webstore/detail/livereload/jnihajbhpnppcggbcgedagnkighmdlei) integration
- Mail inliner 
- Project tasks customization
- Wraith manager

```bash
 gulp ls
 Using gulpfile ~/path/to/gulpfile.js
 Starting 'default'...
 
 Main Tasks
 ------------------------------
     default
     dev
     mail
     prod
     serve
     vendor
 
 Sub Tasks
 ------------------------------
     create:bower_fonts
     create:bower_images
     create:bower_install
     create:bower_scripts
     create:bower_styles
     create:fonts_app
     create:images_app
     create:scripts_app
     create:styles_app
     create:styles_gui
     delete:bower_fonts
     delete:bower_images
     delete:bower_install
     delete:bower_scripts
     delete:bower_styles
     delete:dist
     delete:fonts_app
     delete:images_app
     delete:scripts_app
     delete:styles_app
     delete:styles_gui
     flush:cache_bower
     flush:cache_npm
     mail:delete_styles
     mail:delete_templates
     mail:styles
     mail:styles_convert
     mail:styles_inject
     mail:styles_inliner
     serve:browser-sync
     serve:html
```

## Get Started

Before get started with doom, verify that you have installed node with npm

```bash
which node
which npm
```

if are not installed, install it with brew or similar

```bash
brew install node
```

And verify that gulp and bower are installed globally

```bash
$ sudo npm install -g gulp bower
```

Then you can install doom through npm

```bash
$ sudo npm install -g doom
```

Or through github (you must add the doom and doom/task path to your NODE_PATH)

```bash
$ git clone git@github.com:codezilla-it/doom.git
```

## Set Global Gulp

You must add to your .bashrc or .zshenv the global node_modules path

``` bash
export NODE_PATH=/path/to/node_modules/
```

## Usage

To use:

Create a bower.json into your project root

```json
{
  "name": "project-name",
  "version": "1.0",
  "authors": [
    "Name-1",
    "Name-2"
  ],
  "description": "",
  "main": "",
  "moduleType": [
    "amd"
  ],
  "keywords": [
    "word-1",
    "word-2"
  ],
  "license": "MIT",
  "homepage": "http://project-name.com",
  "private": true,
  "ignore": [
    "**/.*",
    "*.map",
    "*.json",
    "*.md",
    "*.editorconfig",
    "*.yml",
    "bower_components",
    "node_modules",
    "media",
    "test",
    "tests"
  ],
  "dependencies": {
    "plugin-1": "~number-version",
    "plugin-2": "~number-version"
  },
  "devDependencies": {},
  "resolutions": {
    "shim-plugin-1": "~number-version",
    "shim-plugin-2": "~number-version"
  },
  "install": {
    "base": "path/to/static",
    "path": "name_vendor_folder",
    "sources": {
      "plugin-1": [
        "bower_components/path/to/plugin-1.js",
        "bower_components/path/to/plugin-1.css",
        "bower_components/path/to/fonts/*.**",
        "bower_components/path/to/*.{gif,png,jpg,jpeg,svg}"
      ],
      "plugin-2": [
        "bower_components/path/to/plugin-2.js",
        "bower_components/path/to/plugin-2.css",
        "bower_components/path/to/fonts/*.**",
         "bower_components/path/to/*.{gif,png,jpg,jpeg,svg}"
      ]
    },
    "ignore": [
      "plugin-or-dependencies-to-ignore-1",
      "plugin-or-dependencies-to-ignore-2"
    ]
  }
}
```

Then run the gulp install that create the node_modules and bower_components dependencies

```bash
$ gulp install
```

Then create a gulpfile.js at the same level

```javascript
/*
 gulpfile.js
 ===========
 Rather than manage one giant configuration file responsible
 for creating multiple tasks, each task has been broken out into
 its own file in ./tasks. Any files in that directory get
 automatically required below.
 To add a new task, simply add a new task file that directory.
 ./tasks/*.js specifies the default set of tasks to run
 when you run gulp.
 */


require('./doomfile');
require('doom.index');
require('doom.bower');
require('doom.styles');
require('doom.scripts');
require('doom.images');
require('doom.fonts');
require('doom.third_party');
require('doom.mail');
require('doom.serve');
```

And then create a doomfile.js at the same level

```javascript
// ---------------------------------------------
// @doomfile settings
// ---------------------------------------------

// dependecies
var gulp = require('gulp');
var run_sequence = require('run-sequence');

process.wraith = {
    paths: {
        halo: '/halo',
        fulgor: '/fulgor'
    }
};

process.doom = {
    gulp: gulp,
    static: './static',
    templates: './templates',
    common: '/common',
    dist: '/_dist',
    proxy: 'local.dev:8000',
    app: {
        name: 'app',
        styles: '/styles',
        scripts: '/scripts',
        images: '/images',
        fonts: '/fonts'
    },
    gui: {
        name: 'gui',
        styles: '/styles',
        images: '/images'
    },
    mail: {
        root: './mail_system',
        dist: '/static/_dist',
        styles: '/static/styles',
        templates: {
            origin: '/templates/origin',
            inlined: '/templates/inlined'
        }
    },
    bower: {
        name: 'vendor',
        root: '/bower_components',
        static: '/vendor',
        order: [
            'jquery/*.js',
            'modernizr/*.js',
            '**/*.js'
        ],
        include_paths: [
            './bower_components/sass-mediaqueries',
            './bower_components/bourbon/app/assets/stylesheets',
            './bower_components/neat/app/assets/stylesheets'
        ],
        fonts: [
            '/font-awesome'
        ],
        images: []
    },
    third_party: {
        name: 'third_party',
        static: '/third_party'
    },
    serve: {
        styles: '/styles/**/*.{sass,scss}',
        scripts: '/scripts/**/*.js',
        markup: '/**/*.{html, phtml}',
        mail: {
            templates: '/templates/src/**/*.{html}',
            styles: '/styles/sass/**/*.{sass,scss}'
        },
        bower: '/**/*.*',
        third_party: '/**/*.js'
    }
};

var dev = function () {
    gulp.task('dev', ['delete:dist'], function () {
        process.prod = false;
        run_sequence(['create:styles_app', 'create:styles_gui']);
    });
};

var prod = function () {
    gulp.task('prod', ['delete:dist'], function () {
        process.prod = true;
        run_sequence(['create:styles_app', 'create:styles_gui']);
    });
};

var serve = function () {
    gulp.task('serve', function () {
        gulp.watch(serve_paths.styles, {interval: 900}, ['create:styles_app', 'create:styles_gui']);
        gulp.watch(serve_paths.scripts, {interval: 900}, ['create:scripts_app']);
        gulp.watch(serve_paths.markup, {interval: 900}, ['serve:html']);
        gulp.watch(serve_paths.bower, {interval: 900}, ['vendor']);
    });
};

module.exports = {
    dev: dev(),
    prod: prod(),
    serve: serve()
};
```

For verify if node_modules need an update install npm-check

``` bash
$ sudo npm install npm-check -g
```

and then you can update all modules version running

``` bash
$ npm-check -u
```

Now you must simpy include css and js dist into your base template

``` html
<link rel="stylesheet" href="path/to/static/_dist/app.css">
<link rel="stylesheet" href="path/to/static/_dist/vendor.css">
...
<script src="path/to/static/_dist/vendor.js"></script>
<script src="path/to/static/_dist/app.js"></script>
```

## Tasks

### default

Run this task to:

- print the tasks list

``` bash
gulp
```

### vendor

This task create a vendor folder into your static with your plugins 
(images, fonts, and various assets of your choice), then 
create two files vendor.js and vendor.css and exports those (including assets) to dist folder.

``` bash
gulp vendor
```

### dev

Run this task to:

- clean any already generated JS/CSS file 
- compile your SASS files to one unified file (with sourcemaps enabled)

and, parallelly:
- compile your JS browserify files to one unified file (with sourcemaps enabled)

``` bash
gulp dev
```

### prod

Run this task to:

- clean any already generated JS/CSS file 
- compile your SASS files to one unified file and minified CSS file removing 
sourcemaps

and, parallelly:
- compile your JS browserify files to one unified file and uglified JS file removing 
  sourcemaps

``` bash
gulp prod
```

### serve

When you run this task, it will watch your project for changes.
To use this you have to install livereload.


``` bash
gulp serve
```

### mail

Run this task to:

- clean any already generated inlined mail templates
- inline your CSS class to multiple html templates

and, parallelly:
- inject your responsive style after the inliner
- convert your responsive style after the inject into style tag

``` bash
gulp mail
```


## License

This project is released under the MIT license.