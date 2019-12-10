import 'reflect-metadata';
import ApiDecorators from "../lib/decorator";
//import { Application } from 'egg';
//import DB from '../lib/db/base';
//import DBFactory from '../lib/db/factory';
//const DBSymbol = Symbol('Application#db');
const CacheKey = Symbol('Application#cache');

export default {
    // 能用装饰器加载
    get decorators() {
        return {
            apiDecorators: ApiDecorators            
        };
    },

    /**
     * 缓存
     */
   get cache(): Map<string, any> {
       return this[CacheKey] || (this[CacheKey] = new Map<string, any>());
   }
}