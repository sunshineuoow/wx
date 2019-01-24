const Router = require('koa-router')
const sha1 = require('sha1')
const AJAX = require('../axios')
const User = require('../controller/user')

const router = new Router()


// 验证接口
router.get('/wx/', async (ctx, next) => {
  const query = ctx.request.query
  const arr = [process.env.TOKEN, query.timestamp, query.nonce]
  arr.sort()
  const tmpStr = sha1(arr.join(''))
  if (tmpStr === query.signature) {
    ctx.body = query.echostr
  }
})

// 微信授权
router.get('/wx/auth', async (ctx, next) => {
  const query = ctx.request.query
  const redirectUri = `${ctx.request.origin}/wx/access`
  const url = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=${process.env.APPID}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=code&scope=snsapi_userinfo&state=${query.redirect_url}#wechat_redirect`
  ctx.response.redirect(url)
})

// 通过code获取access_token
router.get('/wx/access', async (ctx, next) => {
  const query = ctx.request.query
  const url = `${ctx.request.origin}/wx/userinfo`
  const params = { appid: process.env.APPID, secret: process.env.SECRET, code: query.code }
  const response = await AJAX.getToken(params)
  await User.save(response)

  ctx.cookies.set('_openid', response.openid)
  ctx.response.redirect(url)
})

router.get('/wx/userinfo', async (ctx, next) => {
  const openid = ctx.cookies.get('_openid')
  const userInfo = await User.getUserInfo(openid)
  ctx.body = `<h2>用户昵称：${userInfo.nickname}</h2><div>用户头像:<img src="${userInfo.avatar}" /></div>`
})


module.exports = router