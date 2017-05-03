$(function($) {
  var name = window.location.hostname;
  if (name === 'localhost') {
    name = window.prompt("enter site name", "mysite.com");
  }
  // loadModules
  var storage = modules.storage.init(name, window);
  var gridManager = modules.gridManager.init($);

  //gridManager.load(name);
  $.when(storage.loadItems(name)).done(function(items) {
    gridManager.load(items);
  });
});
