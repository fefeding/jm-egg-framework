
import { Context, EggAppConfig  } from 'egg';

/**
 * api请求拦截中间件
 */
export default (options) => {
  
  return async function (ctx, next) {

    const apiInfo = ctx.getApiInfo();// 解析api请求
    
      // 如果api请求，则走特殊逻辑
    if(ctx.isApi) {
        await request(ctx, apiInfo);
        return;
    }
    await next();
  };

  // api 请求
  async function request(ctx, apiInfo) {
        let result = {
            ret: 0,
            msg: '',
            data: null
        };    
        try {              

            // 分割请求路径，最后为方法名
            if(!apiInfo) {                    
                throw Error(`Controller ${ctx.request.path} 不存在`);
            }
            
            if(!apiInfo.controller) {
                throw Error(`Controller ${apiInfo.path} 不存在`);
            }

            console.log(`run controller ${apiInfo.path} method ${apiInfo.method}`);
            
            if(!apiInfo.controller[apiInfo.method]) {
                throw Error(`Controller ${apiInfo.path} 不存在方法${apiInfo.method}`);
            }

            // 检查是否需要校验token
            // 如果需要但失败，会返回false
            const checked = ctx.helper.checkApiToken(ctx, apiInfo.controller, apiInfo.method);

            // console.log('check token ', checked);

            if(checked === false) {
                result.ret = 10002;
                result.msg = 'check token fail';
                ctx.status = 403;
            }
            else {
                let data = await apiInfo.controller[apiInfo.method](ctx);
            
                if(data) {
                    if('ret' in data && 'msg' in data) {
                        result = Object.assign(result, data);
                    }
                    else {
                        result.data = data;
                    }
                }
            }
        }
        catch(e) {
            ctx.logger.error(e);
            //如果抛出的就是IApiResult 则直接返回
            if(e && 'ret' in e && 'msg' in e) {
                result = Object.assign(result, e);
            }
            else {
                result.ret = 10001;
                result.msg = e.message;
            }
        }
        ctx.body = result;
    }
};
