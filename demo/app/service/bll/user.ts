import { Context, Service } from 'egg';
import User from '../../model/user';
import UserDal from '../dal/user';

export default class UserService extends UserDal {
  
  constructor(ctx: Context) {
    super(ctx);
  }

  /**
   * 通过用户id去同步员工信息
   * 如果本地DB不存在，则去企业微信拉取
   * @param id 用户id
   */
  async syncUser(id: string): Promise<User> {
    let u = await this.getById(id);
    if(!u) {
        let wxuser = await this.service.common.wx.getUserById(id); // 去微信获取
        if(wxuser) {
            u = new User();
            u.address = wxuser.address;
            u.alias = wxuser.alias;
            u.avatar = wxuser.avatar;
            u.email = wxuser.email;
            u.enable = wxuser.enable;
            u.mobile = wxuser.mobile;
            u.name = wxuser.name;
            u.position = wxuser.position;
            u.qrCode = wxuser.qr_code || '';
            u.status = wxuser.status;
            u.telephone = wxuser.telephone || ''; 
            u.userid = wxuser.userid || id;

            console.log(`get wx user`, u);
            let ret = this.save(u);
            console.log(ret);
        }
        
    }
    return u;
  }
}
