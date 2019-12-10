/**
 * production
 *
 *  prod + default（override）
 */

import * as path from 'path';
import { Application, EggAppConfig } from 'egg';

export default (appInfo: EggAppConfig) => {
  const exports: any = {};
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
    "password": 'df123456',
    "database": 'db_jm',
    "charset": 'utf8',
    "useUTC ": true,
    "synchronize": false,
    "logging": false,
    "entities": [
      path.join(appInfo.baseDir, "app/model/**/*.js")
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
