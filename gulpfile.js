var gulp = require('gulp'),
sass = require('gulp-sass'),
autoprefixer = require('gulp-autoprefixer'),
minifycss = require('gulp-minify-css'),
rename = require('gulp-rename'),
livereload = require('gulp-livereload'),
connect = require('gulp-connect'),
imagemin = require('gulp-imagemin'),
uncss = require('gulp-uncss');

var css = './app/*.css';
var html = './app/*.html';
var js = './app/js/*.js';
var img = './images/*';

gulp.task('connect', function() {
  connect.server({
    root: './app',
    livereload: true
  });
});


gulp.task('styles', function () {
  gulp.src('sass/*.sass')
  .pipe(sass({
    includePaths: require('node-bourbon').includePaths
  }).on('error', sass.logError))
  .pipe(rename({suffix: '.min', prefix : '_'}))
  .pipe(autoprefixer({
    browsers: ['last 15 versions'],
    cascade: false
  }))
  // .pipe(uncss({
  //           html: ['app/index.html']
  //       }))
  // .pipe(minifycss())
  .pipe(gulp.dest('app'))
   .pipe(connect.reload());
});


gulp.task('compress-images', function () {
    return gulp.src('./images/*')
        .pipe(imagemin({progressive: true}))
        .pipe(gulp.dest('app/img'))
        .pipe(connect.reload());
  });


gulp.task('html', function () {
  gulp.src(html)
   .pipe(connect.reload());
});

gulp.task('js', function () {
  gulp.src(html)
   .pipe(connect.reload());
});


gulp.task('watch', function() {
  gulp.watch('sass/*.sass', ['styles']);
  gulp.watch(html,['html']);
  gulp.watch(js,['js']);
  gulp.watch(img,['compress-images']);
});

 
gulp.task('uncss', function () {
    gulp.src('app/_main.min.css')
        .pipe(uncss({
            html: ['app/index.html']
        }))
        .pipe(minifycss())
        .pipe(gulp.dest('./app'));
    gulp.src('app/_header.min.css')
        .pipe(uncss({
            html: ['app/index.html']
        }))
        .pipe(minifycss())
        .pipe(gulp.dest('./app'))
});


gulp.task('default', ['connect', 'styles', 'watch', 'compress-images'], function() {

});