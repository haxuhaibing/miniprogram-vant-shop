//app.js
const $http = require('unit/http')
//18956235417
//13511223344
App({
  onLaunch: function() {
    $http.post('/user/m/login', {
        deviceId: '20190723',
        deviceName: 'iphone7',
        mobile: 13511223344,
        pwd: 123456
      })
      .then(response => {
    //    console.log(response)
        if (response.code == 0) {
          wx.setStorageSync('token', response.data.token)
          wx.setStorageSync('uid', response.data.uid)
        }
      })
  }
})
