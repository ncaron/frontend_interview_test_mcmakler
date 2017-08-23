var gulp = require('gulp');
var connect = require('gulp-connect');
var open = require('gulp-open');
var minHTML = require('gulp-htmlmin');
var minCSS = require('gulp-clean-css');
var minJS = require('gulp-uglify');
var babel = require('gulp-babel');
var lint = require('gulp-eslint');

var config = {
  port: 9005,
  devBaseUrl: 'http://localhost',
  paths: {
    html: './src/*.html',
    css: './src/css/*.css',
    js: './src/**/*.js',
    images: './src/images/*',
    dist: './dist',
  },
};

gulp.task('connect', function() {
  connect.server({
    root: ['dist'],
    port: config.port,
    base: config.devBaseUrl,
    livereload: true,
  });
});

gulp.task('open', ['connect'], function() {
  gulp.src('dist/index.html')
      .pipe(open({ uri: config.devBaseUrl + ':' + config.port + '/' }));
});

gulp.task('html', function() {
  gulp.src(config.paths.html)
      .pipe(minHTML({ collapseWhitespace: true, processScripts: ['text/template'] }))
      .pipe(gulp.dest(config.paths.dist))
      .pipe(connect.reload())
});

gulp.task('css', function() {
  gulp.src(config.paths.css)
      .pipe(minCSS())
      .pipe(gulp.dest(config.paths.dist + '/css'))
      .pipe(connect.reload());
});

gulp.task('js', function() {
  gulp.src(config.paths.js)
      .pipe(babel())
      .pipe(minJS())
      .pipe(gulp.dest(config.paths.dist))
      .pipe(connect.reload());
});

gulp.task('lint', function() {
  return gulp.src(config.paths.js)
             .pipe(lint())
             .pipe(lint.format())
             .pipe(lint.failAfterError());
});

gulp.task('images', function() {
  gulp.src(config.paths.images)
      .pipe(gulp.dest(config.paths.dist + '/images'));
});

gulp.task('watch', function() {
  gulp.watch(config.paths.html, ['html']);
  gulp.watch(config.paths.css, ['css']);
  gulp.watch(config.paths.js, ['js', 'lint']);
});

gulp.task('default', ['html', 'css', 'js', 'lint', 'images', 'open', 'watch']);
