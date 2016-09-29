// Karma configuration
// Generated on Tue Aug 23 2016 23:12:04 GMT+0900 (대한민국 표준시)
// https://github.com/babel/karma-babel-preprocessor

module.exports = function(config) {
  config.set({

    plugins : [
      'karma-chrome-launcher',
      'karma-ie-launcher',
      'karma-jasmine',
      'karma-babel-preprocessor'
    ],

    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: '',


    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ['jasmine'],


    // list of files / patterns to load in the browser
    files: [
      'bower_components/emitter/index.js',
      'bower_components/proxy-polyfill/proxy.min.js',
      'src/stateful-array.js',
      'src/crud-array.js',
      'test/**/*.test.js'
    ],


    // list of files to exclude
    exclude: [
    ],


    // preprocess matching files before serving them to the browser
    // available preprocessors:
	// https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: {
    	'src/**/*.js': ['babel' ],
        'test/**/*.js': ['babel']
    },
    babelPreprocessor: {
    	options: {
    		presets: ['es2015'],
    		sourceMap: 'inline',
    		plugins: ["transform-es2015-modules-umd"]
    	},
    	filename: function (file) {
    		return file.originalPath.replace(/\.js$/, '.js');
    	},
    	sourceFileName: function (file) {
    		return file.originalPath;
    	}
    },

    // test results reporter to use
    // possible values: 'dots', 'progress'
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: ['progress'],


    // web server port
    port: 9876,


    // enable / disable colors in the output (reporters and logs)
    colors: true,


    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR ||
	// config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_DEBUG,


    // enable / disable watching file and executing tests whenever any file
	// changes
    autoWatch: true,


    // start these browsers
    // available browser launchers:
	// https://npmjs.org/browse/keyword/karma-launcher
    //browsers: ['Chrome', 'IE', 'IE10', 'IE9'],
    browsers: ['Chrome'],

    customLaunchers: {
    	IE10: {
    		base: 'IE',
	        'x-ua-compatible': 'IE=EmulateIE10'
    	},
    	IE9: {
    		base: 'IE',
    		'x-ua-compatible': 'IE=EmulateIE9'
    	}
    },



    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: false,

    // Concurrency level
    // how many browser should be started simultaneous
    concurrency: Infinity
  })
}
