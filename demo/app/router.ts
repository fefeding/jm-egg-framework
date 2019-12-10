/// <reference path="../typings/app/controller/index.d.ts" />

import { Application } from 'egg';

export default (application: Application) => {
  const { router, controller } = application;
  router.get('/login', controller.login.login);
  router.get('/logout', controller.login.logout);
  router.get('/*', controller.index.home);
};