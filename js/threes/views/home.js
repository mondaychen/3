define([
  'jquery'
, 'underscore'
, 'backbone'
, 'threes/app'
], function($, _, Backbone, app) {
  var HomeView = Backbone.View.extend({
    id: 'home-view'
  , template: $('#tmpl-home').html()
  , render: function() {
      this.$el.html(this.template)
      return this
    }
  })

  return HomeView
})