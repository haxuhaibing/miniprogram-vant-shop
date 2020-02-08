//cart.js
const WXAPI = require('../../unit/http')
const app = getApp()
Page({
  data: {
    userInfo: [],
    bing: []
  },
  onLoad: function() {

  },
  Login: function() {
    let that = this;
    const token = wx.getStorageSync('token');
    if (token) {

    }
    wx.getUserInfo({
      success: (res) => {
        this.setData({
          userInfo: res.userInfo,
          bing: res
        })
      }
    })
    wx.login({
      success(res) {
        let code = res.code
        wx.request({
          url: 'https://api.it120.cc/xuhaibing/user/wxapp/login',
          data: {
            code: code,
            type: 2
          },
          method: "POST",
          header: {
            'content-type': 'application/json'
          },
          success(res) {

            if (res.code == 10000) {
              // 去注册
              that.Register();
              return;
            }
            if (res.code != 0) {
              // 登录错误
              wx.showModal({
                title: '提示',
                content: '无法登录，请重试',
                showCancel: false
              })
              return;
            }
            wx.setStorageSync('token', res.data.token)
            wx.setStorageSync('uid', res.data.uid)
          }
        })
      }
    })
  },
  Register: function() {
    let that = this;
    wx.login({
      success(res) {
        let code = res.code
        wx.getUserInfo({
          success: (res) => {
            let iv = res.iv;
            let encryptedData = res.encryptedData;
            wx.request({
              url: 'https://api.it120.cc/xuhaibing/user/wxapp/register/complex',
              data: {
                code: code,
                encryptedData: encryptedData,
                iv: iv
              },
              method: "POST",
              header: {
                'content-type': 'application/json'
              },
              success(res) {
                that.Login();
                console.log('执行了regUser')
              }
            })
          }
        })
      }
    })
  }


})
