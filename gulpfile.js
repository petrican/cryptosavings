var gulp          = require('gulp');
var gp_babel      = require('gulp-babel');
var clean         = require('gulp-clean');
var sass          = require('gulp-sass');
var gp_concat     = require('gulp-concat');
var gp_rename     = require('gulp-rename');
let gp_uglify     = require('gulp-uglify-es').default;
var gp_sourcemaps = require('gulp-sourcemaps');
var gp_minifyjs   = require('gulp-js-minify');
let gp_cleanCSS   = require('gulp-clean-css');

// Compile sass into CSS & auto-inject into browsers
gulp.task('sass', function() {
    return gulp.src(
        [
            'node_modules/bootstrap/dist/css/bootstrap.css',
            'node_modules/font-awesome/scss/*.scss',
            'app/assets/scss/*.scss'
        ])
        .pipe(gp_sourcemaps.init())
        .pipe(sass())
        .pipe(gp_cleanCSS({compatibility: 'ie8'}))
        .pipe(gp_rename({ suffix: '.min' }))
        .pipe(gp_sourcemaps.write("./"))
        .pipe(gulp.dest("public/css"));
});

// Move the javascript files into our /src/js folder
gulp.task('js', function() {
    return gulp.src(
        [
            'node_modules/jquery/dist/jquery.js',
            'node_modules/bootstrap/dist/js/bootstrap.js',
            'app/assets/js/main-page-comparison-transpiled.js',
            'app/assets/js/exchange/header-values.js'
        ]
    )   // .pipe(gp_sourcemaps.init())      // uncomment this for sourcemap
        .pipe(gp_concat('concat.js'))
        .pipe(gp_babel({
            presets: ['es2015']
        }))
        .pipe(gp_minifyjs())
        .pipe(gp_rename('bundle.min.js'))
        .pipe(gp_uglify())
        // .pipe(gp_sourcemaps.write('./'))  // uncomment this for sourcemap
        .pipe(gulp.dest("public/js"));
});

/*
// Move the javascript files into our /src/js folder
gulp.task('js-main', function() {
    return gulp.src(
        [
            'app/assets/js/main-page-comparison-transpiled.js',
            'app/assets/js/exchange/header-values.js'
        ]
    )   // .pipe(gp_sourcemaps.init())      // uncomment this for sourcemap
        .pipe(gp_concat('concat.js'))
        .pipe(gp_babel({
            presets: ['es2015']
        }))
        .pipe(gp_minifyjs())
        .pipe(gp_rename('main.min.js'))
        .pipe(gp_uglify())
        // .pipe(gp_sourcemaps.write('./'))  // uncomment this for sourcemap
        .pipe(gulp.dest("public/js"));
});
*/

// Settings - Exchange
/*
gulp.task('js-settings', function() {
    return gulp.src(
        [
            'app/assets/js/exchange/header-values.js'
        ]
    )   // .pipe(gp_sourcemaps.init())      // uncomment this for sourcemap
        .pipe(gp_concat('concat.js'))
        .pipe(gp_babel({
            presets: ['es2015']
        }))
        //.pipe(gp_minifyjs())
        .pipe(gp_rename('settings.min.js'))
        //.pipe(gp_uglify())
        // .pipe(gp_sourcemaps.write('./'))  // uncomment this for sourcemap
        .pipe(gulp.dest("public/js"));
});
*/


// watching scss/html files
gulp.task('watch', ['sass'], function() {
    gulp.watch(['node_modules/bootstrap/dist/css/bootstrap.css', 'app/assets/scss/*.scss'], ['sass']);
});


gulp.task('clean', function () {
  return gulp.src('public/js/concat.js', {read: false})
    .pipe(clean());
});

gulp.task('default', ['js','watch']);
