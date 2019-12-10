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
        const needLogin = ctx.checkNeedLogin();
        return needLogin === false; // 返回true就表示不需要检查csrf
    }
    }
  }

  // 中间件access配置
  // 用来请求鉴权  只需要针对/api/ 这类的service请求
  // 计算方法 md5(accessKey + ',' + timestamp)
  config.apiAccess = {
    enabled: true, // false 表示不启用鉴权
    accessKey: 'jm.20191119' // 用来计算token的当前系统唯一key
  }

  return config;
};
