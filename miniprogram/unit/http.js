const BASE_URL = 'https://api.it120.cc/wxapi'
const TOKEN = wx.getStorageSync('token')
const post = (url, data = {}) => {
  let _url = BASE_URL + url
  data.token = TOKEN
  return new Promise((resolve, reject) => {
    wx.request({
      url: _url,
      method: "post",
      data: data,
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success(request) {
        resolve(request.data)
      },
      fail(error) {
        reject(error)
      },
      complete(aaa) {
        // 加载完成
      }
    })
  })
}
const get = (url, data = {}) => {
  let _url = BASE_URL + url
  data.token = TOKEN
  return new Promise((resolve, reject) => {
    wx.request({
      url: _url,
      method: "get",
      data: data,
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success(request) {
        resolve(request.data)
      },
      fail(error) {
        reject(error)
      },
      complete(aaa) {
        // 加载完成
      }
    })
  })
}
module.exports = {
  post,
  get
}
