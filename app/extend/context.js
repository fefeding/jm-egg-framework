'use strict';

const cookieOpt = {
  path: '/',   //cookie写入的路径
  //maxAge: 1000*60*60*1,
  //expires: new Date('2019-07-30'),
  httpOnly: true,
  encrypt: true, // 加密传输
  overwrite: true,
  signed: false,
  domain: ''
};
// ios正则
const iosReg = /iphone|ipad|ipod/i;
// 企业微信正则
const wxWorkReg = /wxwork\/(\d\.)+/i;
// qq正则
const qqReg = /QQ\/\d+\.\d+/i;
// tim正则
const timReg = /\s+TIM\/\d+\.\d+/i;
// 微信正则
const wxReg = /MicroMessenger\/((\d+)\.(\d+))/i;
// ipad
const ipadReg = /(iPad).*OS\s([\d_]+)/i;
// ipod
const ipodReg = /(iPod)(.*OS\s([\d_]+))?/i;
// 移动设备
const mobileReg = /\s+Mobile\s+/i;

module.exports =  {

  /**
   * 获取当前ua
   */
  get ua() {
    return this.get('user-agent');
  },

  /**
   * 是否在移动设备
   */
  get isMobile() {
    return mobileReg.test(this.ua);
  },


  /**
   * 是否在移动设备
   */
  get isIpad() {
    return ipadReg.test(this.ua);
  },

  /**
   * 是否在移动设备
   */
  get isIpod() {
    return ipodReg.test(this.ua);
  },
  
  /**
   * 是否在ios下
   */
  get isIOS() {
    return iosReg.test(this.ua);
  },

  /**
   * 是否在android下
   */
  get isAndroid() {
    return iosReg.test(this.ua);
  },

  /**
   * 是否在企业微信下
   */
  get isWXWork() {
    return wxWorkReg.test(this.ua);
  },

  /**
   * 是否在qq下
   */
  get isQQ() {
    return qqReg.test(this.ua);
  },

  /**
   * 是否在tim下
   */
  get isTIM() {
    return timReg.test(this.ua);
  },

  /**
   * 是否在微信下
   */
  get isWX() {
    return wxReg.test(this.ua);
  },

  /**
   * 读取cookie
   * @param {string} name cookie名称
   */
  getCookie(name) {
    cookieOpt.domain = this.hostname;
    return this.cookies.get(name, cookieOpt);
  },

  /**
   * 写cookie
   * @param {string} name 
   * @param {string} value 
   * @param {cookieOpt} opt 
   */
  setCookie(name, value, opt) {
      cookieOpt.domain = this.hostname;
      opt = Object.assign(cookieOpt, opt||{});
      
      this.cookies.set(name, value, opt);
  },

  /**
   * 获取api请求信息
   * 包括路径和方法名
   */
  getApiInfo() {
      if(this.apiRequestPath) return this.apiRequestPath;

      this.apiRequestPath = {
          method: '',
          path: '',
          pathArray: [],
          controller: null
      };

      // 只处理api请求
      if(!/^\/api\//i.test(this.request.path)) {
          return this.apiRequestPath;
      }
      // console.log('resolve ', this.request.path);
      // 标记为api请求
      this.isApi = true;

      // api开头只是代理，真正访问的是后面
      this.apiRequestPath.path = this.request.path.replace(/^\/api\//i, '').replace(/\/([^\/]+)$/, '');
      this.apiRequestPath.method = RegExp.$1; // 这里截取的是方法名
      this.apiRequestPath.pathArray = this.apiRequestPath.path.split('/');
      
      const controllerClass = require(`${this.app.baseDir}/app/controller/${this.apiRequestPath.path}`);
      this.apiRequestPath.controller = new (controllerClass.default || controllerClass)(this);
      return this.apiRequestPath;
  },

  /**
  * 检查当前api请求是否需要校验登录
  */
 checkNeedLogin() {
     if(typeof this.needLogin != 'undefined') return this.needLogin;

     // 如果指定了静态文件，则跳过检查
     const staticConfig = this.app.config.static || {};
     if(staticConfig.prefix) {
         if(this.request.url.indexOf(staticConfig.prefix) === 0) {
             return this.needLogin = false;
         }
     }

     const apiInfo = this.getApiInfo();
     // 没有解析到api信息，则不处理
     if(!apiInfo || !apiInfo.controller || !apiInfo.method) return true;
     // 只有标记了不需要检查登录的，才跳过
     const isCheck = this.helper.decorators.getApiLogin(apiInfo.controller, apiInfo.method);
     return this.needLogin = (isCheck === false? false : true);
 },
};