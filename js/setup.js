require.config({
  baseUrl: "./js/"
, aliases: {
    'lib': '../bower_components/'
  }
})

define('jquery', '{lib}/jquery/dist/jquery.min.js')
define('underscore', '{lib}/underscore/underscore.js')
define('backbone', ['jquery', 'underscore'],
  '{lib}/backbone/backbone.js')

require(['main'], function(app) {
  app.initialize()
})
