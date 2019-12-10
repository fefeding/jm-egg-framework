// This file is created by egg-ts-helper@1.25.6
// Do not modify this file!!!!!!!!!

import 'egg';
import ExportBllSession from '../../../app/service/bll/session';
import ExportBllUser from '../../../app/service/bll/user';
import ExportCommonWx from '../../../app/service/common/wx';
import ExportDalBase from '../../../app/service/dal/base';
import ExportDalSession from '../../../app/service/dal/session';
import ExportDalUser from '../../../app/service/dal/user';

declare module 'egg' {
  interface IService {
    bll: {
      session: ExportBllSession;
      user: ExportBllUser;
    }
    common: {
      wx: ExportCommonWx;
    }
    dal: {
      base: ExportDalBase;
      session: ExportDalSession;
      user: ExportDalUser;
    }
  }
}
