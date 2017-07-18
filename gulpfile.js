var gulp = require('gulp')
var browserify = require('browserify')
var babelify = require('babelify')
var source = require('vinyl-source-stream')
var buffer = require('vinyl-buffer')
var sourcemaps = require('gulp-sourcemaps')
var server = require('gulp-server-livereload')

gulp.task('js', function () {
  return browserify('./src/app.js')
  .transform(babelify, {
    presets: ['es2015'],
    sourceMapsAbsolute: true
  })
  .bundle()
  .pipe(source('main.js'))
  .pipe(buffer()) // sourcemap doesn't support streams
  .pipe(sourcemaps.init({loadMaps: true}))
  .pipe(sourcemaps.write('./'))
  .pipe(gulp.dest('./build'))
})

gulp.task('default', ['js'])

gulp.task('watch', function () {
  return gulp.watch('./src/**/*.js', ['default'])
})

gulp.task('run', ['watch'], function () {
  gulp.src('')
    .pipe(server({
      livereload: false,
      directoryListing: true,
      open: true
    }))
})
