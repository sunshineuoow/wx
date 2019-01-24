// 进行accessToken的校验，如果过期了则刷新
const User = require('../model/user')
const AJAX = require('../axios')

const checkToken = () => async (ctx, next) => {
  const openid = ctx.cookies.get('_openid')
  if (!openid) next()

  const user = await User.findOne({ where: { id: openid } })
  if (!user) {
    next()
  } else {
    const resp = await AJAX.checkToken({ access_token: user.access_token, openid })
    if (resp.errcode !== 0) {
      const data = await AJAX.updateToken({ appid: process.env.APPID, refresh_token: user.refresh_token })
      await user.update(data)
    }
    next()
  }

}


module.exports = checkToken