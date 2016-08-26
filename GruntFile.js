module.exports = function(grunt) {

  grunt.initConfig({
    browserify: {
      'dist/app.js': ['js/main.js']
      },
    sass: {
      'dist/main.css': ['sass/main.scss']
    },
    jshint: {
      options: {
        predef: [ "document", "console" ],
        esnext: true,
        globalstrict: true,
        globals: {"js": true},
        browserify: true,
        jquery: true,
        devel: true
      },
      files: ['js/**/*.js']
    },
    watch: {
      javascripts: {
        files: ['js/**/*.js'],
        tasks: ['jshint', 'browserify']
      }
    }
});

require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);
grunt.registerTask('default', ['browserify', 'sass', 'jshint', 'watch']);
}
