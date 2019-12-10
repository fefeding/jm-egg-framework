/// <reference path="../../typings/index.d.ts" />
/**
 * 通用的controller代理
 */
import "reflect-metadata";
import { Controller, Context } from 'egg';

export default class ApiController extends Controller {

        /**
         * 通用的API请求接口
         * @param ctx 
         */
        public async request(ctx: Context) { 
            let result: IApiResult = {
                ret: 0,
                msg: ''
            };    
            try {   
                let controllerClass: any;
                let cmd: string;
                let classPath = './';
                // 分割请求路径，最后为方法名
                if(ctx.request.path && ctx.request.path.indexOf('/') > -1) {
                    let paths = ctx.request.path.replace(/^\/api\//i, '').replace(/\/([^\/]+)$/, '');
                    cmd = RegExp.$1;
                    classPath += paths;
                }
                else {
                    throw Error(`Controller ${ctx.request.path} 不存在`);
                }
    
                console.log(`run controller ${classPath} method ${cmd}`);
                
                controllerClass = require(classPath);
                
                if(!controllerClass) {
                    throw Error(`Controller ${classPath} 不存在`);
                }
                let c = new (controllerClass.default||controllerClass)(ctx);
                if(!c[cmd]) {
                    throw Error(`Controller ${classPath} 不存在方法${cmd}`);
                }

                // 检查是否需要校验token
                ctx.helper.checkApiToken(ctx, c, cmd);

                let data = await c[cmd](ctx);
    
                if(data) {
                    if('ret' in data && 'msg' in data) {
                        result = Object.assign(result, data);
                    }
                    else {
                        result.data = data;
                    }
                }
            }
            catch(e) {
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
    }