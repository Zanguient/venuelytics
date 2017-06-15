var gulp = require('gulp');
var concat = require('gulp-concat');
var connect = require('gulp-connect');
var argv = require('yargs').argv;
var gulpif = require('gulp-if');
var jshint = require('gulp-jshint');
var beautify = require('gulp-beautify');
var please = require('gulp-pleeease');
var rename = require('gulp-rename');
var replace = require('gulp-replace');
var sass = require('gulp-sass');
var sassThemes = require('gulp-sass-themes');
var uglify = require('gulp-uglify');
var prettify = require('gulp-prettify');
var processhtml = require('gulp-processhtml');
var del = require('del');
var path = require('path');
var runSequence = require('run-sequence').use(gulp);
var imagemin = require('gulp-imagemin');
var changed = require('gulp-changed');
var mergeStream = require('merge-stream');
var awspublish = require('gulp-awspublish');
var CacheBuster = require('gulp-cachebust');
var config = require('./gulp/config');
var cachebust = new CacheBuster();
var templateHtmlCache = require('gulp-angular-templatecache');
var filter = require('gulp-filter');
var pseudoTranslator = require('gulp-pseudo-translate-angular-json');
var jeditor = require('gulp-json-editor');
var jscpd = require('gulp-jscpd');
 

var paths = {
    src : {
        i18n: 'src/i18n'
    },
    dist: path.join(config.folders.dist),
    assets: path.join(config.folders.dist, config.folders.assets),
    html: path.join(config.folders.dist),
    js: path.join(config.folders.dist, config.folders.assets, 'js'),
    jsConcat: path.join(config.folders.dist, config.folders.assets, 'js'),
    fonts: path.join(config.folders.dist, config.folders.assets, 'fonts'),
    media: path.join(config.folders.dist, config.folders.assets, 'media'),
    css: path.join(config.folders.dist, config.folders.assets, 'css'),
    img: path.join(config.folders.dist, config.folders.assets, 'img'),
    plugins: path.join(config.folders.dist, config.folders.assets, config.folders.plugins),
    revolution: path.join(config.folders.dist, config.folders.assets, config.folders.plugins, 'revolution'),
    i18n: path.join(config.folders.dist, config.folders.assets, 'i18n'),
};

var themeOptions = {
    primaryColor: argv.color || config.primaryColor,
    shineColor: argv.shine || config.shine,
    headerClass: argv.header || config.headerClass,
    navbarClass: argv.navbar || config.navbarClass,
    navbarMode: argv.navbarMode || config.navbarMode
};

var targets = {
    dist: {
        environment: 'dist',
        data: {
            assets: config.folders.assets,
            primaryColor: themeOptions.primaryColor + '-' + themeOptions.shineColor,
            headerClass: themeOptions.headerClass,
            navbarClass: themeOptions.navbarClass
        },
    },
    navbar: {
        environment: 'navbar',
        data: {
            assets: config.folders.assets,
            primaryColor: themeOptions.primaryColor + '-' + themeOptions.shineColor,
            headerClass: themeOptions.headerClass,
            navbarClass: themeOptions.navbarClass + ' navbar-mode'
        },
    },
    demo: {
        environment: 'demo',
        data: {
            assets: config.folders.assets,
            primaryColor: themeOptions.primaryColor + '-' + themeOptions.shineColor,
            headerClass: themeOptions.headerClass,
            navbarClass: themeOptions.navbarClass
        },
    },
    dev: {
        environment: 'dev',
        data: {
            assets: config.folders.assets,
            primaryColor: themeOptions.primaryColor + '-' + themeOptions.shineColor,
            headerClass: themeOptions.headerClass,
            navbarClass: themeOptions.navbarClass
        },
    },
};

gulp.task('plugins', ['plugins:js', 'plugins:css', 'plugins:fonts', 'plugins:img'],function() {   
    return gulp.src(config.plugins.jsConcat)
        .pipe(gulpif(config.concat, concat('plugins.min.js')))
        .pipe(gulpif(config.compress, uglify()))
        .pipe(cachebust.resources())
        .pipe(gulp.dest(paths.jsConcat));
});

gulp.task('plugins:js', function() {
    return gulp.src(config.plugins.js)
        .pipe(cachebust.resources())
        .pipe(gulp.dest(paths.js));
});

gulp.task('plugins:css', function() {
    return gulp.src(config.plugins.css)
        .pipe(gulpif(config.concat, concat('plugins.min.css')))
        .pipe(cachebust.resources())
        .pipe(gulp.dest(paths.css));
});

gulp.task('plugins:fonts', function() {
    return gulp.src(config.plugins.fonts)
        .pipe(gulp.dest(paths.fonts));
});

gulp.task('plugins:img', function() {
    return gulp.src(config.plugins.img)
        .pipe(gulp.dest(paths.img));
});

gulp.task('revolution', function() {
    return gulp.src([
            './plugins/slider-revolution/revolution/**/*',
            './plugins/slider-revolution/revolution-addons/**/*',
            './plugins/slider-revolution/assets/**/*'
        ], {
            base: './plugins/slider-revolution/'
        })
        .pipe(gulp.dest(paths.revolution));
});

gulp.task('html', function() {
    return gulp.src(['src/html/**/*.html', '!src/html/layout/**/*'])
        .pipe(changed(path.join(paths.html)))
        .pipe(processhtml({
            recursive: true,
            process: true,
            strip: true,
            environment: targets[config.environment].environment,
            data: targets[config.environment].data,
            customBlockTypes: ['gulp/components-menu.js']
        }))
        .pipe(gulpif(config.compress, prettify({
            indent_size: 2
        })))
        .pipe(gulp.dest(path.join(paths.html)))
        .pipe(connect.reload());
});

gulp.task('html:dist', function() {
    const f = filter([ 'src/html/*.html', '!src/html/index.html'], {restore: true});
    const indexFilter =  filter([ 'src/html/index.html'], {restore: true});
    return gulp.src(['src/html/**/*.html', '!src/html/layout/**/*'])
        .pipe(processhtml({
            recursive: true,
            process: true,
            strip: true,
            environment: targets[config.environment].environment,
            data: targets[config.environment].data,
            customBlockTypes: ['gulp/components-menu.js']
        }))
        .pipe(gulpif(config.compress, prettify({
            indent_size: 2
        })))
        .pipe(f)
        .pipe(templateHtmlCache())
        .pipe(gulp.dest('src/js/'))
        .pipe(f.restore)
        .pipe(indexFilter)
        .pipe(gulp.dest(path.join(paths.html)))
        .pipe(indexFilter.restore)
        .pipe(connect.reload());
});


gulp.task('js', ['js:base', 'js:configurator'], function() {

    return gulp.src('src/js/pages/**/*')
        .pipe(gulpif(config.compress, uglify()))
        .pipe(cachebust.resources())
        .pipe(gulp.dest(paths.js))
        .pipe(connect.reload());
});
gulp.task('js:cpd', function() {
       return gulp.src([ 'src/js/controllers/*.js',  'src/js/services/*.js','src/js/directives/*.js'])
        .pipe(jscpd({
                'min-lines': 5,
                verbose    : true
        }));       
});
gulp.task('js:base', function() {
    const f = filter([ 'src/js/**/*.js', '!src/js/configurator.js', '!src/js/pages/**/*', 
        '!src/js/templates.js', '!src/js/dropdownhover.js', '!src/js/app.js',  '!src/js/material.js'
        ,'!src/js/functions.js'], {restore: true});
    return gulp.src(['src/js/**/*.js', '!src/js/configurator.js', '!src/js/pages/**/*'])
        .pipe(f)
        .pipe(jshint())
        .pipe(jshint.reporter('gulp-jshint-html-reporter', {
            filename: 'jshint-output.html'
        }))
        .pipe(f.restore)
        .pipe(gulpif(config.compress, concat('app.min.js')))
        .pipe(gulpif(config.compress, uglify()))
        .pipe(cachebust.resources())
        .pipe(gulp.dest(paths.js))
        .pipe(connect.reload());
});

gulp.task('js:configurator', function() {
    return gulp.src('src/js/configurator.js')
        .pipe(gulpif(config.compress, concat('configurator.min.js')))
        .pipe(gulpif(config.compress, uglify()))
        .pipe(cachebust.resources())
        .pipe(gulp.dest(paths.js))
        .pipe(connect.reload());
});

gulp.task('themes', function(cb) {
    var out = [];
    for (var color in config.themes) {
        for (var shine in config.shines) {
            var color_light = Number(config.shines[shine]) - 100;
            var color_dark = Number(config.shines[shine]) + 100;
            out.push(gulp.src(['src/scss/_config.scss'])
                .pipe(replace('light-blue-400', 'change400'))
                .pipe(replace('light-blue-500', 'change500'))
                .pipe(replace('light-blue-600', 'change600'))
                .pipe(replace('change400', config.themes[color] + '-' + color_light.toString()))
                .pipe(replace('change500', config.themes[color] + '-' + config.shines[shine]))
                .pipe(replace('change600', config.themes[color] + '-' + color_dark.toString()))
                .pipe(replace(' !default', ''))
                .pipe(rename('_' + config.themes[color] + '-' + config.shines[shine] + '.scss'))
                .pipe(gulp.dest('src/scss/themes')));
        }
    }
    return mergeStream(out);
});

function generateNames() {
    var result = [];
    for (var color in config.themes) {
        for (var shine in config.shines) {
            result.push('' + config.themes[color] + '-' + config.shines[shine]);
        }
    }
    return result;
}

/**
 * @name   i18n:pseudo
 * @desc   Read English JSON Dictionary and Write Pseudo JSON Dictionary File
 */
gulp.task('i18n:pseudo', function() {
  return gulp.src(paths.src.i18n + '/en.json') // url to source file 
  .pipe(jeditor(function(json) {
      return pseudoTranslator(json);
    }))
  .pipe(rename('pseudo.json')) // destination file name 
  .pipe(gulp.dest(paths.i18n)); // destination folder 
});


gulp.task('i18n', ['i18n:pseudo'], function() {
    return gulp.src(paths.src.i18n + '/*.json')
      //  .pipe(gulpif(config.compress, imagemin()))
        .pipe(gulp.dest(paths.i18n))
        .pipe(connect.reload());
});

gulp.task('scss', function() {
    return gulp.src('src/scss/**/*.scss')
        .pipe(gulpif(config.allColors, sassThemes('src/scss/themes/_*.scss', generateNames())))
        .pipe(sass().on('error', sass.logError))
        .pipe(gulpif(config.compress, please({
            "autoprefixer": true,
            "filters": true,
            "rem": true,
            "opacity": true
        })))
        .pipe(gulpif(config.compress, rename({
            suffix: '.min',
            extname: '.css'
        })))
        //.pipe(gulpif(!config.compress, rename('style.' + config.defaultTheme + '.min.css')))
        .pipe(cachebust.resources())
        .pipe(gulp.dest(paths.css))
        .pipe(connect.reload());
});

gulp.task('img', function() {
    return gulp.src('src/img/**/*')
      //  .pipe(gulpif(config.compress, imagemin()))
        .pipe(gulp.dest(paths.img))
        .pipe(connect.reload());
});

gulp.task('fonts', function() {
    return gulp.src('src/fonts/**/*')
        .pipe(gulp.dest(paths.fonts))
        .pipe(connect.reload());
});

gulp.task('media', function() {
    return gulp.src('src/media/**/*')
        .pipe(gulp.dest(paths.media))
        .pipe(connect.reload());
});

gulp.task('clean', function() {
    return del.sync([
        paths.dist,
        'src/scss/themes/*'
    ]);
});

gulp.task('watch', function() {
    gulp.watch(['src/html/**/*'], ['html']);
    gulp.watch(['src/html/layout/**/*'], ['html:dist']);
    gulp.watch(['src/js/**/*'], ['js']);
    gulp.watch(['src/scss/**/*'], ['scss']);
    gulp.watch(['src/img/**/*'], ['img']);
    gulp.watch(['src/fonts/**/*'], ['fonts']);
    gulp.watch(['src/media/**/*'], ['media']);
});

gulp.task('connect', function() {
    return connect.server({
        root: config.folders.dist,
        port: 8080,
        livereload: true,
        fallback: config.folders.dist + '/index.html'
    });
});

gulp.task('default', function() {
    runSequence(
        ['connect']
    );
});

gulp.task('dist:pre', function(cb) {
   return runSequence('themes', ['plugins', 'html:dist', 'i18n','scss', 'img', 'fonts', 'media', 'revolution'], 'js',cb);
});

gulp.task('dist',['dist:pre'], function(cb) {
    return gulp.src('dist/index.html')
     .pipe(cachebust.references())
     .pipe(gulp.dest(config.folders.dist));
});

gulp.task('dev', function() {
    config.environment = 'dev';
    config.compress = false;
    return runSequence(
        'clean', ['plugins', 'html',  'i18n', 'scss', 'img', 'fonts', 'media', 'revolution'], 'js', 'dist'
    );
});

gulp.task('work', function() {
    config.environment = 'dev';
    config.compress = false;
    return runSequence(
        'dev', ['connect', 'watch']
    );
});

gulp.task('dist:clean', function(cb) {
    return runSequence('clean', 'dist', cb);
});
gulp.task('aws:deploy',['dist:clean'],function() {
    config.compress = true;
    config.environment = 'dist';
    config.allColors = true;

    config.themes = [themeOptions.primaryColor];
    config.shines = [themeOptions.shineColor];


    if (themeOptions.navbarMode) {
        config.environment = 'navbar';
    }

    var publisher = awspublish.create({
        region: 'us-west-1',
        params: {
            Bucket: 'dev.webui'
        }
    }, {
        cacheFileName: 'cache/release.webui.cache'
    });

    // define custom headers 
    var headers = {
        'Cache-Control': 'max-age=315360000, no-transform, public'
            // ... 
    };

    return gulp.src(['dist/**'])
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