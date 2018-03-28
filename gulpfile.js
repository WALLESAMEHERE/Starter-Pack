var gulp = require('gulp');
var sass = require('gulp-sass');
var browserSync = require('browser-sync').create();
var useref = require('gulp-useref');
var gulpIf = require('gulp-if');
var cssnano = require('gulp-cssnano');
var imagemin = require('gulp-imagemin');
var cache = require('gulp-cache');
var del = require('del');
var runSequence = require('run-sequence');
var gutil = require('gulp-util');
var concat = require('gulp-concat');
var babili = require('gulp-babili');
var autoprefixer = require('gulp-autoprefixer');
var rename = require('gulp-rename');

gulp.task('hello', () => {
  console.log('Hello Łukasz');
});

gulp.task('browserSync', ['sass', 'scripts', 'html', 'images'], () => {
  browserSync.init({
    server: {
      baseDir: 'dist',
      injectChanges: true 
    },
  })
})
gulp.task('html', () => {
  gulp.src('app/*.html')
    .pipe(gulp.dest('dist/'))
});
gulp.task('sass', () => {
  return gulp.src('app/sass/app.scss')
	.pipe(sass().on('error', sass.logError))
    .pipe(autoprefixer('last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'))
    .pipe(gulp.dest('dist/stylesheets'))
    .pipe(rename({suffix: '.min'}))
    //.pipe(minifycss())
    //.pipe(cssshrink())
    .pipe(gulp.dest('dist/stylesheets'))
    .pipe(browserSync.reload({stream:true}));
});

gulp.task('images', () => {
  return gulp.src('app/images/*.+(png|jpg|jpeg|gif|svg)')
  .pipe(cache(imagemin({
    interlaced: true
   })))
  .pipe(gulp.dest('dist/images'))
});

gulp.task('fonts', () => {
  return gulp.src('app/fonts/**/*')
    .pipe(gulp.dest('dist/fonts'))
})

gulp.task('watch', ['browserSync', 'sass'], () => {
  gulp.watch('app/sass/**/*.scss', ['sass', browserSync.reload]);
  gulp.watch('app/*.html', ['html', browserSync.reload]);
  gulp.watch('app/js/*.js', ['scripts', browserSync.reload]);
  gulp.watch('app/images/*.+(png|jpg|jpeg|gif|svg)', ['images', browserSync.reload]);

});

gulp.task('useref', () => {
  return gulp.src('app/*.html')
    .pipe(useref())
    .pipe(gulpIf('*.css', cssnano()))
    .pipe(gulp.dest('dist'))
});

gulp.task('scripts', () => {
  return gulp.src(['app/js/*.js',
                    'node_modules/jquery/dist/jquery.js'])
    .pipe(concat('main.min.js'))
  .on('error', (err) => {
     gutil.log(gutil.colors.red('[Error]'), err.toString());
   })
  .pipe(gulp.dest('dist/js'));
})

gulp.task('clean:dist', () => {
  return del.sync('dist');
})

gulp.task('default', (callback) => {
  runSequence(['watch', 'sass', 'browserSync','html'],
    callback
  )
})

gulp.task('build', (callback) => {
  runSequence('clean:dist', ['default', 'images', 'fonts'], 'useref', 'scripts',
    callback)
})
