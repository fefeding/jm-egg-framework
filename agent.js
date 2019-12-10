module.exports = app => {
  app.beforeStart(async () => {
    console.log('beforeStart')
  });
  app.ready(async () => {
    console.log('ready')
  });
  app.beforeClose(async () => {
    console.log('beforeClose')
  });
};