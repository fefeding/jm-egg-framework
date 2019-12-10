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
  }
};