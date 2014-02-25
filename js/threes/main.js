define([
  'jquery'
, 'underscore'
, 'backbone'
, 'bowser'
, 'threes/app'
, 'threes/views/playing'
], function($, _, Backbone, bowser, app, PlayingView) {

  var AppRouter = Backbone.Router.extend({

    routes: {
      "": "home"
    , "playing": "playing"
    }

  , initialize: function() {
      app.wrapper = $('#wrapper')

      // init view
      var blueprint = {width: 768, height: 1024}
      var root = $('html'), win = $(window)
      function fixRootEm () {
        var viewHeight = win.height()
        var viewWidth = win.width()
        app.ratio = Math.min(viewHeight/blueprint.height, viewWidth/blueprint.width)
        root.css('font-size', app.ratio+'px')
      }
      fixRootEm()
      $(window).resize(_.debounce(function() {
        // seems only firefox render this perfectly
        if(bowser.firefox) {
          fixRootEm()
        } else {
          // var cfm = confirm("You have resized the window. would you like to "
          //   + "refresh to make a adaptation?")
          // if(cfm) {
          //   window.location.reload()
          // }
        }
      }, 300))
    }

  , home: function() {
      this.go('playing')
    }

  , playing: function() {
      var playingView = new PlayingView()
      app.wrapper.html(playingView.render().el)
      playingView.start()
    }

  , go: function(url) {
      this.navigate(url, {trigger: true})
    }

  })

  function initialize() {
    _.extend(app, {
      router: new AppRouter()
    })
    Backbone.history.start({pushState: false})
  }

  return {
    initialize: initialize
  }
})
