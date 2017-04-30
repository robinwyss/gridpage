$(function($) {

  var storage = (function(window){
    var saveItems = function(items){
      window.localStorage.items = JSON.stringify(items);
    }
    var loadItems = function(){
      var items = []
      if(window.localStorage.items){
        items = JSON.parse(window.localStorage.items);
      }
      return items;
    }
    return {
      saveItems: saveItems,
      loadItems: loadItems
    };
  })(window);

   var gridManager = (function (storage, $){

    var options = {
      float: true
    };
    $('.grid-stack').gridstack(options);
    var gridStack = $('.grid-stack').data('gridstack');

    var addWidget = function(node){
      return gridStack.addWidget($('<div><div class="grid-stack-item-content"><div>'+node.content+'</div></div></div>'),
          node.x, node.y, node.width, node.height);
    }

    var save = function(){
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
      storage.saveItems(items)
    };

    var load = function(){
      // todo use promise
      var items = storage.loadItems();
      serialization = GridStackUI.Utils.sort(items);
      _.each(serialization, function (node) {
          addWidget(node);
      });
    };
    return {
      load: load,
      save: save,
      addWidget: addWidget
    };
  })(storage, $);


  $('#add-new-widget').click(function(){
    var editorPane = $('#editorPane');
    editorPane.show();
    editorPane.append('<div>');
    var editor = editorPane.find('div');
    editorPane.append('<button type="button" class="btn btn-primary saveBtn">Save</button>');
    var saveBtn = editorPane.find('.saveBtn');
    editorPane.append('<button type="button" class="btn closeBtn">Close</button>');
    var closeBtn = editorPane.find('.closeBtn');

    editor.summernote();
    saveBtn.click(function(){
      var content = editor.summernote('code');
      gridManager.addWidget({x:0,y:0,width:2,height:2,content:content});
      editor.summernote('destroy');
      editorPane.html('');
    });

    closeBtn.click(function(){
      editor.summernote('destroy');
      editorPane.html('');
    });
  });
  
  $('#save').click(gridManager.save);
  gridManager.load();

});
