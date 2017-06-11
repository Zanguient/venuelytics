var gulp        = require('gulp'),
    concat      = require('gulp-concat'),
    uglify      = require('gulp-uglify'),
    jade        = require('gulp-jade'),
    less        = require('gulp-less'),
    path        = require('path'),
    livereload  = require('gulp-livereload'), // Livereload plugin needed: https://chrome.google.com/webstore/detail/livereload/jnihajbhpnppcggbcgedagnkighmdlei
    marked      = require('marked'), // For :markdown filter in jade
    path        = require('path'),
    changed     = require('gulp-changed'),
    prettify    = require('gulp-html-prettify'),
    w3cjs       = require('gulp-w3cjs'),
    rename      = require('gulp-rename'),
    flip        = require('css-flip'),
    through     = require('through2'),
    gutil       = require('gulp-util'),
    gulpif = require('gulp-if'),
    war = require('gulp-war'),
    zip = require('gulp-zip'),
    filter = require('gulp-filter'),
    htmlify     = require('gulp-angular-htmlify'),
    replace = require('gulp-replace'),
    awspublish = require('gulp-awspublish'),
    gulpSequence = require('gulp-sequence'),
    CacheBuster  = require('gulp-cachebust'),
    templateCache = require('gulp-angular-templatecache'),
    del = require('del'),
    connect = require('gulp-connect'),
    jshint = require('gulp-jshint'),
    jeditor = require('gulp-json-editor');
    PluginError = gutil.PluginError;


	var cachebust = new CacheBuster();

// LiveReload port. Change it only if there's a conflict
var lvr_port = 35729;

var W3C_OPTIONS = {
  // Set here your local validator if your using one. leave it empty if not
  //uri: 'http://validator/check',
  doctype: 'HTML5',
  output: 'json',
  // Remove some messages that angular will always display.
  filter: function(message) {
    if( /Element head is missing a required instance of child element title/.test(message) )
      return false;
    if( /Attribute .+ not allowed on element .+ at this point/.test(message) )
      return false;
    if( /Element .+ not allowed as child of element .+ in this context/.test(message) )
      return false;
    if(/Comments seen before doctype./.test(message))
      return false;
  }
};

// ignore everything that begins with underscore
var hidden_files = '**/_*.*';
var ignored_files = '!'+hidden_files;

//  Edit here the scripts that will be included statically
//  in the app. Compiles to vendor/base.js
var vendorBaseScripts = [
  // jQuery
  '../vendor/jquery/jquery.min.js',
  // Angular
  '../vendor/angular/angular.min.js',
  '../vendor/angular/angular-route.min.js',
  '../vendor/angular/angular-cookies.js',
  '../vendor/angular/angular-animate.min.js',
  '../vendor/angular/angular-ui-router.js',
  '../vendor/angular/angular-sanitize.min.js',
  '../vendor/angular/angular-resource.min.js',
  '../vendor/angular/angular-cookies.min.js',
  // '../vendor/angular/angular-touch.js',
  // Angular storage
  '../vendor/angularstorage/ngStorage.js',
  // Angular Translate
  '../vendor/angulartranslate/angular-translate.js',
  '../vendor/angulartranslate/angular-translate-loader-url.js',
  '../vendor/angulartranslate/angular-translate-loader-static-files.js',
  '../vendor/angulartranslate/angular-translate-storage-local.js',
  '../vendor/angulartranslate/angular-translate-storage-cookie.js',
  // oclazyload
  '../vendor/oclazyload/ocLazyLoad.min.js',
  // UI Bootstrap
  '../vendor/bootstrap/js/ui-bootstrap-tpls-0.11.0.min.js',
  // Loading Bar
  '../vendor/loadingbar/loading-bar.js',
  // color spectrum
  '../vendor/spectrumcolor/angular-spectrum-color-min.js',
  '../vendor/ngDialog/js/ngDialog.min.js',
  '../vendor/ngImgMap/compile/ng-img-map.min.js'
];

// also add in constants.js
var dynamicScriptFiles = [
    '../vendor/skycons/skycons.js', 
    '../vendor/fontawesome/css/font-awesome.min.css',
    '../vendor/simplelineicons/simple-line-icons.css',
    '../vendor/weathericons/css/weather-icons.min.css',
    '../vendor/modernizr/modernizr.js',
    '../vendor/fastclick/fastclick.js',
    '../vendor/filestyle/bootstrap-filestyle.min.js',
    '../vendor/csspinner/csspinner.min.css',
    '../vendor/animo/animo.min.js',
    '../vendor/sparklines/jquery.sparkline.min.js',
    '../vendor/slimscroll/jquery.slimscroll.min.js',
    '../vendor/screenfull/screenfull.min.js',
    '../vendor/classyloader/js/jquery.classyloader.min.js',
    '../vendor/jvectormap/jquery-jvectormap-1.2.2.min.js',
    '../vendor/jvectormap/maps/jquery-jvectormap-world-mill-en.js',
    '../vendor/jvectormap/jquery-jvectormap-1.2.2.css',
    '../vendor/gmap/load-google-maps.js',
    '../vendor/gmap/jquery.gmap.min.js',
    '../vendor/flot/jquery.flot.min.js',
    '../vendor/flot/jquery.flot.tooltip.min.js',
    '../vendor/flot/jquery.flot.resize.min.js',
    '../vendor/flot/jquery.flot.pie.min.js',
    '../vendor/flot/jquery.flot.time.min.js',
    '../vendor/flot/jquery.flot.categories.min.js',
    '../vendor/flot/jquery.flot.spline.min.js',
    '../vendor/jqueryui/jquery-ui.min.js',
    '../vendor/touch-punch/jquery.ui.touch-punch.min.js',
    '../vendor/chosen/chosen.jquery.min.js',
    '../vendor/chosen/chosen.min.css',
    '../vendor/slider/js/bootstrap-slider.js',
    '../vendor/slider/css/slider.css',
    '../vendor/moment/min/moment-with-locales.min.js',
    '../vendor/fullcalendar/dist/fullcalendar.min.js', 
    '../vendor/fullcalendar/dist/fullcalendar.css',
    '../vendor/codemirror/lib/codemirror.js',
    '../vendor/codemirror/lib/codemirror.css',
    '../vendor/codemirror/addon/mode/overlay.js',
    '../vendor/codemirror/mode/markdown/markdown.js',
    '../vendor/codemirror/mode/xml/xml.js',
    '../vendor/codemirror/mode/gfm/gfm.js',
    '../vendor/marked/marked.js',
    '../vendor/tagsinput/bootstrap-tagsinput.min.js', 
    '../vendor/tagsinput/bootstrap-tagsinput.css',
    '../vendor/inputmask/jquery.inputmask.bundle.min.js',
    '../vendor/wizard/js/bwizard.min.js',
    '../vendor/parsley/parsley.min.js',
    '../vendor/datatable/media/js/jquery.dataTables.min.js', 
    '../vendor/datatable/extensions/datatable-bootstrap/css/dataTables.bootstrap.css',
    '../vendor/datatable/extensions/datatable-bootstrap/js/dataTables.bootstrap.js',
    '../vendor/datatable/extensions/datatable-bootstrap/js/dataTables.bootstrapPagination.js',
    '../vendor/datatable/extensions/ColVis/js/dataTables.colVis.min.js', 
    '../vendor/datatable/extensions/ColVis/css/dataTables.colVis.css',
    '../vendor/flatdoc/flatdoc.js',
    '../vendor/spectrumcolor/js/spectrum.js',
    '../vendor/spectrumcolor/css/spectrum.css',
    '../vendor/ngDialog/js/ngDialog.min.js', 
    '../vendor/ngDialog/css/ngDialog.min.css', 
    '../vendor/ngDialog/css/ngDialog-theme-default.min.css',
    '../vendor/ngImgMap/compile/ng-img-map.css',
    '../vendor/ngImgMap/compile/ng-img-map.js',
    '../vendor/toaster/toaster.css',
    '../vendor/toaster/toaster.js',
    '../vendor/spectrumcolor/js/angular-spectrum-color-min.js',
    '../vendor/fontawesome/fonts/fontawesome-webfont.ttf',
    '../vendor/simplelineicons/fonts/Simple-Line-Icons.ttf',
    '../vendor/weathericons/fonts/weathericons-regular-webfont.ttf',
    '../vendor/fontawesome/fonts/fontawesome-webfont.woff',
    '../vendor/fontawesome/fonts/fontawesome-webfont.woff2',
    '../vendor/weathericons/fonts/weathericons-regular-webfont.woff',
    '../vendor/simplelineicons/fonts/Simple-Line-Icons.woff'
];


// SOURCES CONFIG 
var source = {
  scripts: {
    app:    [ 'js/app.init.js',
              'js/modules/*.js',
              'js/modules/controllers/*.js',
              'js/modules/directives/*.js',
              'js/modules/services/*.js',
              'js/modules/filters/*.js',
              'js/custom/**/*.js',
              ignored_files
            ],
    vendor: vendorBaseScripts,
    watch: ['js/*.js','js/**/*.js']
  },
  templates: {
    app: {
        files : ['jade/index.jade'],
        watch: ['jade/index.jade', hidden_files]
    },
    views: {
        files : ['jade/views/*.jade', 'jade/views/**/*.jade', ignored_files],
        watch: ['jade/views/*.jade', 'jade/views/**/*.jade']
    },
    pages: {
        files : ['jade/pages/*.jade'],
        watch: ['jade/pages/*.jade']
    }
  },
  styles: {
    app: {
      main: ['less/app.less', '!less/themes/*.less'],
      dir:  'less',
      watch: ['less/*.less', 'less/**/*.less', '!less/themes/*.less']
    },
    themes: {
      main: ['less/themes/*.less', ignored_files],
      dir:  'less/themes',
      watch: ['less/themes/*.less']
    },
  },
  bootstrap: {
    main: 'less/bootstrap/bootstrap.less',
    dir:  'less/bootstrap',
    watch: ['less/bootstrap/*.less']
  }
};

// BUILD TARGET CONFIG 
var build = {
  scripts: {
    app: {
      main: 'app.js',
      dir: '../app/js'
    },
    vendor: {
      main: 'base.js',
      dir: '../app/js'
    }
  },
  styles: '../app/css',
  templates: {
    app: '..',
    views: '../app/views',
    pages: '../app/pages'
  }
};

//---------------
// TASKS
//---------------

gulp.task('clean', function () {
    return del.sync(['../dist/**'], {force: true});
});

// JS APP
gulp.task('scripts:app', function() {
    // Minify and copy all JavaScript (except vendor scripts)
    const f = filter(['js/app.init.js',
              'js/modules/*.js',
              'js/modules/controllers/*.js',
              'js/modules/directives/*.js',
              'js/modules/services/*.js',
              'js/modules/filters/*.js', '!js/custom/**/*.js' ], {restore: true});
    return gulp.src(source.scripts.app)
     	.pipe(gulpif('*.js',replace('dev.api.venuelytics.com',baseUrl())))
     //	.pipe(uglify()) 
        .pipe(f)
        .pipe(jshint())
        .pipe(jshint.reporter('gulp-jshint-html-reporter', {
            filename: 'jshint-output.html'
        }))
        .pipe(f.restore)
        .pipe(concat(build.scripts.app.main))
        .pipe(gulp.dest(build.scripts.app.dir));
});

// JS APP
gulp.task('scripts:vendor', function() {
    // Minify and copy all JavaScript (except vendor scripts)
    return gulp.src(source.scripts.vendor)
      //  .pipe(uglify())  /* UNCOMMENT TO MINIFY */
        .pipe(concat(build.scripts.vendor.main))
        .pipe(gulp.dest(build.scripts.vendor.dir));
});

// APP LESS
gulp.task('styles:app', function() {
    return gulp.src(source.styles.app.main)
        .pipe(less({
            paths: [source.styles.app.dir]
        }))
        .on("error", handleError)
        .pipe(gulp.dest(build.styles));
});

// APP RTL
gulp.task('styles:app:rtl', function() {
    return gulp.src(source.styles.app.main)
        .pipe(less({
            paths: [source.styles.app.dir]
        }))
        .on("error", handleError)
        .pipe(flipcss())
        .pipe(rename(function(path) {
            path.basename += "-rtl";
            return path;
        }))
        .pipe(gulp.dest(build.styles));
});

// LESS THEMES
gulp.task('styles:themes', function() {
    return gulp.src(source.styles.themes.main)
        .pipe(less({
            paths: [source.styles.themes.dir]
        }))
        .on("error", handleError)
        .pipe(gulp.dest(build.styles));
});

// BOOSTRAP
gulp.task('bootstrap', function() {
    return gulp.src(source.bootstrap.main)
        .pipe(less({
            paths: [source.bootstrap.dir]
        }))
        .on("error", handleError)
        .pipe(gulp.dest(build.styles));
});

// JADE
gulp.task('templates:app', function() {
    return gulp.src(source.templates.app.files)
        .pipe(changed(build.templates.app, { extension: '.html' }))
        .pipe(jade())
        .on("error", handleError)
        .pipe(prettify({
            indent_char: ' ',
            indent_size: 3,
            unformatted: ['a', 'sub', 'sup', 'b', 'i', 'u']
        }))
        // .pipe(htmlify({
        //     customPrefixes: ['ui-']
        // }))
        // .pipe(w3cjs( W3C_OPTIONS ))
        .pipe(gulp.dest(build.templates.app));
});

// JADE
gulp.task('templates:pages', function() {
    return gulp.src(source.templates.pages.files)
        .pipe(changed(build.templates.pages, { extension: '.html' }))
        .pipe(jade())
        .on("error", handleError)
        .pipe(prettify({
            indent_char: ' ',
            indent_size: 3,
            unformatted: ['a', 'sub', 'sup', 'b', 'i', 'u']
        }))
        // .pipe(htmlify({
        //     customPrefixes: ['ui-']
        // }))
        // .pipe(w3cjs( W3C_OPTIONS ))
        .pipe(gulp.dest(build.templates.pages));
});

// JADE
gulp.task('templates:views', function() {
    return gulp.src(source.templates.views.files)
        .pipe(changed(build.templates.views, { extension: '.html' }))
        .pipe(jade())
        .on("error", handleError)
        .pipe(prettify({
            indent_char: ' ',
            indent_size: 3,
            unformatted: ['a', 'sub', 'sup', 'b', 'i', 'u']
        }))
        // .pipe(htmlify({
        //     customPrefixes: ['ui-']
        // }))
        // .pipe(w3cjs( W3C_OPTIONS ))
        .pipe(gulp.dest(build.templates.views));
});

//---------------
// WATCH
//---------------

// Rerun the task when a file changes
gulp.task('watch', function() {
  livereload.listen();

  gulp.watch(source.scripts.watch,           ['scripts:app']);
  gulp.watch(source.styles.app.watch,        ['styles:app', 'styles:app:rtl']);
  gulp.watch(source.styles.themes.watch,     ['styles:themes']);
  gulp.watch(source.bootstrap.watch,         ['styles:app']); //bootstrap
  gulp.watch(source.templates.pages.watch,   ['templates:pages', 'bust-template']);
  gulp.watch(source.templates.views.watch,   ['templates:views', 'bust-template']);
  gulp.watch(source.templates.app.watch,     ['templates:app', 'bust-template']);

  gulp.watch(
      '../app/**', livereload.changed).on('change', function(event) {
      livereload.changed();
      console.log('Triggering LiveReload..');
      // console.log('File', event.path, 'was', event.type);
      console.log('Triggered LiveReload..');
  });

});

//---------------
// DEFAULT TASK
//---------------

gulp.task('dev',[
          'scripts:vendor',
          'scripts:app',
          'styles:app',
          'styles:app:rtl',
          'styles:themes',
          'templates:app',
          'templates:pages',
          'templates:views',
          'watch'
        ], function (){

         return connect.server({
            root: '../',
            port:9000
         });
 });

gulp.task('build', gulpSequence([
                      'scripts:vendor',
                      'scripts:app',
                      'styles:app',
                      'styles:app:rtl',
                      'styles:themes',
                      'templates:app',
                      'templates:pages',
                      'templates:views'
                    ], 'bust-template'));

gulp.task('package:src', ['build'], function () {
	const f = filter([ '!../index.html', '../app/js/**', '../app/css/**' ], {restore: true});
	return gulp.src(['../app/**',  '../index.html'], {base: '../'})
     .pipe(f)
     .pipe(cachebust.resources())
     .pipe(f.restore)
     .pipe(gulp.dest('../dist'));
    
});

gulp.task('bust-template', function () {
	
	return gulp.src(['../app/templates/**/*.html',  '../app/pages/**/*.html', '../app/views/**/*.html'])
	 .pipe(templateCache())
   .pipe(gulp.dest('../app/js/'));
    
});


gulp.task('package:vendor', function () {
	return gulp.src(dynamicScriptFiles,  { base : '../' })
	.pipe(gulp.dest('../dist'));
	
});

gulp.task('package:build', ['package:src', 'package:vendor'], function () {
	
	return gulp.src('../dist/index.html')
	.pipe(cachebust.references())
    .pipe(gulp.dest('../dist'));
});

gulp.task('package', gulpSequence('clean','package:build'));

gulp.task('aws:deploy', ['package'], function () {
      
    var publisher = awspublish.create({
        region: 'us-west-1',
        params: {
          Bucket: 'dev.admin'
        }
      }, {
        cacheFileName: '../cache/dev.admin.cache'
      });
     
      // define custom headers 
      var headers = {
        'Cache-Control': 'max-age=315360000, no-transform, public'
        // ... 
      };
     
      return gulp.src(['../dist/**'])
         // gzip, Set Content-Encoding headers and add .gz extension 
        .pipe(awspublish.gzip())
     
        // publisher will add Content-Length, Content-Type and headers specified above 
        // If not specified it will set x-amz-acl to public-read by default 
        .pipe(publisher.publish(headers))
     
        // create a cache file to speed up consecutive uploads 
        .pipe(publisher.cache())
     
         // print upload updates to console 
        .pipe(awspublish.reporter());
});


// Error handler
function handleError(err) {
  console.log(err.toString());
  this.emit('end');
}

// Mini gulp plugin to flip css (rtl)
function flipcss(opt) {
  
  if (!opt) opt = {};

  // creating a stream through which each file will pass
  var stream = through.obj(function(file, enc, cb) {
    if(file.isNull()) return cb(null, file);

    if(file.isStream()) {
        console.log("todo: isStream!");
    }

    var flippedCss = flip(String(file.contents), opt);
    file.contents = new Buffer(flippedCss);
    cb(null, file);
  });

  // returning the file stream
  return stream;
}

function baseUrl() {
	if (gutil.env.build === 'prod') {
		return "prod.api.venuelytics.com";
	} else if (gutil.env.build === 'dev') {
		return "dev.api.venuelytics.com";
	} 
	return "localhost:8080"
}