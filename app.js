$(function($) {

  var name = window.location.hostname;
  if (name === 'localhost') {
    name = window.prompt("enter site name", "mysite.com");
  }

  var state = {};

  // loadModules
  var storage = modules.storage.init(name, window);
  var gridManager = modules.gridManager.init($);
  var editor = modules.editor.init(gridManager);
  gridManager.enableEdit();
  editor.showEditOptions();

  $.when(storage.loadItems(name)).done(function(items) {
    gridManager.load(items);
  });


  $('#add-new-widget').click(editor.createWidget);

  $('#save').click(gridManager.save);

  $('body').on('gridchanged', function(event, data) {
    state.items = data.items;
    storage.saveItems(data.items);
  });

  $('body').on('newcontent', function(event, content) {
    gridManager.initNewWidget(content);
  });

  var lock = new Auth0Lock('nXQj37lBSzxG-hfbH5zZecsrvX3vUU-7', 'robinwyss.auth0.com', {
    auth: {
      params: {
        scope: 'openid email'
      }
    },
    additionalSignUpFields: [{
      name: "sitename",
      placeholder: "enter a sitename",
      validator: function(address) {
        return {
          valid: address.length >= 5,
          hint: "Must have 10 or more chars" // optional
        };
      }
    }]

  });

  $('#login').click(function(e) {
    e.preventDefault();
    lock.show();
  });

  lock.on("authenticated", function(authResult) {
    lock.getProfile(authResult.idToken, function(error, profile) {
      if (error) {
        // Handle error
        console.log(error);
        return;
      }

      localStorage.setItem('id_token', authResult.idToken);

      // Display user information
      $('#nickname').text(profile.nickname);
      //$('#avatar').attr('src', profile.picture);
      gridManager.enableEdit();
      editor.showEditOptions();
    });
  });

});
