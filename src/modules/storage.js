var modules = modules || {};
modules.storage = {
  init: function(name, window){
    if(!name){
      throw 'error loading module, parameter name is missing';
    }
    if(!window){
      throw 'error loading module, parameter window is missing';
    }

    var saveItems = function( items) {
      window.localStorage[name] = JSON.stringify(items);
    };
    var loadItems = function() {
      var items = [];
      if (window.localStorage[name]) {
        items = JSON.parse(window.localStorage[name]);
      }
      return items;
    };
    return {
      saveItems: saveItems,
      loadItems: loadItems
    };
  }


};
