import 'jv-egg-framework';
declare module 'egg' {
    interface Application {
      mysql: any;
      notify: any;
      cache: Map<string, any>;
    }

    interface Context {
        notify: any;
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