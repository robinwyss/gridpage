$(function($) {
  $.ajaxSetup({ cache: false });
  $.getJSON('settings.json', function(settings){

    var state = {};

    // loadModules
    var storage = modules.cloudantStorage.init($, settings.cloudantSettings);
    var grid = modules.grid.init($);
    var editor = modules.editor.init();

    $.when(storage.login()).done(function(){
      $.when(storage.loadItems()).done(function(items) {
        grid.load(items);
        grid.enableEdit();
      });
    });

    $('#add-new-widget').click(editor.createWidget);

    $('#save').click(grid.save);

    $('body').on('gridchanged', function(event, data) {
      state.items = data.items;
      storage.saveItems(data.items);
    });

    $('body').on('newcontent', function(event, content) {
      grid.initNewWidget(content);
    });

    $('body').on('editwidgetcontent', function(event, data) {
      editor.editWidget(data.content, data.callback);
    });

  });

});
