var gulp        = require('gulp'),
    gutil       = require('gulp-util'),
    sass        = require('gulp-sass'),
    bs          = require('browser-sync'),
    concat      = require('gulp-concat'),
    uglify      = require('gulp-uglify'),
    cleanCSS    = require('gulp-clean-css'),
    rename      = require('gulp-rename'),
    del         = require('del'),
    imagemin    = require('gulp-imagemin'),
    pngquant    = require('imagemin-pngquant'),
    cache       = require('gulp-cache'),
    ap          = require('gulp-autoprefixer'),
    ftp         = require('vinyl-ftp'),
    notify      = require("gulp-notify"),
    pug         = require("gulp-pug");

// Paths
var input   =   'src/',
    output  =   'src/',
    dist    =   'dist/';

var paths = {
    scripts: {
        input:  input + 'js/*.js',
        output: output + 'js/',
        dist:   dist + 'js/'
    },
    styles: {
        input:  input + 'sass/**/*.{scss,sass}',
        output: output +'css/',
        dist:   dist + 'css/'
    },
    svgs: {
        input:  input + 'svg/*',
        output: output + 'svg/',
        dist:   dist + 'svg/'
    },
    images: {
        input:  input +'src/img/**/*',
        output: output +'dist/img/',
        dist:   dist + 'img/'
    },
    pug:{
        input:  input + 'pug/**/*.pug',
        output: output ,
        no: {
            common:     '!' + input + 'pug/common/*.pug',
            partials:   '!' + input + 'pug/partials/*.pug',
            variables:  '!' + input + 'pug/variables/*.pug',
            mixins:     '!' + input + 'pug/mixins/*.pug'
        }
    }
};
//  BrowserSync
gulp.task('browser-sync', function () {
    bs({
        server: {
            baseDir: 'src'
        },
        notify: false
    });
});
//  PUG to HTML
gulp.task('pug', function () {
    return gulp.src([
        paths.pug.input,
        paths.pug.no.common,
        paths.pug.no.variables,
        paths.pug.no.mixins,
        paths.pug.no.partials
    ])
        .pipe(pug({
            pretty: true
        }).on("error", notify.onError()))
        .pipe(gulp.dest(paths.pug.output))
});
//  SASS to CSS
gulp.task('sass',  function () {
    return gulp.src(paths.styles.input)
        .pipe(sass().on("error", notify.onError()))
        .pipe(rename({suffix: '.min', prefix: ''}))
        .pipe(ap(['last 10 versions']))
        //.pipe(cleanCSS())
        .pipe(gulp.dest(paths.styles.output))
        .pipe(bs.reload({stream: true}))
});
//  Javascript
gulp.task('libs', function () {
    return gulp.src([
        //'app/libs/jquery/dist/jquery.min.js',
        'app/js/common.js'
    ])
        .pipe(concat('libs.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest(paths.scripts.output))
        .pipe(bs.reload({stream: true}))
});
// Watch files
gulp.task('watch', ['sass', 'pug', 'libs', 'browser-sync'], function () {
    gulp.watch(paths.styles.input, ['sass']);
    gulp.watch(paths.pug.input, ['pug']);
    gulp.watch(paths.scripts.input, ['libs']);
    gulp.watch('src/*.html', bs.reload);
    gulp.watch(paths.scripts.input, bs.reload);
});
//  Images
gulp.task('imagemin', function () {
    return gulp.src(paths.images.input)
        .pipe()
        .pipe(cache(imagemin([
            imagemin.gifsicle({interlaced: true}),
            imagemin.jpegtran({progressive: true}),
            imagemin.optipng({optimizationLevel: 5}),
            imagemin.svgo({plugins: [{removeViewBox: true}]})
        ])))
        .pipe(gulp.dest(paths.images.dist));
});
//  Clear dist folder
gulp.task('removedist', function () {
    return del.sync('dist');
});

/*  Production  */
gulp.task('build', ['removedist', 'imagemin', 'pug', 'sass', 'libs'], function () {

    var buildCss = gulp.src([
        'src/css/fonts.min.css',
        'src/main.min.css'
    ])
        .pipe(concat('main.min.css'))
        .pipe(gulp.dest(paths.dist));

    var buildFiles = gulp.src([
        'src/.htaccess',
        'src/robots.txt',
        'src/sitemap.xml'
    ])
        .pipe(gulp.dest('dist'));

    var buildFonts = gulp.src('src/fonts/**/*')
        .pipe(gulp.dest('dist/fonts'));

    var buildJs = gulp.src('src/js/**/*')
        .pipe(gulp.dest('dist/js'));

    var buildHTML = gulp.src(['src/*.html'
    ])
        .pipe(gulp.dest('dist'));

});
// Deploy
gulp.task('deploy', function() {
	var conn = ftp.create({
		host:      'hostname.com',
		user:      'username',
		password:  'userpassword',
		parallel:  10,
		log: gutil.log
	});
	var globs = [
	'dist/**/*'
	];
	return gulp.src(globs, {buffer: false})
	.pipe(conn.dest('/path/to/server/folder'));

});

gulp.task('clearcache', function () {
    return cache.clearAll();
});

gulp.task('default', ['watch']);
