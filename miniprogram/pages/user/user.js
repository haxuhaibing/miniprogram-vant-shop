//cart.js
const app = getApp()

Page({
  data: {
    userInfo: []
  },
  onLoad: function() {

  },
  onLogin() {
    wx.getUserInfo({
      success: (res) => {
        this.setData({
          userInfo: res.userInfo
        })
      }
    })
    wx.login({
      success(res) {
        if (res.code) {
          //发起网络请求
          let code = res.code;
          wx.request({
            url: 'https://api.it120.cc/xiaochengxu/user/wxsns/login',
            data: {
              code: code
            },
            method: "POST",
            success(res) {
              console.log(res)
              //  console.log(res)
            }
          })
        } else {
          console.log('登录失败！' + res.errMsg)
        }
      }
    })
  }

})
