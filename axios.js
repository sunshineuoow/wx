const axios = require('axios')

const instance = axios.create()

instance.interceptors.response.use(resp => resp.data)


const URLS = {
  token: 'https://api.weixin.qq.com/sns/oauth2/access_token',
  user: 'https://api.weixin.qq.com/sns/userinfo',
  checkToken: ' https://api.weixin.qq.com/sns/auth',
  refreshToken: 'https://api.weixin.qq.com/sns/oauth2/refresh_token'
}


const AJAX = {
  /**
   * @param {Object} params
   * @param {string} params.access_token
   * @param {string} params.openid
   */
  checkToken: params => instance.get(URLS.checkToken, { params }),


  /**
   * @param {Object} params
   * @param {string} params.appid
   * @param {string} params.secret
   * @param {string} params.code
   */
  getToken: params => instance.get(URLS.token, { params: {...params, grant_type: 'authorization_code'} }),


  /**
   * @param {Object} params
   * @param {string} params.appid
   * @param {string} params.refresh_token
   */
  updateToken: params => instance.get(URLS.refreshToken, { params: {...params, grant_type: 'refresh_token'} }),

  /**
   * @param {Object} params
   * @param {string} params.access_token
   * @param {string} params.openid
   */
  getUserInfo: params => instance.get(URLS.user, { params: { ...params, lang: 'zh_CN' } })
}



module.exports = AJAX