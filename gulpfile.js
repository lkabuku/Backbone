// Include gulp
var gulp = require('gulp');

// Include Our Plugins
var jshint      = require('gulp-jshint');
var eslint      = require('gulp-eslint');
var sass        = require('gulp-sass');
var concat      = require('gulp-concat');
var uglify      = require('gulp-uglify');
var rename      = require('gulp-rename');
var sourcemaps  = require('gulp-sourcemaps');
var gutil       = require('gulp-util');
var browserSync = require('browser-sync').create();
var server      = require('gulp-express');
var clean       = require('gulp-clean');
var browserify  = require('gulp-browserify');

var del         = require('del');
var rimraf      = require('rimraf');


var paths = {
  scripts: ['src/**/*.js', '!src/tmp/**/*.js'],
  styles: 'src/scss/*.scss',
  images: 'src/img/**/*',
  html: 'src/**/*.html'
};


gulp.task('clean', function() {
  return gulp.src('src/tmp/**/*', {read: false})
    .pipe(clean());
});

// Lint Task
gulp.task('lint', function() {
  return gulp.src(paths.scripts)
    .pipe(eslint())
    .pipe(eslint.format());
});

// Compile Our Sass
gulp.task('sass', function() {
  return gulp.src(paths.styles)
    .pipe(sass())
    .pipe(rename('style.min.css'))
    .pipe(gulp.dest('src/tmp/css'))
    .pipe(browserSync.stream());;
});

// Concatenate & Minify JS
gulp.task('scripts', function() {
  return gulp.src(paths.scripts)
    .pipe(sourcemaps.init())
    .pipe(concat('script.min.js'))
    .pipe(browserify())
    //.pipe(gutil.env.type === 'production' ? uglify() : gutil.noop())
    //.pipe(uglify())
    .pipe(sourcemaps.write())
    .pipe(gutil.env.type === 'production' ? gulp.dest('build/js') : gulp.dest('src/tmp/js'))
    .pipe(browserSync.stream());
});

// Watch Files For Changes
gulp.task('watch', function() {
  gulp.watch(paths.scripts, ['lint', 'scripts']);
  gulp.watch(paths.styles, ['sass']);
});


//Tasks that ensure [scripts] and [sass] are finished before reload browserSync
gulp.task('js-watch', ['scripts'], browserSync.reload);
gulp.task('css-watch', ['sass'], browserSync.reload);

//Init browser sync
gulp.task('serve', ['watch'], function() {
  browserSync.init({
    server: {
        baseDir: "./src"
    }
  });

  gulp.watch(paths.scripts, ['js-watch']);
  gulp.watch(paths.styles, ['css-watch']);
  gulp.watch("src/*.html").on('change', browserSync.reload);
});


gulp.task('server', function () {
  // Start the server at the beginning of the task 
  server.run(['./api/app.js']);
});

// Default Task
//    gulp.task('default', ['lint', 'sass', 'scripts', 'watch']);
gulp.task('default', ['clean', 'lint', 'sass', 'scripts', 'watch', 'serve', 'server']);