module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
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

    ozma: {
      app: {
        src: "./js/setup.js",
        saveConfig: false,
        config: {
          baseUrl: "./js/",
          distUrl: "./js/dist/",
          loader: "../bower_components/ozjs/oz.js",
          disableAutoSuffix: true,
        },
        slient: false,
        jam: false
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

  grunt.loadNpmTasks('grunt-ozjs');
  grunt.loadNpmTasks('grunt-contrib-stylus');
  grunt.loadNpmTasks('grunt-contrib-watch');

  grunt.registerTask('build', ['stylus']);
  grunt.registerTask('default', ['build']);
}
