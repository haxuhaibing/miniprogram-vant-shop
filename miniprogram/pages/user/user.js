//cart.js
const $http = require('../../unit/http')
const app = getApp()
Page({
  data: {
    userInfo: [],
    walletInfo: []
  },
  onLoad: function() {
    const TOKEN = wx.getStorageSync('token')
    $http.post('/user/amount')
      .then(response => {
        this.setData({
          walletInfo: response.data
        })
      })

  },
  Login: function() {
    let that = this;
    const token = wx.getStorageSync('token');
    if (token) {

    }
    wx.getUserInfo({
      success: (res) => {
        this.setData({
          userInfo: res.userInfo
        })
      }
    })
    wx.login({
      success(res) {
        let code = res.code
        $http.post('/user/wxapp/login', {
            code: code,
            type: 2
          })
          .then(res => {
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
            $http.post('/user/wxapp/register/complex', {
                code: code,
                encryptedData: encryptedData,
                iv: iv
              })
              .then(res => {
                that.Login();
                console.log('执行了regUser')
              })
          }
        })
      }
    })
  }


})
