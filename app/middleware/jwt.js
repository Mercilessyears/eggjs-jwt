// const jwt = require('egg-jwt');
module.exports = (options, app) => {
    return async function auth(ctx, next) {
        //拿到前端传来的token
        const token = ctx.request.headers.authorization || null;
        // const method = ctx.method.toLowerCase();
        //如果token过期或者无token，返回401
        if(!token) {
            ctx.throw(401, '登录凭证为空，请先登录')
        } else {
            // 判断token过期时间
            let decode;
            try{
                console.log(options.secret)
                decode = app.jwt.verify(token, options.secret) || null;
                if (!decode || !decode.uuid) {
                    ctx.throw(401, '没有访问权限');
                }
                if (Date.now() - decode.expire > 0) {
                    ctx.throw(401, 'token过期，重新登录');
                }
                const uuid = await ctx.model.User.findOne({ where: { uuid: decode.uuid } });
                if (uuid) {
                    await next();
                } else {
                    ctx.throw(401, '用户验证信息失败！');
                }
            } catch(err) {
                console.log(err)
            }
        }
    }
}