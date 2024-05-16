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


const apiRequestKey = 'models/api_request_options';
const apiRequestInstanceKey = 'models/api_is_request_instance';

// 参数是否必需
function api(options) {
    return Reflect.metadata(apiRequestKey, options);
}
// 获取api装饰对象
function getApi(target) {
    let value = Reflect.getMetadata(apiRequestKey, target);
    if(typeof value == 'undefined' && target.constructor) {
        value = Reflect.getMetadata(apiRequestKey, target.constructor);
        
        if(typeof value === 'undefined') value = Reflect.getOwnMetadata(apiRequestKey, target);
    }
    return value;
}

// req对象实例
function req(options) {
    return Reflect.metadata(apiRequestInstanceKey, options);
}
// 获取是否是req实例
function getReq(target) {
    let value = Reflect.getMetadata(apiRequestInstanceKey, target);
    if(typeof value == 'undefined' && target.constructor) {
        value = Reflect.getMetadata(apiRequestInstanceKey, target.constructor);
        
        if(typeof value === 'undefined') value = Reflect.getOwnMetadata(apiRequestInstanceKey, target);
    }
    return value;
}

module.exports = {
  checkApiToken,
  getApiToken,
  checkApiLogin,
  getApiLogin,
  api,
  getApi,
  req,
  getReq
};

