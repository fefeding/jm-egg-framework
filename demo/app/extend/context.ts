'use strict';
import { Context } from 'egg';

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

export default {
    /*getCookie(this: Context, name: string): string {
        cookieOpt.domain = this.hostname;
        return this.cookies.get(name, cookieOpt);
    },
    setCookie(this: Context, name: string, value: string, opt: any) {
        cookieOpt.domain = this.hostname;
        opt = Object.assign(cookieOpt, opt||{});
        
        this.cookies.set(name, value, opt);
    }*/
};