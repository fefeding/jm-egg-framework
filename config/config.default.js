'use strict';

const fs = require('fs');
const path = require('path');

module.exports = appInfo => {
  const config = {};

  config.keys = 'jm-egg-framework-keys';

  /**
   * some description
   * @member Config#test
   * @property {String} key - some description
   */
  config.test = {
    key: appInfo.name + '_123456',
  };

  config.siteFile = {
    '/favicon.ico': fs.readFileSync(path.join(appInfo.baseDir, 'app/web/asset/images/favicon.ico'))
  };

  config.static = {
    prefix: '/public/',
    dir: path.join(appInfo.baseDir, 'public')
  };

  config.logger = {
    consoleLevel: 'DEBUG',
    dir: path.join(appInfo.baseDir, 'logs')
  };

  // 打开前置代理模式
  config.proxy = true;

  // session配置
  config.session = {
    key: 'JM_SESSION',
    maxAge: 20 * 60 * 1000, // 20分
    httpOnly: true,
    encrypt: true,
  };

  // 安全配置
  config.security = {
    csrf: {
      ignore: ctx => {
        return false; // 返回true就表示不需要检查csrf
    }
    }
  }

  return config;
};
