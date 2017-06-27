const gulp         = require('gulp'),
      sass         = require('gulp-sass'),
      autoprefixer = require('gulp-autoprefixer'),
      cleanCSS     = require('gulp-clean-css'),
      rename       = require('gulp-rename'),
      browserSync  = require('browser-sync').create(),
      concat       = require('gulp-concat'),
      uglify       = require('gulp-uglify'),
      babel        = require('gulp-babel');

let css = './app/*.css',
    html = './app/*.html',
    js = './app/js/common.js',
    libs = './app/libs/**/*.js',
    sassDir = './sass/**/*.sass',
    img = './app/images/*';

gulp.task('browser-sync', ['styles', 'scripts'], function() {
    browserSync.init({
        server: {
            baseDir: "./app"
        },
        notify: false
    });
});

gulp.task('styles', function () {
  return gulp.src('sass/*.sass')
  .pipe(sass({
    includePaths: require('node-bourbon').includePaths
  }).on('error', sass.logError))
  .pipe(rename({suffix: '.min', prefix : ''}))
  .pipe(autoprefixer({browsers: ['last 15 versions'], cascade: false}))
  .pipe(cleanCSS())
  .pipe(gulp.dest('app/css'))
  .pipe(browserSync.stream());
});

gulp.task('scripts', function() {
  return gulp.src([
    './app/libs/jquery/jquery-1.11.2.min.js',
    './app/libs/waypoints/waypoints.min.js',
    './app/libs/animate/animate-css.js',
    './app/js/common.js',
    ])
    .pipe(concat('common.min.js'))
    .pipe(babel({
        presets: ['es2015']
    }))
    .pipe(uglify()) //Minify libs.js
    .pipe(gulp.dest('./app/js/'))
});

gulp.task('compress-images', function () {
  return gulp.src('./app/img/*')
      .pipe(imagemin({progressive: true}))
      .pipe(gulp.dest('app/img'))
      .pipe(connect.reload());
});

gulp.task('watch', function () {
  gulp.watch(sassDir, ['styles']);
  gulp.watch(js, ['scripts']);
  gulp.watch(html).on('change', browserSync.reload);
  gulp.watch(img,['compress-images']);

});

gulp.task('default', ['browser-sync', 'watch']);
