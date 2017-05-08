var modules = modules || {};
modules.grid = {
  init: function($) {
    if (!$) {
      throw 'error loading module, parameter jQuery is missing';
    }

    var options = {
      float: true,
      animate: true,
      cellHeight: 10,
      verticalMargin: 10,

    };

    $('.grid-stack').gridstack(options);
    var gridStack = $('.grid-stack').data('gridstack');

    $('.grid-stack').on('change', function(event, items) {
        triggerUpdate();
    });

    var initNewWidget = function(content){
      var widgetDefinition = {
        x: 0,
        y: 0,
        width: 2,
        height: 2,
        content: content
      };
      var widget = addWidget(widgetDefinition);
      resizeWidget(widget);
      reloadEditOptions();
      return widget;
    };

    var addWidget = function(node) {
      return gridStack.addWidget($('<div><div class="grid-stack-item-content"><div class="item-content-container">' + node.content + '</div></div></div>'),
        node.x, node.y, node.width, node.height);
    };

    var resizeWidget = function(widget) {
      var widgetContent = widget.find('.grid-stack-item-content div');
      var contentWidth = widgetContent.width();
      var contentHeight = widgetContent.height();
      // handle images
      widget.find('img').each(function() {
        var imgEl = $(this);
        contentWidth = imgEl.outerWidth(true);
        contentHeight = imgEl.outerHeight(true);
        imgEl.css({
          'width': 'auto',
          'height': 'auto',
          'max-height': '100%',
          'max-width': '100%'
        });
        // remove parent p-elemnent to enable correct sizing
        // TODO: this should be handled in editor
        if (imgEl.parent().prop('nodeName') === 'P') {
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

    var triggerUpdate = function() {
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
      $('body').trigger('gridchanged', {items: items});
    };

    var load = function(items) {
      serialization = GridStackUI.Utils.sort(items);
      _.each(serialization, function(node) {
        addWidget(node);
      });
    };

    var reloadEditOptions = function() {
      hideEditOptions();
      showEditOptions();
    };

    var showEditOptions = function() {
      $('.grid-stack-item-content').append('<div class="grid-element-edit"><div><button class="btn edit">edit</button><button class="btn delete">delete</button></div></div>');
      $('.grid-stack-item-content').find('button.edit').click(function(evt) {
        var widget = $(evt.target).closest('.grid-stack-item');
        var widgetContentContainer = widget.find('.grid-stack-item-content div');
        var content = widgetContentContainer.html();
        $('body').trigger('editwidgetcontent', {content: content, callback: function(content){
          widgetContentContainer.html(content);
        }});
      });
      $('.grid-stack-item-content').find('button.delete').click(function(evt) {
        var widget = $(evt.target).closest('.grid-stack-item');
        removeWidget(widget);
      });
    };

    var hideEditOptions = function() {
      $('.grid-stack-item-content .grid-element-edit').remove();
    };

    var enableEdit = function() {
      gridStack.enable();
      showEditOptions();
    };

    return {
      load: load,
      initNewWidget: initNewWidget,
      removeWidget: removeWidget,
      enableEdit: enableEdit
    };
  }
};
