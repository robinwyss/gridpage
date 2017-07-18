'use-strict'
// import $ from 'jquery'
// import gridstack from 'gridstack.jQueryUI'

export default class GridManager {
  constructor () {
    this.options = {
      float: true,
      animate: true,
      cellHeight: 10,
      verticalMargin: 10
    }

    $('.grid-stack').gridstack(this.options)
    this.gridStack = $('.grid-stack').data('gridstack')

    $('.grid-stack').on('change', (event, items) => {
      this.triggerUpdate()
    })
  }

  initNewWidget (content) {
    var widgetDefinition = {
      x: 0,
      y: 0,
      width: 2,
      height: 2,
      content: content
    }
    var widget = this.addWidget(widgetDefinition)
    this.resizeWidget(widget)
    this.reloadEditOptions()
    return widget
  }

  addWidget (node) {
    return this.gridStack.addWidget($('<div><div class="grid-stack-item-content"><div class="item-content-container">' + node.content + '</div></div></div>'),
      node.x, node.y, node.width, node.height)
  }

  resizeWidget (widget) {
    var widgetContent = widget.find('.grid-stack-item-content div')
    var contentWidth = widgetContent.width()
    var contentHeight = widgetContent.height()
    // handle images
    widget.find('img').each(() => {
      var imgEl = $(this)
      contentWidth = imgEl.outerWidth(true)
      contentHeight = imgEl.outerHeight(true)
      imgEl.css({
        'width': 'auto',
        'height': 'auto',
        'max-height': '100%',
        'max-width': '100%'
      })
      // remove parent p-elemnent to enable correct sizing
      // TODO: this should be handled in editor
      if (imgEl.parent().prop('nodeName') === 'P') {
        var pEl = imgEl.parent()
        imgEl.appendTo(imgEl.parent().parent())
        pEl.remove()
      }
    })
    var width = Math.ceil((contentWidth + 10) / this.gridStack.cellWidth())
    var height = Math.ceil((contentHeight + 10) / (this.gridStack.cellHeight() + this.options.verticalMargin))
    this.gridStack.resize(widget, width, height)
  }

  removeWidget (widget) {
    this.gridStack.removeWidget(widget)
  }

  triggerUpdate () {
    var items = window._.map($('.grid-stack .grid-stack-item:visible'), (el) => {
      el = $(el)
      var node = el.data('_gridstack_node')
      return {
        id: el.attr('data-custom-id'),
        x: node.x,
        y: node.y,
        width: node.width,
        height: node.height,
        content: el.find('.grid-stack-item-content .item-content-container').html()
      }
    })
    $('body').trigger('gridchanged', {
      items: items
    })
  }

  load (items) {
    var serialization = window.GridStackUI.Utils.sort(items)
    window._.each(serialization, (node) => {
      this.addWidget(node)
    })
  }

  reloadEditOptions () {
    this.hideEditOptions()
    this.showEditOptions()
  }

  showEditOptions () {
    $('.grid-stack-item-content').append('<div class="grid-element-edit"><div><button class="btn edit">edit</button><button class="btn delete">delete</button></div></div>')
    $('.grid-stack-item-content').find('button.edit').click((evt) => {
      var widget = $(evt.target).closest('.grid-stack-item')
      var widgetContentContainer = widget.find('.grid-stack-item-content div')
      var content = widgetContentContainer.html()
      $('body').trigger('editwidgetcontent', {
        content: content,
        callback: (content) => {
          widgetContentContainer.html(content)
        }
      })
    })

    $('.grid-stack-item-content').find('button.delete').click((evt) => {
      var widget = $(evt.target).closest('.grid-stack-item')
      this.removeWidget(widget)
    })
  };

  hideEditOptions () {
    $('.grid-stack-item-content .grid-element-edit').remove()
  };

  enableEdit () {
    this.gridStack.enable()
    this.showEditOptions()
  }
}
