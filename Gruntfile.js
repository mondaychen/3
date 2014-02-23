module.exports = function(grunt) {
  grunt.initConfig({
    stylus: {
      compile: {
        options: {
          paths: ['bower_components/'],
          "include css": true,
        },
        files: {
          "./css/app.css": "./css/app.styl"
        }
      }
    },

    watch: {
      grunt: { files: ['Gruntfile.js'] },

      stylus: {
        files: ['./css/**/*.styl'],
        tasks: ['stylus']
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-stylus');
  grunt.loadNpmTasks('grunt-contrib-watch');

  grunt.registerTask('build', ['stylus']);
  grunt.registerTask('default', ['build']);
}
