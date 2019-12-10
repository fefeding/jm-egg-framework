
import * as crypto from 'crypto';
import { Context } from 'egg';
import decorators from "../lib/decorator";

export default {
    // 校验token是否正确
    checkToken(ctx: Context) {
        // 配置了启用鉴权
        const options = ctx.app.config.access;
        if(options && options.enabled) {
            
            let sign = ctx.request.header['lct_token'] || ctx.request.query.lct_token;
            if(!sign && ctx.request.body && ctx.request.body.lct_token) {
                sign = ctx.request.body.lct_token;
            }
    
            let timestamp = ctx.request.header['lct_timestamp'] || ctx.request.query.lct_timestamp;
            if(!timestamp && ctx.request.body && ctx.request.body.lct_timestamp) {
                timestamp = ctx.request.body.lct_timestamp;
            }
    
            let key = options.accessKey || '';
            let retstring = `${key},${timestamp}`;
            let hash = crypto.createHash('md5');
            hash.update(retstring);
            let computedSign = hash.digest('hex'); // 返回16进制hash码    
            if(sign != computedSign) {
                console.log(`access signature check fail: ${retstring}`);
                console.log(`request sign: ${sign}`);
                console.log(`computed sign: ${computedSign}`);
                // 设置响应内容和响应状态码
                ctx.body = 'access signature check fail';
                ctx.status = 403;
                throw new Error(ctx.body);
            }
        }
    },
    // 校验指定api的token
    checkApiToken(ctx: Context, target: any, propertyKey: string) {
        // 查看是否需要校验
        const isCheck = decorators.getApiToken(target, propertyKey);
        // 只要没指定false就校验
        if(isCheck !== false) {
            return this.checkToken(ctx);
        }
    }
}