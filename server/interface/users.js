import Router from 'koa-router';
import Redis from 'koa-redis';
import nodeMailer from 'nodemailer';

import User from '../dbs/models/users';
import Passport from './utils/passport';
import Email from '../dbs/config';
import axios from './utils/axios';

const router = new Router({
    prefix: '/users'
})

const Store = new Redis().client;

router.post('/signup', async (ctx, next) => {
    const {
        username,
        password,
        email,
        code
    } = ctx.request.body;
console.log(ctx);
    if(code){
        const saveCode = await Store.hget(`nodemail:${username}`, 'code');
        const saveExpire = await Store.hget(`nodemail:${username}`, 'expire')
        if(code === saveCode){
            if(new Date().getTime() - saveExpire > 0){
                ctx.body = {
                    code: -1,
                    msg: '验证码已过期，请重新尝试'
                };
                return false;
            }
        }else{
            ctx.body = {
                code: -1,
                msg: '请填写正确的验证码'
            }
        }
    }else{
        ctx.body = {
            code: -1,
            msg: '请填写验证码'
        }
    }

    let user = await User.find({
        username
    })
console.log(user);
    if(user.length){
        ctx.body = {
            code: -1,
            msg: '用户名已存在'
        }
        return;
    }

    let newUser = await User.create({
        username,
        password,
        email
    })

    if(newUser){
        let res = await axios.post('/users/signin', {
            username,
            password
        })

        if(res.data && res.data.code === 0){
            ctx.body = {
                code: 0,
                msg: '注册成功',
                data: {
                    user: res.data.user
                }
            }
        }else{
            ctx.body = {
                code: -1,
                msg: 'error'
            }
        }
    }else{
        ctx.body = {
            code: -1,
            msg: '注册失败'
        }
    }
})

router.post('/signin', async (ctx, next) => {
    return Passport.authenticate('local', (err, user, info, status) => {
        if(err){
            ctx.body = {
                code: -1,
                msg: err
            }
        }else{
            if(user){
                ctx.body = {
                    code: 0,
                    msg: '登陆成功',
                    data: {
                        user
                    }
                }
                return ctx.login(user);
            }
        }
    })(ctx, next);
})

router.post('/verify', async(ctx, next) => {
    // 获取用户和验证码过期时间
    let username = ctx.request.body.username;
    const saveExpire = await Store.hget(`nodemail:${username}`, 'expire')
    // 拦截，避免频繁的刷那个接口：一定时间内再次点击，只执行一次：函数节流
    if(saveExpire && new Date().getTime() - saveExpire < 0){
        ctx.body = {
            code: -1,
            msg: '请求过于频繁'
        }
        return false
    }
    // 开启一个 SMTP 连接池
    let transporter = nodeMailer.createTransport({
        host : Email.smtp.host,
        //   端口465和587用于电子邮件客户端到电子邮件服务器通信 - 发送电子邮件。
        //   端口465用于smtps SSL加密在任何SMTP级别通信之前自动启动。
        //   端口587用于msa
        port: 587,
        // secure:true   --> for port 465
        // secure:false  --> for port 587
        secure: false,
        // 创建smtp服务
        // 在dbs中config.js文件中配置的参数
        auth:{
            user: Email.smtp.user,
            pass: Email.smtp.pass
        }
    })
    // 对外发送哪些信息，以及接收方式是什么
    let ko = {
        // 设置验证码是什么
        code: Email.smtp.code(),
        // 每发送一次验证码都设置一个过期时间
        expire : Email.smtp.expire(),
        // 我要给谁发邮件
        email: ctx.request.body.email,
        // 我用哪个用户名发验证码
        user: ctx.request.body.username
    }
    // 邮件中显示哪些内容
    let mailOptions = {
        // 发送方
        from : `"认证邮件" <${Email.smtp.user}>`,
        // 接收方
        to : ko.email,
        // 主题
        subject: `注册码`,
        html: `您的验证码是${ko.code}`,
    }
    await transporter.sendMail(mailOptions, (err, info) =>{
        if(err){
            return console.log(err);
        }else{
            Store.hmset(`nodemail:${ko.user}`, 'code', ko.code, 'expire', ko.expire, 'email', ko.email)
        }
    })
    ctx.body = {
        code: 0,
        msg:'验证码已发送',
    }
})
// 退出
router.get('/exit', async(ctx, next) => {
    await ctx.logout()
    // 二次验证，检查现在是不是注销了状态
    if(!ctx.isAuthenticated()){
        ctx.body = {
            code: 0,
        }
    }else{
        ctx.body = {
            code: -1,
        }
    }
})
// 获取用户名
router.get('/getUser', async(ctx) =>{
    //isAuthenticated()， 是passport内部固定的的api，
    // 判断用户是否登录
    if(ctx.isAuthenticated()){
        // 我们的passport会把我们的用户信息的session放到session对象里面去，ctx这个上下文对象中session就有passport相关信息，所以我们的passport是存储在这个session中的
        // 如果它是登录状态的话，session中一定有passport，passport中一定有user
         const {username, email} = ctx.session.passport.user
         ctx.body = {
             user: username,
             email,
         }
    }else{
        // 如果用户没有登录
        ctx.body = {
            user: '',
            email: '',
        }
    }
})
export default router