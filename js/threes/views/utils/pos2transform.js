define([
  'bowser'
], function (bowser) {

  function pos2transform (pos) {
    var prefix = ''
    if(bowser.webkit) {
      prefix = '-webkit-'
    }
    var rtn = {}
    rtn[prefix + 'transform'] = 'translate3d('
        + pos.left + 'px, ' + pos.top +'px, 0px)'
    return rtn
  }

  return pos2transform
})