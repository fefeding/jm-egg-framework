import { Context } from 'egg';

//const uuidv5 = require('uuid/v5');
import { v4 as UUID} from 'uuid';
import User from '../../model/user';
import { default as Session, EStatus as SessionStatus } from '../../model/session';
import SessionDal from '../dal/session';


export default class SessionService extends SessionDal {
  
  constructor(ctx: Context) {
    super(ctx);
  }

  /**
   * 根据用户信息生成登录态
   * @param u 当前登录的用户信息
   */
  async create(u: User): Promise<Session> {
    let session = new Session();
    
    session.id = UUID(u.userid, Date.now());
    session.value = JSON.stringify(u);
    return await this.save(session);
  }

  /**
   * 根据ID获取session
   * 并判断session是否在有效期
   * @param id token唯一
   */
  async getLoginSession(id: string): Promise<Session> {
    let session = await this.getById(id);
    if(!session) return null;

    if(session.status != SessionStatus.ACTIVED) {
      this.ctx.logger.debug(`session ${id} 已失效 ${session.status}`);
      return null;
    }
    // session已过期，则返回空
    if(Date.now() - session.lastDate.getTime() > this.config.session.maxAge) {
      this.ctx.logger.debug(`session ${id} 已过期`);
      return null;
    }
    // 读取一次就继约一次
    else {
      session.lastDate = new Date();
      this.save(session);
    }
    return session;
  }

  /**
   * 下线
   * @param id 需要下线的id获session
   */
  async logout(id: string | Session): Promise<number> {
    let ret = await this.setStatus(id, SessionStatus.OFFLINE);

    this.ctx.logger.debug(`logout ${ id instanceof Session? id.id : id }}`);

    if(ret) {
      this.ctx.session = null;
    }
    return ret;
  }

  /**
   * 改变session状态
   * @param id 需要改变状态的session或id
   * @param status 状态
   * @returns 修改结果，0表示没有被修改，其它表示修改个数
   */
  async setStatus(id: string | Session, status: SessionStatus): Promise<number> {
    if(typeof id == 'string') {
      id = await this.getById(id);
      if(!id) return 0;
    }
    id.status = status;
    await this.save(id);
    return 1;
  }
}
