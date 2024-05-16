# @fefeding/egg-framework
基于egg框架的上层framework

## 插件使用指南
在根目录`package.json`中,配置`egg.framework`  
```
  "egg": {
    "framework": "@fefeding/egg-framework"
  }
```  
配置完成项目之后,安装依赖  
```
npm i
```
启动项目  
```
npm run dev
```

## framework扩展配置  
### framework/extend扩展配置  
进入`app/extend`扩展目录  
```
cd app/extend
```
可分别对`application.js`、`context.js`、`helper.js`、`request.js`、`response.js`进行定制化配置

增加对应的配置之后，需在根目录的`index.d.ts`增加导入的函数提示
如在`context.js`增加了获取当前`ua`的配置  
```
get ua() {
    return this.get('user-agent');
}
```  
在index.d.ts中进行同步  
```
/**
* 获取当前user-agent
* @property ua
*/
ua: string
```

### framework/config扩展配置  
进入`app/config/config.default.js`扩展配置  
```
cd app/config
```  
增加对应的配置，如增加`config.keys`的配置
```
config.keys = 'jm-egg-framework-keys'
```

### framework/plugin插件扩展配置
进入`app/config/plugin.js`插件扩展配置  
```
cd app/config
``` 
增加对应的插件配置，如增加`vuessr`插件
```
vuessr: {
    package: 'egg-view-vue-ssr'
}
```