module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    test: {
      files: ['test/**/*.js']
    },
    lint: {
      files: ['grunt.js', 'tasks/**/*.js', 'test/**/*.js']
    },
    watch: {
      files: '<config:lint.files>',
      tasks: 'default'
    },
    grunticon: {
      // required config
      src: "example/svg/",
      dest: "example/stylus/grunticon/",
      cssdest: "example/build/css/grunticon/",

      // optional grunticon config properties

      // text file that will hold the original list of icons
      // to be copy/pasted into a customizable scss file by editor
      // that file must be requiered inside scss files
      iconslistfile: "icons.list.txt",

      // YOU create this file manually so that we dont overwrite content on icons change
      iconsliststyl: "icons.list.styl",

      // SCSS filenames (now sass powered in order to manage different selectors)
      datasvgstyl: "icons.data.svg.styl",
      datapngstyl: "icons.data.png.styl",
      urlpngstyl: "icons.fallback.styl",

      // CSS filenames (used in async call in preview html)
      datasvgcss: "icons.data.svg.css",
      datapngcss: "icons.data.png.css",
      urlpngcss: "icons.fallback.css",

      // preview HTML filename
      previewhtml: "preview.html",

      // grunticon loader code snippet filename
      loadersnippet: "grunticon.loader.txt",

      // folder name (within dest) for png output
      pngfolder: "png/",

      // prefix for CSS classnames
      cssprefix: "icon-",

      // css file path prefix - this defaults to "/" and will be placed before the "dest" path when stylesheets are loaded.
      // This allows root-relative referencing of the CSS. If you don't want a prefix path, set to to ""
      cssbasepath: "/"
    },
    jshint: {
      options: {
        curly: true,
        eqeqeq: true,
        immed: true,
        latedef: false,
        newcap: true,
        noarg: true,
        sub: true,
        undef: true,
        boss: true,
        eqnull: true,
        node: true,
        es5: true
      },
      globals: {
        Image: true,
        window: true
      }
    }
  });

  // load npm tasks.
  grunt.loadNpmTasks('grunt-grunticon-stylus');

  // Load local tasks.
  grunt.loadTasks('tasks');

  // Default task.
  grunt.registerTask('default', 'lint grunticon');

};
