import CloudantStorage from './modules/cloudant-storage.js'
import Editor from './modules/editor.js'
import Grid from './modules/grid.js'
// import $ from 'jquery'
window.$ = window.jQuery = $

class App {
  init () {
    $.ajaxSetup({ cache: false })
    $.getJSON('settings.json', function (settings) {
      var state = {}

      // loadModules
      var storage = new CloudantStorage(settings.cloudantSettings)
      var grid = new Grid()
      var editor = new Editor()

      $.when(storage.login()).done(function () {
        $.when(storage.loadItems()).done(function (items) {
          grid.load(items)
          grid.enableEdit()
        })
      })

      $('#add-new-widget').click(() => editor.createWidget())

      $('#save').click(() => grid.save())

      $('body').on('gridchanged', function (event, data) {
        state.items = data.items
        storage.saveItems(data.items)
      })

      $('body').on('newcontent', function (event, content) {
        grid.initNewWidget(content)
      })

      $('body').on('editwidgetcontent', function (event, data) {
        editor.editWidget(data.content, data.callback)
      })
    })
  };
}

const app = new App()

$(function () {
  app.init()
})
