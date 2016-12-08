var gulp = require('gulp'),
    $ = require('gulp-load-plugins')({rename: {'gulp-rev-append': 'rev'}});

var pkg = require('./package.json');

var AUTOPREFIXER_BROWSERS = ["Android >= 4", "Explorer >= 10", "iOS >= 6"];

// 注释信息
var banner = '/*! <%= pkg.title %> v<%= pkg.version %> by YDCSS (c) ' +
    $.util.date(Date.now(), 'UTC:yyyy') + ' Licensed <%= pkg.license %>' + ' */ \n';

gulp.task('less', function () {
    gulp.src(['src/less/{ydui,demo}.less'])
        .pipe($.plumber({errorHandler: $.notify.onError('Error: <%= error.message %>')}))
        .pipe($.less())
        .pipe($.autoprefixer({
            browsers: AUTOPREFIXER_BROWSERS, cascade: false
        }))
        .pipe(gulp.dest('src/css'))
        .pipe($.livereload());
});

gulp.task('concat', function () {
    gulp.src(['src/js/source/ydui.js', 'src/js/source/**/*.js'])
        .pipe($.concat('ydui.js'))
        .pipe(gulp.dest('src/js'));
});

gulp.task('watch', function () {
    $.livereload.listen();
    gulp.watch('src/less/**/*.less', ['less']);
    gulp.watch('src/js/source/**/*.js', ['concat']);
});

gulp.task('build:cssmin', ['less'], function () {
    gulp.src('src/css/ydui.css')
        //.pipe($.cssBase64({
        //    extensionsAllowed: ['.ttf']
        //}))
        .pipe($.cleanCss({keepSpecialComments: '*'}))
        .pipe($.header(banner, {pkg: pkg}))
        .pipe(gulp.dest('dist/build/css'));
});

gulp.task('build:uglify', function () {
    gulp.src(['src/js/{ydui.js,ydui.flexible.js}'])
        .pipe($.uglify())
        .pipe($.header(banner, {pkg: pkg}))
        .pipe(gulp.dest('dist/build/js'));
});

gulp.task('demo:css', function () {
    gulp.src(['src/less/{ydui,demo}.less']).pipe($.sourcemaps.init())
        .pipe($.less())
        .pipe($.cssBase64({
            extensionsAllowed: ['.ttf']
        }))
        .pipe($.autoprefixer({
            browsers: AUTOPREFIXER_BROWSERS, cascade: false, remove: true
        }))
        .pipe($.sourcemaps.write('./'))
        .pipe(gulp.dest('dist/demo/css'));
});

gulp.task('demo:html', function () {
    gulp.src(['src/html/**/*.html', 'src/index.html', 'src/libs/**/*.html'], {base: 'src'})
        .pipe($.rev())
        .pipe(gulp.dest('dist/demo'));
});

gulp.task('demo:uglify', function () {
    gulp.src(['src/js/{ydui.js,ydui.flexible.js}'])
        .pipe(gulp.dest('dist/demo/js'));
});

gulp.task('dev', ['less', 'concat', 'watch']);

gulp.task('demo', ['demo:css', 'demo:uglify', 'demo:html']);

gulp.task('default', ['build:cssmin', 'build:uglify']);
