'use-strict'
// import $ from 'jquery'

export default class Editor {
  constructor (gridManager) {
    this.gridManager = gridManager
  }

  createEditor (saveAction, initialContent) {
    var editorPane = $('#editorPane')
    editorPane.show()
    editorPane.append('<div>')
    var editor = editorPane.find('div')
    var saveBtn = $('<button type="button" class="btn btn-primary saveBtn">Save</button>').appendTo(editorPane)
    var closeBtn = $('<button type="button" class="btn closeBtn">Close</button>').appendTo(editorPane)
    editor.summernote()
    if (initialContent) {
      editor.summernote('code', initialContent)
    }
    editor.summernote('focus')
    saveBtn.click(() => {
      var content = editor.summernote('code')
      saveAction(content)
      editor.summernote('destroy')
      editorPane.html('')
    })

    closeBtn.click(() => {
      editor.summernote('destroy')
      editorPane.html('')
    })
  }

  createWidget () {
    this.createEditor((content) => {
      $('body').trigger('newcontent', content)
    })
  }

  editWidget (content, callback) {
    this.createEditor(callback, content)
  }
}
