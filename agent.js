module.exports = app => {
  app.beforeStart(async () => {
    console.log('jm-egg-framework', 'agent beforeStart')
  });
  app.ready(async () => {
    console.log('jm-egg-framework', 'agent ready')
  });
  app.beforeClose(async () => {
    console.log('jm-egg-framework', 'agent beforeClose')
  });
};