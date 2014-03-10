define([
  'jquery'
, 'underscore'
, 'backbone'
, 'threes/app'
], function($, _, Backbone, app) {
  var Menu = function() {
    this.html = $('#tmpl-playing-menu').html()
    $(document).on('click', '.playing-menu .restart', function() {
      app.router.go('replay')
    }).on('click', '.playing-menu .home', function() {
      app.router.go('')
    })
  }

  _.extend(Menu.prototype, {
    show: function() {
      app.popup.open({
        html: this.html
      })
    }
  })

  return new Menu()
})