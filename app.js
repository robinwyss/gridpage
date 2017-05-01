$(function($) {

  $('#add-new-widget').click(editor.createWidget);

  $('#save').click(gridManager.save);

  gridManager.load();
  editor.showEditOptions();
  
});
