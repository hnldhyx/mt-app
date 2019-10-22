const requireDirectory = require('require-directory');
const Router = require('koa-router');
class InitManager{
    initCore(app){
        // 入口方法
        InitManager.app = app;
        InitManager.loadConfig() 
        InitManager.initLoadRouters()
        InitManager.initExceptions()
    }

    static loadConfig(){
        // 全局config
        const configPath = process.cwd() + '/config/globalConfig';
        const config = require(configPath);
        global.globalConfig = config;

        // jwt相关config
        const securityConfPath = process.cwd() + '/config/security';
        global.securityConfig = require(securityConfPath);

        // 微信相关配置
        const wxConfPath = process.cwd() + '/config/wxConfig';
        global.wxConfig = require(wxConfPath);
    }

    static initLoadRouters(){
        const apiDirctory = `${process.cwd()}/app/api`
        requireDirectory(module, apiDirctory, {
            visit: whenLoadModule
        });
        function whenLoadModule(obj){
            if(obj instanceof Router){
                InitManager.app.use(obj.routes());
            }
        }
    }

    // 初始化异常，将异常处理抛到全局global对象中
    static initExceptions(){
        global.errs = require('./http-exception');
    }
}

module.exports = InitManager;