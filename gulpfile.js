const gulp = require('gulp');
const sass = require('gulp-sass');
const rename = require('gulp-rename');
const browserSync = require('browser-sync');
const htmlmin = require('gulp-htmlmin');
const cleanCSS = require('gulp-clean-css');
const imagemin = require('gulp-imagemin');
const autoprefixer = require('gulp-autoprefixer');
const del = require('del');
const webpack = require('webpack-stream');

gulp.task('server', function (){
    browserSync({
        server: {
            baseDir:'./dist'
        }
    })
    gulp.watch("dist/*.html").on('change', browserSync.reload);
})
gulp.task('styles',function (){
    return gulp.src("src/sass/**/*.+(scss|sass)")
    .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
    .pipe(rename({suffix: '.min', prefix: ''}))
    .pipe(autoprefixer())
    .pipe(cleanCSS({compatibility: 'ie8'}))
    .pipe(gulp.dest("dist/css"))
    .pipe(browserSync.stream());

});


gulp.task('html', function(){
    return gulp.src('src/*.html')
    .pipe(htmlmin({ collapseWhitespace: true }))
    .pipe(gulp.dest('dist'));
})
gulp.task('watch', function(){
    gulp.watch("src/sass/**/*.+(scss|sass|css)", gulp.parallel('styles'));
    gulp.watch("src/*.html").on('change', gulp.parallel('html'));
    gulp.watch('src/mailer/**').on('change', gulp.parallel('mailer'));
    gulp.watch('src/js/**').on('change', gulp.parallel('script'));
});
gulp.task('script', function(){
    return gulp.src('src/js/script.js')
    .pipe(webpack(require('./webpack.config')))
    .pipe(gulp.dest('dist/js/'))
    .pipe(browserSync.stream());
});

gulp.task('icons',function(){
    return gulp.src('src/icons/**')
    .pipe(gulp.dest('dist/icons/'));
});
gulp.task('mailer', function(){
    return gulp.src('src/mailer/**')
    .pipe(gulp.dest('dist/mailer/'));
});
gulp.task('fonts', function(){
    return gulp.src('src/fonts/**')
    .pipe(gulp.dest('dist/fonts/'));
})
gulp.task('images', function (){
    return gulp.src("src/img/**/*")
        .pipe(imagemin([
            imagemin.gifsicle({interlaced: true}),
            imagemin.jpegtran({progressive: true}),
            imagemin.optipng({optimizationLevel: 5}),
            imagemin.svgo({
                plugins: [
                    {removeViewBox: true},
                    {cleanupIDs: false}
                ]
            })
        ]))
        .pipe(gulp.dest("dist/img"));
});

gulp.task('clean', function () {
    return del(['dist/*'])
});

gulp.task('pres1', gulp.parallel('images', 'icons', 'fonts', 'mailer'))
gulp.task('pres2', gulp.parallel('server', 'watch', 'html', 'styles', 'script'))