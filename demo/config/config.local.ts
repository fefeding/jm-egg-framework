import { Application, EggAppConfig } from 'egg';
import * as path from 'path';

export default (appInfo: EggAppConfig) => {
  const exports: any = {};

  exports.static = {
    maxAge: 0 // maxAge 缓存，默认 1 年
  };

  exports.development = {
    watchDirs: ['build'], // 指定监视的目录（包括子目录），当目录下的文件变化的时候自动重载应用，路径从项目根目录开始写
    ignoreDirs: ['app/web', 'public', 'config'] // 指定过滤的目录（包括子目录）
  };

  exports.logview = {
    dir: path.join(appInfo.baseDir, 'logs')
  };

  exports.vuessr = {
    injectCss: false
  };

  /**
   * DB 测试库
   * https://typeorm.io/#/connection-options/mysql--mariadb-connection-options
   */
  const jvMysql = {
    "name": 'default',
    "type": 'mysql',
    "host": 'localhost',
    "port": '3306',
    "username": 'root',
    "password": '1234',
    "database": 'db_jm',
    "charset": 'utf8',
    "useUTC ": true,
    "synchronize": true,
    "logging": false,
    "entities": [
      path.join(appInfo.baseDir, "app/model/**/*.ts")
    ]
  };

  exports.mysql = {
    // database configuration
    clients: [
      jvMysql
    ]
};

  return exports;
};
