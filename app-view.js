$(function($) {
  var name = window.location.hostname;
  if (name === 'localhost') {
    name = window.prompt("enter site name", "mysite.com");
  }
  // loadModules
  var storage = modules.storage.init(name, window);
  var gridManager = modules.gridManager.init(storage, $);

  gridManager.load(name);
});
