/**
 * 企业微信接口
 */
import {  Service } from 'egg';

/**
 * 继承自egg的Service，
 * 对typeorm的更低级的封装
 */
export default class WXService extends Service {
    // 请求微信接口超时时间
    wxRequesTimeout: 5000

    /**
     * 获取access token
     */
    async getAccessToken(appid: string = ""): Promise<string> {
        const config = this.config.jv;
        appid = appid || config.appId;
        let cacheKey = `wx/access_token/${appid}`;
        let data = await this.app.cache.get(cacheKey);
        // 还有有效期内，则直接返回
        if(data && data.timeout && Date.now() < data.timeout) {
            return data.access_token; 
        }
        const result = await this.ctx.curl(`https://qyapi.weixin.qq.com/cgi-bin/gettoken?corpid=${appid}&corpsecret=${config.secret}`, {
            // 自动解析 JSON response
            dataType: 'json',
            // 3 秒超时
            timeout: this.wxRequesTimeout,
          });
        this.ctx.logger.debug(`get access token ${appid}: ${result.data.errcode}`);
        if(result.data && result.data.errcode == 0) {
            result.data.timeout = Date.now() + result.data.expires_in * 1000 - 1000; // 先计算好过期时间，缓存后每次判断是否过期
            this.app.cache.set(cacheKey, result.data);// 缓存access toke            
            return result.data.access_token;
        }
        else {
            this.ctx.logger.error(new Error(`${result.data.errcode}:${result.data.errmsg}`));
            return "";
        }
    }

    /**
     * 通过code获取用户信息
     * @param code auth跳转回调的code
     * @param agentid 应用注册的企业微信id
     */
    async getUserByCode(code: string, appid: string = "") {
        const config = this.config.jv;
        appid = appid || config.appId;

        let token = await this.getAccessToken(appid);
        if(!token) {
            throw new Error(`getUserByCode: 获取accessToken失败`);
        }
        let url = `https://qyapi.weixin.qq.com/cgi-bin/user/getuserinfo?access_token=${token}&code=${code}`;
        const result = await this.ctx.curl(url, {
            // 自动解析 JSON response
            dataType: 'json',
            // 3 秒超时
            timeout: this.wxRequesTimeout,
          });
         // console.log(result);
        // 记录错误日志
        if(result.data && result.data.errcode != 0) { 
            console.log(token);
            this.ctx.logger.error(new Error(`${code}: ${result.data.errcode}:${result.data.errmsg}`));            
        }
        return result.data;
    }

    /**
     * 通过员工id获取企业微信相关信息
     * @param id 员工id
     */
    async getUserById(id: string) {
        let token = await this.getAccessToken();
        if(!token) {
            throw new Error(`getUserById: 获取accessToken失败`);
        }
        let url = `https://qyapi.weixin.qq.com/cgi-bin/user/get?access_token=${token}&userid=${id}`;

        const u = await this.ctx.curl(url, {
            // 自动解析 JSON response
            dataType: 'json',
            // 3 秒超时
            timeout: this.wxRequesTimeout,
          });

        if(u.data && u.data.errcode != 0) {
            this.ctx.logger.error(new Error(`${id}: ${u.data.errcode}:${u.data.errmsg}`));  
        }
        return u.data;
    }
}
