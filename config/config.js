var path = require('path'),
    rootPath = path.normalize(__dirname + '/..'),
    env = process.env.NODE_ENV || 'development',
  siteConfig = require('./SiteConfig.js');

var config = {
  development: {
    root: rootPath,
    app: {
      name: 'web-lombard-client'
    },
    port: siteConfig.port,
    db: siteConfig.db
  },

  test: {
    root: rootPath,
    app: {
      name: 'web-lombard-client'
    },
    port: siteConfig.port,
    db: siteConfig.db
  },

  production: {
    root: rootPath,
    app: {
      name: 'web-lombard-client'
    },
    port: siteConfig.port,
    db: siteConfig.db
  },
  captcha: {
    secret:'6LcerAQTAAAAALHK_bMLN7hlyflmaTZhuclbRV0D'
  }
};

module.exports = config[env];
