# gulp-web-static-tool

The development tool that generates static HTML pages.

Contains:
 
`Gulp`, `Pug`, `Sass`, `Browsersync`, `Autoprefixer`, `Clean-CSS`, `Uglify`, `Imagemin`, `Vinyl-FTP`, 

Contains also `.htaccess` rules file for apache server.

## Usage
- **Download** or **clone** repository;
- Open _**terminal**_
- Install **_node_modules:_** `npm i`;
- Run gulp task: `gulp`.

## Gulp tasks
- **gulp:** run default gulp task (sass, js, watch, browserSync) for web development;
- **build:** build project to dist folder (cleanup, image optimize, removing unnecessary files);
- **deploy:** project deployment on the server from dist folder via FTP;
- **clearcache:** clear all gulp cache.

## File Structure 

+ app
    + css
    + js
    + img
    + libs
    + pug
        + common
        + mixins
        + variables
    + sass
        + common
        + mixins
+ .htaccess
+ gulpfile.js
+ dist