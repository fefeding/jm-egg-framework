
module.exports = app => {
    
    // 引入登录验证中间件
    //const index = app.config.coreMiddleware.length;

    // 解析请求地址中间件需要放到权限校验之前
    // app.config.coreMiddleware.push('requestResolve');

    //if (app.config.useMiddleware !== false) {
        
    //}

    app.config.coreMiddleware.push('jmApi');

    console.log(app.config.coreMiddleware);
};
