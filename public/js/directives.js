'use strict';

chat.directive('autoscrolldown', function() {
  return {
    link: function(scope, element, attrs) {
      scope.$watch(function() {
        return element[0].scrollHeight;
      }, function(newval, oldval) {
        element[0].scrollTop = newval;
      });
    }
  }
})
