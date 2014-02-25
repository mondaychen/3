require.config({
  baseUrl: "./bower_components/"
, aliases: {
    'mod': '../js/mod/'
  , 'threes': '../js/threes/'
  }
})

define('jquery', './jquery/dist/jquery.min.js')
define('underscore', 'underscore/underscore.js')
define('backbone', ['jquery', 'underscore'],
  'backbone/backbone.js')

define('bowser', 'bowser/bowser.min.js')

require(['threes/main'], function(app) {
  app.initialize()
})
