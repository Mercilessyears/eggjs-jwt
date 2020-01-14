'use strict';

const Controller = require('../core/base_controller');
const v1 = require('uuid/v1');
// const jwt = require('egg-jwt')


function toInt(str){
    if(typeof str === 'number') return str;
    if(!str) return str;
    return parseInt(str, 10) || 0;
}

class UserController extends Controller{
    async index() {
        const ctx = this.ctx;
        // const query = { limit: toInt(ctx.query.limit), offset: toInt(ctx.query.offset) };
        // ctx.body = await ctx.model.User.findAll();
        const data = await ctx.model.User.findAll() || []
        if(data.length > 0) {
            this.success(data)
        } else {
            this.fail(ctx.ERROR_CODE, '查询失败')
        }
    }
    /**
     * @uuid uuid
     * 通过token查询用户的基础信息
     */
    async userInfo() {
        const ctx = this.ctx;
        const user = ctx.state.user // 可以获取到token值 {uuid: '23c68f802f8611eaac6f1b56b2d16176',name: 'qwer111',iat: 1578279762,exp: 1578283362 }
        // const req = ctx.request.headers.Authorization || null;
        // const decode = this.app.jwt.verify(req, this.config.jwt.secret)
        const data = await this.service.users.userInfo(user.uuid)
        if (data) {
            this.success(data, 200)
        } else {
            this.fail('网络错误', 500)
        }
    }

    /**
     * @name 用户名
     * @pwd 密码
     * 用户登录查询
     */
    async login() {
        const ctx = this.ctx;
        const userInfo = ctx.request.body
        const user = await ctx.service.users.login(userInfo) || null;
        if(typeof user === 'object') {
            console.log(this.app)
            const token = this.app.jwt.sign({
                uuid: user.uuid,
                name: user.name
            }, this.config.jwt.secret, { expiresIn: 60 * 5 })
            ctx.body = {
                code: 200,
                data: null,
                message: '登录成功'
            }
            ctx.status = 200
            ctx.append('Authorization', token)
        } else{
            this.fail(user, ctx.ERROR_CODE)
        }
    }

    async create() {
        const ctx = this.ctx;
        const data = ctx.request.body;
        const user = await ctx.service.users.create(data) || null;
        if(user) {
            this.success('注册成功', ctx.SUCCESS_CODE)
        } else {
            this.fail(ctx.ERROR_CODE, '注册失败')
        }
    }

    async update() {
        const ctx = this.ctx;
        const id = toInt(ctx.params.id);
        const user = await ctx.model.User.findByPk(id);
        if(!user){
            ctx.status = 404;
            return;
        }

        const { name, realname, phone, email } = ctx.request.body;
        await user.update({name, realname, phone, email});
        ctx.body = user;
    }

    async destroy() {
        const ctx = this.ctx;
        const id = toInt(ctx.params.id);
        const user = await ctx.model.User.findByPk(id);
        if(!user){
            ctx.status = 404;
            return;
        }

        await user.destroy();
        ctx.status = 200;
    }
}

module.exports = UserController;