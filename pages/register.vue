<template>
    <div class="page-register">
        <div class="header">
            <header>
            <a href="/" class="site-logo"></a>
            <span class="login">
                <em class="bold">已有美团账号？</em>
                <a href="/login">
                    <el-button type="primary" size="small">登陆</el-button>
                </a>
            </span>
            </header>
        </div>
        <section>
            <el-form
                ref="ruleForm"
                :model="ruleForm"
                :rules="rules"
                label-width="100px"
                class=""
            >
                <el-form-item
                    label="昵称"
                    prop="name"
                >
                    <el-input v-model="ruleForm.name"></el-input>
                </el-form-item>
                <el-form-item
                    label="邮箱"
                    prop="email"
                >
                    <el-input v-model="ruleForm.email"></el-input>
                    <el-button size="mini" round @click="sendEmail" :disabled="emailBtnDisabled">发送验证码</el-button>
                    <span class="status">{{ emailStatusMsg }}</span>
                </el-form-item>
                <el-form-item
                    label="验证码"
                    prop="code"
                >
                    <el-input v-model="ruleForm.code" maxlength="4"></el-input>
                </el-form-item>
                <el-form-item
                    label="密码"
                    prop="pwd"
                >
                    <el-input v-model="ruleForm.pwd" type="password"></el-input>
                </el-form-item>
                <el-form-item
                    label="确认密码"
                    prop="cpwd"
                >
                    <el-input v-model="ruleForm.cpwd" type="password"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="registerHandler">同意以下协议并注册</el-button>
                    <a href="http://www.meituan.com/about/terms" target="_blank" class="f1">《美团网用户协议》</a>
                    <div class="error">{{ errorMsg }}</div>
                </el-form-item>
            </el-form>
        </section>
    </div>
</template>

<script>
import Crypto from 'crypto-js';
export default {
    layout: 'blank',
    data(){
        return {
            ruleForm: {
                name: '',
                email: '',
                code: '',
                pwd: '',
                cpwd: ''
            },
            rules: {
                name: [{
                    required: true,
                    type: 'string',
                    message: '请输入昵称',
                    trigger: 'blur'
                }],
                email: [{
                    required: true,
                    type: 'email',
                    message: '请输入正确的邮箱',
                    trigger: 'blur'
                }],
                code: [{
                    required: true,
                    message: '请输入验证码',
                    trigger: 'blur'
                }],
                pwd: [{
                    required: true,
                    message: '请输入密码',
                    trigger: 'blur'
                }],
                cpwd: [{
                    required: true,
                    message: '确认密码',
                    trigger: 'blur'
                },{
                    validator: (rule, value, cb) => {
                        if(value === ''){
                            cb(new Error('请再次输入密码'));
                        }else if(value !== this.ruleForm.pwd){
                            cb(new Error('两次输入的密码不一致'));
                        }else{
                            cb();
                        }
                    },
                    trigger: 'blur'
                }],
            },
            emailStatusMsg: '',
            errorMsg: '',
            emailBtnDisabled: false
        }
    },
    methods: {
        async sendEmail(){
            let namePass;
            let emailPass;
            if(this.timerid){
                return false;
            }
            this.$refs['ruleForm'].validateField('name', valid => {
                namePass = valid;
            })
            this.emailStatusMsg = '';
            if(namePass){
                return false;
            }

            this.$refs.ruleForm.validateField('email', valid => {
                emailPass = valid;
            })

            // 名字和邮箱都通过验证
            if(!namePass && !emailPass){
                const data = await this.$api.userApi.verify({
                    username: encodeURIComponent(this.ruleForm.name),
                    email: this.ruleForm.email
                })
                if(data.code === 0){
                    let count = 60;
                    this.emailStatusMsg = `验证码已发送，剩余${count --}秒`;
                    this.emailBtnDisabled = true;

                    this.timer = setInterval(() => {
                        this.emailStatusMsg = `验证码已发送，剩余${count --}秒`;
                        if(count === 0){
                            clearInterval(this.timer);
                            this.emailStatusMsg = '';
                            this.emailBtnDisabled = false;
                        }
                    }, 1000);
                }else{
                    this.emailStatusMsg = data.msg;
                }
            }
        },
        registerHandler(){
            this.$refs.ruleForm.validate(async valid => {
                if(valid){
                    const data = await this.$api.userApi.register({
                        username: encodeURIComponent(this.ruleForm.name),
                        email: this.ruleForm.email,
                        password: Crypto.MD5(this.ruleForm.pwd).toString(),
                        code: this.ruleForm.code
                    })

                    if(data.code === 0){
                        location.href = '/login'
                    }else{
                        this.errorMsg = data.msg;
                    }
                }
            })
        }
    }
}
</script>

<style lang="scss">
    @import '@/assets/css/register/index.scss';
</style>