function CreateDatabaseForUser(user, context, callback) {
  var cloudantUsername = 'REPLACE WITH REAL USERNAME';
  var cloudantPassword = 'REPLACE WITH REAL PASSWORD';
  var baseUrl = 'https://'+cloudantUsername +'.cloudant.com';
  // Ensure application meta-data exists.
  user.app_metadata = ( user.app_metadata || {} );

  // If the user already has a database provisioned, move on to the next Rule -
  // no need to do any work!
  if ( user.app_metadata.db ) {
        return( callback( null, user, context ) );
  }

  // import request to make API calls to cloudant
  require('request');
  var rp = require('request-promise');

  // helper method used to call cloudant
  function request(url, method, body) {
    var options = {
      url: baseUrl + url,
      method: method,
      'auth': {
        'user': cloudantUsername,
        'pass': cloudantPassword
      }
    };
    if (body) {
      options.body = body;
      options.json = true;
    }
    return rp(options);
  }

  // object to hold the cloudant settings
  var cloudantSettings = {};
  // Generate API key and password
  request('/_api/v2/api_keys', 'POST')
    .then(function(response) {
      var data = JSON.parse(response);
      if (!data.ok) {
         throw new Error('error creating key ' + response);
      }
      // store the key, password and dbname (same as key)
      cloudantSettings.key = data.key;
      cloudantSettings.password = data.password;
      cloudantSettings.db = data.key;
      return data.key;
    }).then(function(dbname) {
      // create database
      return request('/' + dbname,'PUT').then(function(content){
        var data = JSON.parse(content);
        if(data.ok){
          return dbname;
        } else {
          throw new Error('error creating DB ' + content);
        }
      });
    }).then(function(dbname){
      // get the security settings
      return request('/_api/v2/db/' + dbname + '/_security','GET');
    }).then(function(data){
      var security = JSON.parse(data);
      // on new DBs, the cloudant object in security is missing
      if(!security.cloudant){
        security.cloudant = {};
      }
      // add read/write to security for DB user
      security.cloudant[cloudantSettings.key] = ['_reader','_writer'];
      // add read permissions for everyone
      security.cloudant.nobody = ['_reader'];
      // update the security settings
      return request('/_api/v2/db/' + cloudantSettings.db + '/_security', 'PUT', security);
    }).then(function(){
      console.log('Adding database config to user!');
      user.app_metadata.db = cloudantSettings;
      // persist the app_metadata update
      callback(null, user, context);
    }).catch(function(error){
      console.log('Failed to initialize Database');
      console.log(error);
      // cancel login if database cannot be generated
      callback( new UnauthorizedError( "Database could not be provisioned at this time, please try to login again." ) );
    });

}
