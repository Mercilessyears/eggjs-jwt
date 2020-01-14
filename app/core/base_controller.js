'use strict';

const Controller = require('egg').Controller;

class BaseController extends Controller{
    get user() {
        return this.ctx.session.user;
    }

    success(data, status) {
        this.ctx.status = 200;
        this.ctx.body = {
            code: status,
            data
        };
    }

    fail(message, code){
        this.ctx.body = { code, message, data: {} };
        this.ctx.status = 200;
    }

    notFound(msg) {
        msg = msg || 'not found';
        this.ctx.throw(404, msg);
    }
}

module.exports = BaseController;