// This file is created by egg-ts-helper@1.25.6
// Do not modify this file!!!!!!!!!

import 'egg';
import ExportSession from '../../../app/model/session';
import ExportUser from '../../../app/model/user';

declare module 'egg' {
  interface IModel {
    Session: ReturnType<typeof ExportSession>;
    User: ReturnType<typeof ExportUser>;
  }
}
