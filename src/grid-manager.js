var gridManager = (function(storage, $) {

  var options = {
    float: true,
    animate: true,
    cellHeight: 10,
    verticalMargin: 10,

  };
  $('.grid-stack').gridstack(options);
  var gridStack = $('.grid-stack').data('gridstack');

  var addWidget = function(node) {
    return gridStack.addWidget($('<div><div class="grid-stack-item-content"><div class="item-content-container">' + node.content + '</div></div></div>'),
      node.x, node.y, node.width, node.height);
  };

  var resizeWidget = function(widget) {

    var widgetContent = widget.find('.grid-stack-item-content div');
    var contentWidth = widgetContent.width();
    var contentHeight = widgetContent.height();
    // handle images
    widget.find('img').each(function(){
      var imgEl = $(this);
      contentWidth = imgEl.outerWidth( true );
      contentHeight = imgEl.outerHeight( true );
      imgEl.css({'width': 'auto', 'height': 'auto', 'max-height':'100%','max-width':'100%'});
      // remove parent p-elemnent to enable correct sizing
      // TODO: this should be handled in editor
      if(imgEl.parent().prop('nodeName') === 'P'){
        var pEl = imgEl.parent();
        imgEl.appendTo(imgEl.parent().parent());
        pEl.remove();
      }
    });
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
        content: el.find('.grid-stack-item-content .item-content-container').html()
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

  var disableEdit = function(){
    gridStack.disable();
  };

  return {
    load: load,
    save: save,
    addWidget: addWidget,
    resizeWidget: resizeWidget,
    removeWidget: removeWidget,
    disableEdit: disableEdit
  };
})(storage, $);