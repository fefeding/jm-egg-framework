'use strict';
const decorators = require('../../lib/decorator');
const crypto = require('crypto');

module.exports =  {


    /**
      * 根据时间和当前系统配置计算token
      *
      * @param {string} accessKey 当前系统的唯一key
      * @param {string} timestamp 时间参数
      * @return {sign: string, timestamp: string} 根据当前算法得到的校验token
      */
     createApiToken(accessKey, timestamp = '') {
        if (!timestamp) timestamp = Date.now() + '';
        const retstring = `${accessKey},${timestamp}`;
        const hash = crypto.createHash('md5');
        hash.update(retstring);
        const computedSign = hash.digest('hex'); // 返回16进制hash码
        return {
            sign: computedSign,
            timestamp,
        };
    },
    /**
     * 校验当前请求的token是否有效，从装饰器中判断当前接口是否需要校验，如果要则调用checkToken处理
     * 否则返回true
      * 会从当前config中读取 apiAccess相关配置
      * 配置示例:
      * ```
      * // 中间件apiAccess配置
      *     // 用来请求鉴权  只需要针对/api/ 这类的service请求
      *     // 计算方法 md5(accessKey + ',' + timestamp)
      *     config.apiAccess = {
      *         enabled: true, // false 表示不启用鉴权
      *         accessKey: 'jv.account.20191022' // 用来计算token的当前系统唯一key
      *     }
      * ```
     * @param {Context} ctx egg上下文对象
     * @param {Controller} target controller对象
     * @param {string} propertyKey  需要校验的接口名字
     * @return {boolean} 无需校验或成功返回true，否则false
     */
    checkApiToken(ctx, target, propertyKey) {
        // 查看是否需要校验
        const isCheck = decorators.getApiToken(target, propertyKey);
        // 只要没指定false就校验
        if (isCheck !== false) {
            // 配置了启用鉴权
            const options = ctx.app.config.apiAccess;
            if (!options || !options.enabled) {
                console.log('未配置 apiAccess 跳过api token校验');
                return true;
            }
            
            let token = ctx.request.header.jmtoken || ctx.request.query.jmtoken;
            if (!token && ctx.request.body && ctx.request.body.jmtoken) {
                token = ctx.request.body.jmtoken;
            }

            let timestamp = ctx.request.header.jmtimestamp || ctx.request.query.jmtimestamp;
            if (!timestamp && ctx.request.body && ctx.request.body.jmtimestamp) {
                timestamp = ctx.request.body.jmtimestamp;
            }

            // 如果配置了超时，则判断是否超时
            if(timestamp && options.timeout) {
                const timeout = options.timeout || 300000;
                if(Date.now() - timestamp > timeout) {
                    throw {
                        ret: 1003,
                        msg: `timestamp ${timestamp} 已超时`
                    };
                }
            }

            const result = this.createApiToken(options.accessKey, timestamp);
            
            if (token !== result.sign) {
                console.log('access signature check fail');
                console.log(`request sign: ${token}`);
                console.log('computed sign: ', result);
                return false;
            }
        }
        return true;
    },
    /**
     * 公共通用装饰器
     */
    decorators,
}