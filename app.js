var express = require('express'),
  config = require('./config/config'),
  db = require('./app/models');

var app = express();

require('./config/express')(app, config);

//  Be careful!!! force parameter rebuild database! It means that schema and data will be destroyed.
var force = false;

db.sequelize
  .sync({force: force})
  .complete(function (err) {
    if(err){
      throw err[0];
    }else{
      app.listen(config.port);
    }
  });

