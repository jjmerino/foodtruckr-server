module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json')
    ,
    mochaTest: {
      test: {
        options: {
          reporter: 'spec'
        },
        src: ['test/**/*.js']
      }
    },

    jshint: {
      files: [
        './**/*.js'
      ],
      options: {
        force: 'true',
        jshintrc: '.jshintrc',
        ignores: [
          'specs/client/**/*.js'
        ]
      }
    },

    watch: {
      scripts: {
        files: [
          './**/*.js'
        ],
        tasks: [
          'test'
        ]
      }
    },

    jsdoc : {
      dist : {
        src: ['./**/*.js'],
        options: {
          destination: 'doc'
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-mocha-test');
  grunt.loadNpmTasks('grunt-jsdoc');

  grunt.registerTask('test', 'Runs mocha tests', [
    'mochaTest'
  ]);

};
