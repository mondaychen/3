require.config({
  baseUrl: "./js/",
  aliases: {
    'lib': '../bower_components/'
  }
})

define('jquery-src', '{lib}/jquery/dist/jquery.min.js')
define('underscore-src', '{lib}/underscore/underscore.js')
define('backbone-src', ['jquery-src', 'underscore-src'],
  '{lib}/backbone/backbone.js')

define('jquery', ['jquery-src'], function() { return $ })
define('underscore', ['underscore-src'], function() { return _ })
define('backbone', ['backbone-src'], function() { return Backbone })

require(['main'], function(app) {
  app.initialize()
})
