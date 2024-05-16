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
    // 根据header信息初始化dataType（默认是text）
    initDataType(headers) {
        const contentType = headers["content-type"] || "";
        let dataType;

        if (contentType.toLowerCase().startsWith("application/json")) {
            dataType = "json";
        } else {
            dataType = this.app.config.curl.defaultDataType;
        }

        return dataType;
    },
    // get 请求方法
    async curlGet(url, data = {}, headers = {}, contentType) {
        if (!url) {
            return null;
        }

        return await this.curl(url, {
            headers,
            method: "GET", // 请求方式（post/get）
            data, // 请求数据
            contentType,
        });
    },
    // post 请求方法
    async curlPost(url, data = {}, headers = {}, contentType) {
        if (!url) {
            return null;
        }
        return await this.curl(url, {
            headers,
            method: "POST", // 请求方式（post/get）
            data, // 请求数据
            contentType,
        });
    },

    // 对egg 的curl二次封装，集成一些jv特性
    async curl(url, option) {

        if (typeof url === "object") {
            option = url;
            url = "";
        }
        option = option || {};
        if (url) option.url = url;

        // 如果有tars配置，则表示去请求tars  http服务
        if (
            option.tarsConfig &&
            option.tarsConfig.servant &&
            option.tarsConfig.client
        ) {
            let host = '';
            let port = '';
            //加入本地服务间调试模式
            if (option.tarsConfig.local && option.tarsConfig.local.port) {
                host = option.tarsConfig.local.host || "127.0.0.1";
                port = option.tarsConfig.local.port;
            } else {
                // 查找服务ip
                const point = await registry.getConnectPoint(
                    option.tarsConfig.servant,
                    option.tarsConfig.client
                );
                // console.log("请求tars 的 http服务", point);
                if (point) {
                    host = point.host;
                    port = point.port;
                }else{
                    throw {ret:-1001,msg:'tars查询可用IP端口失败'}
                }
            }
            if(port && host){
                option.baseURL = `http://${host}:${port}`;
            }
        }
        //此时的url，附带了baseUrl
        option.url = axios.getApiUrl(option.data, option) || option.url; // 从model装饰器里再获取一次 , 并且会组合baseURL

        const app = this.app;
        const dataType = this.initDataType(option.headers || {});
        option = Object.assign(
            {
                dataType,
                method: "POST",
                timeout: app.config.curl && app.config.curl.timeout || 6000, // 连接和返回的超时时间，在config.default.js中配置
            },
            option
        );

        // 设置请求第三方时的session.id即token
        const sesstionToken = this.ctx.jmSessionToken;

        option.headers = option.headers || {};
        if (this.ctx.traceid) {
            // 添加跟踪id，实现日志追踪
            option.headers["jm-traceid"] = this.ctx.traceid;
        }
        // 设置httpclient第三方访问的原始域名
        if (this.ctx.header.host) {
            option.headers["jm-origin-host"] = this.ctx.header.host;
        }
        if (sesstionToken) {
            option.headers["jm-cors-token"] = sesstionToken;
        }

        //  是否有指定请求代理
        // this.logger.debug(app.config.curl);
        if (app.config.curl && app.config.curl.proxy) {
            // 如果有配置多条，则使用正则匹配
            if (Array.isArray(app.config.curl.proxy)) {
                for (const p of app.config.curl.proxy) {
                    // this.logger.debug(p);
                    if (!p || !p.match) continue;
                    if (p.match.test(url || option.url) && p.proxy) {
                        option.proxy = p.proxy;
                        break;
                    }
                }
            } else {
                option.proxy = app.config.curl.proxy;
            }
            if (option.proxy) {
                option.enableProxy = true;
                option.rejectUnauthorized = false;                
            }
        }
        // this.logger.debug(opt);
        option.dataType = option.dataType || option.responseType;
        option.contentType = option.contentType || "json";

        const result = await this.ctx.curl(option.url, option);
        // 如果是要获取文件流，则返回result.res
        if(option.streaming) {
            return result.res
        }
        return result.data;
    },
    /**
     * 公共通用装饰器
     */
    decorators,

    /**
     * 请求基础服务
     * option {
     * url:string,
     * data: any
     * }
     */
    async requestBaseServer(data, option) {
        option = Object.assign(
            {
                method: "POST",
                // 指定请求的tars服务配置  objName, setName
                tarsConfig: {
                    servant: this.app.config.baseService.servant,
                    client: this.app.config.tars && this.app.config.tars.client || null,
                    local: this.app.config.baseService.local || null
                },
                data,
            },
            option || {}
        );
        return await this.curl(option);
    },
}