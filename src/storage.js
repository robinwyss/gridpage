var storage = (function(window) {
  
  var saveItems = function(items) {
    window.localStorage.items = JSON.stringify(items);
  };
  var loadItems = function() {
    var items = [];
    if (window.localStorage.items) {
      items = JSON.parse(window.localStorage.items);
    }
    return items;
  };
  return {
    saveItems: saveItems,
    loadItems: loadItems
  };
})(window);
