//app.js
const $http = require('unit/http')
App({
  onLaunch: function() {
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
  }
})
