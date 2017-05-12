var modules = modules || {};
modules.cloudantStorage = {
  init: function($, cloudantSettings) {
    var latestData;
    // decrypts the username and password from the settings files.
    // username and password are separated by a space (could be improved!)
    var getCredentials = function() {
      var key = prompt("");
      var decrypted = CryptoJS.AES.decrypt(cloudantSettings.encryptedUsernamePassword, key).toString(CryptoJS.enc.Utf8);
      var usernamePassword = decrypted.split(' ');
      if (usernamePassword.length !== 2) {
        throw "invalid credentials";
      }
      return {
        name: usernamePassword[0],
        password: usernamePassword[1]
      };
    };

    var login = function() {
      // get current session
      return $.ajax(cloudantSettings.url + '/_session', {
        crossDomain: true,
      }).then(function(data) {
        // if user is not logged in, create a new session
        if (!data.userCtx.name) {
          var credentials = getCredentials();
          return $.ajax({
            url: cloudantSettings.url + '/_session',
            method: 'POST',
            crossDomain: true,
            data: credentials
          }); // TODO handle response
        }
      });
    };

    var getDocumentUrl = function() {
      return cloudantSettings.url + '/' + cloudantSettings.database + '/' + cloudantSettings.document;
    };

    var loadData = function() {
      var documentUrl = getDocumentUrl();
      return $.ajax(documentUrl, {
        crossDomain: true,
        xhrFields: {
          withCredentials: true
        }
      });
    };

    var saveItems = function(items) {
      // load latest data from server
      loadData().then(function(data) {
        if (latestData && latestData._rev != data._rev) {
          // data changed on server in the mean time!
          // TODO handle this situation
          throw "Data changed on server";
        }
        data.content.items = items;
        latestData = data;
        var documentUrl = getDocumentUrl();
        $.ajax(documentUrl, {
          crossDomain: true,
          method: 'PUT',
          xhrFields: {
            withCredentials: true
          },
          data: JSON.stringify(data),
          contentType: "application/json"
        }).then(function(data){
          if(data.ok){
            latestData._rev = data.rev;
          }
          // TODO handle nok case
        });
      });
    };

    var loadItems = function() {
      return loadData().then(function(data) {
        latestData = data;
        return data.content.items;
      });
    };

    return {
      login: login,
      saveItems: saveItems,
      loadItems: loadItems
    };
  }
};
