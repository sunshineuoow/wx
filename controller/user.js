const UserModel = require('../model/user')
const dayjs = require('dayjs')
const AJAX = require('../axios')

class UserController {

  static async save(data) {
    const { openid, unionid, nickname, access_token, headimgurl, refresh_token } = data
    const params = {
      openid,
      unionid,
      nickname,
      avatar: headimgurl,
      access_token,
      refresh_token
    }
    
    const user = await UserModel.findOne({ where: { openid } })
    if (user) {
      await user.update(params)
    } else {
      await UserModel.create(params)
    }
  }

  static async getUserInfo(openid) {
    const user = await UserModel.findOne({ where: { openid } })
    const now = dayjs(new Date())
    const lastUpdate = dayjs(new Date(user.updatedAt))

    if (!user.unionid || now.diff(lastUpdate, 'hour') >= 24) {
      const userInfo = await AJAX.getUserInfo({ access_token: user.access_token, openid })
      await this.save(userInfo)
      return { nickname: userInfo.nickname, avatar: userInfo.headimgurl }
    } else {
      return { nickname: user.nickname, avatar: user.avatar }
    }
  }
}


module.exports = UserController