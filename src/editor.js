var modules = modules || {};
modules.editor = {
  init: function(gridManager) {
    if(!gridManager){
      throw 'error loading module, parameter gridManager is missing';
    }

    var createEditor = function(saveAction, initialContent) {
      var editorPane = $('#editorPane');
      editorPane.show();
      editorPane.append('<div>');
      var editor = editorPane.find('div');
      editorPane.append('<button type="button" class="btn btn-primary saveBtn">Save</button>');
      var saveBtn = editorPane.find('.saveBtn');
      editorPane.append('<button type="button" class="btn closeBtn">Close</button>');
      var closeBtn = editorPane.find('.closeBtn');
      editor.summernote();
      if (initialContent) {
        editor.summernote('code', initialContent);
      }
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
        // var widget = gridManager.addWidget({
        //   x: 0,
        //   y: 0,
        //   width: 2,
        //   height: 2,
        //   content: content
        // });
        // gridManager.resizeWidget(widget);
        reloadEditOptions();
      };
      createEditor(saveAction);
    };

    var editWidget = function(widget) {
      var content = widget.find('.grid-stack-item-content div').html();
      var saveAction = function(content) {
        widget.find('.grid-stack-item-content div').html(content);
        reloadEditOptions();
        gridManager.resizeWidget(widget);
      };
      createEditor(saveAction, content);
    };

    var reloadEditOptions = function() {
      hideEditOptions();
      showEditOptions();
    };

    var showEditOptions = function() {
      $('.grid-stack-item-content').append('<div class="grid-element-edit"><div><button class="btn edit">edit</button><button class="btn delete">delete</button></div></div>');
      $('.grid-stack-item-content').find('button.edit').click(function(evt) {
        var widget = $(evt.target).closest('.grid-stack-item');
        editor.editWidget(widget);
      });
      $('.grid-stack-item-content').find('button.delete').click(function(evt) {
        var widget = $(evt.target).closest('.grid-stack-item');
        gridManager.removeWidget(widget);
      });
    };

    var hideEditOptions = function() {
      $('.grid-stack-item-content .grid-element-edit').remove();
    };

    return {
      createWidget: createWidget,
      editWidget: editWidget,
      showEditOptions: showEditOptions,
      hideEditOptions: hideEditOptions
    };
  }
};
