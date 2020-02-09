//cart.js
const $http = require('../../unit/http')
const app = getApp()
Page({
  data: {
    userInfo: [],
    bing: []
  },
  onLoad: function() {
    $http.post('/user/m/login', {
        deviceId: '20190723',
        deviceName: 'iphone7',
        mobile: 13511502043,
        pwd: 123456
      })
      .then(response => {
        if (response.code == 0) {
          wx.setStorageSync('token', response.data.token)
          wx.setStorageSync('uid', response.data.uid)
        }
      })

    $http.post('/user/modify')
      .then(response => {
        console.log(response)
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
          userInfo: res.userInfo,
          bing: res
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
