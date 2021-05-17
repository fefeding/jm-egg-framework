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
// 校验api路径规则的
const apiReg = /^\/([^\/]+\/)?api\//i;

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
     * 当前客户端IP
     */
    get clientIP() {
        if(this.request.ip) return this.request.ip;

        if(this.request && this.request.ips && this.request.ips.length) {
            return this.request.ips[0];
        }
        return this.get('X-Forwarded-For') || '';
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
     * @param {string} name key
     * @param {string} value  value
     * @param {cookieOpt} opt  选项
     */
    setCookie(name, value, opt) {
        cookieOpt.domain = this.hostname;
        opt = Object.assign(cookieOpt, opt || {});

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
            controller: null,
        };

        try {
            // 只处理api请求
            /*if (!/^\/api\//i.test(this.request.path)) {
                return this.apiRequestPath;
            }*/
            // 标记为api请求   只要有api路径都认为是api请求
            this.isApi = apiReg.test(this.request.path);

            this.apiRequestPath.prefix = RegExp.$1 || ''; // 截取项目路径前缀，有可能没有

            // api开头只是代理，真正访问的是后面
            this.apiRequestPath.path = this.request.path.replace(apiReg, '').replace(/\/([^\/]+)$/, '');
            this.apiRequestPath.method = RegExp.$1; // 这里截取的是方法名
            this.apiRequestPath.pathArray = this.apiRequestPath.path.split('/');

            // this.apiRequestPath.controller = dotProp.get(this.app.controller, this.helper.normalMethodPath(this.apiRequestPath.path));


            if(this.isApi) {
                // 用require，在文件不存在时，会抛错
                const controlerPath = `${this.app.baseDir}/app/controller/${this.apiRequestPath.path}`;
                let controllerClass = require(controlerPath);

                // 如果是函数，则执行它
                if(typeof controllerClass === 'function' && Object.prototype.toString.call(controllerClass) === '[object Function]') {
                    try {
                        controllerClass = controllerClass(this.app);
                    }
                    catch(e) {
                        // 有些版本的node  class  toString 也是 Function  。所以这里会报错
                        //console.log(e);
                    }
                }

                try {
                    this.apiRequestPath.controller = new (controllerClass.default || controllerClass)(this);
                }
                catch(e) {
                    // 又有些版本 class 是 object ，这里也会执行失败，我们就直接赋值了
                    this.apiRequestPath.controller = controllerClass;
                }

                this.apiRequestPath.controller.ctx = this;
                this.apiRequestPath.controller.service = this.service;
                this.apiRequestPath.controller.app = this.app;
            }
        }
        catch(ex) {
            console.log(ex);
        }
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
// api 请求
    async requestApi() {
        let result = {
            ret: 0,
            msg: '',
        };
        try {
            const config = this.app.config.jvCommon || {};
            const apiInfo = this.getApiInfo();

            // 分割请求路径，最后为方法名
            if (!apiInfo) {
                throw Error(`Controller ${this.request.path} 不存在`);
            }

            if (!apiInfo.controller) {
                throw Error(`Controller ${apiInfo.path} 不存在`);
            }

            console.log(`run controller ${apiInfo.path} method ${apiInfo.method}`);

            if (!apiInfo.controller[apiInfo.method]) {
                throw Error(`Controller ${apiInfo.path} 不存在方法${apiInfo.method}`);
            }

            // 检查是否需要校验token
            // 如果需要但失败，会返回false
            let tokenChecked = this.helper.checkApiToken(this, apiInfo.controller, apiInfo.method);            
            if (config.skipLoginCheck) {
                tokenChecked = true;
            }

            if (tokenChecked === false) {
                result.ret = 10002;
                result.msg = 'check token fail';
                this.status = 403;
            } else {
                // 收集请求参数，get post都支持
                const params = Object.assign(Object.assign({}, this.request.query||{}), this.request.body||{});

                const method = apiInfo.controller[apiInfo.method];

                const data = await method.call(apiInfo.controller, this, params);
                if (data) {
                    if (typeof data ==='object' && 'ret' in data && 'msg' in data) {
                        result = Object.assign(result, data);
                    } else {
                        result.data = data;
                    }
                } else if (this.body) { // 针对部分没有返回值，直接设body的情况，如返回二进制文件流。
                    return;
                }
            }
        } catch (e) {
            this.logger.error(e);
            console.log(e);

            // 如果抛出的就是IApiResult 则直接返回
            if (e && 'ret' in e && 'msg' in e) {
                result = Object.assign(result, e);
            } else {
                result.ret = 10001;
                result.msg = e.message;
            }
        }
        this.body = result;
    },
};