import { EggAppConfig } from 'egg';
import * as fs from 'fs';
import * as path from 'path';

export default (appInfo: EggAppConfig) => {
  const config: any = {};
/*
  config.siteFile = {
    '/favicon.ico': fs.readFileSync(path.join(appInfo.baseDir, 'app/web/asset/images/favicon.ico'))
  };

  config.view = {
    cache: false
  };


  config.logger = {
    consoleLevel: 'DEBUG',
    dir: path.join(appInfo.baseDir, 'logs')
  };

  config.static = {
    prefix: '/public/',
    dir: path.join(appInfo.baseDir, 'public')
  };

  config.multipart = {
    mode: 'file',
    fileExtensions: [ '.pdf' ] // 增加对 pdf 扩展名的文件支持
  };*/
  
  config.vuessr = {
    layout: path.resolve(appInfo.baseDir, 'app/web/view/layout.html'),
    renderOptions: {
      basedir: path.join(appInfo.baseDir, 'app/view'),
    },
  };

  // config.keys = 'jm-20191119';

  // 打开前置代理模式
  config.proxy = true;

  config.middleware = [
    'global'
  ];

  // session配置
  /*config.session = {
    key: 'JM_SESSION',
    maxAge: 24 * 3600 * 1000, // 1 天
    httpOnly: true,
    encrypt: true,
  }*/

  // 中间件access配置
  // 用来请求鉴权  只需要针对/api/ 这类的service请求
  // 计算方法 md5(accessKey + ',' + timestamp)
  config.access = {
    enabled: true, // false 表示不启用鉴权
    accessKey: 'jm.20191119' // 用来计算token的当前系统唯一key
  }

  return config;
};
