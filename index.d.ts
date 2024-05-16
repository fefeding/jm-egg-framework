
import 'egg';
import 'egg-cache';
import { AxiosRequestConfig, AxiosPromise, AxiosInstance } from "axios";
//import BaseDalService from './app/service/dal/base';
//import { ObjectType, BaseEntity, Connection, Repository, FindManyOptions, FindOneOptions } from 'typeorm';

declare module "axios" {
    interface AxiosInstance {
        /**
         * 这里当项目有部署目录时，会指定。用来请求当前项目接口的根路径
         */
        baseURL: string;

        /**
         * API请求通用方法
         * @param data 请求参数
         * @param options axios的请求参数，可以指定baseURL
         */
        requestApi<req, res>(
            data: req,
            options?: AxiosRequestConfig
        ): Promise<res>;

        /**
         * 从请求model里获取url，并组合baseURL
         * @param data 请求参数model
         * @param options axios的请求参数，可以指定baseURL
         */
        getApiUrl<req>(data: req, options?: AxiosRequestConfig): string;
    }
}

declare module 'egg' {    

    // 扩展 app
    interface Application {
        jmCache: {
            /**
             * 获取缓存值
             * @param key 缓存健值
             */
            get(key: string): any;
            /**
             * 写入缓存
             * @param key 健值
             * @param value 缓存值
             */
            set(key: string, value: any): void;
            /**
             * 本地进程session缓存
             */
            session: {
                get(id: string): Session;
                set(id: string, session: Session): void;
            };
        };
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
         * 根据请求路径分析出的controller和path，这里已处理了api代理情况
         */
        apiRequestPath: IApiInfo,

        /**
         * 是否是api请求
         * 这里指通过/api/xx这个规则访问
         */
        isApi: boolean,

        /**
         * 是否需要登录，只有===false才不需要
         */
        needLogin: boolean,

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
        setCookie(): void,

        /**
         * 获取当前api信息，
         */
        getApiInfo(): IApiInfo,

        /**
         * 检查当前api请求是否需要校验登录
         */
        checkNeedLogin(): boolean


        /**
         * 当请求api时，统一的处理函数
         * @param next 中间件next函数
         */
        requestApi(next: any): Promise<any>
    }

    // 扩展你的配置
    interface EggAppConfig {

    }

    interface IService {
        
    }

    interface IHelper { 
        /**
        * 校验token是否正确
        * 会从当前config中读取 access相关配置，计算出请求参数的token是否一至
        * 配置示例:
        * ```
        * // 中间件access配置
        *     // 用来请求鉴权  只需要针对/api/ 这类的service请求
        *     // 计算方法 md5(accessKey + ',' + timestamp)
        *     config.access = {
        *         enabled: true, // false 表示不启用鉴权
        *         accessKey: 'jv.account.20191022' // 用来计算token的当前系统唯一key
        *     }
        * ```
        * @param {string} token 请求方算出的token
        * @param {string} timestamp 当前时间
        * @return {boolean} 校验成功=true
        */
        checkToken(token: string, timestamp: string): {sign: string, timestamp: string}

        /**
         * 校验当前请求的token是否有效，从装饰器中判断当前接口是否需要校验，如果要则调用checkToken处理
         * 否则返回true
         * @param {Context} ctx egg上下文对象
         * @param {Controller} target controller对象
         * @param {string} propertyKey  需要校验的接口名字
         * @return {boolean} 无需校验或成功返回true，否则false
         */
        checkApiToken(ctx: Context, target: Controller, propertyKey: string): boolean        

        /**
         * 调用curl get表求
         * @param url
         * @param data
         * @param headers
         */
        curlGet<req, res>(url: string, data?: req, headers?: any): Promise<res>;

        /**
         * 调用curl post表求
         * @param url
         * @param data
         * @param headers
         */
        curlPost<req, res>(
            url: string,
            data?: req,
            headers?: any
        ): Promise<res>;

        /**
         * 对egg的curl二次封装，加入了代理配置能力，参考config.default.js
         * @param url 请求地址
         * @param option IRequestOption  参考egg的curl参数
         */
        curl<req, res>(
            url: string | IRequestOption<req>,
            option?: IRequestOption<req>
        ): Promise<res>;

        /**
         * 公共通用装饰器
         */
        decorators: apiDecorators;

        /**
         * 请求基础服务平台
         * @param data {req} 请求model
         * @param option curl参数
         */
        requestBaseServer<req, rsp>(
            data: req,
            option?: IRequestOption<req>
        ): Promise<rsp>;
    }
    

    interface IApiInfo {
        /**
         * 当前请求访问的controller中的方法名
         */
        method: string,
        /**
         * 当前请求路径，不包含方法名
         */
        path: string,
        /**
         * 请求路径拆分的数据
         */
        pathArray: Array<string>,
        /**
         * 当前请求的controller
         */
        controller: Controller
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

/**
 * 通用装饰器
 */
declare type apiDecorators = {
    
    /**
     * 给接口设置token校验标识
     * @param isCheck true=表示要校验token，默认为true
     */
    checkApiToken(isCheck: boolean): {
        (target: Function): void;
        (target: Object, propertyKey: string | symbol): void;
    }
    
    /**
     * 获取当前接口是否设置了校验权限
     * @param target {Controller} 接口所在的controller
     * @param propertyKey 接口名
     */
    getApiToken(target: any, propertyKey: string): boolean

    /**
     * 给接口设置登录态校验标识
     * @param isCheck true=表示要校验，默认为true
     */
    checkApiLogin(isCheck: boolean): {
        (target: Function): void;
        (target: Object, propertyKey: string | symbol): void;
    }
    
    /**
     * 获取接口是否已设置登录态校验
     * @param target {Controller} 接口所在的controller
     * @param propertyKey 接口名
     */
    getApiLogin(target: any, propertyKey: string): boolean// 参数是否必需

    api(options: any): any;

    // 获取api装饰对象
    getApi(target: any): any;

    // req对象实例
    req(options: any): any;

    // 获取是否是req实例
    getReq(target: any): any;
}

declare module '@fefeding/egg-framework' {
    /**
     * 通用装饰器
     */
    export const decorators: apiDecorators
}