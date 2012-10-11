/*
 * grunticon
 * https://github.com/filamentgroup/grunticon
 *
 * Copyright (c) 2012 Scott Jehl, Filament Group, Inc
 * Licensed under the MIT license.
 */

module.exports = function(grunt ) {

  grunt.registerTask( 'grunticon', 'A mystical CSS icon solution.', function() {

    // just a quick starting message
    grunt.log.write( "Look, it's a grunticon!\n" );

    // get the config
    var config = grunt.config.get( "grunticon" );

    // fail if config or no src or dest config
    if( !config || config.src === undefined || config.dest === undefined ){
      grunt.fatal( "Oops! Please provide grunticon configuration for src and dest in your grunt.js file" );
      return;
    }

    // make sure src and dest have / at the end
    if( !config.src.match( /\/$/ ) ){
        config.src += "/";
    }
    if( !config.dest.match( /\/$/ ) ){
        config.dest += "/";
    }

    var cssdest = config.cssdest || config.dest;

    if( !cssdest.match( /\/$/ ) ){
        cssdest += "/";
    }

    var asyncCSS = grunt.task.getFile( "grunticon/static/grunticon.loader.js" );
    var asyncCSSBanner = grunt.task.getFile( "grunticon/static/grunticon.loader.banner.js" );
    var previewHTMLsrc = grunt.task.getFile( "grunticon/static/preview.html" );

    // text filename that will hold the original list of icons
    var iconslistfile = grunt.config.iconslistfile || "icons.list.txt";

    // Stylus filename that will be used to add our own selectors
    // this file will need to be created manually to avoid overwrite!
    // we list it here so we can add the require rules at beginning of the 3 Stylus files
    var iconsliststyl = grunt.config.iconsliststyl || "icons.list.styl";

    // Stylus filenames
    var datasvgstyl = grunt.config.datasvgstyl || "icons.data.svg.styl";
    var datapngstyl = grunt.config.datapngstyl || "icons.data.png.styl";
    var urlpngstyl = grunt.config.urlpngstyl || "icons.fallback.styl";

    // CSS filenames to be used on preview async call
    var datasvgcss = grunt.config.datasvgcss || "icons.data.svg.css";
    var datapngcss = grunt.config.datapngcss || "icons.data.png.css";
    var urlpngcss = grunt.config.urlpngcss || "icons.fallback.css";

    //filename for generated output preview HTML file
    var previewhtml = config.previewhtml || "preview.html";

    //filename for generated loader HTML snippet file
    var loadersnippet = config.loadersnippet || "grunticon.loader.txt";

    // css references base path for the loader
    var cssbasepath = (typeof config.cssbasepath === 'string') ? config.cssbasepath : "/";

    // folder name (within the output folder) for generated png files
    var pngfolder = config.pngfolder || "png/";
    // make sure pngfolder has / at the end
    if( !pngfolder.match( /\/$/ ) ){
        pngfolder += "/";
    }

    // css class prefix
    var cssprefix = (typeof config.cssprefix === 'string') ? config.cssprefix : "icon";
    
    // create the output directory
    grunt.file.mkdir( config.dest );

    // create the output icons directory
    grunt.file.mkdir( config.cssdest + pngfolder );

    // minify the source of the grunticon loader and write that to the output
    grunt.log.write( "\ngrunticon now minifying the stylesheet loader source." );
    var asyncsrc = grunt.file.read( asyncCSS );
    var banner = grunt.file.read( asyncCSSBanner );
    var min = banner + "\n" + grunt.helper('uglify', asyncsrc );
    var loaderCodeDest = config.dest + loadersnippet;
    grunt.file.write( loaderCodeDest, min );
    grunt.log.write( "\ngrunticon loader file created." );

    // take it to phantomjs to do the rest
    grunt.log.write( "\ngrunticon now spawning phantomjs...\n" );

    var args = [
        grunt.task.getFile('grunticon/phantom.js'),
        config.src,
        config.dest,
        loaderCodeDest,
        previewHTMLsrc,
        datasvgstyl,
        datapngstyl,
        urlpngstyl,
        previewhtml,
        pngfolder,
        "'" + cssprefix + "'",
        "'" + cssbasepath + "'",
        iconslistfile,
        iconsliststyl,
        datasvgcss,
        datapngcss,
        urlpngcss,
        cssdest
      ];

    //grunt.log.write( args.join(',\n') );

    grunt.utils.spawn({
      cmd: 'phantomjs',
      args: args,
      fallback: ''
    }, function(err, result, code) {
      // TODO boost this up a bit.
      grunt.log.write("\nSomething went wrong with phantomjs...");
    });
  });
};
