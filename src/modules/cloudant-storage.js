// import { controls } from './template';
'use-strict'
// import $ from 'jquery'

export default class CloudantStorage {
  constructor (cloudantSettings) {
    this.cloudantSettings = cloudantSettings
    // this.el = document.getElementById('target')
  }

  // decrypts the username and password from the settings files.
  // username and password are separated by a space (could be improved!)
  getCredentials () {
    var key = window.prompt('')
    var decrypted = window.CryptoJS.AES.decrypt(this.cloudantSettings.encryptedUsernamePassword, key).toString(window.CryptoJS.enc.Utf8)
    var usernamePassword = decrypted.split(' ')
    if (usernamePassword.length !== 2) {
      throw new Error('invalid credentials')
    }
    return {
      name: usernamePassword[0],
      password: usernamePassword[1]
    }
  }

  login () {
    // get current session
    return $.ajax(this.cloudantSettings.url + '/_session', {
      crossDomain: true
    }).then((data) => {
      // if user is not logged in, create a new session
      if (!data.userCtx.name) {
        var credentials = this.getCredentials()
        return $.ajax({
          url: this.cloudantSettings.url + '/_session',
          method: 'POST',
          crossDomain: true,
          data: credentials
        }) // TODO handle response
      }
    })
  }

  getDocumentUrl () {
    return this.cloudantSettings.url + '/' + this.cloudantSettings.database + '/' + this.cloudantSettings.document
  }

  loadData () {
    var documentUrl = this.getDocumentUrl()
    return $.ajax(documentUrl, {
      crossDomain: true,
      xhrFields: {
        withCredentials: true
      }
    })
  }

  saveItems (items) {
    // load latest data from server
    this.loadData().then((data) => {
      if (this.latestData && this.latestData._rev !== data._rev) {
        // data changed on server in the mean time!
        // TODO handle this situation
        throw new Error('Data changed on server')
      }
      data.content.items = items
      var documentUrl = this.getDocumentUrl()
      $.ajax(documentUrl, {
        crossDomain: true,
        method: 'PUT',
        xhrFields: {
          withCredentials: true
        },
        data: JSON.stringify(data),
        contentType: 'application/json'
      }).then((data) => {
        if (data.ok) {
          this.latestData._rev = data.rev
          this.latestData = data
        }
        // TODO handle nok case
      })
    })
  }

  loadItems () {
    return this.loadData().then((data) => {
      this.latestData = data
      return data.content.items
    })
  }
}
