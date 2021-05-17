'use strict';
require('reflect-metadata');

/** api 校验token装饰器 */
const apiTokenMetadataKey = 'jm_framework_api_access_toke';
const apiAuthMetadataKey = 'jm_framework_api_access_auth';

// 给接口设置token校验标识
function checkApiToken(isCheck = true) {
  return Reflect.metadata(apiTokenMetadataKey, isCheck);
}
// 获取接口是否已设置
function getApiToken(target, propertyKey) {
  return Reflect.getMetadata(apiTokenMetadataKey, target, propertyKey);
}

// 给接口设置登录态校验标识
function checkApiLogin(isCheck = true) {
  return Reflect.metadata(apiAuthMetadataKey, isCheck);
}
// 获取接口是否已设置登录态校验
function getApiLogin(target, propertyKey) {
  return Reflect.getMetadata(apiAuthMetadataKey, target, propertyKey);
}
/* end api token */

module.exports = {
  checkApiToken,
  getApiToken,
  checkApiLogin,
  getApiLogin
};

