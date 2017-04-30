$(function($) {

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

  var gridManager = (function(storage, $) {

    var options = {
      float: true,
      animate: true,
      cellHeight: 10,
      verticalMargin: 10
    };
    $('.grid-stack').gridstack(options);
    var gridStack = $('.grid-stack').data('gridstack');

    var addWidget = function(node) {
      return gridStack.addWidget($('<div><div class="grid-stack-item-content"><div>' + node.content + '</div></div></div>'),
        node.x, node.y, node.width, node.height);
    };

    var resizeWidget = function(widget) {
      // adjust size of p-element for images
      widget.find('img').each(function(){
        var width = $(this).outerWidth( true );
        $(this).closest('p').width(width);
      })
      var widgetContent = widget.find('.grid-stack-item-content div');
      var contentWidth = widgetContent.width();
      var contentHeight = widgetContent.height();
      var width = Math.ceil((contentWidth + 10) / gridStack.cellWidth());
      var height = Math.ceil((contentHeight + 10) / (gridStack.cellHeight() + options.verticalMargin));
      gridStack.resize(widget, width, height);
    };

    var removeWidget = function(widget) {
      gridStack.removeWidget(widget);
    };

    var save = function() {
      var items = _.map($('.grid-stack .grid-stack-item:visible'), function(el) {
        el = $(el);
        var node = el.data('_gridstack_node');
        return {
          id: el.attr('data-custom-id'),
          x: node.x,
          y: node.y,
          width: node.width,
          height: node.height,
          content: el.children().first().html()
        };
      });
      storage.saveItems(items);
    };

    var load = function() {
      // todo use promise
      var items = storage.loadItems();
      serialization = GridStackUI.Utils.sort(items);
      _.each(serialization, function(node) {
        addWidget(node);
      });
    };
    return {
      load: load,
      save: save,
      addWidget: addWidget,
      resizeWidget: resizeWidget,
      removeWidget: removeWidget
    };
  })(storage, $);

  var editor = (function(gridManager) {

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
        var widget = gridManager.addWidget({
          x: 0,
          y: 0,
          width: 2,
          height: 2,
          content: content
        });
        gridManager.resizeWidget(widget);
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
  })(gridManager);


  $('#add-new-widget').click(editor.createWidget);

  $('#save').click(gridManager.save);

  gridManager.load();
  editor.showEditOptions();


});
