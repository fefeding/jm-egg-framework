
import 'egg';
import 'egg-cache';
//import BaseDalService from './app/service/dal/base';
//import { ObjectType, BaseEntity, Connection, Repository, FindManyOptions, FindOneOptions } from 'typeorm';

declare module 'egg' {    

    // 扩展 app
    interface Application {
        
    }

    // 扩展 context
    interface Context {
        /**
         * 获取当前user-agent
         */
        ua: string,

        /**
         * 是否在移动设备
         */
        isMobile: boolean,

        /**
         * 是否在移动设备
         */
        isIpad: boolean,

        /**
         * 是否在移动设备
         */
        isIpod: boolean,

        /**
         * 是否在android环境下
         */
        isAndroid: boolean,

        /**
         * 是否在ios环境下
         */
        isIOS: boolean,

        /**
         * 是否在企业微信环境下
         */
        isWXWork: boolean,

        /**
         * 是否在qq环境下
         */
        isQQ: boolean,

        /**
         * 是否在tim环境下
         */
        isTIM: boolean,

        /**
         * 是否在微信环境下
         */
        isWX: boolean,

        /**
         * 读取cookie
         * @param {string} name cookie名称  
         * @returns {string}  cookie名称的对应的值   
         */
        getCookie(): string

        /**
         * 写入cookie  
         * 使用示例：
         * ctx.setCookie(key, value, {
                httpOnly: false,
                signed: false,
            });  
         * @param {string} name 写入cookie的名称
         * @param {string} value 写入cookie对应的值
         * @param {cookieOpt} opt 写入cookie对应配置  
         * 可配置对象  
         *  {  
         *      path: string,   //cookie写入的路径  
                maxAge: string,  
                expires: Date,  
                httpOnly: boolean,  
                encrypt: boolean, // 加密传输  
                overwrite: boolean,  
                signed: boolean,  
                domain: string  
         *  }  
         * @returns void  
         */
        setCookie(): void
    }

    // 扩展你的配置
    interface EggAppConfig {

    }

    interface IService {
        
    }
}

/**
 * api 返回数据标准结构
 */
declare interface IApiResult {
  ret: number,
  msg: string,
  data?: any
}

//export = egg;