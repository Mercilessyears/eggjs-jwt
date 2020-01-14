'use strict';

const Service = require('egg').Service;

class UsersService extends Service {
  async index() {

  }

  async create(data) {
    const ctx = this.ctx
    const { name, pwd, realname, phone, email } = data;
    return await ctx.model.User.create({ name, pwd, realname, phone, email })
  }

  async login(userInfo) {
    const { ctx } = this;
    let { name, pwd } = userInfo;
    const user = await ctx.model.User.findOne({
      where: {
        name: name
      }
    }) || null;
    if(user) {
      const spwd = await ctx.model.User.findOne({
        where: {
          name: name,
          pwd: ctx.helper.myMd5(pwd)
        }
      }) || null;
      if(spwd) {
        return spwd
      } else {
        return '密码错误'
      }
    } else {
      return '用户未注册'
    }
  }

  async userInfo(uuid) {
      const ctx = this.ctx;
      const res = await ctx.model.User.findOne({
        where: {
          uuid: uuid
        }
      })
      return {
        uuid: res.uuid,
        name: res.name,
        realname: res.realname,
        phone: res.phone,
        email: res.email
      }
  }
}

module.exports = UsersService;
