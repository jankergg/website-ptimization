var gulp = require('gulp');
var htmlmin = require('gulp-htmlmin');
var inlinesource = require('gulp-inline-source');
var clean = require('gulp-clean');

//清除旧目录
gulp.task('clean', function () {
    return gulp.src('./dist', {read: false})
        .pipe(clean());
});

//copy到dist目录
gulp.task('copy',['clean'], function() {
    gulp.src(['./src/**/*','!./src/index.html'])
        .pipe(gulp.dest('./dist'))
});

//内联css和js文件，并生index.html成到dist
gulp.task('inlinesource',['copy'], function() {
    return gulp.src('./src/index.html')
        .pipe(inlinesource())
        .pipe(htmlmin({
          collapseWhitespace: true,
          minifyJS:true,
          minifyCSS:true,
          removeComments:true
        }))
        .pipe(gulp.dest('./dist'));
});

//注册默认任务
gulp.task('default', ['inlinesource']);
