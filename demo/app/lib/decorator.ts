import "reflect-metadata";

/** api 校验token装饰器 */
const apiTokenMetadataKey = Symbol("api_access_toke");
// 给接口设置token校验标识
function checkApiToken(isCheck: boolean = true) {
    return Reflect.metadata(apiTokenMetadataKey, isCheck);
}
// 获取接口是否已设置
function getApiToken(target: any, propertyKey: string) {
    return Reflect.getMetadata(apiTokenMetadataKey, target, propertyKey);
}
/* end api token */

export default {
    checkApiToken,
    getApiToken
}