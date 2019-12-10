
import { Context, Controller } from 'egg';

export default class IndexController extends Controller {

  public async home(ctx: Context) { 
    const { app } = this;
    console.log('app.config.keys', app.config.keys)
    await ctx.render('admin/home.js', { url: ctx.url });
  }

}