var modules = modules || {};
modules.editor = {
  init: function(gridManager) {

    var createEditor = function(saveAction, initialContent) {
      var editorPane = $('#editorPane');
      editorPane.show();
      editorPane.append('<div>');
      var editor = editorPane.find('div');
      var saveBtn = $('<button type="button" class="btn btn-primary saveBtn">Save</button>').appendTo(editorPane);
      var closeBtn = $('<button type="button" class="btn closeBtn">Close</button>').appendTo(editorPane);
      editor.summernote();
      if (initialContent) {
        editor.summernote('code', initialContent);
      }
      editor.summernote('focus');
      saveBtn.click(function() {
        var content = editor.summernote('code');
        saveAction(content);
        editor.summernote('destroy');
        editorPane.html('');
      });

      closeBtn.click(function() {
        editor.summernote('destroy');
        editorPane.html('');
      });
    };

    var createWidget = function() {
      var saveAction = function(content) {
        $('body').trigger('newcontent', content);
      };
      createEditor(saveAction);
    };

    var editWidget = function(content, callback) {
      createEditor(callback, content);
    };

    return {
      createWidget: createWidget,
      editWidget: editWidget
    };
  }
};
