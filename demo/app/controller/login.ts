
import { Context } from 'egg';
import Session from '../model/session';

export default class LoginController {

  public async login(ctx: Context) {
    //const session = ctx.service.
    try {
      // 如果session中有，则直接返回token
      if(ctx.session && ctx.session.token) {
        let session = await ctx.service.bll.session.getLoginSession(ctx.session.token);
        if(session) {
          return this.loginCallback(ctx, session);
        }
      }
      let code = ctx.query.code || '';
      if(!code) {
          let agentid = ctx.query.agentid || ctx.app.config.jv.agentId;
          let url = encodeURIComponent(ctx.href.replace('logout=1', 'logout=0'));
          let authurl = '';
          // 哪果在企业微信内，则跳转内授权
          if(ctx.isWXWork) {
              authurl = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=${ctx.app.config.jv.appId}&redirect_uri=${url}&response_type=code&scope=snsapi_base&state=jvAccount#wechat_redirect`;
          }
          else {
              authurl = `https://open.work.weixin.qq.com/wwopen/sso/qrConnect?appid=${ctx.app.config.jv.appId}&agentid=${agentid}&redirect_uri=${url}&state=jvAccount`;
          }
          ctx.redirect(authurl);
      }
      else {
          
          let user = await ctx.service.common.wx.getUserByCode(code);

          // 非企业员工，则不会返回userid，有可能返回openid
          if(!user || !user.UserId) {            
            await ctx.renderClient('login.js', {
              user,
              url: ctx.href
            });
          }
          else {
            let u = await ctx.service.bll.user.syncUser(user.UserId); // 同步得到员工信息
            let session = await ctx.service.bll.session.create(u);

            // token保证到session里
            ctx.session.token = session.id;
            return this.loginCallback(ctx, session);            
          }
      }
    }
    catch(ex) {
      console.error(ex);
      ctx.logger.error(ex);
      ctx.body = ex;
    }
  }

  /**
   * 登录成功后跳转处理
   * @param session 当前登录session
   */
  loginCallback(ctx: Context, session: Session) {
    let url = ctx.query.url || '';
    if(url) {
      if(url.includes('?')) url += '&';
      else url += '?';
      url += `token=${session.id}`;
      ctx.redirect(url);
    }
    else {
      console.log('redirec /')
      ctx.redirect('/');
    }
  }

  /**
   * 登出
   * @param ctx 
   */
  public async logout(ctx: Context) {
    let token = ctx.session.token || ctx.query.token;
    if(token) {      
        // 退出登陆
        await ctx.service.bll.session.logout(token);// 登出
        ctx.session = {};
    }
    // 跳回登录
    ctx.redirect('/login?' + ctx.querystring);
  }

  public async err(ctx: Context) {
    throw {ret: 10086, msg: "我是一个自定义异常"}
  }
}