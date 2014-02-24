define([
  'jquery'
, 'underscore'
, 'backbone'
, 'threes/app'
, 'threes/views/playing'
], function($, _, Backbone, app, PlayingView) {

  var AppRouter = Backbone.Router.extend({

    routes: {
      "": "home"
    , "playing": "playing"
    }

  , initialize: function() {
      app.wrapper = $('#wrapper')
    }

  , home: function() {
      this.go('playing')
    }

  , playing: function() {
      var playingView = new PlayingView()
      app.wrapper.html(playingView.render().el)
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
