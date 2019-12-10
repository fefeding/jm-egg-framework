
import { Context, Controller } from 'egg';
import decorators from "../lib/decorator";
import Article from '../model/session';
import configDefault from '../../config/config.default';

export default class AdminController extends Controller {

  public async login(ctx: Context) {
    await ctx.renderClient('login.js', {});

  }

  public async home(ctx: Context) {
    /*ctx.notify.sendMail({ // 发送邮件，邮件的发送还需要在TOF系统上添加发件人，添加后才可以使用
      from: 'fefeding@tencent.com', // 谁发送的
      to: 'fefeding', // 英文名列表，以分号分割
      cc: 'xxxx2', // 抄送给谁
      title: '测试邮件，忽略', // 邮件标题
      content: '我皮一下' // 邮件正文
  }).then(function(res){ // res为调用tof返回的结果
      console.log(res);
  });*/
    //console.log(this.app['notify']);
    await ctx.render('admin/home.js', { url: ctx.url.replace(/\/admin/, '') });
  }

  public async search(ctx: Context) {
    let page = ctx.query.page;
    let count = ctx.query.count;
    let params = JSON.parse(ctx.query.params);
    return await ctx.service.bll.article.search(page, count, params);
  }

  @decorators.checkApiToken(true) // 标记需要校验token
  public async list(ctx: Context) {
    return await ctx.service.bll.article.getAll();
  }

  public async add(ctx: Context) {
    let article = new Article();
   
    return await ctx.service.bll.article.save(article);
  }

  public async update(ctx: Context) {
    let article = await ctx.service.bll.article.get({id: 3});
    article.title = "test11111";
   
    return await ctx.service.bll.article.save(article);
  }

  public async del(ctx: Context) {
    const { id  } = ctx.request.body;
    return await ctx.service.bll.article.deleteArticle(id);
  }

  public async detail(ctx: Context) {
    const { id } = ctx.params;
    return await ctx.service.bll.article.get({ id });
  }

  public async err(ctx: Context) {
    throw {ret: 10086, msg: "我是一个自定义异常"}
  }
}