module.exports = function(grunt) {

  grunt.initConfig({
    browserify: {
      js: {
        src: ['js/main.js'],
        dest: 'dist/app.js'
      },
      options: {
        transform: ['hbsfy']
      }
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
      },
      sass: {
        files: ['./sass/**/*.scss'],
        tasks: ['sass']
      },
      hbs: {
        files: ['./templates/**/*.hbs'],
        tasks: ['browserify']
      }
    }
});

require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);
grunt.registerTask('default', ['browserify', 'sass', 'watch']);
}
